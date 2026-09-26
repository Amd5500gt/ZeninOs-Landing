import React, { useState, useEffect } from 'react';
import { Download, Menu, X, ArrowUpRight } from 'lucide-react';
import { APK_DOWNLOAD_URL, RAZORPAY_PRO_URL } from '../data/landingData.ts';

interface NavbarProps {
  onDownloadClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onDownloadClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#07090C]/85 backdrop-blur-md border-b border-[#222A38]/80 py-3 shadow-lg shadow-black/40'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="flex items-center space-x-2 text-white font-extrabold tracking-tight text-lg group"
            aria-label="Zenin OS Home"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E5A3] shadow-[0_0_10px_#00E5A3] transition-transform group-hover:scale-125" />
            <span className="tracking-wider">ZENIN OS</span>
          </a>

          {/* Zone 2: 4–6 clean text navigation links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#94A3B8]">
            <a
              href="#why-zenin"
              className="hover:text-white transition-colors duration-150 py-1"
            >
              Why Zenin
            </a>
            <a
              href="#features"
              className="hover:text-white transition-colors duration-150 py-1"
            >
              Features
            </a>
            <a
              href="#ai-planner"
              className="hover:text-white transition-colors duration-150 py-1"
            >
              AI Planner
            </a>
            <a
              href="#focus"
              className="hover:text-white transition-colors duration-150 py-1"
            >
              Focus
            </a>
            <a
              href="#pricing"
              className="hover:text-white transition-colors duration-150 py-1"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="hover:text-white transition-colors duration-150 py-1"
            >
              FAQ
            </a>
          </nav>

          {/* Zone 3: 1–2 primary actions */}
          <div className="hidden sm:flex items-center space-x-3">
            <a
              href={RAZORPAY_PRO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#222A38] bg-[#131720] hover:bg-[#1A202C] text-[#F1F5F9] transition-colors flex items-center space-x-1"
            >
              <span>Pro ₹79</span>
              <ArrowUpRight className="w-3 h-3 text-[#00E5A3]" />
            </a>

            <a
              href={APK_DOWNLOAD_URL}
              download
              onClick={onDownloadClick}
              className="text-xs font-bold px-4 py-2 rounded-lg bg-[#00E5A3] hover:bg-[#00c98e] text-[#07090C] transition-all transform active:scale-95 shadow-[0_0_20px_rgba(0,229,163,0.25)] flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download APK</span>
            </a>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center space-x-2">
            <a
              href={APK_DOWNLOAD_URL}
              download
              onClick={onDownloadClick}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#00E5A3] text-[#07090C] flex items-center space-x-1"
            >
              <Download className="w-3 h-3" />
              <span>APK</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-[#222A38] text-[#94A3B8] hover:text-white bg-[#131720]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#07090C]/95 backdrop-blur-xl border-b border-[#222A38] px-5 py-6 space-y-4 animate-in fade-in slide-in-from-top-3 duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-[#94A3B8]">
            <a
              href="#why-zenin"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-white hover:text-[#00E5A3]"
            >
              Why Zenin OS
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-white hover:text-[#00E5A3]"
            >
              Features
            </a>
            <a
              href="#ai-planner"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-white hover:text-[#00E5A3]"
            >
              AI Day Planner
            </a>
            <a
              href="#focus"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-white hover:text-[#00E5A3]"
            >
              Focus &amp; Discipline
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-white hover:text-[#00E5A3]"
            >
              Pricing (₹79 Lifetime)
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-white hover:text-[#00E5A3]"
            >
              FAQ
            </a>
          </nav>
          <div className="pt-3 border-t border-[#222A38] flex flex-col space-y-2.5">
            <a
              href={APK_DOWNLOAD_URL}
              download
              onClick={() => {
                setMobileMenuOpen(false);
                onDownloadClick();
              }}
              className="w-full text-center py-2.5 rounded-lg bg-[#00E5A3] font-bold text-[#07090C] text-sm flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Zenin OS (APK)</span>
            </a>
            <a
              href={RAZORPAY_PRO_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 rounded-lg border border-[#222A38] text-xs font-semibold text-white bg-[#131720]"
            >
              Unlock Pro — ₹79 Lifetime
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
