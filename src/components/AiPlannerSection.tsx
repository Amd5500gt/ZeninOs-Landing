import React, { useState } from 'react';
import { Sparkles, Clock, CheckCircle2, ShieldCheck, ChevronRight, Zap } from 'lucide-react';
import { SCHEDULE_BLOCKS } from '../data/landingData.ts';

export const AiPlannerSection: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'morning' | 'balanced'>('morning');

  return (
    <section id="ai-planner" className="py-24 border-t border-[#161A22] bg-[#07090C] relative overflow-hidden">
      {/* Subtle ambient AI glow backdrop */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-[#00E5A3]/8 via-[#38BDF8]/10 to-[#818CF8]/8 blur-3xl opacity-60"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 text-left">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#00E5A3] uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zenin Pro Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
            Let AI organize the chaos.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            Zenin OS AI Day Planner analyzes your active tasks, habits, and target availability to synthesize a balanced, energy-aligned execution schedule.
          </p>
        </div>

        {/* Schedule & Interactive Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Context & Explanations */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#222A38] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#64748B]">ENERGY ALIGNMENT</span>
                <span className="text-xs font-semibold text-[#00E5A3]">Circadian Optimized</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                How It Works
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Rather than treating all hours equally, the planner places deep, cognitively demanding work during your peak hours, interleaving strategic breaks, nutrition, and routine upkeep.
              </p>

              {/* Mode Toggle Selector */}
              <div className="pt-2 flex items-center space-x-2 p-1.5 rounded-xl bg-[#131720] border border-[#222A38]">
                <button
                  onClick={() => setActiveMode('morning')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    activeMode === 'morning'
                      ? 'bg-[#00E5A3] text-[#07090C]'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  Morning Peak Energy
                </button>
                <button
                  onClick={() => setActiveMode('balanced')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    activeMode === 'balanced'
                      ? 'bg-[#00E5A3] text-[#07090C]'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  Balanced Steady State
                </button>
              </div>
            </div>

            {/* Advisory Guarantee Notice */}
            <div className="p-5 rounded-2xl bg-[#131720] border border-[#222A38] flex items-start space-x-3 text-xs text-[#CBD5E1]">
              <ShieldCheck className="w-5 h-5 text-[#00E5A3] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5">100% Advisory &amp; User-Controlled</span>
                <span>
                  AI recommendations never modify your tasks or data autonomously. You review, approve, and adjust every single block.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Schedule Timeline */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#0D0F12] border border-[#222A38] shadow-2xl relative">
            {/* Header info */}
            <div className="flex items-center justify-between pb-6 border-b border-[#1E232E]">
              <div>
                <div className="text-xs font-mono text-[#00E5A3] font-bold">SYNTHESIZED DAY TIMELINE</div>
                <div className="text-base font-bold text-white mt-0.5">Recommended Schedule</div>
              </div>
              <span className="text-xs font-mono text-[#94A3B8] bg-[#161A22] px-3 py-1 rounded-lg border border-[#222A38]">
                7 Timeblocks · 8h Allocated
              </span>
            </div>

            {/* Schedule Blocks */}
            <div className="divide-y divide-[#1A202C] pt-2">
              {SCHEDULE_BLOCKS.map((block, idx) => {
                const isFocus = block.type === 'focus';
                const isBreak = block.type === 'break';
                const isHabit = block.type === 'habit';
                const isReview = block.type === 'review';

                return (
                  <div
                    key={idx}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 group hover:bg-[#131720]/40 -mx-3 px-3 rounded-xl transition-colors"
                  >
                    {/* Time & Title */}
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-mono font-bold text-[#F1F5F9] w-14 shrink-0">
                        {block.time}
                      </span>
                      <div className="w-2.5 h-2.5 rounded-full shrink-0 flex items-center justify-center">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isFocus
                              ? 'bg-[#00E5A3] shadow-[0_0_8px_#00E5A3]'
                              : isBreak
                              ? 'bg-[#64748B]'
                              : isHabit
                              ? 'bg-[#FF6D00]'
                              : 'bg-[#A78BFA]'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center space-x-2">
                          <span>{block.title}</span>
                          <span
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                              isFocus
                                ? 'bg-[#00E5A3]/15 text-[#00E5A3]'
                                : isBreak
                                ? 'bg-[#334155]/30 text-[#94A3B8]'
                                : isHabit
                                ? 'bg-[#FF6D00]/15 text-[#FF6D00]'
                                : 'bg-[#A78BFA]/15 text-[#A78BFA]'
                            }`}
                          >
                            {block.category}
                          </span>
                        </div>
                        <div className="text-xs text-[#64748B] mt-0.5">{block.note}</div>
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <span className="text-xs font-mono text-[#94A3B8] sm:self-center shrink-0 pl-18 sm:pl-0">
                      {block.duration}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
