import React from 'react';
import { ShieldCheck, Shield, Zap, Bell, Check } from 'lucide-react';
import { PRODUCT_PILLARS } from '../data/landingData.ts';

export const ProductPillarsSection: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-[#00E5A3]" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-[#448AFF]" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-[#FFB100]" />;
      case 'Bell':
        return <Bell className="w-5 h-5 text-[#38BDF8]" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-[#00E5A3]" />;
    }
  };

  return (
    <section className="py-20 border-t border-[#161A22] bg-[#07090C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 text-left">
          <div className="text-xs font-semibold text-[#00E5A3] uppercase tracking-wider mb-2">
            Engineering Foundations
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            Built around the way you actually work.
          </h2>
          <p className="mt-3 text-base text-[#94A3B8]">
            We designed Zenin OS around strict technical standards rather than trendy growth hacks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCT_PILLARS.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#0D0F12] border border-[#222A38] space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#131720] border border-[#222A38] flex items-center justify-center mb-4">
                  {getIcon(pillar.iconName)}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{pillar.title}</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{pillar.description}</p>
              </div>

              <div className="pt-4 border-t border-[#1A202C] flex items-center space-x-1.5 text-[11px] text-[#00E5A3] font-mono">
                <Check className="w-3.5 h-3.5" />
                <span>Verified in Codebase</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
