import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Printer, 
  Sigma, 
  Cpu, 
  Terminal, 
  Layers, 
  Check, 
  X
} from 'lucide-react';
import { Navbar } from '../components/home/Navbar';
import { Footer } from '../components/home/Footer';
import { CtaBanner } from '../components/home/CtaBanner';

type FeatureTab = 'pdf' | 'math' | 'perf' | 'slash' | 'media';

export const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FeatureTab>('pdf');

  const tabs = [
    { id: 'pdf' as FeatureTab, label: 'PDF Publishing Studio', icon: Printer },
    { id: 'math' as FeatureTab, label: 'KaTeX Math Studio', icon: Sigma },
    { id: 'perf' as FeatureTab, label: '60FPS Canvas & Offline', icon: Cpu },
    { id: 'slash' as FeatureTab, label: 'Slash Commands', icon: Terminal },
    { id: 'media' as FeatureTab, label: 'Modern Media & Diagrams', icon: Layers },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors select-none">
      <Navbar />

      <main className="flex-1">
        {/* Header Hero Section */}
        <section className="pt-16 pb-12 sm:pt-20 sm:pb-16 text-center max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="font-mono uppercase tracking-wider text-[11px]">Flagship Feature Deep Dives</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-950 dark:text-white tracking-tight mb-5 leading-tight">
            Everything you need to write,<br />refine and publish.
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10">
            A comprehensive overview of MD Writer's client-side performance, publication typography, mathematical engines, and keyboard power tools.
          </p>

          {/* Quick Action Button */}
          <button
            onClick={() => navigate('/editor')}
            className="px-6 sm:px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all inline-flex items-center gap-2 shadow-sm hover:shadow cursor-pointer"
          >
            <span>Open Free Editor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>

        {/* Interactive Tabbed Feature Pillars */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Tab Navigation */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-md scale-102'
                      : 'bg-neutral-100/80 dark:bg-neutral-850 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panels */}
          <div className="mt-8 p-6 sm:p-10 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xl min-h-[420px] flex flex-col justify-between">
            {activeTab === 'pdf' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Printer className="w-3.5 h-3.5" />
                    <span>Vector Print Engine v2.4</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
                    Markdown that exports like a dedicated design tool.
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Most markdown editors produce raw, unstyled HTML prints. MD Writer's PDF Studio provides standalone cover pages, 5 editorial typographic presets, automatic table of contents with leader dots, and pinned running headers/footers.
                  </p>
                  <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 5 Curated Font Pairs (Editorial Sans, RFC Mono, Academic Serif)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Sandboxed iframe printing with 0 UI chrome</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Instant keyboard shortcut via <code className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono">/exportpdf</code></li>
                  </ul>
                </div>
                <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-sm text-xs font-mono space-y-3">
                  <div className="text-neutral-400 pb-2 border-b border-neutral-100 dark:border-neutral-800 flex justify-between">
                    <span>PDF STUDIO PRESET</span>
                    <span className="text-blue-500">A4 • 300 DPI VECTOR</span>
                  </div>
                  <div className="text-neutral-900 dark:text-white font-bold text-sm">System Architecture Document.pdf</div>
                  <div className="text-neutral-500 text-[11px] leading-relaxed">
                    Cover Page: Enabled<br />
                    TOC Generation: Dynamic H1-H3<br />
                    Watermark: "Confidential - Draft"<br />
                    Page Numbers: Bottom Right (Page 1 of 8)
                  </div>
                  <div className="pt-2">
                    <button 
                      onClick={() => navigate('/editor')} 
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-sans font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Try PDF Export in Editor →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'math' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Sigma className="w-3.5 h-3.5" />
                    <span>KaTeX Mathematical Studio</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
                    Predefined formulas library for research and science.
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Never search for obscure LaTeX syntax again. MD Writer includes 20+ pre-built formulas across Calculus, Linear Algebra, Statistics, and Quantum Physics with instant 1-click insertion.
                  </p>
                  <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 0ms client-side KaTeX typesetting</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Pre-categorized library with real-time preview</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Insert directly at cursor via <code className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono">/math</code></li>
                  </ul>
                </div>
                <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 font-mono text-xs space-y-3">
                  <div className="text-neutral-400 pb-2 border-b border-neutral-100 dark:border-neutral-800">SAMPLE LATEX RENDERING</div>
                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center text-sm font-serif">
                    {'f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}'}
                  </div>
                  <div className="text-[11px] text-neutral-400">Normal Distribution Formula • 1-click copy & insert</div>
                </div>
              </div>
            )}

            {activeTab === 'perf' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Hardware-Accelerated 2D Canvas</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
                    ⚡ Smooth 60fps typing with zero input latency.
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Most web editors suffer from micro-stutters when typing quickly. MD Writer renders visual carets and particle effects on an isolated High-DPI canvas layer with a zero-allocation object pool, running smoothly even at 144Hz.
                  </p>
                  <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Dexie IndexedDB client-side database with 0ms auto-save</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Progressive Web App (PWA) with 112 offline cached assets</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Sub-30 kB initial chunk for instant mobile loading</li>
                  </ul>
                </div>
                <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-3">
                  <div className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">Performance Telemetry</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="text-neutral-500">Typing Latency</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">&lt; 1ms (Native)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="text-neutral-500">Frame Rate</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">⚡ Constant 60–144 FPS</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="text-neutral-500">Offline Availability</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">100% Client-Side</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'slash' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Keyboard Command Powerhouse</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
                    Keep your hands on the keyboard.
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Type <code className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-xs">/</code> anywhere to invoke instant formatting, rich blocks, or execution actions without touching your mouse.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                      <span className="text-blue-600 font-bold">/exportmd</span>
                      <div className="text-[10px] text-neutral-400 font-sans mt-0.5">Instant .md file download</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                      <span className="text-blue-600 font-bold">/exportpdf</span>
                      <div className="text-[10px] text-neutral-400 font-sans mt-0.5">Open PDF Studio toolbar</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                      <span className="text-blue-600 font-bold">/api &amp; /json</span>
                      <div className="text-[10px] text-neutral-400 font-sans mt-0.5">REST API mock block</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                      <span className="text-blue-600 font-bold">/yaml</span>
                      <div className="text-[10px] text-neutral-400 font-sans mt-0.5">Line-1 YAML Front Matter</div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono space-y-2">
                  <div className="text-neutral-400 pb-2 border-b border-neutral-100 dark:border-neutral-800">GLOBAL RAYCAST PALETTE</div>
                  <div className="text-neutral-900 dark:text-white font-bold">Ctrl + K / Cmd + K</div>
                  <p className="text-neutral-500 font-sans text-xs">
                    Quickly search through all your local documents, switch between split/write/zen modes, toggle themes, or trigger PDF export.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Media &amp; Visual Documentation</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
                    Rich media, WebP compression, and Mermaid charts.
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Embed screenshots via direct clipboard paste (Ctrl+V) with client-side WebP compression, render complex Mermaid flowcharts with 0ms typing debounce, and enjoy 3D Microsoft Fluent emojis.
                  </p>
                  <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Offline WebP compression via HTML5 bicubic canvas</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Mermaid architecture charts with dynamic code-splitting</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Commercial-safe Microsoft Fluent 3D Emojis</li>
                  </ul>
                </div>
                <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs space-y-3">
                  <div className="text-neutral-400 font-mono pb-2 border-b border-neutral-100 dark:border-neutral-800">IMAGE EMBED STUDIO TELEMETRY</div>
                  <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/40 text-neutral-900 dark:text-white flex items-center justify-between">
                    <div>
                      <div className="font-bold">Screenshot_2026.png</div>
                      <div className="text-[10px] text-neutral-500">Downscaled &amp; converted to WebP</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono">
                      -72% Saved
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Feature Comparison Matrix Table */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral-200/80 dark:border-neutral-800">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-neutral-950 dark:text-white tracking-tight mb-3">
              How MD Writer Compares
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              A clear side-by-side view against typical markdown tools and notes apps.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-850">
                  <th className="p-4 font-bold text-neutral-950 dark:text-white">Capability</th>
                  <th className="p-4 font-bold text-blue-600 dark:text-blue-400">MD Writer</th>
                  <th className="p-4 font-medium text-neutral-500">Notion</th>
                  <th className="p-4 font-medium text-neutral-500">Obsidian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {[
                  { feat: 'Works 100% Offline with Zero Sign-Up', md: true, notion: false, obsidian: true },
                  { feat: 'Publication-Ready PDF Cover & TOC', md: true, notion: false, obsidian: false },
                  { feat: 'Pre-Categorized KaTeX Formula Studio', md: true, notion: false, obsidian: false },
                  { feat: '⚡ Smooth 60fps Hardware-Accelerated Canvas', md: true, notion: false, obsidian: false },
                  { feat: 'Direct Clipboard Image WebP Compression', md: true, notion: false, obsidian: false },
                  { feat: 'One-Click PWA Installability', md: true, notion: false, obsidian: false },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-850/50">
                    <td className="p-4 font-medium text-neutral-900 dark:text-neutral-100">{row.feat}</td>
                    <td className="p-4 text-emerald-600 dark:text-emerald-400 font-bold">
                      <Check className="w-4 h-4" />
                    </td>
                    <td className="p-4 text-neutral-400">
                      {row.notion ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-neutral-300 dark:text-neutral-700" />}
                    </td>
                    <td className="p-4 text-neutral-400">
                      {row.obsidian ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-neutral-300 dark:text-neutral-700" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA Banner */}
        <CtaBanner onOpenTemplates={() => navigate('/editor')} />
      </main>

      <Footer />
    </div>
  );
};
