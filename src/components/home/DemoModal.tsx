import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  X, 
  ArrowRight, 
  Cpu, 
  Printer, 
  ListTree, 
  Cloud, 
  Sparkles, 
  CheckCircle2, 
  Table, 
  Code, 
  Timer,
  MousePointer2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenUpdates?: () => void;
}

type FeatureTab = 'all' | 'fx' | 'pdf' | 'outline' | 'sync' | 'zen';

interface FeatureCard {
  id: string;
  category: FeatureTab;
  title: string;
  tag: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  specs: string[];
}

const FEATURES: FeatureCard[] = [
  {
    id: 'fx-canvas',
    category: 'fx',
    title: '60–144FPS Game-Engine Canvas FX',
    tag: 'Engine Architecture',
    description: 'Hardware-accelerated 2D canvas overlay using fixed 256-item object pooling. Zero Garbage Collection pauses, zero DOM reconciliation, and self-sleeping RAF loop.',
    icon: Cpu,
    iconColor: 'text-amber-500 dark:text-amber-400',
    iconBg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900/40',
    specs: ['0ms Native Input Latency', 'High-DPI Retina Scaling', '256-Particle Object Pool', 'Auto-Sleeping RAF Engine']
  },
  {
    id: 'fx-cursors',
    category: 'fx',
    title: 'Custom Caret Studio',
    tag: 'Visual Physics',
    description: 'Switch dynamically between Neon Cyan Pulse, Terminal Matrix Block (with authentic step-blink), Amber CRT Phosphor, and Minimal High-Contrast carets.',
    icon: MousePointer2,
    iconColor: 'text-cyan-500 dark:text-cyan-400',
    iconBg: 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-900/40',
    specs: ['Direct GPU translate3d', 'Cached Mirror Singleton', 'Soft Sparks & Ripple Glow', 'Performance Mode Toggle']
  },
  {
    id: 'pdf-studio',
    category: 'pdf',
    title: 'PDF Export Studio v2',
    tag: 'Vector Publishing',
    description: 'High-resolution vector print engine with 5 curated typographic themes (Editorial, Technical RFC, Academic, Corporate, Minimalist) and customizable paper formats.',
    icon: Printer,
    iconColor: 'text-blue-500 dark:text-blue-400',
    iconBg: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900/40',
    specs: ['A4 & US Letter Formats', 'Standalone Cover Pages', 'Auto TOC from H1-H3', 'Pinned Running Footers']
  },
  {
    id: 'outline-drawer',
    category: 'outline',
    title: 'Interactive Outline Navigator',
    tag: 'Navigation',
    description: 'Real-time Markdown heading extractor (# to ######) displaying structure hierarchy with indentation badges and single-click jump-to-line scrolling.',
    icon: ListTree,
    iconColor: 'text-purple-500 dark:text-purple-400',
    iconBg: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-900/40',
    specs: ['H1–H6 Depth Support', 'Active Section Highlight', '1-Click Jump to Line', 'Zero-Lag Regex Parsing']
  },
  {
    id: 'cloud-sync',
    category: 'sync',
    title: 'Dual-Engine Offline + Cloud Sync',
    tag: 'Storage & Resilience',
    description: 'Offline-first Dexie IndexedDB caching thousands of drafts locally, automatically synchronizing bi-directionally with Supabase with cryptographic Row-Level Security.',
    icon: Cloud,
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900/40',
    specs: ['Instant Local Indexing', 'Automatic Inbound Cloud Pull', 'Row Level Security (RLS)', 'Pre-Signup Email Guard']
  },
  {
    id: 'slash-tables',
    category: 'zen',
    title: 'Slash Commands (/) & Visual Tables',
    tag: 'Productivity',
    description: 'Summon rapid formatting tools with a single keystroke. Create multi-column aligned Markdown tables with an intuitive visual grid modal.',
    icon: Table,
    iconColor: 'text-rose-500 dark:text-rose-400',
    iconBg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900/40',
    specs: ['Keyboard Shortcuts', 'Alignment Controls', 'Code & Callout Blocks', '1-Click Insertion']
  },
  {
    id: 'focus-zen',
    category: 'zen',
    title: 'Typewriter Scrolling & Focus Sprints',
    tag: 'Flow State',
    description: 'Keep your active writing line vertically centered on the screen. Track productivity intervals (15/25/45m) with real-time word velocity telemetry.',
    icon: Timer,
    iconColor: 'text-indigo-500 dark:text-indigo-400',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900/40',
    specs: ['Vertical Line Centering', '15/25/45m Sprints', 'Words/Min Velocity', 'Distraction-Free Zen Mode']
  },
  {
    id: 'katex-math',
    category: 'zen',
    title: 'KaTeX LaTeX Formulas & Code Sandbox',
    tag: 'Typography',
    description: 'Instant inline ($...$) and block ($$...$$) mathematical equation rendering, paired with Prism-grade syntax highlighted code blocks with language tags.',
    icon: Code,
    iconColor: 'text-neutral-500 dark:text-neutral-400',
    iconBg: 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700',
    specs: ['Full LaTeX Math Engine', 'Code Copy Buttons', 'GFM Task Lists', 'Live Split Preview']
  }
];

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, onOpenUpdates }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FeatureTab>('all');

  const filteredFeatures = FEATURES.filter(f => activeTab === 'all' || f.category === activeTab);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xl flex flex-col overflow-hidden text-neutral-900 dark:text-neutral-100"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-black text-base shadow-md">
                M
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-base sm:text-lg text-neutral-950 dark:text-white tracking-tight">
                    MD Writer Feature Exploration Studio
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Active Suite
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Comprehensive breakdown of all writing, typography, publishing, and sync engines
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

          {/* Sub-header Filter Tabs */}
          <div className="px-6 py-2.5 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs shrink-0">
            {[
              { id: 'all', label: 'All Capabilities' },
              { id: 'fx', label: '⚡ 60FPS Writing FX' },
              { id: 'pdf', label: '📄 PDF Studio' },
              { id: 'outline', label: '📑 Outline & TOC' },
              { id: 'sync', label: '☁️ Dual Cloud Sync' },
              { id: 'zen', label: '🧘 Zen & Focus Flow' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as FeatureTab)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Feature Grid Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {filteredFeatures.map(feat => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.id}
                    className="p-6 rounded-2xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-200/70 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between shadow-xs group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${feat.iconBg} ${feat.iconColor} shadow-2xs group-hover:scale-105 transition-transform`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-200/60 dark:bg-neutral-700/60 text-neutral-600 dark:text-neutral-300">
                          {feat.tag}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-neutral-950 dark:text-white mb-2 tracking-tight">
                        {feat.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-5">
                        {feat.description}
                      </p>
                    </div>

                    {/* Spec Bullets */}
                    <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-700/60 grid grid-cols-2 gap-2 text-[11px] text-neutral-600 dark:text-neutral-400 font-mono">
                      {feat.specs.map((spec, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Banner Linking to Updates Timeline */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-200/60 dark:border-amber-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                    Interested in the technical release history?
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    See chronological milestones from v1.0 foundation to the v2.5 game-engine canvas.
                  </span>
                </div>
              </div>

              {onOpenUpdates && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenUpdates();
                  }}
                  className="px-4 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer shrink-0 transition-colors"
                >
                  View Release Timeline →
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 bg-neutral-50/70 dark:bg-neutral-950/60 border-t border-neutral-100 dark:border-neutral-800 shrink-0">
            <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500">
              MD Writer Studio • Built for Flow
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate('/editor');
                }}
                className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Launch in Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
