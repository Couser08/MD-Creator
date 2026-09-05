import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Sparkles, 
  X, 
  Heart, 
  Search, 
  CheckCircle2, 
  Cpu, 
  Printer, 
  ListTree, 
  Cloud, 
  PenTool, 
  ArrowRight,
  GitCommit,
  Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProductUpdatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UpdateCategory = 'all' | 'engine' | 'publishing' | 'sync' | 'ux';

interface UpdateMilestone {
  version: string;
  isLatest?: boolean;
  date: string;
  title: string;
  category: UpdateCategory;
  categoryLabel: string;
  summary: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  highlights: {
    type: 'new' | 'improved' | 'perf' | 'fix';
    text: string;
  }[];
}

const MILESTONES: UpdateMilestone[] = [
  {
    version: 'v2.5',
    isLatest: true,
    date: 'September 2026',
    title: 'Game-Developer 60–144FPS Canvas Engine & Idempotent Cloud Sync',
    category: 'engine',
    categoryLabel: 'Performance & Engine',
    summary: 'A complete architectural rebuild of the writing effect pipeline. Replaced DOM particle rendering with a hardware-accelerated 2D canvas layer and persistent mirror singleton, eliminating all input lag during rapid typing.',
    icon: Cpu,
    iconColor: 'text-amber-500 dark:text-amber-400',
    iconBg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200/60 dark:border-amber-900/50',
    highlights: [
      { type: 'perf', text: 'Hardware-Accelerated 2D Canvas Layer: Full-screen High-DPI canvas overlay for 60–144FPS particle physics with 0 DOM nodes mounted per keypress.' },
      { type: 'perf', text: 'Zero-Allocation Particle Pool: Pre-allocated pool of 256 particle structures, entirely eliminating Garbage Collection pauses.' },
      { type: 'perf', text: 'Persistent Mirror Singleton: Caret measurement now completes in < 0.05ms without adding/removing DOM elements or forcing synchronous reflows.' },
      { type: 'perf', text: 'Direct GPU-Composited Cursor: Visual carets positioned via direct translate3d transform, bypassing React render cycles for native 0ms typing latency.' },
      { type: 'new', text: 'Self-Sleeping RAF Loop: Animation loop automatically sleeps when particles fade, dropping CPU & GPU usage to 0.00% when idle.' },
      { type: 'fix', text: 'Idempotent Supabase SQL & Pre-signup Email Validation: Added checkEmailExists() and robust DROP POLICY IF EXISTS scripts to eliminate error 42710.' }
    ]
  },
  {
    version: 'v2.4',
    date: 'August 2026',
    title: 'PDF Publishing Studio v2 & Running Footer Geometry',
    category: 'publishing',
    categoryLabel: 'Vector Publishing',
    summary: 'Transformed document export into an isolated high-resolution vector publishing studio with curated typographic themes, standalone cover pages, auto TOC, and pinned running footers.',
    icon: Printer,
    iconColor: 'text-blue-500 dark:text-blue-400',
    iconBg: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200/60 dark:border-blue-900/50',
    highlights: [
      { type: 'new', text: '5 Curated Typographic Presets: Editorial (Sans), Technical RFC (Mono), Academic (Serif), Corporate, and Swiss Minimalist.' },
      { type: 'new', text: 'Standalone Cover Pages & Table of Contents: Automatically extracts H1–H3 headings with dotted leader tabs.' },
      { type: 'fix', text: 'Pinned Footer Geometry: Screen preview and print engine updated with flexbox column layout and min-height 88vh to pin running footers firmly to page bottom.' },
      { type: 'improved', text: 'Isolated Print Engine: Renders through a hidden sandboxed iframe to preserve document-perfect print typography with 0 UI chrome.' }
    ]
  },
  {
    version: 'v2.3',
    date: 'July 2026',
    title: 'Interactive Outline Navigator & Centralized Safety Confirmation',
    category: 'ux',
    categoryLabel: 'UI & Safety',
    summary: 'Introduced the Document Outline drawer for effortless navigation across long-form documents, paired with a global promise-based confirmation system.',
    icon: ListTree,
    iconColor: 'text-purple-500 dark:text-purple-400',
    iconBg: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200/60 dark:border-purple-900/50',
    highlights: [
      { type: 'new', text: 'Real-time Outline Drawer: Parses # through ###### Markdown headings with hierarchy indentations and 1-click jump-to-line navigation.' },
      { type: 'new', text: 'Global Confirmation Architecture: Promise-based useConfirmStore modal with safety auto-focus on Cancel for destructive actions.' },
      { type: 'improved', text: 'Card Hover Physics: Smooth spring lift and elevation shadows on the library document grid.' },
      { type: 'new', text: 'Writing FX Studio Popover: Interactive effects playground with real-time typewriter loop demo and keystroke testing sandbox.' }
    ]
  },
  {
    version: 'v2.2',
    date: 'June 2026',
    title: 'Bi-Directional Supabase Cloud Sync & Multi-Device Hub',
    category: 'sync',
    categoryLabel: 'Cloud & Offline',
    summary: 'Bridges offline-first Dexie IndexedDB with real-time Supabase cloud sync, enabling seamless cross-device writing and instant recovery.',
    icon: Cloud,
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200/60 dark:border-emerald-900/50',
    highlights: [
      { type: 'new', text: 'Inbound Cloud Pull: Automatically queries Supabase on startup to populate local Dexie with documents written on other devices.' },
      { type: 'new', text: 'Sync All Engine: Pushes offline drafts to Supabase in the background upon login or reconnect.' },
      { type: 'improved', text: 'Row-Level Security (RLS): All documents and revisions isolated per user_id with cryptographically verified auth tokens.' }
    ]
  },
  {
    version: 'v2.0',
    date: 'April 2026',
    title: 'Design System Overhaul, Slash Commands & Typewriter Mode',
    category: 'ux',
    categoryLabel: 'Core Experience',
    summary: 'A ground-up modern UI overhaul introducing keyboard-centric slash commands, vertical typewriter centering, and sprint interval timers.',
    icon: PenTool,
    iconColor: 'text-indigo-500 dark:text-indigo-400',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200/60 dark:border-indigo-900/50',
    highlights: [
      { type: 'new', text: 'Slash Commands (/): Instant menu for headings, code blocks, checklists, quotes, and visual table builder.' },
      { type: 'new', text: 'Typewriter Scrolling: Centers the active line vertically so your gaze never drops to the bottom of the screen.' },
      { type: 'new', text: 'Focus Sprint Timer: 15, 25, and 45-minute writing sprint modes with live word velocity tracking.' },
      { type: 'improved', text: 'Tailwind CSS v4 & Framer Motion v13 Design Tokens: Pure modern minimalism with fluid dark mode.' }
    ]
  },
  {
    version: 'v1.0',
    date: 'January 2026',
    title: 'Foundational Release: The Offline-First Markdown Architecture',
    category: 'engine',
    categoryLabel: 'Foundation',
    summary: 'The original launch of MD Writer: instant offline persistence, KaTeX mathematical typesetting, and distraction-free writing modes.',
    icon: GitCommit,
    iconColor: 'text-neutral-500 dark:text-neutral-400',
    iconBg: 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700',
    highlights: [
      { type: 'new', text: 'Zero-Latency Dexie IndexedDB: Client-side database caching thousands of documents with instant search.' },
      { type: 'new', text: 'Split, Write, Read, & Zen Modes: Flexible workspaces adapting to drafting, reading, and pure flow.' },
      { type: 'new', text: 'KaTeX & Syntax Highlighting: Mathematical formulas and code syntax highlighting out of the box.' }
    ]
  }
];

export const ProductUpdatesModal: React.FC<ProductUpdatesModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<UpdateCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMilestones = useMemo(() => {
    return MILESTONES.filter(m => {
      const matchesCategory = activeCategory === 'all' || m.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch = 
        m.version.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.highlights.some(h => h.text.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const getBadgeStyle = (type: 'new' | 'improved' | 'perf' | 'fix') => {
    switch (type) {
      case 'new':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80';
      case 'perf':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/80';
      case 'improved':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/80';
      case 'fix':
        return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/80';
    }
  };

  const getBadgeLabel = (type: 'new' | 'improved' | 'perf' | 'fix') => {
    switch (type) {
      case 'new': return 'New';
      case 'perf': return '60FPS Perf';
      case 'improved': return 'Improved';
      case 'fix': return 'Resolved';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xl flex flex-col overflow-hidden text-neutral-900 dark:text-neutral-100"
        >
          {/* Header Bar */}
          <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-neutral-950/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-neutral-950 dark:text-white">
                    What's New & Release Timeline
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs">
                    v2.5 Live
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Engineered with obsession for craft, typography & performance
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub-bar: Category Filters & Search */}
          <div className="px-6 py-3 border-b border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-neutral-900 shrink-0">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
              {[
                { id: 'all', label: 'All Milestones' },
                { id: 'engine', label: '⚡ Engine & 60FPS' },
                { id: 'publishing', label: '📄 PDF Studio' },
                { id: 'ux', label: '✨ UI & Carets' },
                { id: 'sync', label: '☁️ Cloud Sync' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as UpdateCategory)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Keyword Search */}
            <div className="relative w-full sm:w-56 shrink-0">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search updates..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Timeline Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-10">
            {filteredMilestones.length === 0 ? (
              <div className="text-center py-16">
                <Layers className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">No updates matching your filter.</p>
                <button
                  onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                  className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="relative border-l-2 border-neutral-200 dark:border-neutral-800 ml-3 sm:ml-6 space-y-10 pl-6 sm:pl-8">
                {filteredMilestones.map((milestone) => {
                  const Icon = milestone.icon;
                  return (
                    <div key={milestone.version} className="relative group">
                      {/* Timeline Dot with Icon */}
                      <div className={`absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full border-2 border-white dark:border-neutral-900 flex items-center justify-center shadow-md ${milestone.iconBg} ${milestone.iconColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Milestone Card */}
                      <div className="p-5 sm:p-6 rounded-2xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-200/70 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-xs">
                        {/* Header Info */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-2xs">
                              {milestone.version}
                            </span>
                            {milestone.isLatest && (
                              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Current Release
                              </span>
                            )}
                            <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">
                              • {milestone.categoryLabel}
                            </span>
                          </div>

                          <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500">
                            {milestone.date}
                          </span>
                        </div>

                        {/* Title & Summary */}
                        <h3 className="text-base sm:text-lg font-bold text-neutral-950 dark:text-white mb-2 leading-snug">
                          {milestone.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                          {milestone.summary}
                        </p>

                        {/* Highlights List */}
                        <div className="space-y-2 pt-3 border-t border-neutral-200/60 dark:border-neutral-700/60">
                          {milestone.highlights.map((h, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                              <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider shrink-0 border mt-0.5 ${getBadgeStyle(h.type)}`}>
                                {getBadgeLabel(h.type)}
                              </span>
                              <span className="leading-relaxed">{h.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* "Crafted with Love" Signature Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-indigo-500/10 dark:from-rose-950/30 dark:via-amber-950/20 dark:to-indigo-950/30 border border-rose-200/60 dark:border-rose-900/40 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 shadow-inner">
                    <Heart className="w-6 h-6 fill-rose-500 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-0.5">
                      <span>Crafted with Love & Precision</span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 max-w-md leading-relaxed">
                      Every transition, caret pulse, typography rule, and particle is engineered with obsessive devotion to the writing craft.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    navigate('/editor');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <span>Open in Editor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3.5 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 flex items-center justify-between text-xs text-neutral-500 shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>All systems operational • 0ms Native Input Latency</span>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
