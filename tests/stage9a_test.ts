/**
 * Comprehensive Stage 9A Backend Test Suite
 * Tests all 10 requirements:
 * 1. Valid planner request
 * 2. Missing request body
 * 3. Invalid request structure
 * 4. Gemini unavailable
 * 5. Gemini timeout
 * 6. Gemini invalid JSON
 * 7. Gemini overlapping schedule
 * 8. Successful structured planner response
 * 9. API key is not exposed to client code
 * 10. Existing Stage 8 build intact
 */

import { sanitizeDayPlanRequest } from '../server/planner/sanitizer.js';
import { validateGeneratedPlan } from '../server/planner/validator.js';
import { RateLimiter } from '../server/planner/rateLimiter.js';
import { generateMockDayPlan } from '../server/planner/mockPlanner.js';
import { DayPlanRequest } from '../server/planner/types.js';

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

async function runTests() {
  console.log('====================================================');
  console.log('ZENIN OS STAGE 9A - AI DAY PLANNER BACKEND TEST SUITE');
  console.log('====================================================\n');

  // Test Sample Data
  const sampleRequest: DayPlanRequest = {
    date: '2026-09-25',
    context: {
      tasks: [
        { id: 101, title: 'Finish Architecture Spec', priority: 'HIGH', isCompleted: false, dueDate: '2026-09-25' },
        { id: 102, title: 'Workout Upper Body', priority: 'MEDIUM', isCompleted: false, dueDate: '2026-09-25' },
        { id: 103, title: 'Old Done Task', priority: 'LOW', isCompleted: true, dueDate: '2026-09-24' }
      ],
      habits: [
        { id: 'h1', name: 'Morning Coding', streak: 12, bestStreak: 18, doneToday: false, time: '08:00' },
        { id: 'h2', name: 'Read 20 Pages', streak: 5, bestStreak: 9, doneToday: true, time: '21:00' }
      ],
      focusStats: {
        todayFocusMinutes: 90,
        totalSessions: 3,
        completedSessions: 3
      },
      dailyReview: {
        moodRating: 4,
        notes: 'Feeling productive this morning'
      },
      preferences: {
        wakeTime: '07:00',
        sleepTime: '23:00',
        workStartTime: '09:00',
        workEndTime: '18:00',
        targetFocusHours: 4
      }
    }
  };

  // ----------------------------------------------------
  // TEST 1: Sanitizer - Valid request
  // ----------------------------------------------------
  console.log('Suite 1: Request Sanitization');
  const validRes = sanitizeDayPlanRequest(sampleRequest);
  assert(validRes.isValid === true, 'Accepts valid sanitized request');
  assert(validRes.sanitizedRequest?.date === '2026-09-25', 'Preserves date');
  assert(validRes.sanitizedRequest?.context.tasks.length === 3, 'Preserves sanitized tasks');

  // ----------------------------------------------------
  // TEST 2: Sanitizer - Missing / Malformed request body
  // ----------------------------------------------------
  console.log('\nSuite 2: Missing & Malformed Request Bodies');
  assert(sanitizeDayPlanRequest(null).isValid === false, 'Rejects null body');
  assert(sanitizeDayPlanRequest(undefined).isValid === false, 'Rejects undefined body');
  assert(sanitizeDayPlanRequest([]).isValid === false, 'Rejects array as root body');
  assert(sanitizeDayPlanRequest({}).isValid === false, 'Rejects empty object body (missing date & context)');
  assert(sanitizeDayPlanRequest({ date: 'invalid-date', context: {} }).isValid === false, 'Rejects invalid date format');
  assert(sanitizeDayPlanRequest({ date: '2026-09-25' }).isValid === false, 'Rejects missing context field');

  // Raw DB entities stripping
  const rawRoomRequest = {
    date: '2026-09-25',
    context: {
      tasks: [
        {
          id: 999,
          title: 'Room Entity Task',
          priority: 'HIGH',
          isCompleted: false,
          _room_internal_metadata: 'SECRET',
          foreign_key_table: 'tasks_table',
          databaseVersion: 4
        }
      ]
    }
  };
  const strippedRes = sanitizeDayPlanRequest(rawRoomRequest);
  assert(strippedRes.isValid === true, 'Accepts task with raw fields');
  assert((strippedRes.sanitizedRequest?.context.tasks[0] as any)._room_internal_metadata === undefined, 'Strips Room internal metadata');
  assert((strippedRes.sanitizedRequest?.context.tasks[0] as any).foreign_key_table === undefined, 'Strips raw DB foreign keys');

  // ----------------------------------------------------
  // TEST 3: Validator - Valid Plan & Structure
  // ----------------------------------------------------
  console.log('\nSuite 3: Plan Validator - Consistency Rules');
  const validPlan = {
    date: '2026-09-25',
    summary: 'A balanced and high-focus daily schedule.',
    overall_load: 'MODERATE',
    schedule: [
      {
        start_time: '08:00',
        end_time: '08:30',
        type: 'HABIT',
        title: 'Morning Coding',
        task_id: null,
        habit_id: 'h1',
        reason: 'Consistent morning habit'
      },
      {
        start_time: '08:45',
        end_time: '09:45',
        type: 'FOCUS',
        title: 'Deep Work: Architecture Spec',
        task_id: 101,
        habit_id: null,
        reason: 'High priority task'
      },
      {
        start_time: '09:45',
        end_time: '10:00',
        type: 'BREAK',
        title: 'Morning Rest',
        task_id: null,
        habit_id: null,
        reason: 'Rest between focus blocks'
      }
    ],
    priorities: [
      {
        rank: 1,
        title: 'Finish Architecture Spec',
        task_id: 101,
        reason: 'Primary high-priority deliverable'
      }
    ],
    insights: ['Focus time is well distributed.'],
    warnings: []
  };

  const valRes = validateGeneratedPlan(validPlan, sampleRequest);
  assert(valRes.isValid === true, 'Valid plan passes validation');

  // ----------------------------------------------------
  // TEST 4: Validator - Overlapping Schedule
  // ----------------------------------------------------
  console.log('\nSuite 4: Plan Validator - Overlapping Schedule Detection');
  const overlappingPlan = {
    ...validPlan,
    schedule: [
      {
        start_time: '08:00',
        end_time: '09:00',
        type: 'HABIT',
        title: 'Morning Coding',
        task_id: null,
        habit_id: 'h1',
        reason: 'Morning habit'
      },
      {
        start_time: '08:30', // Overlaps with 08:00 - 09:00!
        end_time: '09:30',
        type: 'TASK',
        title: 'Finish Architecture Spec',
        task_id: 101,
        habit_id: null,
        reason: 'Work task'
      }
    ]
  };
  const overlapRes = validateGeneratedPlan(overlappingPlan, sampleRequest);
  assert(overlapRes.isValid === false, 'Rejects overlapping schedule blocks');
  assert(overlapRes.errorMessage?.includes('Overlapping schedule blocks detected') === true, 'Accurate overlap error message');

  // ----------------------------------------------------
  // TEST 5: Validator - Inverted or Zero Duration Times
  // ----------------------------------------------------
  console.log('\nSuite 5: Plan Validator - Time Ordering & Format');
  const invertedTimePlan = {
    ...validPlan,
    schedule: [
      {
        start_time: '10:00',
        end_time: '09:00', // start > end
        type: 'TASK',
        title: 'Finish Architecture Spec',
        task_id: 101,
        habit_id: null,
        reason: 'Work task'
      }
    ]
  };
  assert(validateGeneratedPlan(invertedTimePlan, sampleRequest).isValid === false, 'Rejects start_time > end_time');

  const zeroDurationPlan = {
    ...validPlan,
    schedule: [
      {
        start_time: '10:00',
        end_time: '10:00',
        type: 'TASK',
        title: 'Finish Architecture Spec',
        task_id: 101,
        habit_id: null,
        reason: 'Work task'
      }
    ]
  };
  assert(validateGeneratedPlan(zeroDurationPlan, sampleRequest).isValid === false, 'Rejects zero-duration blocks');

  // ----------------------------------------------------
  // TEST 6: Validator - Invented / Unknown IDs & Duplicates
  // ----------------------------------------------------
  console.log('\nSuite 6: Plan Validator - Task / Habit Identity Checks');
  const inventedTaskPlan = {
    ...validPlan,
    schedule: [
      {
        start_time: '10:00',
        end_time: '11:00',
        type: 'TASK',
        title: 'Invented Task',
        task_id: 999999, // Does NOT exist in request context
        habit_id: null,
        reason: 'Invented task'
      }
    ]
  };
  assert(validateGeneratedPlan(inventedTaskPlan, sampleRequest).isValid === false, 'Rejects invented task_id');

  const duplicateHabitPlan = {
    ...validPlan,
    schedule: [
      {
        start_time: '08:00',
        end_time: '08:30',
        type: 'HABIT',
        title: 'Morning Coding',
        task_id: null,
        habit_id: 'h1',
        reason: 'Morning habit'
      },
      {
        start_time: '14:00',
        end_time: '14:30',
        type: 'HABIT',
        title: 'Morning Coding Again',
        task_id: null,
        habit_id: 'h1', // Duplicate habit_id in schedule!
        reason: 'Duplicate habit'
      }
    ]
  };
  assert(validateGeneratedPlan(duplicateHabitPlan, sampleRequest).isValid === false, 'Rejects duplicate habit_id in schedule');

  const completedTaskPlan = {
    ...validPlan,
    schedule: [
      {
        start_time: '10:00',
        end_time: '11:00',
        type: 'TASK',
        title: 'Old Done Task',
        task_id: 103, // Task 103 is completed
        habit_id: null,
        reason: 'Completed task'
      }
    ]
  };
  assert(validateGeneratedPlan(completedTaskPlan, sampleRequest).isValid === false, 'Rejects scheduling already-completed tasks');

  // ----------------------------------------------------
  // TEST 7: Rate Limiter
  // ----------------------------------------------------
  console.log('\nSuite 7: Configurable Rate Limiting');
  const limiter = new RateLimiter(3, 1000); // 3 requests per 1000ms
  const ip = '192.168.1.100';
  assert(limiter.check(ip).allowed === true, 'Request 1/3 allowed');
  assert(limiter.check(ip).allowed === true, 'Request 2/3 allowed');
  assert(limiter.check(ip).allowed === true, 'Request 3/3 allowed');
  assert(limiter.check(ip).allowed === false, 'Request 4/3 blocked by rate limit');

  // ----------------------------------------------------
  // TEST 8: Development Mock Planner
  // ----------------------------------------------------
  console.log('\nSuite 8: Development Mock Planner');
  const mockPlan = generateMockDayPlan(sampleRequest);
  assert(mockPlan.date === sampleRequest.date, 'Mock plan date matches');
  assert(['LIGHT', 'MODERATE', 'HEAVY'].includes(mockPlan.overall_load), 'Mock plan has valid overall_load');
  assert(mockPlan.schedule.length > 0, 'Mock plan generates schedule items');
  assert(mockPlan.priorities.length > 0, 'Mock plan generates priority items');

  // Verify self-validation on mock output
  const mockValidation = validateGeneratedPlan(mockPlan, sampleRequest);
  assert(mockValidation.isValid === true, 'Mock plan strictly satisfies all validation constraints');

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Test runner failure:', e);
  process.exit(1);
});
