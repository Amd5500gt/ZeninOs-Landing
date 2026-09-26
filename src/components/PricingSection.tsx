import React from 'react';
import { Check, ArrowUpRight, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { RAZORPAY_PRO_URL, APK_DOWNLOAD_URL } from '../data/landingData.ts';

interface PricingSectionProps {
  onDownloadClick: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onDownloadClick }) => {
  return (
    <section id="pricing" className="py-24 border-t border-[#161A22] bg-[#07090C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="text-xs font-semibold text-[#00E5A3] uppercase tracking-wider mb-2">
            Honest Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
            One system. Transparent ownership.
          </h2>
          <p className="mt-3 text-base text-[#94A3B8]">
            No monthly renewals. No surprise charges. Just tools for people who take their daily discipline seriously.
          </p>
        </div>

        {/* Pricing Cards Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* 1. FREE PLAN */}
          <div className="p-8 rounded-3xl bg-[#0D0F12] border border-[#222A38] flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Core Tier</span>
                <span className="text-xs font-mono font-semibold text-[#64748B] bg-[#161A22] px-2.5 py-1 rounded">
                  Free Forever
                </span>
              </div>

              <div className="mt-4 flex items-baseline space-x-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-white">₹0</span>
                <span className="text-xs text-[#94A3B8]">lifetime</span>
              </div>

              <p className="mt-4 text-sm text-[#94A3B8]">
                Essential tools to organize your tasks, habits, and daily focus without cloud bloat.
              </p>

              {/* Feature list */}
              <div className="mt-6 pt-6 border-t border-[#1E232E] space-y-3 text-xs text-[#CBD5E1]">
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-[#00E5A3] shrink-0" />
                  <span>Unlimited tasks with P1/P2/P3 priority tagging</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-[#00E5A3] shrink-0" />
                  <span>Habit tracking with streak counts</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-[#00E5A3] shrink-0" />
                  <span>Standard 25-minute Pomodoro focus timer</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-[#00E5A3] shrink-0" />
                  <span>100% offline Room SQLite local storage</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-[#00E5A3] shrink-0" />
                  <span>Exact alarm notifications via Android AlarmManager</span>
                </div>
              </div>
            </div>

            <a
              href={APK_DOWNLOAD_URL}
              download
              onClick={onDownloadClick}
              className="w-full py-3.5 rounded-xl border border-[#222A38] bg-[#131720] hover:bg-[#1A202C] text-white font-bold text-sm text-center transition-colors block"
            >
              Download Free APK
            </a>
          </div>

          {/* 2. PRO PLAN */}
          <div className="p-8 rounded-3xl bg-[#0E121A] border-2 border-[#00E5A3]/50 shadow-[0_0_40px_rgba(0,229,163,0.12)] flex flex-col justify-between space-y-6 relative overflow-hidden">
            {/* Top highlight badge */}
            <div className="absolute top-0 right-0 bg-[#00E5A3] text-[#07090C] text-[10px] font-extrabold uppercase px-4 py-1 rounded-bl-xl tracking-wider">
              Recommended
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#00E5A3] flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Zenin Pro</span>
                </span>
              </div>

              <div className="mt-4 flex items-baseline space-x-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-white">₹79</span>
                <span className="text-xs font-semibold text-[#00E5A3] bg-[#00E5A3]/10 px-2 py-0.5 rounded">
                  One-time lifetime
                </span>
              </div>

              <p className="mt-4 text-sm text-[#CBD5E1]">
                Full access to the intelligent AI Day Planner, deep analytics, and all future updates.
              </p>

              {/* Feature list */}
              <div className="mt-6 pt-6 border-t border-[#1E232E] space-y-3 text-xs text-white">
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-[#00E5A3] shrink-0" />
                  <span className="font-semibold text-[#00E5A3]">Gemini AI Day Planner integration</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-[#00E5A3] shrink-0" />
                  <span>Custom focus timer durations (15m, 45m, 60m, custom)</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-[#00E5A3] shrink-0" />
                  <span>Advanced discipline trends &amp; 0–100 score analytics</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-[#00E5A3] shrink-0" />
                  <span>Full historical daily review journaling</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-[#00E5A3] shrink-0" />
                  <span>Lifetime access to all future Zenin OS releases</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={RAZORPAY_PRO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-[#00E5A3] hover:bg-[#00c98e] text-[#07090C] font-bold text-sm text-center transition-all flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(0,229,163,0.3)] active:scale-98"
              >
                <span>Unlock Pro — ₹79</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              {/* Secure payment processing by Razorpay */}
              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-[#94A3B8]">
                <Lock className="w-3.5 h-3.5 text-[#00E5A3]" />
                <span>Secure payment processing by Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
