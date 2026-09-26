import React, { useState, useEffect, useRef } from 'react';
import { Download, Sparkles, Flame, CheckCircle2, Play, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { APK_DOWNLOAD_URL, RAZORPAY_PRO_URL } from '../data/landingData.ts';

interface HeroSectionProps {
  onDownloadClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onDownloadClick }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [floatingChecked, setFloatingChecked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Subtle 3D perspective mouse tracking on desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 1024) return; // disable on mobile/tablet for performance

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Gentle rotation max ~7 degrees
    const rX = -((y - centerY) / centerY) * 7;
    const rY = ((x - centerX) / centerX) * 7;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden"
    >
      {/* Subtle ambient lighting glows */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#00E5A3]/10 via-[#6366F1]/5 to-transparent blur-3xl opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-[#00E5A3]/5 to-[#8B5CF6]/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Text & CTAs */}
          <div className="lg:col-span-7 text-left space-y-6">
            {/* Small Badge */}
            <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-wider uppercase text-[#00E5A3]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5A3]" />
              <span>ZENIN OS • ANDROID PRODUCTIVITY</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] [text-wrap:balance]">
              Build Your Day. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F1F5F9] to-[#94A3B8]">
                Build Yourself.
              </span>
            </h1>

            {/* Supporting Line */}
            <p className="text-lg sm:text-xl text-[#94A3B8] font-normal leading-relaxed max-w-xl">
              Tasks. Habits. Focus. Discipline. One system.
            </p>

            <p className="text-sm text-[#64748B] leading-relaxed max-w-lg">
              Engineered natively for Android with Room SQLite offline architecture. No intrusive subscriptions, zero ad trackers, and intelligent AI day planning to turn intentions into execution.
            </p>

            {/* Strong CTA Hierarchy */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Primary: Download Zenin OS */}
              <a
                href={APK_DOWNLOAD_URL}
                download
                onClick={onDownloadClick}
                className="group px-7 py-3.5 rounded-xl bg-[#00E5A3] hover:bg-[#00c98e] text-[#07090C] font-bold text-base transition-all transform active:scale-98 shadow-[0_0_30px_rgba(0,229,163,0.3)] flex items-center justify-center space-x-2.5 whitespace-nowrap"
              >
                <Download className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
                <span>Download Zenin OS</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-black/15 text-[#07090C]">
                  APK
                </span>
              </a>

              {/* Secondary: Explore Zenin OS */}
              <a
                href="#why-zenin"
                className="px-6 py-3.5 rounded-xl border border-[#222A38] bg-[#131720]/80 hover:bg-[#1A202C] text-[#F1F5F9] font-semibold text-sm transition-colors flex items-center justify-center space-x-2"
              >
                <span>Explore Zenin OS</span>
                <ArrowRight className="w-4 h-4 text-[#94A3B8]" />
              </a>

              {/* Third Optional: Unlock Pro — ₹79 */}
              <a
                href={RAZORPAY_PRO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3.5 text-xs font-semibold text-[#00E5A3] hover:text-[#34d399] transition-colors flex items-center justify-center space-x-1"
              >
                <span>Unlock Pro — ₹79</span>
              </a>
            </div>

            {/* Trust Markers */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#64748B]">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00E5A3]" />
                <span>100% Offline SQLite</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Cpu className="w-4 h-4 text-[#00E5A3]" />
                <span>Native Android Java MVVM</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5A3]" />
                <span>Android 8.0 to Android 14+</span>
              </span>
            </div>
          </div>

          {/* Right Column: Hero 3D Experience & Phone Mockup */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div
              className="relative w-full max-w-[340px] sm:max-w-[360px] transition-transform duration-200 ease-out"
              style={{
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Outer Phone Hardware Mockup */}
              <div className="relative rounded-[44px] p-3 bg-gradient-to-b from-[#222A38] via-[#161A22] to-[#0D0F12] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(0,229,163,0.12)] border border-[#2E3748]">
                {/* Phone Speaker & Camera Notch */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#07090C] rounded-full z-30 flex items-center justify-center space-x-2">
                  <div className="w-10 h-1 bg-[#1A202C] rounded-full" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#131720] border border-[#222A38]" />
                </div>

                {/* Phone Screen Container */}
                <div className="relative rounded-[36px] overflow-hidden bg-[#0D0F12] border border-[#1E232E] text-white select-none">
                  {/* Android Status Bar */}
                  <div className="pt-3 px-6 pb-2 flex items-center justify-between text-[11px] text-[#94A3B8] font-mono tracking-tight">
                    <span>09:41</span>
                    <div className="flex items-center space-x-1.5">
                      <span>5G</span>
                      <div className="w-4 h-2 rounded-xs border border-[#94A3B8] p-0.5 flex items-center">
                        <div className="w-full h-full bg-[#00E5A3]" />
                      </div>
                    </div>
                  </div>

                  {/* App Screen Header */}
                  <div className="px-5 pt-3 pb-3 flex items-center justify-between border-b border-[#1E232E]">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-[#64748B] font-semibold">Today's System</div>
                      <div className="text-base font-bold text-white flex items-center space-x-1.5">
                        <span>Good Morning</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00E5A3]" />
                      </div>
                    </div>
                    {/* Score Indicator */}
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-[#00E5A3]">88/100</div>
                      <div className="text-[10px] text-[#64748B]">Discipline</div>
                    </div>
                  </div>

                  {/* Screen Content Preview */}
                  <div className="p-4 space-y-3 bg-[#0D0F12]">
                    {/* AI Day Plan Banner Card */}
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-[#161A22] to-[#1E232E] border border-[#00E5A3]/25 flex items-center justify-between shadow-sm">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#00E5A3]/15 flex items-center justify-center text-[#00E5A3]">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">AI Day Plan Ready</div>
                          <div className="text-[10px] text-[#94A3B8]">08:00 – 18:30 Optimized</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#00E5A3] bg-[#00E5A3]/10 px-2 py-0.5 rounded">
                        ACTIVE
                      </span>
                    </div>

                    {/* Quick Metric Tiles */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-xl bg-[#131720] border border-[#222A38]">
                        <div className="text-[10px] text-[#94A3B8]">Deep Focus</div>
                        <div className="text-sm font-bold text-white font-mono mt-0.5">1h 45m</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#131720] border border-[#222A38]">
                        <div className="text-[10px] text-[#94A3B8]">Habit Streak</div>
                        <div className="text-sm font-bold text-[#FF6D00] font-mono mt-0.5 flex items-center space-x-1">
                          <Flame className="w-3.5 h-3.5 fill-[#FF6D00]" />
                          <span>14 Days</span>
                        </div>
                      </div>
                    </div>

                    {/* Active Priorities in Mock Phone */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Priority Tasks</div>
                      <div className="space-y-1.5">
                        <div className="p-2.5 rounded-xl bg-[#161A22] border border-[#222A38] flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-[#FF5252]" />
                            <span className="font-medium text-slate-200">Refactor DB Schema</span>
                          </div>
                          <span className="text-[10px] font-mono text-[#64748B]">P1</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#161A22] border border-[#222A38] flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-[#FFB100]" />
                            <span className="font-medium text-slate-200">Daily Code Review</span>
                          </div>
                          <span className="text-[10px] font-mono text-[#64748B]">P2</span>
                        </div>
                      </div>
                    </div>

                    {/* Focus Quick Action in Phone */}
                    <div className="p-3 rounded-2xl bg-[#00E5A3]/10 border border-[#00E5A3]/30 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-[#00E5A3] text-[#07090C] flex items-center justify-center font-bold">
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Start 25m Focus</div>
                          <div className="text-[10px] text-[#94A3B8]">Deep Work Block</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#00E5A3]">25:00</span>
                    </div>
                  </div>

                  {/* Android Bottom Navigation */}
                  <div className="px-6 py-2.5 border-t border-[#1E232E] bg-[#0A0C0F] flex items-center justify-between text-[10px] text-[#64748B]">
                    <span className="text-[#00E5A3] font-bold">Home</span>
                    <span>Tasks</span>
                    <span>Habits</span>
                    <span>Focus</span>
                    <span>AI</span>
                  </div>
                </div>
              </div>

              {/* Floating Card 1: Interactive Task Card (Left Top) */}
              <div
                className="hidden sm:flex absolute -left-12 top-14 p-3 rounded-2xl bg-[#131720]/95 backdrop-blur-md border border-[#222A38] shadow-2xl items-center space-x-3 cursor-pointer hover:border-[#00E5A3]/40 transition-colors z-30"
                style={{ transform: 'translateZ(40px)' }}
                onClick={() => setFloatingChecked(!floatingChecked)}
                title="Click to toggle"
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                    floatingChecked
                      ? 'bg-[#00E5A3] text-[#07090C]'
                      : 'border border-[#334155] text-transparent hover:border-[#00E5A3]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className={`text-xs font-semibold ${floatingChecked ? 'line-through text-[#64748B]' : 'text-white'}`}>
                    Review sprint deliverables
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">Task completed · +15 score</div>
                </div>
              </div>

              {/* Floating Card 2: Habit Streak Card (Right Top) */}
              <div
                className="hidden sm:flex absolute -right-10 top-36 p-3 rounded-2xl bg-[#131720]/95 backdrop-blur-md border border-[#FF6D00]/30 shadow-2xl items-center space-x-3 z-30"
                style={{ transform: 'translateZ(50px)' }}
              >
                <div className="w-8 h-8 rounded-xl bg-[#FF6D00]/15 flex items-center justify-center text-[#FF6D00]">
                  <Flame className="w-5 h-5 fill-[#FF6D00]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center space-x-1">
                    <span>14 Days Streak</span>
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">Morning Routine Done</div>
                </div>
              </div>

              {/* Floating Card 3: Focus Timer Card (Bottom Left) */}
              <div
                className="hidden sm:flex absolute -left-8 -bottom-6 p-3 rounded-2xl bg-[#131720]/95 backdrop-blur-md border border-[#00E5A3]/30 shadow-2xl items-center space-x-3 z-30"
                style={{ transform: 'translateZ(45px)' }}
              >
                <div className="w-7 h-7 rounded-full border-2 border-[#00E5A3] border-t-transparent animate-spin flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#00E5A3]" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-[#00E5A3]">25:00 Focus Active</div>
                  <div className="text-[10px] text-[#94A3B8]">Distraction defense on</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
