import React from 'react';
import { 
  ArrowRight, 
  Cpu, 
  Printer, 
  ListTree, 
  Cloud, 
  Sparkles, 
  Zap, 
  Table,
  CheckCircle2
} from 'lucide-react';

interface BentoFeaturesProps {
  onExploreFeatures?: () => void;
  onOpenUpdates?: () => void;
}

export const BentoFeatures: React.FC<BentoFeaturesProps> = ({ 
  onExploreFeatures, 
  onOpenUpdates 
}) => {
  return (
    <section id="features" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-amber-500/5 via-indigo-500/5 to-rose-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-mono">
            ENGINEERED FOR POWER & BEAUTY • v2.5 LIVE
          </p>
        </div>

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-950 dark:text-white tracking-tight leading-[1.15] max-w-xl">
              Everything you need for serious writing.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed mt-4">
              From zero-latency gaming-grade typing physics to isolated vector PDF publishing and dual-engine cloud synchronization — crafted with uncompromising polish.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenUpdates}
              className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs group"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
              <span>Changelog & Timeline</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400">v2.5</span>
            </button>

            <button 
              onClick={onExploreFeatures}
              className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg group"
            >
              <span>Explore All Features</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 6-Card Modern Apple/Linear Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          
          {/* Card 1: 60-144FPS Game-Engine Writing FX Studio (Span 2) */}
          <div className="lg:col-span-2 p-8 sm:p-9 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white border border-neutral-800 shadow-2xl relative overflow-hidden flex flex-col justify-between group">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/15 transition-all duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <Cpu className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-[10px] font-mono font-bold">
                  <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span>0ms Latency • 60-144FPS Canvas</span>
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-3 text-white">
                Game-Developer Writing FX & Caret Studio
              </h3>
              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-xl mb-6">
                Engineered with high-DPI 2D canvas layers and a 256-particle object pool. Zero Garbage Collection pauses, zero DOM node thrashing, and custom visual carets (Neon Glow, Terminal Block, Amber CRT, Minimal Line) with authentic phosphor step-blink.
              </p>
            </div>

            {/* Micro Live Caret Mockup */}
            <div className="relative z-10 p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 font-mono-code text-xs text-neutral-300 flex flex-wrap items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">$</span>
                <span>Writing is thought rendered into form</span>
                <span className="inline-block w-2.5 h-4 bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-bold text-neutral-300">Self-Sleeping RAF</span>
                <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-bold text-neutral-300">Object Pool</span>
              </div>
            </div>
          </div>

          {/* Card 2: PDF Publishing Studio v2 (Span 1) */}
          <div className="p-8 sm:p-9 rounded-3xl bg-white dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800/80 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.03)] dark:shadow-none hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center mb-6 shadow-2xs group-hover:scale-105 transition-transform">
                <Printer className="w-6 h-6" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-blue-600 dark:text-blue-400">Vector Engine</span>
              </div>

              <h3 className="text-xl font-bold text-neutral-950 dark:text-white mb-2.5 tracking-tight">
                PDF Publishing Studio v2
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">
                5 curated typographic presets (Editorial, Technical RFC, Academic, Corporate, Minimalist) with standalone cover pages, auto TOC, and pinned running footers.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-mono">
              <span>A4 & US Letter</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">Document-Perfect</span>
            </div>
          </div>

          {/* Card 3: Interactive Outline & Jump Navigator */}
          <div className="p-8 sm:p-9 rounded-3xl bg-white dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800/80 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.03)] dark:shadow-none hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40 flex items-center justify-center mb-6 shadow-2xs group-hover:scale-105 transition-transform">
                <ListTree className="w-6 h-6" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-purple-600 dark:text-purple-400">Structure</span>
              </div>

              <h3 className="text-xl font-bold text-neutral-950 dark:text-white mb-2.5 tracking-tight">
                Interactive Outline Drawer
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">
                Auto-extracts `#` to `######` Markdown headings in real-time with visual hierarchy badges and instant 1-click jump-to-line scrolling.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-mono">
              <span>H1–H6 Depth</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">1-Click Jump</span>
            </div>
          </div>

          {/* Card 4: Dual-Engine Cloud Sync */}
          <div className="p-8 sm:p-9 rounded-3xl bg-white dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800/80 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.03)] dark:shadow-none hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center mb-6 shadow-2xs group-hover:scale-105 transition-transform">
                <Cloud className="w-6 h-6" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-emerald-600 dark:text-emerald-400">Sync & Offline</span>
              </div>

              <h3 className="text-xl font-bold text-neutral-950 dark:text-white mb-2.5 tracking-tight">
                Dual-Engine Storage
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">
                Works 100% offline via client-side Dexie IndexedDB, and automatically syncs bi-directionally with Supabase whenever you are online.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-mono">
              <span>IndexedDB + Cloud</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Zero Data Loss</span>
            </div>
          </div>

          {/* Card 5: Slash Commands & Visual Tables (Span 2) */}
          <div className="lg:col-span-2 p-8 sm:p-9 rounded-3xl bg-white dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800/80 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.03)] dark:shadow-none hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <Table className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  Interactive Builders
                </span>
              </div>

              <h3 className="text-2xl font-bold text-neutral-950 dark:text-white mb-2.5 tracking-tight">
                Slash Command Menu & Visual Table Builder
              </h3>
              <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6 max-w-xl">
                Type <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 font-mono text-xs text-neutral-800 dark:text-neutral-200 font-semibold">/</kbd> anywhere in the editor to summon shortcuts for code blocks, callouts, and formulas. Use the visual table builder to generate multi-column Markdown tables with alignment controls.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs">
              <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>KaTeX Math</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Typewriter Mode</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Focus Sprints</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
