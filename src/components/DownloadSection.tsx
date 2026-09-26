import React from 'react';
import { Download, ShieldCheck, ArrowRight, Smartphone, Check } from 'lucide-react';
import { APK_DOWNLOAD_URL, APK_FILE_NAME } from '../data/landingData.ts';

interface DownloadSectionProps {
  onDownloadClick: () => void;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({ onDownloadClick }) => {
  return (
    <section id="download" className="py-24 border-t border-[#161A22] bg-[#07090C] relative overflow-hidden">
      {/* Subtle radial ambient glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-t from-[#00E5A3]/10 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="p-8 sm:p-14 rounded-[36px] bg-gradient-to-b from-[#131720] to-[#0D0F12] border border-[#222A38] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#00E5A3] uppercase tracking-wider mb-4">
            <Smartphone className="w-4 h-4" />
            <span>Android Production Release</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
            Start building your system today.
          </h2>

          {/* Subheading */}
          <p className="mt-4 text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto">
            Zenin OS is available for Android.
          </p>

          <p className="mt-2 text-xs sm:text-sm text-[#64748B] max-w-xl mx-auto">
            Package: <span className="font-mono text-[#CBD5E1]">{APK_FILE_NAME}</span> · Native Room SQLite persistence · No tracking or ads
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={APK_DOWNLOAD_URL}
              download
              onClick={onDownloadClick}
              className="group px-8 py-4 rounded-xl bg-[#00E5A3] hover:bg-[#00c98e] text-[#07090C] font-extrabold text-base transition-all transform active:scale-98 shadow-[0_0_35px_rgba(0,229,163,0.35)] flex items-center space-x-2.5 whitespace-nowrap"
            >
              <Download className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
              <span>↓ Download APK</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-black/15 text-[#07090C]">
                Android • APK
              </span>
            </a>

            <a
              href="#features"
              className="px-6 py-4 rounded-xl border border-[#222A38] bg-[#161A22] hover:bg-[#1E232E] text-white font-semibold text-sm transition-colors flex items-center space-x-2"
            >
              <span>View Features</span>
              <ArrowRight className="w-4 h-4 text-[#94A3B8]" />
            </a>
          </div>

          {/* Verification Indicators */}
          <div className="mt-10 pt-8 border-t border-[#1E232E] flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-[#94A3B8]">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00E5A3]" />
              <span>Verified Android 8.0 to Android 14+</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-[#00E5A3]" />
              <span>100% Offline &amp; Private</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-[#00E5A3]" />
              <span>Direct APK Install</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
