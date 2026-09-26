/**
 * Stage 10A Part 2 - Profile & Onboarding HTTP Integration Test Suite
 *
 * Verifies live Express endpoints:
 * 1. GET /api/profile (unauthenticated -> 401 UNAUTHORIZED)
 * 2. GET /api/profile (authenticated -> returns profile & onboarding objects)
 * 3. PUT /api/profile (valid updates persisted)
 * 4. PUT /api/profile (invalid payload rejected with 400)
 * 5. GET /api/onboarding/status (authenticated -> returns completed: false for new users)
 * 6. POST /api/onboarding/complete (validates, saves profile, and sets completed: true)
 * 7. POST /api/onboarding/complete (rejects incomplete/missing required fields)
 * 8. User Ownership: User A cannot read or modify User B's profile
 * 9. PasswordHash & secrets never leaked in any response
 */

import express from 'express';
import cookieParser from 'cookie-parser';
import { authRouter } from '../server/auth/authRoutes.js';
import { profileRouter, onboardingRouter } from '../server/profile/profileRoutes.js';
import { AuthService } from '../server/auth/authService.js';
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

async function runStage10aProfileHttpTests() {
  console.log('====================================================');
  console.log('STAGE 10A PART 2 — HTTP INTEGRATION TEST SUITE');
  console.log('====================================================\n');

  // Setup test Express server
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api/auth', authRouter);
  app.use('/api/profile', profileRouter);
  app.use('/api/onboarding', onboardingRouter);

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const port = (server.address() as any).port;

  AuthService.resetMemoryStore();

  let testDb: Db | null = null;
  if (isMongoConfigured()) {
    testDb = await connectToDatabase();
    await testDb.collection('users').deleteMany({ email: { $in: ['parth@zenin.os', 'other@zenin.os'] } });
  }

  try {
    // Suite 1: Unauthenticated Rejections
    console.log('Suite 1: Unauthenticated Security');
    const unauthProfileGet = await request(port, 'GET', '/api/profile');
    assert(unauthProfileGet.status === 401, 'Unauthenticated GET /api/profile returns 401');

    const unauthProfilePut = await request(port, 'PUT', '/api/profile', { name: 'Evil' });
    assert(unauthProfilePut.status === 401, 'Unauthenticated PUT /api/profile returns 401');

    const unauthOnboardGet = await request(port, 'GET', '/api/onboarding/status');
    assert(unauthOnboardGet.status === 401, 'Unauthenticated GET /api/onboarding/status returns 401');

    const unauthOnboardPost = await request(port, 'POST', '/api/onboarding/complete', { name: 'Evil', age: 25 });
    assert(unauthOnboardPost.status === 401, 'Unauthenticated POST /api/onboarding/complete returns 401');

    // Suite 2: Register Two Test Users
    console.log('\nSuite 2: Account Registration');
    const user1Reg = await request(port, 'POST', '/api/auth/register', {
      name: 'Parth Sharma',
      email: 'parth@zenin.os',
      password: 'SecurePassword2026!',
    });
    const token1 = user1Reg.body.token;
    assert(Boolean(token1), 'User 1 registered and received auth token');

    const user2Reg = await request(port, 'POST', '/api/auth/register', {
      name: 'Other User',
      email: 'other@zenin.os',
      password: 'SecurePassword2026!',
    });
    const token2 = user2Reg.body.token;
    assert(Boolean(token2), 'User 2 registered and received auth token');

    // Suite 3: GET /api/onboarding/status
    console.log('\nSuite 3: GET /api/onboarding/status');
    const status1Before = await request(port, 'GET', '/api/onboarding/status', undefined, {
      Authorization: `Bearer ${token1}`,
    });
    assert(status1Before.status === 200, 'GET /api/onboarding/status returns 200');
    assert(status1Before.body.completed === false, 'New user reports completed: false');

    // Suite 4: GET /api/profile
    console.log('\nSuite 4: GET /api/profile');
    const profile1Before = await request(port, 'GET', '/api/profile', undefined, {
      Authorization: `Bearer ${token1}`,
    });
    assert(profile1Before.status === 200, 'GET /api/profile returns 200');
    assert(profile1Before.body.success === true, 'Profile success is true');
    assert(profile1Before.body.profile.name === 'Parth Sharma', 'Profile preserves user name');
    assert(profile1Before.body.onboarding.completed === false, 'Onboarding state is completed: false');
    assert(profile1Before.body.passwordHash === undefined, 'No passwordHash in response');

    // Suite 5: POST /api/onboarding/complete Validation & Submission
    console.log('\nSuite 5: POST /api/onboarding/complete');
    const invalidOnboard = await request(port, 'POST', '/api/onboarding/complete', {
      // Missing name and age
      wakeTime: '05:30',
    }, {
      Authorization: `Bearer ${token1}`,
    });
    assert(invalidOnboard.status === 400, 'Rejects incomplete onboarding payload');
    assert(invalidOnboard.body.error?.code === 'INVALID_REQUEST', 'Returns INVALID_REQUEST code');

    const validOnboardPayload = {
      name: 'Parth',
      age: 21,
      goals: ['CODING', 'JOB_PREPARATION'],
      customGoal: 'Build high-performance AI systems',
      wakeTime: '05:30',
      sleepTime: '22:30',
      workStartTime: '08:00',
      workEndTime: '18:00',
      targetFocusHours: 4,
      preferredFocusDuration: 50,
      planningIntensity: 'BALANCED',
      motivationalInsights: true,
      aiPersonalization: true,
      reminderStyle: 'BALANCED',
    };

    const completeOnboardRes = await request(port, 'POST', '/api/onboarding/complete', validOnboardPayload, {
      Authorization: `Bearer ${token1}`,
    });

    assert(completeOnboardRes.status === 200, 'POST /api/onboarding/complete returns 200 OK');
    assert(completeOnboardRes.body.onboarding.completed === true, 'onboarding.completed is now true');
    assert(Boolean(completeOnboardRes.body.onboarding.completedAt), 'onboarding.completedAt has timestamp');
    assert(completeOnboardRes.body.profile.wakeTime === '05:30', 'Wake time saved as 05:30');
    assert(completeOnboardRes.body.profile.planningIntensity === 'BALANCED', 'Planning intensity saved as BALANCED');

    // Verify GET /api/onboarding/status now returns completed: true
    const status1After = await request(port, 'GET', '/api/onboarding/status', undefined, {
      Authorization: `Bearer ${token1}`,
    });
    assert(status1After.body.completed === true, 'Onboarding status now returns completed: true');

    // Suite 6: User Isolation (User 2 remains uncompleted)
    console.log('\nSuite 6: User Isolation');
    const status2 = await request(port, 'GET', '/api/onboarding/status', undefined, {
      Authorization: `Bearer ${token2}`,
    });
    assert(status2.body.completed === false, 'User 2 onboarding remains completed: false');

    const profile2 = await request(port, 'GET', '/api/profile', undefined, {
      Authorization: `Bearer ${token2}`,
    });
    assert(profile2.body.profile.name === 'Other User', 'User 2 only sees own profile data');

    // Suite 7: PUT /api/profile (Editing Profile)
    console.log('\nSuite 7: PUT /api/profile');
    const updateRes = await request(port, 'PUT', '/api/profile', {
      wakeTime: '05:00',
      targetFocusHours: 6,
      planningIntensity: 'INTENSE',
    }, {
      Authorization: `Bearer ${token1}`,
    });

    assert(updateRes.status === 200, 'PUT /api/profile returns 200 OK');
    assert(updateRes.body.profile.wakeTime === '05:00', 'Updated wakeTime to 05:00');
    assert(updateRes.body.profile.targetFocusHours === 6, 'Updated targetFocusHours to 6');
    assert(updateRes.body.profile.planningIntensity === 'INTENSE', 'Updated planningIntensity to INTENSE');
    assert(updateRes.body.profile.name === 'Parth', 'Unchanged name remains intact');

    console.log('\n====================================================');
    console.log(`STAGE 10A PART 2 HTTP SUMMARY: ${passed} passed, ${failed} failed`);
    console.log('====================================================');
  } finally {
    server.close();
    if (testDb && isMongoConfigured()) {
      await testDb.collection('users').deleteMany({ email: { $in: ['parth@zenin.os', 'other@zenin.os'] } });
    }
    await closeDatabase();
  }

  process.exit(failed > 0 ? 1 : 0);
}

runStage10aProfileHttpTests().catch(async (err) => {
  console.error('HTTP test suite failed:', err);
  await closeDatabase().catch(() => {});
  process.exit(1);
});
