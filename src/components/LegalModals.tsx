import React, { useState } from 'react';
import { X, Copy, Check, FileCode, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import { APK_DOWNLOAD_URL, RAZORPAY_PRO_URL } from '../data/landingData.ts';

interface LegalModalsProps {
  activeModal: 'privacy' | 'terms' | 'refund' | 'about' | 'arch' | null;
  onClose: () => void;
}

const ANDROID_ARCH_FILES = [
  {
    name: 'TaskEntity.java',
    path: 'android/app/src/main/java/com/zenin/os/data/entity/TaskEntity.java',
    snippet: `@Entity(tableName = "tasks")
public class TaskEntity {
    @PrimaryKey(autoGenerate = true)
    private long id;
    private String title;
    private String category;
    private Priority priority;
    private boolean isCompleted;
    private long createdAt;
    // Room SQLite local storage
}`
  },
  {
    name: 'HabitEntity.java',
    path: 'android/app/src/main/java/com/zenin/os/data/entity/HabitEntity.java',
    snippet: `@Entity(tableName = "habits")
public class HabitEntity {
    @PrimaryKey(autoGenerate = true)
    private long id;
    private String title;
    private int currentStreak;
    private int bestStreak;
    private HabitFrequency frequency;
    // Atomic streak persistence
}`
  },
  {
    name: 'FeatureAccessManager.java',
    path: 'android/app/src/main/java/com/zenin/os/data/repository/FeatureAccessManager.java',
    snippet: `public class FeatureAccessManager {
    // Single Source of Truth for Free / Pro Entitlements
    public boolean canUseAIPlanner() { return userPreferences.isProUser(); }
    public boolean canUseCustomTimer() { return userPreferences.isProUser(); }
    public boolean canAccessDeepAnalytics() { return userPreferences.isProUser(); }
}`
  },
  {
    name: 'AIPlannerService.java',
    path: 'android/app/src/main/java/com/zenin/os/ai/service/AIPlannerService.java',
    snippet: `public class AIPlannerService {
    // Communicates with backend proxy endpoint /api/ai/day-plan
    // Zero hardcoded API keys or generative tokens in Android client
    // Strict privacy-first advisory timeblock synthesis
}`
  }
];

export const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose }) => {
  const [selectedArchFile, setSelectedArchFile] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!activeModal) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ANDROID_ARCH_FILES[selectedArchFile].snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0D0F12] border border-[#222A38] rounded-3xl p-6 sm:p-8 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#94A3B8] hover:text-white bg-[#131720] border border-[#222A38] transition-colors"
          aria-label="Close Dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* PRIVACY POLICY */}
        {activeModal === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#00E5A3] uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Privacy Policy</span>
            </div>
            <h3 className="text-2xl font-bold text-white">Your data stays on your device.</h3>
            <div className="space-y-3 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              <p>
                Zenin OS is built on a strict offline-first philosophy. Your tasks, habits, focus logs, and daily reviews are stored locally in Android Room SQLite database files on your physical device.
              </p>
              <p>
                We do not integrate advertising networks, third-party analytics trackers, or telemetry beacons. No behavioral analytics are collected or sold.
              </p>
              <p>
                When using the optional AI Day Planner in Zenin Pro, only non-identifiable scheduling parameters (task names, duration estimates, and availability hours) are sent to the AI processing gateway to synthesize your recommended schedule. Your personal data is never retained for machine learning training.
              </p>
            </div>
            <div className="pt-4 border-t border-[#1E232E] flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#00E5A3] text-[#07090C] font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* TERMS OF SERVICE */}
        {activeModal === 'terms' && (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-[#00E5A3] uppercase">Terms of Service</div>
            <h3 className="text-2xl font-bold text-white">Simple, fair usage terms.</h3>
            <div className="space-y-3 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              <p>
                Zenin OS is provided as native Android software designed for personal productivity and discipline tracking.
              </p>
              <p>
                <strong>Free Tier:</strong> Core features including task tracking, habit streaks, 25m focus timer, and offline SQLite storage are free to use without restrictions.
              </p>
              <p>
                <strong>Pro License:</strong> Zenin OS Pro is a one-time ₹79 purchase providing lifetime access to the AI Day Planner, custom focus timer durations, and advanced insights. There are no recurring subscription fees.
              </p>
              <p>
                <strong>AI Advisory Disclaimer:</strong> AI Day Planner suggestions are generated algorithmically as helpful recommendations. You retain complete authority to accept, decline, or modify any proposed schedule.
              </p>
            </div>
            <div className="pt-4 border-t border-[#1E232E] flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#00E5A3] text-[#07090C] font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* REFUND POLICY */}
        {activeModal === 'refund' && (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-[#00E5A3] uppercase">Refund Policy</div>
            <h3 className="text-2xl font-bold text-white">Refund Policy</h3>
            <div className="space-y-3 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              <p>
                Zenin OS Pro is offered as a permanent, non-recurring lifetime license for ₹79 processed through Razorpay.
              </p>
              <p>
                If you encounter any technical issue or if the Pro features fail to activate on your Android installation, our team will promptly assist or process a full refund within 7 days of purchase.
              </p>
              <p>
                For any payment questions, retain your Razorpay payment confirmation ID and contact support via your order receipt.
              </p>
            </div>
            <div className="pt-4 border-t border-[#1E232E] flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#00E5A3] text-[#07090C] font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* ABOUT */}
        {activeModal === 'about' && (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-[#00E5A3] uppercase">About Zenin OS</div>
            <h3 className="text-2xl font-bold text-white">Engineered for daily discipline.</h3>
            <div className="space-y-3 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              <p>
                Zenin OS was built out of frustration with complex, subscription-heavy productivity apps that distract you with endless customization instead of helping you work.
              </p>
              <p>
                By anchoring your day around four pillars—Tasks, Habits, Focus Sessions, and Evening Reviews—Zenin OS provides an operating system for deep work and atomic consistency.
              </p>
              <p>
                Built natively for Android with Java, Material Design, Jetpack MVVM, and Room SQLite.
              </p>
            </div>
            <div className="pt-4 border-t border-[#1E232E] flex items-center justify-between">
              <a
                href={APK_DOWNLOAD_URL}
                download
                className="px-4 py-2 rounded-xl bg-[#00E5A3] text-[#07090C] font-bold text-xs flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download APK</span>
              </a>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[#222A38] text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* DEVELOPER ARCHITECTURE INSPECTOR */}
        {activeModal === 'arch' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold text-[#00E5A3] uppercase">
                ANDROID SOURCE &amp; MVVM ARCHITECTURE
              </div>
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded bg-[#161A22] border border-[#222A38] text-white text-[11px] flex items-center space-x-1 hover:bg-[#1E232E]"
              >
                {copied ? <Check className="w-3 h-3 text-[#00E5A3]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex space-x-1.5 overflow-x-auto pb-1 border-b border-[#1E232E]">
              {ANDROID_ARCH_FILES.map((file, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedArchFile(idx)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-mono whitespace-nowrap transition-colors ${
                    selectedArchFile === idx
                      ? 'bg-[#161A22] text-[#00E5A3] font-bold border border-[#00E5A3]/40'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {file.name}
                </button>
              ))}
            </div>

            <div className="text-[11px] font-mono text-[#64748B]">
              Path: {ANDROID_ARCH_FILES[selectedArchFile].path}
            </div>

            <pre className="p-4 rounded-2xl bg-[#07090C] border border-[#1E232E] text-xs font-mono text-[#CBD5E1] overflow-x-auto">
              <code>{ANDROID_ARCH_FILES[selectedArchFile].snippet}</code>
            </pre>

            <div className="pt-2 flex items-center justify-between text-xs text-[#64748B]">
              <span>Room SQLite 2.6.1 · Jetpack Navigation 2.7.7</span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-[#00E5A3] text-[#07090C] font-bold text-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
