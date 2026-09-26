import React from 'react';
import { Download, Code2, ArrowUpRight } from 'lucide-react';
import { APK_DOWNLOAD_URL, RAZORPAY_PRO_URL } from '../data/landingData.ts';

interface FooterProps {
  onOpenModal: (type: 'privacy' | 'terms' | 'refund' | 'about' | 'arch') => void;
  onDownloadClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenModal, onDownloadClick }) => {
  return (
    <footer className="border-t border-[#161A22] bg-[#07090C] py-16 text-xs text-[#94A3B8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand & Slogan */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white font-extrabold text-base tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E5A3] shadow-[0_0_8px_#00E5A3]" />
              <span>ZENIN OS</span>
            </div>
            <p className="text-sm text-[#CBD5E1] font-medium">
              Build discipline. Focus on what matters.
            </p>
            <p className="text-xs text-[#64748B] max-w-sm">
              A native Android productivity operating system uniting task management, atomic habits, deep focus sessions, and AI day planning.
            </p>
          </div>

          {/* Download CTA in Footer */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={APK_DOWNLOAD_URL}
              download
              onClick={onDownloadClick}
              className="px-4 py-2 rounded-lg bg-[#00E5A3] hover:bg-[#00c98e] text-[#07090C] font-bold text-xs flex items-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download APK</span>
            </a>
            <a
              href={RAZORPAY_PRO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-lg border border-[#222A38] bg-[#131720] hover:bg-[#1A202C] text-white font-semibold text-xs transition-colors flex items-center space-x-1"
            >
              <span>Unlock Pro — ₹79</span>
              <ArrowUpRight className="w-3 h-3 text-[#00E5A3]" />
            </a>
          </div>
        </div>

        {/* Links Navigation */}
        <div className="pt-8 border-t border-[#161A22] flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-medium">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#ai-planner" className="hover:text-white transition-colors">AI Planner</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#download" className="hover:text-white transition-colors">Download</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <button
              onClick={() => onOpenModal('privacy')}
              className="hover:text-white transition-colors text-left"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenModal('terms')}
              className="hover:text-white transition-colors text-left"
            >
              Terms
            </button>
            <button
              onClick={() => onOpenModal('refund')}
              className="hover:text-white transition-colors text-left"
            >
              Refund Policy
            </button>
            <button
              onClick={() => onOpenModal('about')}
              className="hover:text-white transition-colors text-left"
            >
              About
            </button>
          </div>

          {/* Developer Architecture Mode trigger */}
          <button
            onClick={() => onOpenModal('arch')}
            className="text-[11px] text-[#64748B] hover:text-[#00E5A3] flex items-center space-x-1.5 transition-colors border border-[#1E232E] px-2.5 py-1 rounded-md bg-[#0D0F12]"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer Architecture Inspector</span>
          </button>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-[#161A22] flex flex-col sm:flex-row items-center justify-between text-[#64748B] gap-2">
          <span>© 2026 Zenin OS. All rights reserved.</span>
          <span className="font-mono text-[11px]">Android • Room SQLite • Jetpack MVVM</span>
        </div>
      </div>
    </footer>
  );
};
