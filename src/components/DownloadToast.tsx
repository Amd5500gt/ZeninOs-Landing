import React from 'react';
import { Download, Check, X, Smartphone, AlertCircle } from 'lucide-react';
import { APK_FILE_NAME } from '../data/landingData.ts';

interface DownloadToastProps {
  visible: boolean;
  onClose: () => void;
}

export const DownloadToast: React.FC<DownloadToastProps> = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#131720] border border-[#00E5A3]/50 rounded-2xl p-4 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(0,229,163,0.15)] animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-xl bg-[#00E5A3]/15 text-[#00E5A3] flex items-center justify-center shrink-0 mt-0.5">
            <Download className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center space-x-1.5">
              <span>Download Starting</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5A3]" />
            </div>
            <div className="text-[11px] text-[#CBD5E1] mt-0.5">
              Downloading <span className="font-mono text-[#00E5A3]">{APK_FILE_NAME}</span>
            </div>
            <div className="text-[10px] text-[#94A3B8] mt-2 flex items-center space-x-1">
              <Smartphone className="w-3 h-3 text-[#00E5A3]" />
              <span>Android 8.0+ · Tap APK in notifications to install</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-[#64748B] hover:text-white p-1 rounded-lg hover:bg-[#1A202C] transition-colors"
          aria-label="Dismiss toast"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
