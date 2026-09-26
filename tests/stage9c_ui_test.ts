/**
 * Stage 9C Verification Test Suite:
 * - Verifies all required UI layout files and Java classes exist
 * - Verifies navigation destinations in nav_graph.xml
 * - Verifies Home and Profile integration hooks
 * - Verifies UI states mapping (PRO_LOCKED, EMPTY, LOADING, ERROR, SUCCESS, CACHE)
 * - Verifies strict Pro gating in UI flows
 * - Audits security: 0 Gemini API credentials or direct calls in Android
 */

import fs from 'fs';
import path from 'path';

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

async function runStage9cTests() {
  console.log('====================================================');
  console.log('ZENIN OS STAGE 9C — UI & FINAL INTEGRATION TEST SUITE');
  console.log('====================================================\n');

  // 1. Files existence check
  console.log('Suite 1: File Existence Verification');
  const requiredFiles = [
    'android/app/src/main/java/com/zenin/os/ui/ai/AIPlannerFragment.java',
    'android/app/src/main/res/layout/fragment_ai_planner.xml',
    'android/app/src/main/res/layout/item_planner_priority.xml',
    'android/app/src/main/res/layout/item_planner_schedule.xml',
    'android/app/src/main/res/layout/item_planner_bullet.xml',
    'android/app/src/main/res/drawable/ic_auto_awesome.xml',
    'android/app/src/main/res/drawable/ic_refresh.xml',
    'android/app/src/main/res/drawable/ic_arrow_back.xml',
    'android/app/src/main/res/drawable/bg_schedule_pill.xml'
  ];

  for (const f of requiredFiles) {
    assert(fs.existsSync(f), `Found ${path.basename(f)}`);
  }

  // 2. Navigation Graph check
  console.log('\nSuite 2: Navigation Integration');
  const navXml = fs.readFileSync('android/app/src/main/res/navigation/nav_graph.xml', 'utf-8');
  assert(navXml.includes('android:id="@+id/navigation_ai_planner"'), 'nav_graph contains navigation_ai_planner');
  assert(navXml.includes('com.zenin.os.ui.ai.AIPlannerFragment'), 'nav_graph points to AIPlannerFragment');

  // 3. Profile Screen Integration
  console.log('\nSuite 3: Profile Integration');
  const profileJava = fs.readFileSync('android/app/src/main/java/com/zenin/os/ui/profile/ProfileFragment.java', 'utf-8');
  assert(profileJava.includes('R.id.navigation_ai_planner'), 'ProfileFragment navigates to navigation_ai_planner for Pro users');
  assert(profileJava.includes('canUseAIPlanner'), 'ProfileFragment checks canUseAIPlanner');
  assert(profileJava.includes('ProUpgradeBottomSheet.newInstance("AI Day Planner")'), 'ProfileFragment opens Pro upgrade for Free users');

  // 4. Home Screen Integration
  console.log('\nSuite 4: Home Integration');
  const homeXml = fs.readFileSync('android/app/src/main/res/layout/fragment_home.xml', 'utf-8');
  assert(homeXml.includes('card_home_ai_planner'), 'fragment_home.xml contains card_home_ai_planner');
  assert(homeXml.includes('btn_home_ai_planner_cta'), 'fragment_home.xml contains btn_home_ai_planner_cta');

  const homeJava = fs.readFileSync('android/app/src/main/java/com/zenin/os/ui/home/HomeFragment.java', 'utf-8');
  assert(homeJava.includes('setupHomeAiPlannerCard'), 'HomeFragment initializes AI planner card');
  assert(homeJava.includes('R.id.navigation_ai_planner'), 'HomeFragment card navigates to navigation_ai_planner for Pro users');
  assert(homeJava.includes('ProUpgradeBottomSheet.newInstance("AI Day Planner")'), 'HomeFragment card opens Pro upgrade for Free users');

  // 5. Layout States in fragment_ai_planner.xml
  console.log('\nSuite 5: UI State Containers in fragment_ai_planner.xml');
  const plannerXml = fs.readFileSync('android/app/src/main/res/layout/fragment_ai_planner.xml', 'utf-8');
  assert(plannerXml.includes('layout_pro_locked'), 'Contains layout_pro_locked (Pro locked state)');
  assert(plannerXml.includes('layout_empty_state'), 'Contains layout_empty_state (Empty state)');
  assert(plannerXml.includes('layout_loading_state'), 'Contains layout_loading_state (Loading state)');
  assert(plannerXml.includes('layout_error_state'), 'Contains layout_error_state (Error state)');
  assert(plannerXml.includes('layout_plan_content'), 'Contains layout_plan_content (Success plan display)');
  assert(plannerXml.includes('layout_cache_banner'), 'Contains layout_cache_banner (Cache indicator)');
  assert(plannerXml.includes('container_priorities'), 'Contains container_priorities');
  assert(plannerXml.includes('container_schedule'), 'Contains container_schedule');
  assert(plannerXml.includes('container_insights'), 'Contains container_insights');
  assert(plannerXml.includes('container_warnings'), 'Contains container_warnings');

  // 6. Security Audit: 0 Gemini credentials in entire Android directory
  console.log('\nSuite 6: Security Audit');
  const forbiddenPatterns = ['GEMINI_API_KEY', 'generativelanguage.googleapis.com', 'GoogleGenAI'];
  let leakDetected = false;

  function auditDir(dir: string) {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const full = path.join(dir, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        auditDir(full);
      } else if (entry.endsWith('.java') || entry.endsWith('.xml') || entry.endsWith('.gradle')) {
        const text = fs.readFileSync(full, 'utf-8');
        for (const pat of forbiddenPatterns) {
          if (text.includes(pat)) {
            console.error(`Leak detected in ${full}: ${pat}`);
            leakDetected = true;
          }
        }
      }
    }
  }

  auditDir('android/app/src/main');
  assert(!leakDetected, 'ZERO Gemini API keys or direct Gemini API endpoints in android/');

  console.log('\n====================================================');
  console.log(`STAGE 9C TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runStage9cTests().catch(err => {
  console.error('Stage 9C test runner failed:', err);
  process.exit(1);
});
