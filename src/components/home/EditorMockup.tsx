import React from 'react';
import { Columns, MoreHorizontal, Share2, ChevronDown } from 'lucide-react';

export const EditorMockup: React.FC = () => {
  return (
    <div className="relative w-full max-w-2xl lg:max-w-none mx-auto select-none">
      
      {/* Decorative Plant Accent (Top Left) */}
      <div className="absolute -top-12 -left-8 sm:-left-12 w-28 h-36 pointer-events-none opacity-85 dark:opacity-60 z-0">
        <svg viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Main stem */}
          <path d="M50 130 Q45 70 30 10" stroke="#22543d" strokeWidth="2.5" strokeLinecap="round" />
          {/* Leaves with realistic curves */}
          <path d="M30 10 C15 5 5 25 25 35 C40 35 35 15 30 10 Z" fill="#2f855a" opacity="0.9" />
          <path d="M38 45 C15 38 12 60 32 68 C45 68 42 50 38 45 Z" fill="#38a169" opacity="0.85" />
          <path d="M44 80 C25 75 22 98 42 102 C52 102 48 85 44 80 Z" fill="#48bb78" opacity="0.8" />
          {/* Right side leaves */}
          <path d="M36 28 C55 20 62 40 45 48 C34 48 35 35 36 28 Z" fill="#276749" opacity="0.9" />
          <path d="M42 62 C62 55 68 76 50 82 C40 82 40 68 42 62 Z" fill="#2f855a" opacity="0.85" />
        </svg>
      </div>

      {/* Main Laptop Body Container */}
      <div className="relative z-10 mx-auto max-w-[620px]">
        
        {/* Laptop Screen Bezel */}
        <div className="rounded-2xl p-2.5 sm:p-3 bg-neutral-900 dark:bg-neutral-950 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-white/10 relative">
          
          {/* Top Center Camera Dot */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-neutral-700"></div>

          {/* Screen Content Window */}
          <div className="rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 flex flex-col h-[360px] sm:h-[400px] text-xs">
            
            {/* Top Editor Toolbar */}
            <div className="bg-[#1e1e24] px-3.5 py-2 border-b border-neutral-800 flex items-center justify-between">
              
              {/* Left Tab */}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neutral-600"></span>
                <span className="text-neutral-300 font-medium text-[11px]">Getting Started.md</span>
              </div>

              {/* Right Window Actions */}
              <div className="flex items-center gap-2.5 text-neutral-400">
                <Columns className="w-3.5 h-3.5 hover:text-white cursor-pointer transition-colors" />
                <MoreHorizontal className="w-3.5 h-3.5 hover:text-white cursor-pointer transition-colors" />
                <span className="text-[11px] hover:text-white cursor-pointer transition-colors flex items-center gap-1">
                  <Share2 className="w-3 h-3" /> Share
                </span>
                <button className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[10.5px] px-2 py-0.5 rounded flex items-center gap-1 border border-neutral-700 transition-colors">
                  Export <ChevronDown className="w-2.5 h-2.5" />
                </button>
              </div>

            </div>

            {/* Dual Pane Grid: Left Editor & Right Live Preview */}
            <div className="flex-1 grid grid-cols-2 divide-x divide-neutral-800 overflow-hidden">
              
              {/* Left Pane: Markdown Editor with Line Numbers */}
              <div className="bg-[#18181c] p-3 font-mono-code text-[10.5px] leading-relaxed overflow-hidden flex flex-col justify-between">
                <div className="flex gap-2.5">
                  
                  {/* Line Numbers Gutter */}
                  <div className="text-neutral-600 text-right select-none pr-1 space-y-[2px]">
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                    <div>4</div>
                    <div>5</div>
                    <div>6</div>
                    <div>7</div>
                    <div>8</div>
                    <div>9</div>
                    <div>10</div>
                    <div>11</div>
                    <div>12</div>
                    <div>13</div>
                    <div>14</div>
                    <div>15</div>
                  </div>

                  {/* Code Lines */}
                  <div className="text-neutral-300 space-y-[2px] flex-1 overflow-hidden">
                    <div className="text-sky-400 font-semibold"># Your Ideas, Better</div>
                    <div className="h-[14px]"></div>
                    <div className="text-neutral-300 truncate">
                      Write <span className="text-amber-300 font-bold">**faster**</span>, stay
                    </div>
                    <div className="text-neutral-300 truncate">organized, and create</div>
                    <div className="text-neutral-300 truncate">beautiful documents with</div>
                    <div className="text-neutral-300 truncate">Markdown.</div>
                    <div className="text-sky-400 font-semibold pt-1">## Why MD Writer?</div>
                    <div className="text-neutral-400 pl-1">- Clean interface</div>
                    <div className="text-neutral-400 pl-1">- Real-time preview</div>
                    <div className="text-neutral-400 pl-1">- Powerful tools</div>
                    <div className="text-neutral-400 pl-1">- Export in multiple formats</div>
                    <div className="h-[14px]"></div>
                    <div className="text-emerald-400">&gt; Good writing</div>
                    <div className="text-emerald-400">&gt; builds a better you.</div>
                  </div>

                </div>

                {/* Editor Status Bar */}
                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-500">
                  <span className="flex items-center gap-1 hover:text-neutral-300 cursor-pointer">
                    Markdown <ChevronDown className="w-2.5 h-2.5" />
                  </span>
                  <div className="flex items-center gap-3">
                    <span>Ln 15, Col 1</span>
                    <span>112 words</span>
                  </div>
                </div>

              </div>

              {/* Right Pane: Live Rendered Preview (Clean Light Theme inside preview) */}
              <div className="bg-white p-4.5 text-neutral-800 leading-normal overflow-hidden flex flex-col">
                <div className="space-y-3">
                  
                  {/* Rendered H1 */}
                  <h1 className="text-base font-extrabold text-neutral-950 tracking-tight">
                    Your Ideas, Better
                  </h1>

                  {/* Rendered Paragraph */}
                  <p className="text-[11.5px] text-neutral-600 leading-relaxed">
                    Write <strong className="font-semibold text-neutral-900">faster</strong>, stay{' '}
                    <strong className="font-semibold text-neutral-900">organized</strong>, and create beautiful documents with{' '}
                    <strong className="font-semibold text-neutral-900">Markdown</strong>.
                  </p>

                  {/* Rendered H2 */}
                  <h2 className="text-[13px] font-bold text-neutral-950 pt-0.5">
                    Why MD Writer?
                  </h2>

                  {/* Rendered Bullet List */}
                  <ul className="text-[11px] text-neutral-600 space-y-1 pl-3.5 list-disc marker:text-neutral-400">
                    <li>Clean interface</li>
                    <li>Real-time preview</li>
                    <li>Powerful tools</li>
                    <li>Export in multiple formats</li>
                  </ul>

                  {/* Rendered Blockquote Callout */}
                  <div className="border-l-[3px] border-sky-400 bg-sky-50/50 pl-3 py-1.5 rounded-r text-[11px] text-neutral-700 italic space-y-0.5">
                    <div>Good writing</div>
                    <div className="font-medium text-neutral-900">builds a better you.</div>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Laptop Keyboard Base & Hinge */}
        <div className="relative mx-auto w-[104%] -left-[2%] h-4 bg-gradient-to-b from-neutral-300 to-neutral-400 dark:from-neutral-700 dark:to-neutral-800 rounded-b-xl shadow-lg border-t border-neutral-400/40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-neutral-500/50 rounded-b"></div>
        </div>

        {/* Right Edge Sticky Action Tabs (Write, Organize, Create, Repeat) */}
        <div className="absolute right-[-45px] sm:right-[-54px] top-14 flex flex-col gap-1.5 z-20">
          {[
            { label: 'Write', active: true },
            { label: 'Organize', active: false },
            { label: 'Create', active: false },
            { label: 'Repeat', active: false },
          ].map((tab) => (
            <div
              key={tab.label}
              className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2 py-1 rounded-r-md text-[10px] sm:text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 shadow-sm hover:translate-x-1 transition-transform cursor-pointer"
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* Handwritten Annotation & Curved Arrow Below Laptop */}
        <div className="relative mt-5 flex justify-end pr-10 pointer-events-none">
          <div className="flex items-center gap-2">
            <svg
              className="w-16 h-10 text-neutral-700 dark:text-neutral-300"
              viewBox="0 0 70 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Graceful curved arrow pointing up-left */}
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
            <span className="font-handwriting text-2xl text-neutral-800 dark:text-neutral-200 tracking-wide -rotate-3">
              Clean. Focused. Powerful.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
