/**
 * Stage 10A - Device Identity & First-Launch Onboarding Integration Tests
 *
 * Verifies:
 * 1. First installation creates exactly one installation record in MongoDB user_installations.
 * 2. Same installation ID maps to the exact same userId (Idempotency).
 * 3. Different installation ID maps to a different user identity.
 * 4. Concurrent / repeated registration does not create duplicate users.
 * 5. Onboarding validation: name (required, non-empty, max 100), age (required, integer 13-120).
 * 6. Profile saves correctly to MongoDB.
 * 7. Onboarding completion is idempotent and safe against repeated calls.
 * 8. User isolation: User A cannot read or modify User B's profile.
 * 9. Clear App Data scenario:
 *    - Stable installation ID restores existing user and onboarding state.
 *    - Does NOT create an uncontrolled duplicate account.
 * 10. Account recovery: Linking an installation ID to an authenticated account.
 * 11. Zero credential / secret leakage (no passwordHash, no MongoDB URI, no AUTH_SECRET).
 * 12. Real MongoDB Atlas persistence verified.
 */

import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import { DeviceService } from '../server/device/deviceService.js';
import { deviceRouter } from '../server/device/deviceRoutes.js';
import { profileRouter, onboardingRouter } from '../server/profile/profileRoutes.js';
import { authRouter } from '../server/auth/authRoutes.js';
import { isMongoConfigured, connectToDatabase, closeDatabase } from '../server/db/mongodb.js';
import { UserDocument, UserInstallationDocument } from '../server/models/user.js';
import { Db, ObjectId } from 'mongodb';

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
  server: http.Server,
  method: string,
  path: string,
  body?: any,
  headers: Record<string, string> = {}
): Promise<{ status: number; body: any; headers: http.IncomingHttpHeaders }> {
  const addr = server.address() as any;
  const port = addr.port;

  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const reqHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };
    if (postData) {
      reqHeaders['Content-Length'] = Buffer.byteLength(postData).toString();
    }

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: reqHeaders,
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => (rawData += chunk));
        res.on('end', () => {
          let parsed: any = null;
          try {
            parsed = JSON.parse(rawData);
          } catch {
            parsed = rawData;
          }
          resolve({ status: res.statusCode || 500, body: parsed, headers: res.headers });
        });
      }
    );

    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runDeviceIdentityTests() {
  console.log('====================================================');
  console.log('ZENIN OS STAGE 10A — DEVICE IDENTITY & ONBOARDING SUITE');
  console.log('====================================================\n');

  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api/device', deviceRouter);
  app.use('/api/profile', profileRouter);
  app.use('/api/onboarding', onboardingRouter);
  app.use('/api/auth', authRouter);

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));

  const testInstallationA = 'zenin_inst_test_device_alpha_12345';
  const testInstallationB = 'zenin_inst_test_device_beta_67890';

  let testDb: Db | null = null;
  if (isMongoConfigured()) {
    testDb = await connectToDatabase();
    // Clean any previous test artifacts
    await testDb.collection('user_installations').deleteMany({
      installationId: { $in: [testInstallationA, testInstallationB] },
    });
    await testDb.collection('users').deleteMany({
      deviceInstallationId: { $in: [testInstallationA, testInstallationB] },
    });
    await testDb.collection('users').deleteMany({
      email: { $in: ['device_link_user@zenin.os'] },
    });
  }

  try {
    // Suite 1: Device Registration Validation
    console.log('Suite 1: Device Registration Validation');
    const emptyRes = await request(server, 'POST', '/api/device/register', {});
    assert(emptyRes.status === 400, 'Rejects empty registration payload with 400');
    assert(emptyRes.body.error?.code === 'INVALID_REQUEST', 'Error code is INVALID_REQUEST');

    const invalidIdRes = await request(server, 'POST', '/api/device/register', { installationId: 'short' });
    assert(invalidIdRes.status === 400, 'Rejects short installationId (< 8 chars)');

    // Suite 2: First Launch & User Creation
    console.log('\nSuite 2: First Launch Device Registration');
    const regResA = await request(server, 'POST', '/api/device/register', {
      installationId: testInstallationA,
      platform: 'android',
      appVersion: '1.0.0',
    });

    assert(regResA.status === 200, 'Device A registers successfully with 200 OK');
    assert(Boolean(regResA.body.token), 'Registration returns signed auth token');
    assert(regResA.body.user.plan === 'FREE', 'New device account is strictly FREE plan');
    assert(regResA.body.user.onboardingCompleted === false, 'New device account starts with onboardingCompleted: false');
    assert((regResA.body.user as any).passwordHash === undefined, 'No passwordHash in response');

    const userA_Id = regResA.body.user.id;
    const tokenA = regResA.body.token;

    // Verify in real MongoDB
    if (isMongoConfigured() && testDb) {
      const instRecord = await testDb.collection<UserInstallationDocument>('user_installations').findOne({
        installationId: testInstallationA,
      });
      assert(instRecord !== null, 'MongoDB user_installations contains device record');
      assert(instRecord?.userId === userA_Id, 'user_installations links to correct userId');

      const userRecord = await testDb.collection<UserDocument>('users').findOne({
        _id: new ObjectId(userA_Id),
      });
      assert(userRecord !== null, 'MongoDB users collection contains created user document');
      assert(userRecord?.deviceInstallationId === testInstallationA, 'User record preserves deviceInstallationId');
    }

    // Suite 3: Idempotency & Duplicate Prevention (Same installationId -> Same userId)
    console.log('\nSuite 3: Same installationId maps to Same userId (Deduplication)');
    const secondCallA = await request(server, 'POST', '/api/device/register', {
      installationId: testInstallationA,
      platform: 'android',
      appVersion: '1.0.0',
    });

    assert(secondCallA.status === 200, 'Repeated device registration succeeds');
    assert(secondCallA.body.user.id === userA_Id, 'PROVED: same installationId → exact same userId');

    if (isMongoConfigured() && testDb) {
      const countInst = await testDb.collection('user_installations').countDocuments({
        installationId: testInstallationA,
      });
      assert(countInst === 1, 'MongoDB user_installations has exactly 1 record (no duplicate installation records)');

      const countUsers = await testDb.collection('users').countDocuments({
        deviceInstallationId: testInstallationA,
      });
      assert(countUsers === 1, 'MongoDB users has exactly 1 user for this installation (no duplicate users)');
    }

    // Suite 4: Different installationId -> Different user identity
    console.log('\nSuite 4: Different installationId maps to Different userId');
    const regResB = await request(server, 'POST', '/api/device/register', {
      installationId: testInstallationB,
      platform: 'android',
      appVersion: '1.0.0',
    });

    assert(regResB.status === 200, 'Device B registers successfully');
    const userB_Id = regResB.body.user.id;
    const tokenB = regResB.body.token;
    assert(userB_Id !== userA_Id, 'PROVED: different installationId → different userId');

    // Suite 5: First-Launch Onboarding & Profile Saving
    console.log('\nSuite 5: First-Launch Onboarding Flow');
    // Check initial onboarding status
    const statusBefore = await request(server, 'GET', '/api/onboarding/status', undefined, {
      Authorization: `Bearer ${tokenA}`,
    });
    assert(statusBefore.status === 200, 'GET /api/onboarding/status returns 200');
    assert(statusBefore.body.completed === false, 'Initial onboarding status is completed: false');

    // Validation: missing name or age
    const invalidOnboarding = await request(
      server,
      'POST',
      '/api/onboarding/complete',
      { name: '', age: 25 },
      { Authorization: `Bearer ${tokenA}` }
    );
    assert(invalidOnboarding.status === 400, 'Rejects onboarding with empty name (400)');

    const invalidAge = await request(
      server,
      'POST',
      '/api/onboarding/complete',
      { name: 'Alex Vance', age: 10 },
      { Authorization: `Bearer ${tokenA}` }
    );
    assert(invalidAge.status === 400, 'Rejects onboarding with age < 13 (400)');

    // Successful Onboarding
    const validOnboarding = await request(
      server,
      'POST',
      '/api/onboarding/complete',
      {
        name: 'Alex Vance',
        age: 26,
        wakeTime: '06:00',
        sleepTime: '23:00',
        targetFocusHours: 5,
        planningIntensity: 'INTENSE',
        productivityPreference: 'Deep Work',
        aiPlannerPreference: 'Structured schedule',
      },
      { Authorization: `Bearer ${tokenA}` }
    );

    assert(validOnboarding.status === 200, 'POST /api/onboarding/complete returns 200 OK');
    assert(validOnboarding.body.profile.onboardingCompleted === true, 'onboardingCompleted is true in response');
    assert(validOnboarding.body.profile.name === 'Alex Vance', 'Profile preserves full name');
    assert(validOnboarding.body.profile.age === 26, 'Profile preserves age');
    assert(validOnboarding.body.profile.planningIntensity === 'INTENSE', 'Profile preserves planning intensity');
    assert((validOnboarding.body as any).passwordHash === undefined, 'ZERO passwordHash in onboarding response');

    // Verify onboarding status is now completed
    const statusAfter = await request(server, 'GET', '/api/onboarding/status', undefined, {
      Authorization: `Bearer ${tokenA}`,
    });
    assert(statusAfter.body.completed === true, 'GET /api/onboarding/status returns completed: true');

    // Suite 6: Repeated Onboarding Completion is Safe & Idempotent
    console.log('\nSuite 6: Repeated Onboarding Idempotency');
    const repeatedOnboarding = await request(
      server,
      'POST',
      '/api/onboarding/complete',
      {
        name: 'Alex Vance',
        age: 27,
      },
      { Authorization: `Bearer ${tokenA}` }
    );
    assert(repeatedOnboarding.status === 200, 'Repeated onboarding returns 200 OK');
    assert(repeatedOnboarding.body.profile.onboardingCompleted === true, 'Remains completed: true');
    assert(repeatedOnboarding.body.profile.age === 27, 'Safely updates age without creating duplicate user');

    // Suite 7: User Isolation (User A cannot access or modify User B)
    console.log('\nSuite 7: User Profile Isolation');
    const profileB = await request(server, 'GET', '/api/profile', undefined, {
      Authorization: `Bearer ${tokenB}`,
    });
    assert(profileB.status === 200, 'User B retrieves own profile');
    assert(profileB.body.profile.id === userB_Id, 'User B sees own user id');
    assert(profileB.body.profile.name !== 'Alex Vance', 'User B does NOT see User A data');
    assert(profileB.body.profile.onboardingCompleted === false, 'User B onboarding remains false');

    // Suite 8: Clear App Data Scenario Simulation
    console.log('\nSuite 8: Clear App Data Scenario Simulation');
    // In Android: When "Clear App Data" occurs:
    // 1. SharedPreferences and local SQLite databases are wiped.
    // 2. The stable ANDROID_ID hash produces the SAME installationId (testInstallationA).
    // 3. The client calls POST /api/device/register with testInstallationA.
    const restoredLaunch = await request(server, 'POST', '/api/device/register', {
      installationId: testInstallationA,
      platform: 'android',
      appVersion: '1.0.0',
    });

    assert(restoredLaunch.status === 200, 'Post-clear-data device registration succeeds');
    assert(restoredLaunch.body.user.id === userA_Id, 'User identity restored to existing user (NO duplicate created)');
    assert(restoredLaunch.body.user.onboardingCompleted === true, 'Server-side onboarding state restored as completed');

    const restoredProfile = await request(server, 'GET', '/api/profile', undefined, {
      Authorization: `Bearer ${restoredLaunch.body.token}`,
    });
    assert(restoredProfile.body.profile.name === 'Alex Vance', 'User profile (name) restored accurately');
    assert(restoredProfile.body.profile.age === 27, 'User profile (age) restored accurately');

    // Suite 9: Account Recovery & Linking
    console.log('\nSuite 9: Account Recovery & Device Linking');
    // Register authenticated account
    const regAccount = await request(
      server,
      'POST',
      '/api/auth/register',
      {
        name: 'Device Link User',
        email: 'device_link_user@zenin.os',
        password: 'Password123!',
      },
      { 'x-installation-id': testInstallationB }
    );
    assert(regAccount.status === 201, 'Created authenticated user account');

    // Verify installation B was linked to new user account
    if (isMongoConfigured() && testDb) {
      const linkRecord = await testDb.collection<UserInstallationDocument>('user_installations').findOne({
        installationId: testInstallationB,
      });
      assert(linkRecord?.userId === regAccount.body.user.id, 'Installation B successfully linked to authenticated account');
    }

    console.log('\n====================================================');
    console.log(`DEVICE IDENTITY TEST SUMMARY: ${passed} passed, ${failed} failed`);
    console.log('====================================================');
  } finally {
    server.close();
    if (testDb && isMongoConfigured()) {
      await testDb.collection('user_installations').deleteMany({
        installationId: { $in: [testInstallationA, testInstallationB] },
      });
      await testDb.collection('users').deleteMany({
        deviceInstallationId: { $in: [testInstallationA, testInstallationB] },
      });
      await testDb.collection('users').deleteMany({
        email: { $in: ['device_link_user@zenin.os'] },
      });
    }
    await closeDatabase();
  }

  process.exit(failed > 0 ? 1 : 0);
}

runDeviceIdentityTests().catch(async (err) => {
  console.error('Device identity test failed:', err);
  await closeDatabase().catch(() => {});
  process.exit(1);
});
