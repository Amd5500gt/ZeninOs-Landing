import React, { useState } from 'react';
import {
  CheckCircle2,
  Flame,
  Clock,
  Bell,
  Calendar,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Play,
  Check
} from 'lucide-react';
import { FEATURES, FeatureItem } from '../data/landingData.ts';

export const FeatureShowcaseSection: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string>('tasks');

  const renderFeatureIcon = (name: string) => {
    switch (name) {
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5 text-[#00E5A3]" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-[#FF6D00]" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-[#448AFF]" />;
      case 'Bell':
        return <Bell className="w-5 h-5 text-[#FFB100]" />;
      case 'Calendar':
        return <Calendar className="w-5 h-5 text-[#A78BFA]" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-[#00E5A3]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#38BDF8]" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-[#00E5A3]" />;
    }
  };

  const currentFeature = FEATURES.find((f) => f.id === selectedFeature) || FEATURES[0];

  return (
    <section id="features" className="py-24 border-t border-[#161A22] bg-[#07090C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 text-left">
          <div className="text-xs font-semibold text-[#00E5A3] uppercase tracking-wider mb-2">
            Integrated Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
            Seven pillars. Built into one unified OS.
          </h2>
          <p className="mt-3 text-base text-[#94A3B8]">
            No switching across four different apps. Zenin OS consolidates every dimension of your daily execution.
          </p>
        </div>

        {/* Feature Grid & Interactive Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 7 Interactive Feature Selectors */}
          <div className="lg:col-span-5 space-y-2">
            {FEATURES.map((feature) => {
              const isSelected = feature.id === selectedFeature;
              return (
                <button
                  key={feature.id}
                  onClick={() => setSelectedFeature(feature.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[#131720] border-[#00E5A3]/50 shadow-[0_0_20px_rgba(0,229,163,0.08)]'
                      : 'bg-[#0D0F12] border-[#1E232E] hover:border-[#2E3748] hover:bg-[#10141B]'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-[#00E5A3]/15' : 'bg-[#161A22]'
                      }`}
                    >
                      {renderFeatureIcon(feature.iconName)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center space-x-2">
                        <span>{feature.title}</span>
                        {feature.id === 'planner' && (
                          <span className="text-[10px] uppercase font-bold text-[#00E5A3] bg-[#00E5A3]/10 px-1.5 py-0.2 rounded">
                            Pro
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#94A3B8] line-clamp-1">{feature.subtitle}</div>
                    </div>
                  </div>

                  <span
                    className={`text-xs transition-transform ${
                      isSelected ? 'text-[#00E5A3] translate-x-0.5' : 'text-[#475569] group-hover:text-[#94A3B8]'
                    }`}
                  >
                    →
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Rich Visual Interactive Card */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#0D0F12] border border-[#222A38] relative overflow-hidden shadow-2xl">
            {/* Header info */}
            <div className="flex items-center justify-between pb-6 border-b border-[#1E232E]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#161A22] border border-[#222A38] flex items-center justify-center">
                  {renderFeatureIcon(currentFeature.iconName)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{currentFeature.title}</h3>
                  <div className="text-xs text-[#00E5A3] font-medium">{currentFeature.highlight}</div>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-[#161A22] border border-[#222A38] text-[#CBD5E1]">
                {currentFeature.tag}
              </span>
            </div>

            {/* Description */}
            <div className="py-6">
              <p className="text-base text-[#94A3B8] leading-relaxed">
                {currentFeature.description}
              </p>
            </div>

            {/* Interactive Visual Representation of the Feature */}
            <div className="rounded-2xl bg-[#07090C] border border-[#1E232E] p-5 overflow-hidden">
              {currentFeature.id === 'tasks' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-[#64748B] mb-1 font-mono">
                    <span>ACTIVE TASKS (ROOM SQLITE)</span>
                    <span className="text-[#00E5A3]">3 OF 4 COMPLETED</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#131720] border border-[#222A38] flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-4 h-4 rounded bg-[#00E5A3] flex items-center justify-center text-[#07090C]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="text-[#64748B] line-through">Implement local SQLite schema</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF5252]/10 text-[#FF5252]">P1 HIGH</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#131720] border border-[#222A38] flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-4 h-4 rounded bg-[#00E5A3] flex items-center justify-center text-[#07090C]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="text-[#64748B] line-through">Distraction-free notification alarm</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFB100]/10 text-[#FFB100]">P2 MED</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#161A22] border border-[#00E5A3]/40 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-4 h-4 rounded border border-[#00E5A3]" />
                      <span className="text-white font-medium">Finalize release APK bundle</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF5252]/15 text-[#FF5252]">P1 HIGH</span>
                  </div>
                </div>
              )}

              {currentFeature.id === 'habits' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#64748B] font-mono">
                    <span>ACTIVE ROUTINES</span>
                    <span className="text-[#FF6D00] flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5 fill-[#FF6D00]" />
                      <span>14 DAY STREAK</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 py-1">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                      <div key={idx} className="flex flex-col items-center space-y-1">
                        <span className="text-[10px] text-[#64748B]">{day}</span>
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            idx <= 5
                              ? 'bg-[#FF6D00]/20 text-[#FF6D00] border border-[#FF6D00]/40'
                              : 'bg-[#131720] text-[#64748B] border border-[#222A38]'
                          }`}
                        >
                          {idx <= 5 ? '✓' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-xl bg-[#131720] border border-[#222A38] flex items-center justify-between text-xs">
                    <span className="text-white">Morning Deep Reflection (15m)</span>
                    <span className="text-[#00E5A3] font-bold">100% On Time</span>
                  </div>
                </div>
              )}

              {currentFeature.id === 'focus' && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
                  <div className="text-center sm:text-left">
                    <div className="text-3xl font-mono font-bold text-white">25:00</div>
                    <div className="text-xs text-[#00E5A3] mt-1 font-medium">Deep Focus Mode Active</div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">Anchored to: P1 Sprint Architecture</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 rounded-xl bg-[#00E5A3] text-[#07090C] font-bold text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(0,229,163,0.25)]">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Session</span>
                    </button>
                    <span className="text-xs text-[#94A3B8] font-mono px-3 py-2 rounded-xl bg-[#131720] border border-[#222A38]">
                      Custom Duration
                    </span>
                  </div>
                </div>
              )}

              {currentFeature.id === 'notifications' && (
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#131720] border border-[#222A38] flex items-start space-x-3">
                    <Bell className="w-4 h-4 text-[#FFB100] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Focus Session Complete</div>
                      <div className="text-[#94A3B8] text-[11px]">25 minutes completed. Take a 5-minute break.</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#131720] border border-[#222A38] flex items-start space-x-3">
                    <Calendar className="w-4 h-4 text-[#00E5A3] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Evening Review Reminder (21:00)</div>
                      <div className="text-[#94A3B8] text-[11px]">Reflect on today's discipline score and log habits.</div>
                    </div>
                  </div>
                </div>
              )}

              {currentFeature.id === 'review' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>Focus Quality Rating</span>
                    <span className="text-[#00E5A3] font-bold">5 / 5 Exceptional</span>
                  </div>
                  <div className="w-full bg-[#131720] h-2 rounded-full overflow-hidden border border-[#222A38]">
                    <div className="bg-[#00E5A3] h-full w-[90%]" />
                  </div>
                  <div className="p-3 rounded-xl bg-[#131720] border border-[#222A38] text-[11px] text-[#CBD5E1] italic">
                    "Completed the core database persistence with zero notifications breaking my focus."
                  </div>
                </div>
              )}

              {currentFeature.id === 'score' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-mono font-bold text-[#00E5A3]">88 / 100</div>
                      <div className="text-xs text-[#94A3B8]">Today's Consistency Index</div>
                    </div>
                    <div className="text-right text-xs">
                      <span className="text-[#00E5A3] font-bold">+12%</span> vs last week
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-[#131720] border border-[#222A38]">
                      <div className="text-[10px] text-[#64748B]">TASKS</div>
                      <div className="font-bold text-white">100%</div>
                    </div>
                    <div className="p-2 rounded-lg bg-[#131720] border border-[#222A38]">
                      <div className="text-[10px] text-[#64748B]">FOCUS</div>
                      <div className="font-bold text-white">85m</div>
                    </div>
                    <div className="p-2 rounded-lg bg-[#131720] border border-[#222A38]">
                      <div className="text-[10px] text-[#64748B]">HABITS</div>
                      <div className="font-bold text-[#FF6D00]">4 / 4</div>
                    </div>
                  </div>
                </div>
              )}

              {currentFeature.id === 'planner' && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#00E5A3] font-semibold text-[11px]">
                    <span className="flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Gemini AI Day Optimization</span>
                    </span>
                    <span className="text-[#94A3B8]">7 Energy Blocks</span>
                  </div>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="p-2 rounded-lg bg-[#131720] border border-[#222A38] flex items-center justify-between">
                      <span className="text-[#94A3B8]">08:00 – 09:30</span>
                      <span className="text-white font-medium">Deep Work (Core Code)</span>
                      <span className="text-[#00E5A3]">Peak Focus</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#131720] border border-[#222A38] flex items-center justify-between">
                      <span className="text-[#94A3B8]">10:00 – 12:30</span>
                      <span className="text-white font-medium">Priority Task Deliverables</span>
                      <span className="text-[#38BDF8]">Sprint P1</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
