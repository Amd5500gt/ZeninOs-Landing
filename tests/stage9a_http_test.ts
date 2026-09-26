/**
 * HTTP Integration Test Suite for Stage 9A Backend
 * Tests live HTTP requests to POST /api/ai/day-plan and GET /api/health
 */

import express from 'express';
import { plannerRateLimitMiddleware, RateLimiter } from '../server/planner/rateLimiter.js';
import { handleDayPlanRequest } from '../server/planner/controller.js';
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
  headers: Record<string, string> = {},
  body?: any
): Promise<{ status: number; body: any; headers: http.IncomingHttpHeaders }> {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : undefined;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: serverPort,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(dataString ? { 'Content-Length': Buffer.byteLength(dataString) } : {}),
          ...headers
        }
      },
      (res) => {
        let resData = '';
        res.on('data', (chunk) => {
          resData += chunk;
        });
        res.on('end', () => {
          let parsed: any;
          try {
            parsed = JSON.parse(resData);
          } catch {
            parsed = resData;
          }
          resolve({ status: res.statusCode || 0, body: parsed, headers: res.headers });
        });
      }
    );
    req.on('error', reject);
    if (dataString) {
      req.write(dataString);
    }
    req.end();
  });
}

async function runHttpTests() {
  console.log('====================================================');
  console.log('STAGE 9A - HTTP INTEGRATION TEST SUITE');
  console.log('====================================================\n');

  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Zenin OS Backend' });
  });

  app.post('/api/ai/day-plan', plannerRateLimitMiddleware, handleDayPlanRequest);

  const server = app.listen(3055);
  await new Promise((r) => setTimeout(r, 200));

  try {
    // 1. Health check
    console.log('Suite 1: GET /api/health');
    const health = await request(3055, 'GET', '/api/health');
    assert(health.status === 200, 'Health check returns 200 OK');
    assert(health.body?.status === 'ok', 'Health response body contains status ok');

    // 2. Missing body
    console.log('\nSuite 2: Missing & Malformed Bodies');
    const missingBody = await request(3055, 'POST', '/api/ai/day-plan', {}, {});
    assert(missingBody.status === 400, 'Empty body returns 400 Bad Request');
    assert(missingBody.body?.success === false, 'Body success is false');
    assert(missingBody.body?.error?.code === 'INVALID_REQUEST', 'Error code is INVALID_REQUEST');

    // 3. Invalid date format
    const badDate = await request(3055, 'POST', '/api/ai/day-plan', {}, {
      date: '25-09-2026',
      context: {}
    });
    assert(badDate.status === 400, 'Invalid date format returns 400 Bad Request');
    assert(badDate.body?.error?.code === 'INVALID_REQUEST', 'Error code is INVALID_REQUEST on date error');

    // 4. Successful Mock Plan (testing structured response schema)
    console.log('\nSuite 3: Successful Structured Planner Response (via Mock/Dev)');
    const validPayload = {
      date: '2026-09-25',
      context: {
        tasks: [
          { id: 1, title: 'Complete Stage 9A', priority: 'HIGH', isCompleted: false },
          { id: 2, title: 'Drink water', priority: 'LOW', isCompleted: false }
        ],
        habits: [
          { id: 10, name: 'Deep Work', doneToday: false }
        ],
        focusStats: { todayFocusMinutes: 60 }
      }
    };

    const mockRes = await request(
      3055,
      'POST',
      '/api/ai/day-plan',
      { 'x-zenin-mock': 'true' },
      validPayload
    );

    assert(mockRes.status === 200, 'Mock day plan returns 200 OK');
    assert(mockRes.body?.success === true, 'Response success is true');
    assert(mockRes.body?.plan?.date === '2026-09-25', 'Response plan date matches');
    assert(['LIGHT', 'MODERATE', 'HEAVY'].includes(mockRes.body?.plan?.overall_load), 'overall_load is valid enum');
    assert(Array.isArray(mockRes.body?.plan?.schedule), 'schedule is an array');
    assert(Array.isArray(mockRes.body?.plan?.priorities), 'priorities is an array');
    assert(Array.isArray(mockRes.body?.plan?.insights), 'insights is an array');
    assert(Array.isArray(mockRes.body?.plan?.warnings), 'warnings is an array');

    // Verify schedule items schema
    const firstSchedule = mockRes.body?.plan?.schedule[0];
    assert(typeof firstSchedule?.start_time === 'string', 'Schedule start_time is string');
    assert(typeof firstSchedule?.end_time === 'string', 'Schedule end_time is string');
    assert(['HABIT', 'TASK', 'FOCUS', 'BREAK', 'MEAL', 'FREE'].includes(firstSchedule?.type), 'Schedule type is valid');
    assert(typeof firstSchedule?.reason === 'string', 'Schedule reason is string');

    // 5. Test Gemini unavailable response (when key is missing or dummy)
    console.log('\nSuite 4: Gemini Error & Unavailability Handling');
    const originalKey = process.env.GEMINI_API_KEY;
    try {
      process.env.GEMINI_API_KEY = ''; // Simulate missing key
      const geminiFailRes = await request(
        3055,
        'POST',
        '/api/ai/day-plan',
        {}, // No mock header, live call attempt
        validPayload
      );
      assert(geminiFailRes.status === 503, 'Missing API key returns 503 Service Unavailable');
      assert(geminiFailRes.body?.success === false, 'success is false');
      assert(geminiFailRes.body?.error?.code === 'AI_UNAVAILABLE', 'error code is AI_UNAVAILABLE');
      assert(geminiFailRes.body?.error?.message === 'Planner temporarily unavailable', 'Safe non-leaking error message returned');
    } finally {
      process.env.GEMINI_API_KEY = originalKey;
    }

    console.log('\n====================================================');
    console.log(`HTTP TEST SUMMARY: ${passed} passed, ${failed} failed`);
    console.log('====================================================');
  } finally {
    server.close();
  }

  if (failed > 0) {
    process.exit(1);
  }
}

runHttpTests().catch((e) => {
  console.error('HTTP test failure:', e);
  process.exit(1);
});
