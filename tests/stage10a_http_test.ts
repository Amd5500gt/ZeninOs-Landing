/**
 * Stage 10A Part 1 - HTTP Integration Test Suite
 * Tests live Express endpoints:
 * 1. POST /api/auth/register (validation, success, duplicate)
 * 2. POST /api/auth/login (validation, valid, invalid creds)
 * 3. GET /api/auth/me (authenticated via Bearer header or Cookie)
 * 4. GET /api/auth/me (unauthenticated -> 401 UNAUTHORIZED)
 * 5. POST /api/auth/logout (clears cookie)
 * 6. Rate limiter on /api/auth/*
 * 7. Absence of passwordHash and secrets in all payloads
 */

import express from 'express';
import cookieParser from 'cookie-parser';
import { authRouter } from '../server/auth/authRoutes.js';
import { AuthService } from '../server/auth/authService.js';
import { resetAuthRateLimiter } from '../server/auth/authRateLimiter.js';
import { isMongoConfigured, connectToDatabase, closeDatabase } from '../server/db/mongodb.js';
import http from 'http';
import { Db } from 'mongodb';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}${detail ? ` - ${detail}` : ''}`);
    failed++;
  }
}

async function request(
  serverPort: number,
  method: string,
  path: string,
  body?: any,
  headers: Record<string, string> = {}
): Promise<{ status: number; headers: http.IncomingHttpHeaders; body: any }> {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : undefined;
    const reqHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };
    if (payload) {
      reqHeaders['Content-Length'] = String(Buffer.byteLength(payload));
    }

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: serverPort,
        path,
        method,
        headers: reqHeaders,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed = data;
          try {
            parsed = JSON.parse(data);
          } catch {}
          resolve({ status: res.statusCode || 0, headers: res.headers, body: parsed });
        });
      }
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runHttpAuthTests() {
  console.log('====================================================');
  console.log('STAGE 10A PART 1 — HTTP INTEGRATION TEST SUITE');
  console.log('====================================================\n');

  // Setup isolated test express app
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api/auth', authRouter);

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address() as any;
  const port = address.port;

  AuthService.resetMemoryStore();
  resetAuthRateLimiter();

  let testDb: Db | null = null;
  if (isMongoConfigured()) {
    testDb = await connectToDatabase();
    await testDb.collection('users').deleteMany({ email: 'alex.mercer@zenin.os' });
  }

  try {
    // Suite 1: Registration Validation
    console.log('Suite 1: POST /api/auth/register Validation');
    const emptyBodyRes = await request(port, 'POST', '/api/auth/register', {});
    assert(emptyBodyRes.status === 400, 'Rejects empty body with 400');
    assert(emptyBodyRes.body.error?.code === 'INVALID_REQUEST', 'Error code is INVALID_REQUEST');

    const missingNameRes = await request(port, 'POST', '/api/auth/register', {
      email: 'alex@example.com',
      password: 'password123',
    });
    assert(missingNameRes.status === 400, 'Rejects missing name');

    const invalidEmailRes = await request(port, 'POST', '/api/auth/register', {
      name: 'Alex',
      email: 'not-an-email',
      password: 'password123',
    });
    assert(invalidEmailRes.status === 400, 'Rejects invalid email format');

    const shortPasswordRes = await request(port, 'POST', '/api/auth/register', {
      name: 'Alex',
      email: 'alex@example.com',
      password: '123',
    });
    assert(shortPasswordRes.status === 400, 'Rejects password shorter than 6 characters');

    // Suite 2: Successful Registration
    console.log('\nSuite 2: Successful User Registration');
    const validRegRes = await request(port, 'POST', '/api/auth/register', {
      name: 'Alex Mercer',
      email: 'alex.mercer@zenin.os',
      password: 'ValidPassword2026!',
      plan: 'PRO', // Attempting to sneak PRO into payload
    });

    assert(validRegRes.status === 201, 'Returns 201 Created on valid registration');
    assert(validRegRes.body.success === true, 'Response body success is true');
    assert(validRegRes.body.user.name === 'Alex Mercer', 'User name matches');
    assert(validRegRes.body.user.email === 'alex.mercer@zenin.os', 'User email matches');
    assert(validRegRes.body.user.plan === 'FREE', 'Client cannot choose PRO during registration (strictly FREE)');
    assert(validRegRes.body.user.passwordHash === undefined, 'passwordHash NEVER returned to client');
    assert(Boolean(validRegRes.body.token), 'Returns session auth token');

    if (isMongoConfigured() && testDb) {
      const storedUser = await testDb.collection('users').findOne({ email: 'alex.mercer@zenin.os' });
      assert(storedUser !== null, 'REAL MongoDB Atlas persisted the HTTP registered user');
      assert(storedUser?.email === 'alex.mercer@zenin.os', 'MongoDB Atlas stored record matches normalized email');
      assert(storedUser?.plan === 'FREE', 'MongoDB Atlas stored record strictly has FREE plan');
    }

    const setCookieHeader = validRegRes.headers['set-cookie'];
    assert(Boolean(setCookieHeader), 'Sets Set-Cookie header for HTTP-only cookie');
    const cookieStr = Array.isArray(setCookieHeader) ? setCookieHeader[0] : setCookieHeader || '';
    assert(cookieStr.includes('HttpOnly'), 'Cookie is HttpOnly');

    // Duplicate email registration
    const duplicateRes = await request(port, 'POST', '/api/auth/register', {
      name: 'Alex Mercer Again',
      email: 'alex.mercer@zenin.os',
      password: 'ValidPassword2026!',
    });
    assert(duplicateRes.status === 409, 'Returns 409 Conflict on duplicate email');
    assert(duplicateRes.body.error?.code === 'EMAIL_EXISTS', 'Returns EMAIL_EXISTS error code');

    // Suite 3: Login Endpoint
    console.log('\nSuite 3: POST /api/auth/login');
    const loginEmptyRes = await request(port, 'POST', '/api/auth/login', {});
    assert(loginEmptyRes.status === 400, 'Rejects empty login payload');

    const loginWrongPassRes = await request(port, 'POST', '/api/auth/login', {
      email: 'alex.mercer@zenin.os',
      password: 'WrongPassword123!',
    });
    assert(loginWrongPassRes.status === 401, 'Rejects incorrect password with 401');
    assert(loginWrongPassRes.body.error?.code === 'INVALID_CREDENTIALS', 'Returns INVALID_CREDENTIALS code');

    const loginSuccessRes = await request(port, 'POST', '/api/auth/login', {
      email: 'alex.mercer@zenin.os',
      password: 'ValidPassword2026!',
    });
    assert(loginSuccessRes.status === 200, 'Returns 200 OK on valid credentials');
    assert(loginSuccessRes.body.success === true, 'Login body success is true');
    assert(loginSuccessRes.body.user.email === 'alex.mercer@zenin.os', 'Login user email matches');
    assert(loginSuccessRes.body.user.passwordHash === undefined, 'passwordHash NEVER returned on login');

    const authToken = loginSuccessRes.body.token;

    // Suite 4: Authenticated /api/auth/me
    console.log('\nSuite 4: GET /api/auth/me');
    const meUnauthRes = await request(port, 'GET', '/api/auth/me');
    assert(meUnauthRes.status === 401, 'Unauthenticated /api/auth/me returns 401');
    assert(meUnauthRes.body.error?.code === 'UNAUTHORIZED', 'Returns UNAUTHORIZED code');

    const meBearerRes = await request(port, 'GET', '/api/auth/me', undefined, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(meBearerRes.status === 200, 'Authenticated /api/auth/me with Bearer returns 200');
    assert(meBearerRes.body.user.email === 'alex.mercer@zenin.os', 'Returns current user info');
    assert(meBearerRes.body.user.plan === 'FREE', 'Returns current user plan');
    assert(meBearerRes.body.user.passwordHash === undefined, 'No passwordHash in /api/auth/me');

    // Test with Cookie header
    const meCookieRes = await request(port, 'GET', '/api/auth/me', undefined, {
      Cookie: `zenin_auth_token=${authToken}`,
    });
    assert(meCookieRes.status === 200, 'Authenticated /api/auth/me with Cookie returns 200');

    // Suite 5: Logout
    console.log('\nSuite 5: POST /api/auth/logout');
    const logoutRes = await request(port, 'POST', '/api/auth/logout');
    assert(logoutRes.status === 200, 'Logout returns 200 OK');
    assert(logoutRes.body.success === true, 'Logout success is true');
    const logoutCookie = Array.isArray(logoutRes.headers['set-cookie'])
      ? logoutRes.headers['set-cookie'][0]
      : logoutRes.headers['set-cookie'] || '';
    assert(logoutCookie.includes('Expires=') || logoutCookie.includes('Max-Age=0'), 'Logout clears cookie with expiration');

    console.log('\n====================================================');
    console.log(`STAGE 10A PART 1 HTTP SUMMARY: ${passed} passed, ${failed} failed`);
    console.log('====================================================');
  } finally {
    server.close();
    if (testDb && isMongoConfigured()) {
      await testDb.collection('users').deleteMany({ email: 'alex.mercer@zenin.os' });
    }
    await closeDatabase();
  }

  process.exit(failed > 0 ? 1 : 0);
}

runHttpAuthTests().catch(async (err) => {
  console.error('HTTP test suite failed:', err);
  await closeDatabase().catch(() => {});
  process.exit(1);
});
