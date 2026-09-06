import React, { useState } from 'react';
import { 
  ArrowRight, 
  Cpu, 
  Printer, 
  ListTree, 
  Cloud, 
  Sparkles, 
  Zap, 
  Table,
  RefreshCw
} from 'lucide-react';

interface BentoFeaturesProps {
  onExploreFeatures?: () => void;
  onOpenUpdates?: () => void;
}

export const BentoFeatures: React.FC<BentoFeaturesProps> = ({ 
  onExploreFeatures, 
  onOpenUpdates 
}) => {
  const [activeCaretDemo, setActiveCaretDemo] = useState<'neon' | 'matrix' | 'amber'>('neon');

  return (
    <section id="features" className="py-20 sm:py-28 relative overflow-hidden bg-neutral-50/50 dark:bg-black/20 transition-colors">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-indigo-500/5 via-amber-500/5 to-cyan-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-mono">
            PRECISION CRAFTSMANSHIP • APPLE-GRADE BENCHMARK
          </p>
        </div>

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-950 dark:text-white tracking-tight leading-[1.15] max-w-xl">
              Engineered for fluid, serious writing.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed mt-4">
              From zero-latency game-engine typing physics to vector PDF publishing, real-time outline tree navigation, and zero-egress local revision snapshots.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenUpdates}
              className="px-4 py-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs group"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
              <span>Changelog & Timeline</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-400 font-bold">v2.5</span>
            </button>

            <button 
              onClick={onExploreFeatures}
              className="px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg group"
            >
              <span>Explore All Features</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Apple-Grade Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          
          {/* Card 1: 60-144FPS Game-Engine Writing FX Studio (Span 2) */}
          <div className="lg:col-span-2 p-7 sm:p-9 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-[0_4px_30px_-6px_rgba(0,0,0,0.04)] dark:shadow-none hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between group relative overflow-hidden">
            {/* Ambient Corner Mesh */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-cyan-500/10 via-indigo-500/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/40 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200/60 dark:border-cyan-800/60 text-cyan-700 dark:text-cyan-300 text-[11px] font-mono font-bold">
                  <Zap className="w-3 h-3 text-cyan-500 animate-pulse" />
                  <span>0ms Latency • 60–144FPS Canvas</span>
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-3 text-neutral-950 dark:text-white">
                Game-Engine Writing FX & Caret Physics
              </h3>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl mb-6">
                Engineered with high-DPI 2D canvas overlays and a pre-allocated 256-particle object pool. Exactly 0 bytes allocated per keypress, eliminating all Garbage Collection pauses and DOM layout thrashing.
              </p>
            </div>

            {/* Living Micro-UI: Interactive Caret Terminal Mockup */}
            <div className="relative z-10 p-5 rounded-2xl bg-neutral-950 text-neutral-100 border border-neutral-800/80 shadow-inner font-mono-code text-xs">
              <div className="flex items-center justify-between gap-3 mb-3 pb-2.5 border-b border-neutral-800 text-[11px] text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-neutral-500 text-[10px]">editor-fx-engine.canvas</span>
                </div>
                {/* Live Caret Switcher in Mockup */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveCaretDemo('neon')}
                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                      activeCaretDemo === 'neon' ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    Neon
                  </button>
                  <button
                    onClick={() => setActiveCaretDemo('matrix')}
                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                      activeCaretDemo === 'matrix' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    Matrix
                  </button>
                  <button
                    onClick={() => setActiveCaretDemo('amber')}
                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                      activeCaretDemo === 'amber' ? 'bg-amber-950 text-amber-300 border border-amber-700' : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    Amber CRT
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <span className="text-cyan-400 font-bold">$</span>
                <span className="text-neutral-200">Writing is thought rendered into physical form</span>
                {activeCaretDemo === 'neon' && (
                  <span className="inline-block w-2.5 h-4.5 bg-cyan-400 shadow-[0_0_12px_#06b6d4] animate-pulse" />
                )}
                {activeCaretDemo === 'matrix' && (
                  <span className="inline-block w-2.5 h-4.5 bg-emerald-400 shadow-[0_0_10px_#22c55e] animate-pulse" />
                )}
                {activeCaretDemo === 'amber' && (
                  <span className="inline-block w-2.5 h-4.5 bg-amber-400 shadow-[0_0_10px_#f59e0b] animate-pulse" />
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-neutral-800/80 text-[10px] text-neutral-500">
                <span>Hardware Acceleration: <strong className="text-emerald-400">Active (120Hz ProMotion)</strong></span>
                <span>Object Pool: <strong className="text-neutral-300">256 Nodes (0B GC)</strong></span>
              </div>
            </div>
          </div>

          {/* Card 2: PDF Publishing Studio v2 (Span 1) */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-[0_4px_30px_-6px_rgba(0,0,0,0.04)] dark:shadow-none hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Printer className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/40">
                  Vector Engine
                </span>
              </div>

              <h3 className="text-xl font-bold text-neutral-950 dark:text-white mb-2.5 tracking-tight">
                PDF Publishing Studio v2
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                5 curated typographic presets (Editorial, Technical RFC, Academic, Corporate, Minimalist) with standalone cover pages, auto TOC, and pinned running footers.
              </p>
            </div>

            {/* Tactile Micro-UI: Layered Document Sheet Stack */}
            <div className="relative p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/60 dark:border-neutral-800/80 text-[11px] font-sans">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-200 dark:border-neutral-800 text-[10px] text-neutral-400 font-mono">
                <span>DOCUMENT SPEC: A4</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">5 Typographic Presets</span>
              </div>
              <div className="space-y-1.5 text-neutral-700 dark:text-neutral-300 font-serif">
                <div className="h-2 w-3/4 bg-neutral-300 dark:bg-neutral-700 rounded-xs" />
                <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-xs" />
                <div className="h-1.5 w-5/6 bg-neutral-200 dark:bg-neutral-800 rounded-xs" />
              </div>
              <div className="mt-3 pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                <span>Header: Section 2.4</span>
                <span>Page 1 of 12</span>
              </div>
            </div>
          </div>

          {/* Card 3: Interactive Outline & Jump Navigator (Span 1) */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-[0_4px_30px_-6px_rgba(0,0,0,0.04)] dark:shadow-none hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <ListTree className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-900/40">
                  Structure
                </span>
              </div>

              <h3 className="text-xl font-bold text-neutral-950 dark:text-white mb-2.5 tracking-tight">
                Interactive Outline Drawer
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                Auto-extracts `#` to `######` Markdown headings in real-time with visual hierarchy depth badges and instant 1-click jump-to-line scrolling.
              </p>
            </div>

            {/* Tactile Micro-UI: Live TOC Tree Hierarchy */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/60 dark:border-neutral-800/80 text-xs space-y-2">
              <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                <span className="text-[10px] font-mono px-1 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold">H1</span>
                <span className="truncate">System Architecture</span>
              </div>
              <div className="pl-4 flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <span className="text-[10px] font-mono px-1 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">H2</span>
                <span className="truncate">Data Ingestion Flow</span>
              </div>
              <div className="pl-8 flex items-center gap-2 text-neutral-500 dark:text-neutral-500 text-[11px]">
                <span className="text-[9px] font-mono px-1 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">H3</span>
                <span className="truncate">Cache Revalidation</span>
              </div>
            </div>
          </div>

          {/* Card 4: Dual-Engine Storage Hub (Span 1) */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-[0_4px_30px_-6px_rgba(0,0,0,0.04)] dark:shadow-none hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Cloud className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/40">
                  Zero Egress
                </span>
              </div>

              <h3 className="text-xl font-bold text-neutral-950 dark:text-white mb-2.5 tracking-tight">
                Dual-Engine Storage Hub
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                Works 100% offline via client-side Dexie IndexedDB with local revision snapshots, and seamlessly syncs bi-directionally with Supabase when online.
              </p>
            </div>

            {/* Tactile Micro-UI: Sync Diagram Bridge */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/60 dark:border-neutral-800/80 text-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-center flex-1">
                  <div className="text-[10px] font-bold font-mono text-emerald-600 dark:text-emerald-400">IndexedDB</div>
                  <div className="text-[9px] text-neutral-400">0ms Offline</div>
                </div>

                <div className="flex flex-col items-center justify-center px-1">
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-500 animate-spin" style={{ animationDuration: '4s' }} />
                  <span className="text-[8px] font-mono text-neutral-400 mt-0.5">Bi-Sync</span>
                </div>

                <div className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-center flex-1">
                  <div className="text-[10px] font-bold font-mono text-cyan-600 dark:text-cyan-400">Supabase</div>
                  <div className="text-[9px] text-neutral-400">Multi-Device</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Slash Commands & Visual Tables (Span 2) */}
          <div className="lg:col-span-2 p-7 sm:p-9 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-[0_4px_30px_-6px_rgba(0,0,0,0.04)] dark:shadow-none hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between group relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between gap-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Table className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                  Interactive Studio
                </span>
              </div>

              <h3 className="text-2xl font-black text-neutral-950 dark:text-white mb-2.5 tracking-tight">
                Slash Command Palette & Visual Table Designer
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 max-w-xl">
                Type <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 font-mono text-xs text-neutral-800 dark:text-neutral-200 font-semibold">/</kbd> anywhere to summon instant blocks: Callouts, Accordions, KaTeX formulas, and 8 curated templates. Design multi-column tables with live column alignment controls.
              </p>
            </div>

            {/* Tactile Micro-UI: Spotlight-style Command Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/60 dark:border-neutral-800/80 font-mono-code text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">/table</span>
                  <span className="text-neutral-600 dark:text-neutral-300 font-sans text-[11px]">Visual Table Grid</span>
                </div>
                <kbd className="px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] text-neutral-500">Enter</kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="text-blue-500 font-bold">/template</span>
                  <span className="text-neutral-600 dark:text-neutral-300 font-sans text-[11px]">8 Curated Presets</span>
                </div>
                <kbd className="px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] text-neutral-500">Enter</kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">/callout</span>
                  <span className="text-neutral-600 dark:text-neutral-300 font-sans text-[11px]">GitHub Alert Box</span>
                </div>
                <kbd className="px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] text-neutral-500">Enter</kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">/details</span>
                  <span className="text-neutral-600 dark:text-neutral-300 font-sans text-[11px]">Collapsible Accordion</span>
                </div>
                <kbd className="px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] text-neutral-500">Enter</kbd>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
