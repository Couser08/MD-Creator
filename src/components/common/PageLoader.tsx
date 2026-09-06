import React from 'react';
import { Sparkles } from 'lucide-react';

export const PageLoader: React.FC = () => {
  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors select-none"
      role="status"
      aria-label="Loading page content"
    >
      <div className="relative flex items-center justify-center">
        {/* Hardware-accelerated pulse glow ring */}
        <div className="absolute w-16 h-16 rounded-full bg-emerald-500/20 dark:bg-emerald-400/15 animate-ping pointer-events-none" />
        
        {/* Core rotating spinner */}
        <div className="w-12 h-12 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center shadow-xl shadow-black/10 dark:shadow-white/5 animate-pulse">
          <Sparkles className="w-6 h-6 text-emerald-400 dark:text-emerald-600 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-1">
        <span className="text-xs font-semibold tracking-wider text-neutral-800 dark:text-neutral-200 uppercase">
          MD Creator Studio
        </span>
        <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
          Loading resources...
        </span>
      </div>
    </div>
  );
};
