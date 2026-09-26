/**
 * Stage 10B - Android Onboarding & Personalization Verification Test Suite
 *
 * Verifies:
 * 1. Java class file existence for Onboarding & Personalization
 * 2. XML layout file existence
 * 3. nav_graph destination registration (@id/navigation_onboarding)
 * 4. First-launch check integration in MainActivity
 * 5. Personalization bottom sheet trigger in ProfileFragment
 * 6. Audit: Zero credentials, tokens, or MongoDB URIs in android codebase
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

async function runStage10bAndroidTests() {
  console.log('====================================================');
  console.log('STAGE 10B — ANDROID ONBOARDING & ARCHITECTURE TESTS');
  console.log('====================================================\n');

  // Suite 1: File Existence
  console.log('Suite 1: Source Files Verification');
  const requiredFiles = [
    'android/app/src/main/java/com/zenin/os/ui/onboarding/OnboardingFragment.java',
    'android/app/src/main/java/com/zenin/os/ui/onboarding/OnboardingViewModel.java',
    'android/app/src/main/java/com/zenin/os/ui/profile/PersonalizationBottomSheet.java',
    'android/app/src/main/java/com/zenin/os/data/remote/UserProfileService.java',
    'android/app/src/main/res/layout/fragment_onboarding.xml',
    'android/app/src/main/res/layout/bottom_sheet_personalization.xml',
  ];

  for (const f of requiredFiles) {
    assert(fs.existsSync(f), `Found ${path.basename(f)}`);
  }

  // Suite 2: Navigation Integration
  console.log('\nSuite 2: Navigation Graph Integration');
  const navGraphXml = fs.readFileSync('android/app/src/main/res/navigation/nav_graph.xml', 'utf-8');
  assert(navGraphXml.includes('android:id="@+id/navigation_onboarding"'), 'nav_graph contains navigation_onboarding');
  assert(navGraphXml.includes('com.zenin.os.ui.onboarding.OnboardingFragment'), 'nav_graph routes to OnboardingFragment');

  // Suite 3: MainActivity First Launch Integration
  console.log('\nSuite 3: First Launch Routing in MainActivity');
  const mainActivityJava = fs.readFileSync('android/app/src/main/java/com/zenin/os/MainActivity.java', 'utf-8');
  assert(mainActivityJava.includes('checkFirstLaunchOnboarding'), 'MainActivity calls checkFirstLaunchOnboarding');
  assert(mainActivityJava.includes('navigation_onboarding'), 'MainActivity routes to navigation_onboarding if not completed');
  assert(mainActivityJava.includes('UserProfileService.checkOnboardingStatus'), 'MainActivity verifies onboarding status with UserProfileService');
  assert(mainActivityJava.includes('binding.bottomNavigation.setVisibility(View.GONE)'), 'MainActivity hides bottom navigation during onboarding');

  // Suite 4: Profile Settings Personalization Integration
  console.log('\nSuite 4: Profile Screen Integration');
  const profileFragmentJava = fs.readFileSync('android/app/src/main/java/com/zenin/os/ui/profile/ProfileFragment.java', 'utf-8');
  assert(profileFragmentJava.includes('rowSettingsPersonalization'), 'ProfileFragment binds rowSettingsPersonalization');
  assert(profileFragmentJava.includes('PersonalizationBottomSheet.newInstance()'), 'ProfileFragment opens PersonalizationBottomSheet');

  const fragmentProfileXml = fs.readFileSync('android/app/src/main/res/layout/fragment_profile.xml', 'utf-8');
  assert(fragmentProfileXml.includes('row_settings_personalization'), 'fragment_profile.xml contains row_settings_personalization');

  // Suite 5: Onboarding Multi-step Verification in Layout
  console.log('\nSuite 5: Multi-Step Screen Containers in fragment_onboarding.xml');
  const onboardingXml = fs.readFileSync('android/app/src/main/res/layout/fragment_onboarding.xml', 'utf-8');
  assert(onboardingXml.includes('layout_step_1'), 'Contains Step 1 (Welcome & Name/Age)');
  assert(onboardingXml.includes('layout_step_2'), 'Contains Step 2 (Schedule)');
  assert(onboardingXml.includes('layout_step_3'), 'Contains Step 3 (Goals)');
  assert(onboardingXml.includes('layout_step_4'), 'Contains Step 4 (Productivity Style)');
  assert(onboardingXml.includes('layout_step_5'), 'Contains Step 5 (Personalization)');
  assert(onboardingXml.includes('layout_step_6'), 'Contains Step 6 (Complete Summary)');
  assert(onboardingXml.includes('btn_onboarding_skip'), 'Contains Skip CTA for optional reflection step');

  // Suite 6: Security & Credential Isolation Audit
  console.log('\nSuite 6: Security & Credential Isolation');
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
  console.log(`STAGE 10B ANDROID TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runStage10bAndroidTests().catch((err) => {
  console.error('Android test runner failed:', err);
  process.exit(1);
});
