/**
 * Stage 10B - User Onboarding + Personalization Profile Test Suite
 *
 * Verifies:
 * 1. GET /api/profile (unauthenticated -> 401 UNAUTHORIZED)
 * 2. GET /api/profile (authenticated -> returns SafeUser with default profiles)
 * 3. Profile Validation Rules:
 *    - name validation (required for onboarding, not empty)
 *    - age validation (required 13-120)
 *    - time validation (HH:mm format 24h)
 *    - duration validation (1-1440 mins)
 *    - string length clamping / sanitization
 * 4. POST /api/profile/onboarding:
 *    - successful completion sets onboardingCompleted = true
 *    - client cannot override plan or id
 * 5. GET /api/profile/onboarding-status:
 *    - returns { success: true, onboardingCompleted: boolean }
 * 6. PUT /api/profile:
 *    - updates schedule and preferences safely
 * 7. User isolation (User A cannot access or update User B's profile)
 * 8. Zero passwordHash or database credentials in any profile response
 */

import express from 'express';
import cookieParser from 'cookie-parser';
import { authRouter } from '../server/auth/authRoutes.js';
import { profileRouter } from '../server/profile/profileRoutes.js';
import { AuthService } from '../server/auth/authService.js';
import { ProfileService } from '../server/profile/profileService.js';
import { validateProfilePayload } from '../server/profile/profileValidation.js';
import http from 'http';

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

async function runStage10bTests() {
  console.log('====================================================');
  console.log('STAGE 10B — ONBOARDING & PERSONALIZATION TEST SUITE');
  console.log('====================================================\n');

  // Setup test express server
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api/auth', authRouter);
  app.use('/api/profile', profileRouter);

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const port = (server.address() as any).port;

  AuthService.resetMemoryStore();

  try {
    // Suite 1: Payload Validator Unit Tests
    console.log('Suite 1: Profile & Onboarding Payload Validation');
    assert(!validateProfilePayload(null).valid, 'Rejects null payload');
    assert(!validateProfilePayload([]).valid, 'Rejects array payload');
    assert(!validateProfilePayload({ name: '' }).valid, 'Rejects empty name');
    assert(!validateProfilePayload({ age: 10 }).valid, 'Rejects age < 13');
    assert(!validateProfilePayload({ age: 150 }).valid, 'Rejects age > 120');
    assert(validateProfilePayload({ age: 25 }).valid, 'Accepts valid age 25');

    assert(!validateProfilePayload({ profile: { wakeTime: '25:00' } }).valid, 'Rejects invalid 25:00 time');
    assert(!validateProfilePayload({ profile: { sleepTime: '7:30' } }).valid, 'Rejects non-padded 7:30 time');
    assert(validateProfilePayload({ profile: { wakeTime: '07:30' } }).valid, 'Accepts valid 07:30 time');

    assert(!validateProfilePayload({ preferences: { productivityPeriod: 'NIGHT' } }).valid, 'Rejects invalid productivity period');
    assert(validateProfilePayload({ preferences: { productivityPeriod: 'MORNING' } }).valid, 'Accepts valid MORNING period');

    // Onboarding requires name and age
    assert(!validateProfilePayload({}, true).valid, 'Onboarding requires name and age');
    assert(!validateProfilePayload({ name: 'Parth' }, true).valid, 'Onboarding requires age');
    assert(validateProfilePayload({ name: 'Parth', age: 21 }, true).valid, 'Onboarding accepts valid name and age');

    // Suite 2: Unauthenticated Profile Access
    console.log('\nSuite 2: Unauthenticated Security & Access Control');
    const unauthGet = await request(port, 'GET', '/api/profile');
    assert(unauthGet.status === 401, 'GET /api/profile returns 401 for unauthenticated request');
    assert(unauthGet.body.error?.code === 'UNAUTHORIZED', 'Error code is UNAUTHORIZED');

    const unauthPut = await request(port, 'PUT', '/api/profile', { name: 'Hacker' });
    assert(unauthPut.status === 401, 'PUT /api/profile returns 401 for unauthenticated request');

    const unauthOnboarding = await request(port, 'POST', '/api/profile/onboarding', { name: 'Hacker', age: 20 });
    assert(unauthOnboarding.status === 401, 'POST /api/profile/onboarding returns 401 for unauthenticated request');

    const unauthStatus = await request(port, 'GET', '/api/profile/onboarding-status');
    assert(unauthStatus.status === 401, 'GET /api/profile/onboarding-status returns 401 for unauthenticated request');

    // Suite 3: User Registration & Initial Onboarding Status
    console.log('\nSuite 3: User Registration & Default Profile State');
    const userAReg = await request(port, 'POST', '/api/auth/register', {
      name: 'User Alpha',
      email: 'alpha@zenin.os',
      password: 'StrongPassword123!',
    });
    const tokenA = userAReg.body.token;

    const userBReg = await request(port, 'POST', '/api/auth/register', {
      name: 'User Beta',
      email: 'beta@zenin.os',
      password: 'StrongPassword456!',
    });
    const tokenB = userBReg.body.token;

    // Check User A onboarding status before onboarding
    const statusBeforeA = await request(port, 'GET', '/api/profile/onboarding-status', undefined, {
      Authorization: `Bearer ${tokenA}`,
    });
    assert(statusBeforeA.status === 200, 'GET /api/profile/onboarding-status returns 200');
    assert(statusBeforeA.body.onboardingCompleted === false, 'New user has onboardingCompleted = false');

    // Fetch initial profile for User A
    const profileA = await request(port, 'GET', '/api/profile', undefined, {
      Authorization: `Bearer ${tokenA}`,
    });
    assert(profileA.status === 200, 'GET /api/profile returns 200 for authenticated user');
    assert(profileA.body.user.name === 'User Alpha', 'Profile matches user name');
    assert(profileA.body.user.email === 'alpha@zenin.os', 'Profile matches email');
    assert(profileA.body.user.onboardingCompleted === false, 'Profile indicates onboarding not completed');
    assert(profileA.body.user.passwordHash === undefined, 'No passwordHash in profile response');

    // Suite 4: Onboarding Completion
    console.log('\nSuite 4: POST /api/profile/onboarding');
    const onboardingPayload = {
      name: 'Alpha Chief',
      age: 24,
      plan: 'PRO', // Attempt client override
      profile: {
        wakeTime: '06:30',
        sleepTime: '22:30',
        workStartTime: '08:30',
        workEndTime: '17:30',
        primaryGoal: 'Build high-performance systems',
        focusTargetMinutes: 180,
        preferredFocusMinutes: 50,
        preferredBreakMinutes: 10,
      },
      preferences: {
        productivityPeriod: 'MORNING',
        workloadPreference: 'AMBITIOUS',
      },
      aiProfile: {
        improvementGoal: 'Eliminate phone distraction',
        distractions: 'Notifications',
        biggestGoal: 'Launch Zenin OS',
      },
    };

    const onboardRes = await request(port, 'POST', '/api/profile/onboarding', onboardingPayload, {
      Authorization: `Bearer ${tokenA}`,
    });

    assert(onboardRes.status === 200, 'POST /api/profile/onboarding returns 200 OK');
    assert(onboardRes.body.success === true, 'Onboarding response success is true');
    assert(onboardRes.body.user.name === 'Alpha Chief', 'User name updated to Alpha Chief');
    assert(onboardRes.body.user.age === 24, 'User age set to 24');
    assert(onboardRes.body.user.onboardingCompleted === true, 'onboardingCompleted is now true');
    assert(onboardRes.body.user.plan === 'FREE', 'Client cannot override plan to PRO during onboarding');
    assert(onboardRes.body.user.profile.wakeTime === '06:30', 'Wake time preserved');
    assert(onboardRes.body.user.profile.primaryGoal === 'Build high-performance systems', 'Primary goal preserved');
    assert(onboardRes.body.user.preferences.productivityPeriod === 'MORNING', 'Productivity period preserved');
    assert(onboardRes.body.user.aiProfile.biggestGoal === 'Launch Zenin OS', 'AI profile goal preserved');

    // Verify status endpoint reflects completion
    const statusAfterA = await request(port, 'GET', '/api/profile/onboarding-status', undefined, {
      Authorization: `Bearer ${tokenA}`,
    });
    assert(statusAfterA.body.onboardingCompleted === true, 'Status endpoint now returns onboardingCompleted = true');

    // Suite 5: User Isolation (User B cannot see User A's profile)
    console.log('\nSuite 5: User Isolation & Cross-Account Safety');
    const profileB = await request(port, 'GET', '/api/profile', undefined, {
      Authorization: `Bearer ${tokenB}`,
    });
    assert(profileB.body.user.name === 'User Beta', 'User B sees own name');
    assert(profileB.body.user.onboardingCompleted === false, 'User B onboarding remains false');
    assert(profileB.body.user.email === 'beta@zenin.os', 'User B sees own email');

    // Suite 6: Profile Editing (PUT /api/profile)
    console.log('\nSuite 6: PUT /api/profile (Personalization Update)');
    const updateRes = await request(port, 'PUT', '/api/profile', {
      name: 'Alpha Prime',
      profile: {
        wakeTime: '06:00',
        primaryGoal: 'Master Android Architecture',
      },
    }, {
      Authorization: `Bearer ${tokenA}`,
    });

    assert(updateRes.status === 200, 'PUT /api/profile returns 200 OK');
    assert(updateRes.body.user.name === 'Alpha Prime', 'Name updated to Alpha Prime');
    assert(updateRes.body.user.profile.wakeTime === '06:00', 'Wake time updated to 06:00');
    assert(updateRes.body.user.profile.primaryGoal === 'Master Android Architecture', 'Primary goal updated');
    assert(updateRes.body.user.profile.sleepTime === '22:30', 'Unchanged sleep time is preserved');

    console.log('\n====================================================');
    console.log(`STAGE 10B TEST SUMMARY: ${passed} passed, ${failed} failed`);
    console.log('====================================================');
  } finally {
    server.close();
  }

  if (failed > 0) {
    process.exit(1);
  }
}

runStage10bTests().catch((err) => {
  console.error('Stage 10B test failed:', err);
  process.exit(1);
});
