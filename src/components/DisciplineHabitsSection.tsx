import React, { useState } from 'react';
import { Flame, ArrowRight, ShieldCheck, Check, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export const DisciplineHabitsSection: React.FC = () => {
  const [completedDays, setCompletedDays] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
  ]);

  const toggleDay = (day: number) => {
    if (completedDays.includes(day)) {
      setCompletedDays(completedDays.filter((d) => d !== day));
    } else {
      setCompletedDays([...completedDays, day]);
    }
  };

  const consistencyRate = Math.round((completedDays.length / 21) * 100);

  return (
    <section id="focus" className="py-24 border-t border-[#161A22] bg-[#07090C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 text-left">
          <div className="text-xs font-semibold text-[#FF6D00] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <Flame className="w-3.5 h-3.5 fill-[#FF6D00]" />
            <span>Habit Compounding</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
            Small actions. Repeated daily.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            Momentum is not created by occasional heroic efforts. It is forged by uninterrupted routines, deep focus sessions, and honest daily closure.
          </p>
        </div>

        {/* Compounding Loop Bar */}
        <div className="mb-12 p-6 rounded-3xl bg-[#0D0F12] border border-[#222A38]">
          <div className="text-xs font-mono text-[#64748B] mb-4 uppercase tracking-wider">
            THE ZENIN CLOSED-LOOP SYSTEM
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#131720] border border-[#222A38] space-y-1">
              <div className="text-xs font-bold text-[#FF6D00] flex items-center space-x-1.5">
                <Flame className="w-4 h-4 fill-[#FF6D00]" />
                <span>1. Habit Streak</span>
              </div>
              <div className="text-sm font-bold text-white">Morning Routine</div>
              <div className="text-xs text-[#94A3B8]">Anchor your day with atomic micro-habits.</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#131720] border border-[#222A38] space-y-1">
              <div className="text-xs font-bold text-[#448AFF] flex items-center space-x-1.5">
                <Clock className="w-4 h-4" />
                <span>2. Focus Session</span>
              </div>
              <div className="text-sm font-bold text-white">Deep Work Block</div>
              <div className="text-xs text-[#94A3B8]">Protect 90 uninterrupted minutes for P1.</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#131720] border border-[#222A38] space-y-1">
              <div className="text-xs font-bold text-[#00E5A3] flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>3. Completed Tasks</span>
              </div>
              <div className="text-sm font-bold text-white">Priority Checkoff</div>
              <div className="text-xs text-[#94A3B8]">Execute what moves your project forward.</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#131720] border border-[#222A38] space-y-1">
              <div className="text-xs font-bold text-[#A78BFA] flex items-center space-x-1.5">
                <Calendar className="w-4 h-4" />
                <span>4. Daily Review</span>
              </div>
              <div className="text-sm font-bold text-white">Evening Closure</div>
              <div className="text-xs text-[#94A3B8]">Reflect, score, and sleep without cognitive residue.</div>
            </div>
          </div>
        </div>

        {/* 21-Day Interactive Streak Matrix & Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Circular Progress Gauge */}
          <div className="lg:col-span-4 p-8 rounded-3xl bg-[#0D0F12] border border-[#222A38] text-center flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 flex items-center justify-center mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#1E232E"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#00E5A3"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * consistencyRate) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-mono font-bold text-white">{consistencyRate}%</span>
                <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider">Consistency</span>
              </div>
            </div>
            <div className="text-sm font-bold text-white">Active Habit Streak</div>
            <div className="text-xs text-[#00E5A3] mt-1 font-mono">
              {completedDays.length} of 21 Days Executed
            </div>
          </div>

          {/* Interactive Days Matrix */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#0D0F12] border border-[#222A38] space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">21-Day Habit Horizon</h3>
                <p className="text-xs text-[#94A3B8]">Tap any day block to simulate streak continuity</p>
              </div>
              <span className="text-xs font-mono text-[#FF6D00] flex items-center space-x-1">
                <Flame className="w-4 h-4 fill-[#FF6D00]" />
                <span>Current Streak: {completedDays.length}d</span>
              </span>
            </div>

            {/* Matrix of 21 Day Tiles */}
            <div className="grid grid-cols-7 gap-2 sm:gap-3">
              {Array.from({ length: 21 }, (_, i) => i + 1).map((day) => {
                const isChecked = completedDays.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`h-12 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isChecked
                        ? 'bg-[#00E5A3]/15 border-[#00E5A3]/50 text-[#00E5A3]'
                        : 'bg-[#131720] border-[#222A38] text-[#64748B] hover:border-[#475569]'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-[#94A3B8]">D{day}</span>
                    <span className="text-xs font-bold">{isChecked ? '✓' : '—'}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-[#64748B]">
              <span>Room SQLite stores each completion timestamp locally</span>
              <span className="text-[#00E5A3] font-semibold">Zero Cloud Dependency</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
