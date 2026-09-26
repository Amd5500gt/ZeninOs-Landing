import React, { useState } from 'react';
import { Target, Shield, Flame, Check, ArrowRight } from 'lucide-react';
import { CORE_PILLARS } from '../data/landingData.ts';

export const WhyZeninSection: React.FC = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const getPillarIcon = (tag: string) => {
    switch (tag) {
      case 'PLAN':
        return <Target className="w-6 h-6 text-[#00E5A3]" />;
      case 'FOCUS':
        return <Shield className="w-6 h-6 text-[#448AFF]" />;
      case 'BUILD':
        return <Flame className="w-6 h-6 text-[#FF6D00]" />;
      default:
        return <Target className="w-6 h-6 text-[#00E5A3]" />;
    }
  };

  const getPillarAccent = (tag: string) => {
    switch (tag) {
      case 'PLAN':
        return 'group-hover:border-[#00E5A3]/50 group-hover:shadow-[0_10px_30px_-10px_rgba(0,229,163,0.15)]';
      case 'FOCUS':
        return 'group-hover:border-[#448AFF]/50 group-hover:shadow-[0_10px_30px_-10px_rgba(68,138,255,0.15)]';
      case 'BUILD':
        return 'group-hover:border-[#FF6D00]/50 group-hover:shadow-[0_10px_30px_-10px_rgba(255,109,0,0.15)]';
      default:
        return 'group-hover:border-[#00E5A3]/50';
    }
  };

  return (
    <section id="why-zenin" className="py-24 border-t border-[#161A22] bg-[#07090C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="text-xs font-semibold text-[#00E5A3] uppercase tracking-wider mb-2">
            The Philosophy
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
            Your productivity deserves a system.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            Most productivity apps help you make lists. Zenin OS is designed to help you actually build a daily system—bridging the gap between what you plan and what you execute.
          </p>
        </div>

        {/* 3 Large Interactive Cards with Subtle 3D Depth */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {CORE_PILLARS.map((pillar, idx) => (
            <div
              key={pillar.tag}
              onMouseEnter={() => setActiveCard(idx)}
              onMouseLeave={() => setActiveCard(null)}
              className={`group relative p-8 rounded-3xl bg-[#0D0F12] border border-[#222A38] transition-all duration-300 transform md:hover:-translate-y-1.5 flex flex-col justify-between ${getPillarAccent(
                pillar.tag
              )}`}
            >
              <div>
                {/* Header row: Step & Icon */}
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xs font-mono font-bold text-[#64748B] tracking-wider">
                    {pillar.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#131720] border border-[#222A38] flex items-center justify-center transition-colors group-hover:bg-[#1A202C]">
                    {getPillarIcon(pillar.tag)}
                  </div>
                </div>

                {/* Tag & Heading */}
                <div className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                  {pillar.tag}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-white transition-colors">
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
                  {pillar.description}
                </p>
              </div>

              {/* Bullet Points */}
              <div className="pt-6 border-t border-[#1E232E] space-y-2.5">
                {pillar.details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-center space-x-2 text-xs text-[#CBD5E1]">
                    <Check className="w-3.5 h-3.5 text-[#00E5A3] shrink-0" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
