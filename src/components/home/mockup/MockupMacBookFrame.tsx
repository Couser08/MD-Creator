import React from 'react';

interface MockupMacBookFrameProps {
  children: React.ReactNode;
}

export const MockupMacBookFrame: React.FC<MockupMacBookFrameProps> = React.memo(({ children }) => {
  return (
    <div className="relative w-full max-w-3xl lg:max-w-none mx-auto select-none">
      {/* Decorative Botanical Leaf Accent (Top Left) */}
      <div className="absolute -top-12 -left-6 sm:-left-10 w-24 h-32 pointer-events-none opacity-80 dark:opacity-50 z-0">
        <svg viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M50 130 Q45 70 30 10" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M30 10 C15 5 5 25 25 35 C40 35 35 15 30 10 Z" fill="#16a34a" opacity="0.9" />
          <path d="M38 45 C15 38 12 60 32 68 C45 68 42 50 38 45 Z" fill="#22c55e" opacity="0.85" />
          <path d="M44 80 C25 75 22 98 42 102 C52 102 48 85 44 80 Z" fill="#4ade80" opacity="0.8" />
          <path d="M36 28 C55 20 62 40 45 48 C34 48 35 35 36 28 Z" fill="#15803d" opacity="0.9" />
          <path d="M42 62 C62 55 68 76 50 82 C40 82 40 68 42 62 Z" fill="#16a34a" opacity="0.85" />
        </svg>
      </div>

      {/* Main Flat Laptop Container */}
      <div className="relative z-10 mx-auto">
        {/* Apple MacBook Pro Lid & Display Bezel */}
        <div className="rounded-[26px] p-2.5 sm:p-3 bg-gradient-to-b from-[#2a2a30] via-[#1c1c22] to-[#121215] border border-neutral-700/60 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.55)] ring-1 ring-white/10 relative overflow-visible">
          {/* MacBook Display Camera Notch */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center pointer-events-none">
            <div className="h-4 w-28 bg-neutral-950 rounded-b-xl border-b border-x border-neutral-800/80 flex items-center justify-center gap-2.5 px-3 shadow-xs">
              {/* Webcam Lens */}
              <div className="w-2 h-2 rounded-full bg-[#0a0a0f] border border-neutral-700/60 flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-blue-400/80" />
              </div>
              {/* Active Green Status Micro-LED */}
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.9)]" />
            </div>
          </div>

          {children}
        </div>

        {/* Laptop Keyboard Deck (Unibody Base) */}
        <div className="relative mx-auto w-[104%] -left-[2%] h-4.5 bg-gradient-to-b from-[#2e2e36] via-[#1f1f24] to-[#141418] rounded-b-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] border-t border-neutral-600/50 flex items-start justify-center">
          {/* Machined Center Thumb Scoop / Display Open Indent */}
          <div className="w-16 h-1.5 bg-neutral-900/80 rounded-b-md border-b border-x border-neutral-700/50 shadow-inner" />
        </div>

        {/* Playful Handwritten Annotation & Curved Arrow Below Laptop */}
        <div className="relative mt-4 flex justify-end pr-8 sm:pr-12 pointer-events-none">
          <div className="flex items-center gap-2">
            <svg
              className="w-14 h-8 text-neutral-700 dark:text-neutral-300"
              viewBox="0 0 70 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 32 C 25 35, 45 28, 55 12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M48 9 L 56 11 L 58 19"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <span className="font-handwriting text-xl sm:text-2xl text-neutral-800 dark:text-neutral-200 tracking-wide -rotate-3 select-none">
              Try typing directly in the laptop!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

MockupMacBookFrame.displayName = 'MockupMacBookFrame';
