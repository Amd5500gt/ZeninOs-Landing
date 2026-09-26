/**
 * Stage 10A Part 2 - Android Architecture & Source Code Verification Test Suite
 *
 * Verifies:
 * 1. Android class structure in com.zenin.os.profile.*:
 *    - UserProfile.java
 *    - OnboardingState.java
 *    - UserProfileService.java
 *    - UserProfileRepository.java
 *    - OnboardingViewModel.java
 *    - UserProfileViewModel.java
 *    - OnboardingFragment.java
 *    - ProfileEditFragment.java
 * 2. Layouts:
 *    - fragment_onboarding.xml (7 screen layouts with time pickers, goal chips, radio groups)
 *    - bottom_sheet_personalization.xml
 * 3. nav_graph.xml registration:
 *    - @id/navigation_onboarding points to com.zenin.os.profile.ui.OnboardingFragment
 * 4. First-launch check in MainActivity:
 *    - routes uncompleted users to navigation_onboarding
 *    - hides bottom navigation during onboarding
 * 5. ProfileFragment integration:
 *    - opens ProfileEditFragment on "Edit" personalization click
 * 6. Security Audit:
 *    - ZERO API keys, tokens, MongoDB URIs, or secrets in Android codebase
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

async function runStage10aPart2AndroidTests() {
  console.log('====================================================');
  console.log('STAGE 10A PART 2 — ANDROID ARCHITECTURE TESTS');
  console.log('====================================================\n');

  // Suite 1: Source Files Verification
  console.log('Suite 1: Source Files Verification');
  const requiredFiles = [
    'android/app/src/main/java/com/zenin/os/profile/model/UserProfile.java',
    'android/app/src/main/java/com/zenin/os/profile/model/OnboardingState.java',
    'android/app/src/main/java/com/zenin/os/profile/service/UserProfileService.java',
    'android/app/src/main/java/com/zenin/os/profile/repository/UserProfileRepository.java',
    'android/app/src/main/java/com/zenin/os/profile/viewmodel/OnboardingViewModel.java',
    'android/app/src/main/java/com/zenin/os/profile/viewmodel/UserProfileViewModel.java',
    'android/app/src/main/java/com/zenin/os/profile/ui/OnboardingFragment.java',
    'android/app/src/main/java/com/zenin/os/profile/ui/ProfileEditFragment.java',
    'android/app/src/main/res/layout/fragment_onboarding.xml',
    'android/app/src/main/res/layout/bottom_sheet_personalization.xml',
  ];

  for (const f of requiredFiles) {
    assert(fs.existsSync(f), `Found ${path.basename(f)}`);
  }

  // Suite 2: Navigation Graph Integration
  console.log('\nSuite 2: Navigation Graph Integration');
  const navGraphXml = fs.readFileSync('android/app/src/main/res/navigation/nav_graph.xml', 'utf-8');
  assert(navGraphXml.includes('android:id="@+id/navigation_onboarding"'), 'nav_graph contains navigation_onboarding');
  assert(navGraphXml.includes('com.zenin.os.profile.ui.OnboardingFragment'), 'nav_graph points to profile.ui.OnboardingFragment');

  // Suite 3: MainActivity First Launch Routing
  console.log('\nSuite 3: MainActivity First-Launch Integration');
  const mainActivityJava = fs.readFileSync('android/app/src/main/java/com/zenin/os/MainActivity.java', 'utf-8');
  assert(mainActivityJava.includes('checkFirstLaunchOnboarding'), 'MainActivity calls checkFirstLaunchOnboarding');
  assert(mainActivityJava.includes('navigation_onboarding'), 'MainActivity routes to navigation_onboarding');
  assert(mainActivityJava.includes('binding.bottomNavigation.setVisibility(View.GONE)'), 'MainActivity hides bottom nav during onboarding');

  // Suite 4: Profile Screen Edit Integration
  console.log('\nSuite 4: Profile Screen Edit Integration');
  const profileFragmentJava = fs.readFileSync('android/app/src/main/java/com/zenin/os/ui/profile/ProfileFragment.java', 'utf-8');
  assert(profileFragmentJava.includes('ProfileEditFragment.newInstance()'), 'ProfileFragment opens ProfileEditFragment');

  // Suite 5: 7-Screen Layout Containers in fragment_onboarding.xml
  console.log('\nSuite 5: 7-Screen Onboarding Layout Containers');
  const onboardingXml = fs.readFileSync('android/app/src/main/res/layout/fragment_onboarding.xml', 'utf-8');
  assert(onboardingXml.includes('screen_1_welcome'), 'Contains Screen 1 (Welcome)');
  assert(onboardingXml.includes('screen_2_basic_info'), 'Contains Screen 2 (Basic Info)');
  assert(onboardingXml.includes('screen_3_daily_routine'), 'Contains Screen 3 (Daily Routine Time Pickers)');
  assert(onboardingXml.includes('btn_pick_wake_time'), 'Contains Wake Time Picker Button');
  assert(onboardingXml.includes('btn_pick_sleep_time'), 'Contains Sleep Time Picker Button');
  assert(onboardingXml.includes('screen_4_productivity_goal'), 'Contains Screen 4 (Productivity Goals Chips)');
  assert(onboardingXml.includes('chip_group_goals'), 'Contains ChipGroup for Multi-select Goals');
  assert(onboardingXml.includes('screen_5_focus_preferences'), 'Contains Screen 5 (Focus Preferences)');
  assert(onboardingXml.includes('rg_target_focus_hours'), 'Contains Target Focus Hours RadioGroup');
  assert(onboardingXml.includes('screen_6_personalization'), 'Contains Screen 6 (Personalization Preferences)');
  assert(onboardingXml.includes('rg_planning_intensity'), 'Contains Planning Intensity RadioGroup');
  assert(onboardingXml.includes('screen_7_finish'), 'Contains Screen 7 (Finish Summary)');

  // Suite 6: Security & Credential Isolation Audit
  console.log('\nSuite 6: Security & Credential Isolation Audit');
  const forbiddenPatterns = ['GEMINI_API_KEY', 'MONGODB_URI', 'AUTH_SECRET', 'mongodb+srv', 'passwordHash'];
  let leakDetected = false;

  function auditDir(dir: string) {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const full = path.join(dir, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        auditDir(full);
      } else if (entry.endsWith('.java') || entry.endsWith('.xml')) {
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
  assert(!leakDetected, 'ZERO credentials, secrets, or MongoDB URIs in Android codebase');

  console.log('\n====================================================');
  console.log(`STAGE 10A PART 2 ANDROID SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runStage10aPart2AndroidTests().catch((err) => {
  console.error('Android test runner failed:', err);
  process.exit(1);
});
