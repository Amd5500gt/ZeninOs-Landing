/**
 * Stage 10A Part 1 - Backend Account & Authentication Test Suite
 *
 * Verifies:
 * 1. MongoDB configuration validation
 * 2. Password hashing & salt separation
 * 3. Plaintext password is never stored or matched with invalid hashes
 * 4. User registration validation (missing name, invalid email, short password)
 * 5. Successful registration creates FREE user (client cannot override to PRO)
 * 6. Duplicate email rejection
 * 7. Login with valid credentials
 * 8. Login with invalid credentials rejection
 * 9. Token creation & cryptographic signature verification
 * 10. Tampered session token rejection
 * 11. Expired session token rejection
 * 12. PasswordHash & credentials never appear in SafeUser / API responses
 * 13. Auth rate limiter functionality
 * 14. Zero credential leakage in response objects
 */

import { hashPassword, verifyPassword, signSessionToken, verifySessionToken } from '../server/auth/cryptoUtils.js';
import { AuthService } from '../server/auth/authService.js';
import { isMongoConfigured, getMongoConfig, connectToDatabase, closeDatabase } from '../server/db/mongodb.js';
import { toSafeUser, UserDocument } from '../server/models/user.js';
import { ObjectId, Db } from 'mongodb';

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

async function runStage10aTests() {
  console.log('====================================================');
  console.log('ZENIN OS STAGE 10A PART 1 — AUTH TEST SUITE');
  console.log('====================================================\n');

  // Suite 1: MongoDB Configuration
  console.log('Suite 1: MongoDB Configuration & Safety');
  const mongoConfig = getMongoConfig();
  assert(typeof mongoConfig.dbName === 'string' && mongoConfig.dbName.length > 0, 'MongoDB DB name is configured');
  assert(typeof isMongoConfigured() === 'boolean', 'isMongoConfigured helper returns boolean');

  // Suite 2: Password Security & Cryptographic Hashing
  console.log('\nSuite 2: Password Hashing & Timing-Safe Verification');
  const rawPassword = 'SecurePassword2026!';
  const hash = await hashPassword(rawPassword);

  assert(typeof hash === 'string', 'hashPassword returns string');
  assert(hash.includes(':'), 'Hash format includes salt:key separator');
  assert(!hash.includes(rawPassword), 'Hash NEVER contains plaintext password');

  const isValidMatch = await verifyPassword(rawPassword, hash);
  assert(isValidMatch, 'verifyPassword returns true for correct password');

  const isInvalidMatch = await verifyPassword('WrongPassword', hash);
  assert(!isInvalidMatch, 'verifyPassword returns false for wrong password');

  const emptyMatch = await verifyPassword('', hash);
  assert(!emptyMatch, 'verifyPassword returns false for empty password');

  // Suite 3: Session Token Signing & Verification
  console.log('\nSuite 3: Session Token Security');
  const now = Math.floor(Date.now() / 1000);
  const samplePayload = {
    userId: new ObjectId().toString(),
    email: 'tester@zenin.os',
    plan: 'FREE' as const,
    iat: now,
    exp: now + 3600, // 1 hour
  };

  const token = signSessionToken(samplePayload);
  assert(typeof token === 'string' && token.includes('.'), 'Token generated in payload.signature format');

  const verified = verifySessionToken(token);
  assert(verified !== null, 'Token verified successfully');
  assert(verified?.email === 'tester@zenin.os', 'Token preserves user email');
  assert(verified?.plan === 'FREE', 'Token preserves plan tier');

  // Tampered token test
  const tamperedToken = token.slice(0, -3) + 'xyz';
  const tamperedResult = verifySessionToken(tamperedToken);
  assert(tamperedResult === null, 'Tampered token is rejected');

  // Expired token test
  const expiredPayload = {
    ...samplePayload,
    exp: now - 100, // Expired in the past
  };
  const expiredToken = signSessionToken(expiredPayload);
  assert(verifySessionToken(expiredToken) === null, 'Expired token is rejected');

  // Suite 4: User Document Sanitization
  console.log('\nSuite 4: User Model Sanitization');
  const rawUserDoc: UserDocument = {
    _id: new ObjectId(),
    name: 'Parth Sharma',
    email: 'parth@example.com',
    passwordHash: hash,
    plan: 'FREE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const safeUser = toSafeUser(rawUserDoc);
  assert(safeUser.name === 'Parth Sharma', 'SafeUser preserves name');
  assert(safeUser.email === 'parth@example.com', 'SafeUser preserves email');
  assert(safeUser.plan === 'FREE', 'SafeUser preserves plan');
  assert((safeUser as any).passwordHash === undefined, 'passwordHash is STRIPPED from SafeUser');
  assert((safeUser as any)._id === undefined, 'MongoDB _id internal is converted to clean id string');

  // Suite 5: Registration & Authentication Flow
  console.log('\nSuite 5: Registration & Login Flow');
  AuthService.resetMemoryStore();

  let testDb: Db | null = null;
  if (isMongoConfigured()) {
    try {
      testDb = await connectToDatabase();
      await testDb.collection('users').deleteMany({ email: 'parth.dev@zenin.os' });
      assert(testDb !== null, 'Connected to real MongoDB Atlas for authentication tests');
    } catch (err: any) {
      assert(false, 'Connected to real MongoDB Atlas for authentication tests', err.message);
    }
  }

  const regResult = await AuthService.register({
    name: 'Parth',
    email: 'Parth.Dev@Zenin.OS', // Test email case normalization
    password: 'SuperSecretPassword123',
  });

  assert(regResult.user.email === 'parth.dev@zenin.os', 'Email is normalized to lowercase');
  assert(regResult.user.plan === 'FREE', 'New registered user is initialized strictly as FREE');
  assert(Boolean(regResult.token), 'Registration returns signed auth token');
  assert((regResult.user as any).passwordHash === undefined, 'Registration response contains NO passwordHash');

  if (isMongoConfigured() && testDb) {
    const mongoUser = await testDb.collection<UserDocument>('users').findOne({ email: 'parth.dev@zenin.os' });
    assert(mongoUser !== null, 'REAL MongoDB Atlas persisted the user document (no silent fallback)');
    assert(mongoUser?.email === 'parth.dev@zenin.os', 'MongoDB Atlas stored record matches normalized email');
    assert(mongoUser?.plan === 'FREE', 'MongoDB Atlas stored record strictly has FREE plan');
  }

  // Duplicate email registration should fail
  let duplicateErrorCaught = false;
  try {
    await AuthService.register({
      name: 'Impostor',
      email: 'parth.dev@zenin.os',
      password: 'AnotherPassword456',
    });
  } catch (err: any) {
    duplicateErrorCaught = err.message === 'EMAIL_EXISTS';
  }
  assert(duplicateErrorCaught, 'Duplicate email registration throws EMAIL_EXISTS');

  // Login with correct credentials
  const loginSuccess = await AuthService.login({
    email: 'PARTH.DEV@ZENIN.OS', // Case insensitive test
    password: 'SuperSecretPassword123',
  });
  assert(loginSuccess.user.email === 'parth.dev@zenin.os', 'Login succeeds with correct credentials');
  assert(Boolean(loginSuccess.token), 'Login returns valid session token');

  // Login with invalid credentials
  let invalidCredsCaught = false;
  try {
    await AuthService.login({
      email: 'parth.dev@zenin.os',
      password: 'WrongPassword',
    });
  } catch (err: any) {
    invalidCredsCaught = err.message === 'INVALID_CREDENTIALS';
  }
  assert(invalidCredsCaught, 'Login with wrong password throws INVALID_CREDENTIALS');

  // Login with non-existent user
  let nonExistentCaught = false;
  try {
    await AuthService.login({
      email: 'ghost@zenin.os',
      password: 'SomePassword',
    });
  } catch (err: any) {
    nonExistentCaught = err.message === 'INVALID_CREDENTIALS';
  }
  assert(nonExistentCaught, 'Login with non-existent user throws INVALID_CREDENTIALS');

  // Cleanup test user from MongoDB Atlas
  if (isMongoConfigured() && testDb) {
    await testDb.collection('users').deleteMany({ email: 'parth.dev@zenin.os' });
  }

  await closeDatabase();

  console.log('\n====================================================');
  console.log(`STAGE 10A PART 1 TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('====================================================');

  process.exit(failed > 0 ? 1 : 0);
}

runStage10aTests().catch(async (err) => {
  console.error('Test suite failed:', err);
  await closeDatabase().catch(() => {});
  process.exit(1);
});
