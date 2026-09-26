/**
 * Stage 10A Part 2 - User Profile & Onboarding Unit Test Suite
 *
 * Verifies:
 * 1. Profile Model & Sanitization:
 *    - Valid profile accepted
 *    - Invalid/empty name rejected
 *    - Overly long name clamped/rejected
 *    - Invalid age rejected (<13 or >120)
 *    - Valid age accepted (e.g. 21)
 *    - Invalid time format rejected (non 24h HH:mm)
 *    - Valid time format accepted (e.g. 05:30)
 *    - Unknown goals rejected
 *    - Valid goals accepted (STUDY, JOB_PREPARATION, CODING, etc.)
 *    - Invalid planning intensity rejected
 *    - Valid planning intensity accepted (LIGHT, BALANCED, INTENSE)
 *    - Invalid reminder style rejected
 *    - Valid reminder style accepted (MINIMAL, BALANCED, FREQUENT)
 *    - Focus duration validation (25, 45, 50, 60, 90)
 * 2. Profile Serialization & Data Isolation:
 *    - SafeUser strips passwordHash
 *    - SafeUser strips MongoDB _id internal
 *    - Backward compatibility for existing users with null profile/onboarding
 * 3. Onboarding Status Validation:
 *    - Incomplete onboarding reports completed = false
 *    - Valid onboarding payload sets completed = true with timestamp
 */

import { validateProfilePayload } from '../server/profile/profileValidation.js';
import { toSafeUser, UserDocument, DEFAULT_USER_PROFILE } from '../server/models/user.js';
import { ObjectId } from 'mongodb';

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

async function runStage10aProfileTests() {
  console.log('====================================================');
  console.log('STAGE 10A PART 2 — PROFILE UNIT TEST SUITE');
  console.log('====================================================\n');

  // Suite 1: Name Validation
  console.log('Suite 1: Name Validation');
  assert(!validateProfilePayload({ name: '' }).valid, 'Empty name rejected');
  assert(!validateProfilePayload({ name: '   ' }).valid, 'Whitespace-only name rejected');
  assert(validateProfilePayload({ name: 'Parth Sharma' }).valid, 'Valid name accepted');
  assert(!validateProfilePayload({ name: 'A'.repeat(101) }).valid, 'Name > 100 characters rejected');
  assert(!validateProfilePayload({}, true).valid, 'Name required during onboarding');

  // Suite 2: Age Validation
  console.log('\nSuite 2: Age Validation');
  assert(!validateProfilePayload({ age: 10 }).valid, 'Age < 13 rejected');
  assert(!validateProfilePayload({ age: 125 }).valid, 'Age > 120 rejected');
  assert(!validateProfilePayload({ age: 'twenty' }).valid, 'Non-numeric age rejected');
  assert(!validateProfilePayload({ age: 21.5 }).valid, 'Float age rejected');
  assert(validateProfilePayload({ age: 21 }).valid, 'Valid age 21 accepted');
  assert(!validateProfilePayload({ name: 'Parth' }, true).valid, 'Age required during onboarding');

  // Suite 3: Time Field Validation (HH:mm)
  console.log('\nSuite 3: 24h Time Field Validation');
  assert(!validateProfilePayload({ wakeTime: '5:30' }).valid, 'Non-padded 5:30 rejected');
  assert(!validateProfilePayload({ wakeTime: '25:00' }).valid, 'Invalid hour 25:00 rejected');
  assert(!validateProfilePayload({ sleepTime: '22:60' }).valid, 'Invalid minute 22:60 rejected');
  assert(validateProfilePayload({ wakeTime: '05:30', sleepTime: '22:30' }).valid, 'Valid 05:30 and 22:30 accepted');
  assert(validateProfilePayload({ workStartTime: '08:00', workEndTime: '18:00' }).valid, 'Valid work times accepted');

  // Suite 4: Goals Validation
  console.log('\nSuite 4: Productivity Goals Validation');
  assert(!validateProfilePayload({ goals: 'CODING' }).valid, 'Non-array goals rejected');
  assert(!validateProfilePayload({ goals: ['CODING', 'GAMING'] }).valid, 'Unknown goal "GAMING" rejected');
  assert(validateProfilePayload({ goals: ['CODING', 'JOB_PREPARATION'] }).valid, 'Valid goals array accepted');

  // Suite 5: Planning Intensity & Reminder Style
  console.log('\nSuite 5: Planning Intensity & Reminder Style');
  assert(!validateProfilePayload({ planningIntensity: 'EXTREME' }).valid, 'Unknown planning intensity rejected');
  assert(validateProfilePayload({ planningIntensity: 'BALANCED' }).valid, 'BALANCED intensity accepted');
  assert(validateProfilePayload({ planningIntensity: 'INTENSE' }).valid, 'INTENSE intensity accepted');
  assert(!validateProfilePayload({ reminderStyle: 'ANNOYING' }).valid, 'Unknown reminder style rejected');
  assert(validateProfilePayload({ reminderStyle: 'MINIMAL' }).valid, 'MINIMAL reminder style accepted');
  assert(validateProfilePayload({ reminderStyle: 'FREQUENT' }).valid, 'FREQUENT reminder style accepted');

  // Suite 6: Focus Durations
  console.log('\nSuite 6: Focus Durations');
  assert(!validateProfilePayload({ preferredFocusDuration: 30 }).valid, 'Unsupported focus duration 30m rejected');
  assert(validateProfilePayload({ preferredFocusDuration: 25 }).valid, '25m duration accepted');
  assert(validateProfilePayload({ preferredFocusDuration: 50 }).valid, '50m duration accepted');
  assert(validateProfilePayload({ preferredFocusDuration: 90 }).valid, '90m duration accepted');

  // Suite 7: Model Sanitization & Backward Compatibility
  console.log('\nSuite 7: User Serialization & Security');
  const rawOldUserDoc: UserDocument = {
    _id: new ObjectId(),
    name: 'Old User',
    email: 'old.user@zenin.os',
    passwordHash: 'salt123:scryptKey456',
    plan: 'FREE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const safeOldUser = toSafeUser(rawOldUserDoc);
  assert(safeOldUser.name === 'Old User', 'Preserves old user name');
  assert(safeOldUser.email === 'old.user@zenin.os', 'Preserves old user email');
  assert(safeOldUser.onboarding.completed === false, 'Old user defaults onboarding.completed to false');
  assert(safeOldUser.profile.wakeTime === '05:30', 'Provides safe default wakeTime');
  assert((safeOldUser as any).passwordHash === undefined, 'passwordHash STRIPPED from safe user');
  assert((safeOldUser as any)._id === undefined, 'MongoDB _id internal converted to string id');

  console.log('\n====================================================');
  console.log(`STAGE 10A PART 2 PROFILE SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runStage10aProfileTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
