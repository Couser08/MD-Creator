import React, { useRef } from 'react';
import { 
  Columns, 
  FileCode, 
  PenTool, 
  Eye, 
  Workflow,
  Lightbulb,
  Table as TableIcon,
  Sparkles,
  Folder,
  FileText,
  CheckSquare,
  Play,
  Pause,
  RotateCcw,
  Sun,
  Moon,
  ExternalLink
} from 'lucide-react';
import { SAMPLE_DOCS, SampleDoc, SparkParticle, ViewMode, SideTab } from './mockupData';

const MarkdownPreview = React.lazy(() =>
  import('../../editor/MarkdownPreview').then((m) => ({ default: m.MarkdownPreview }))
);

interface MockupWorkspaceProps {
  mockupTheme: 'dark' | 'light';
  setMockupTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>;
  viewMode: ViewMode;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
  activeSideTab: SideTab;
  setActiveSideTab: React.Dispatch<React.SetStateAction<SideTab>>;
  activeDocId: string;
  currentDoc: SampleDoc;
  content: string;
  setContent: (val: string) => void;
  stats: { lines: number; words: number; chars: number };
  sparks: SparkParticle[];
  isAutoTyping: boolean;
  emitSparks: () => void;
  handleSelectDoc: (id: string) => void;
  handleToggleTask: (idx: number, currentChecked: boolean) => void;
  handleInsertSnippet: (snippet: string) => void;
  startAutoType: () => void;
  stopAutoType: () => void;
  onOpenInFullApp: () => void;
}

export const MockupWorkspace: React.FC<MockupWorkspaceProps> = ({
  mockupTheme,
  setMockupTheme,
  viewMode,
  setViewMode,
  activeSideTab,
  setActiveSideTab,
  activeDocId,
  currentDoc,
  content,
  setContent,
  stats,
  sparks,
  isAutoTyping,
  emitSparks,
  handleSelectDoc,
  handleToggleTask,
  handleInsertSnippet,
  startAutoType,
  stopAutoType,
  onOpenInFullApp,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <>
      {/* High-Resolution Screen Window */}
      <div className={`rounded-xl overflow-hidden ${mockupTheme === 'dark' ? 'bg-[#121216] text-neutral-200' : 'bg-white text-neutral-800'} border border-neutral-800/80 flex flex-col h-[400px] sm:h-[450px] text-xs transition-colors duration-200 relative`}>
        {/* macOS Chrome / Top App Bar */}
        <div className={`px-3.5 py-2 border-b ${mockupTheme === 'dark' ? 'bg-[#1a1a22] border-neutral-800' : 'bg-neutral-100 border-neutral-200'} flex items-center justify-between z-20 shrink-0`}>
          {/* Left: Traffic Lights & Document Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            {/* Traffic Lights */}
            <div className="flex items-center gap-1.5 shrink-0 pr-1">
              <button 
                onClick={() => setContent(currentDoc.content)}
                title="Reset to default"
                className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] hover:brightness-110 cursor-pointer transition-transform hover:scale-110"
              />
              <button 
                onClick={() => setViewMode(prev => prev === 'split' ? 'preview' : 'split')}
                title="Toggle Split / Preview"
                className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] hover:brightness-110 cursor-pointer transition-transform hover:scale-110"
              />
              <button 
                onClick={onOpenInFullApp}
                title="Open in Full App"
                className="w-2.5 h-2.5 rounded-full bg-[#27c93f] hover:brightness-110 cursor-pointer transition-transform hover:scale-110"
              />
            </div>

            {/* Document Tabs */}
            <div className="flex items-center gap-1">
              {SAMPLE_DOCS.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => handleSelectDoc(doc.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                    activeDocId === doc.id
                      ? mockupTheme === 'dark'
                        ? 'bg-[#242430] text-white shadow-xs'
                        : 'bg-white text-neutral-900 shadow-xs'
                      : mockupTheme === 'dark'
                      ? 'text-neutral-400 hover:text-neutral-200'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  <FileCode className="w-3 h-3 text-sky-400" />
                  <span>{doc.title}</span>
                  {activeDocId === doc.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Window Controls & Launch Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Segmented Pill */}
            <div className={`hidden sm:flex items-center p-0.5 rounded-lg border ${mockupTheme === 'dark' ? 'bg-neutral-900/90 border-neutral-800' : 'bg-neutral-200/80 border-neutral-300'}`}>
              <button
                onClick={() => setViewMode('split')}
                title="Side-by-Side Split"
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                  viewMode === 'split' 
                    ? mockupTheme === 'dark' ? 'bg-neutral-800 text-white shadow-2xs' : 'bg-white text-neutral-900 shadow-2xs'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Columns className="w-2.5 h-2.5" />
                <span>Split</span>
              </button>
              <button
                onClick={() => setViewMode('code')}
                title="Editor Only"
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                  viewMode === 'code' 
                    ? mockupTheme === 'dark' ? 'bg-neutral-800 text-white shadow-2xs' : 'bg-white text-neutral-900 shadow-2xs'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <PenTool className="w-2.5 h-2.5" />
                <span>Code</span>
              </button>
              <button
                onClick={() => setViewMode('preview')}
                title="Live Preview Only"
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                  viewMode === 'preview' 
                    ? mockupTheme === 'dark' ? 'bg-neutral-800 text-white shadow-2xs' : 'bg-white text-neutral-900 shadow-2xs'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Eye className="w-2.5 h-2.5" />
                <span>Preview</span>
              </button>
            </div>

            {/* Mini Theme Switcher */}
            <button
              onClick={() => setMockupTheme(prev => prev === 'dark' ? 'light' : 'dark')}
              className={`p-1 rounded-md cursor-pointer transition-colors ${mockupTheme === 'dark' ? 'text-neutral-400 hover:text-white bg-neutral-800/60' : 'text-neutral-600 hover:text-black bg-neutral-200/70'}`}
              title="Toggle Mockup Dark/Light Theme"
            >
              {mockupTheme === 'dark' ? <Sun className="w-3 h-3 text-amber-400" /> : <Moon className="w-3 h-3 text-blue-600" />}
            </button>

            {/* Open in Full Editor CTA */}
            <button
              onClick={onOpenInFullApp}
              className="bg-blue-600 hover:bg-blue-500 text-white text-[10.5px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-2xs transition-all hover:shadow-xs cursor-pointer"
            >
              <span>Launch</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        {/* Action Chips Bar */}
        <div className={`px-3 py-1.5 border-b ${mockupTheme === 'dark' ? 'bg-[#15151c] border-neutral-800/80 text-neutral-400' : 'bg-neutral-50 border-neutral-200 text-neutral-600'} flex items-center justify-between text-[10.5px] z-10 shrink-0 overflow-x-auto no-scrollbar`}>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider font-mono opacity-60">Insert:</span>
            <button 
              onClick={() => handleInsertSnippet('> [!TIP]\n> Write with clarity and speed.')}
              className="px-2 py-0.5 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-medium cursor-pointer transition-colors flex items-center gap-1 text-[10px]"
            >
              <Lightbulb className="w-2.5 h-2.5" /> + Tip
            </button>
            <button 
              onClick={() => handleInsertSnippet('```mermaid\ngraph TD;\n  Start-->Process-->Complete;\n```')}
              className="px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-medium cursor-pointer transition-colors flex items-center gap-1 text-[10px]"
            >
              <Workflow className="w-2.5 h-2.5" /> + Flowchart
            </button>
            <button 
              onClick={() => handleInsertSnippet('- [ ] Review architecture milestones')}
              className="px-2 py-0.5 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-medium cursor-pointer transition-colors flex items-center gap-1 text-[10px]"
            >
              <CheckSquare className="w-2.5 h-2.5" /> + Task
            </button>
          </div>

          {/* Auto-Type Demo Player & Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={isAutoTyping ? stopAutoType : startAutoType}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                isAutoTyping 
                  ? 'bg-amber-500 text-neutral-950 animate-pulse'
                  : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300'
              }`}
            >
              {isAutoTyping ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5 fill-current" />}
              <span>{isAutoTyping ? 'Typing...' : 'Auto-Type'}</span>
            </button>
            <button
              onClick={() => setContent(currentDoc.content)}
              title="Reset text"
              className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 cursor-pointer"
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        {/* Screen Content Engine (Supports 4 Modes: Write, Organize, Create, Export) */}
        <div className="flex-1 relative overflow-hidden flex">
          {/* MODE: ORGANIZE */}
          {activeSideTab === 'organize' && (
            <div className="absolute inset-0 z-30 bg-[#121216]/95 backdrop-blur-md p-4 flex flex-col justify-between text-neutral-200 animate-in fade-in duration-150">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-xs tracking-tight">Workspace Navigator</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500">2 documents synced</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 font-semibold px-2">
                      📁 Product Specs & RFCs
                    </span>
                    <div className="mt-1 space-y-1">
                      {SAMPLE_DOCS.filter(d => d.folder === 'Product Specs').map(doc => (
                        <button
                          key={doc.id}
                          onClick={() => {
                            handleSelectDoc(doc.id);
                            setActiveSideTab('write');
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                            activeDocId === doc.id
                              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                              : 'hover:bg-neutral-800/60 text-neutral-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-blue-400" />
                            <span>{doc.title}</span>
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                            {doc.status}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 font-semibold px-2">
                      📁 System Flow & Diagrams
                    </span>
                    <div className="mt-1 space-y-1">
                      {SAMPLE_DOCS.filter(d => d.folder === 'Architecture').map(doc => (
                        <button
                          key={doc.id}
                          onClick={() => {
                            handleSelectDoc(doc.id);
                            setActiveSideTab('write');
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                            activeDocId === doc.id
                              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                              : 'hover:bg-neutral-800/60 text-neutral-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Workflow className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{doc.title}</span>
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                            {doc.status}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                <span>IndexedDB 0ms Local Cache</span>
                <button
                  onClick={() => setActiveSideTab('write')}
                  className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                >
                  Return to Editor →
                </button>
              </div>
            </div>
          )}

          {/* MODE: CREATE */}
          {activeSideTab === 'create' && (
            <div className="absolute inset-0 z-30 bg-[#121216]/95 backdrop-blur-md p-4 flex flex-col justify-between text-neutral-200 animate-in fade-in duration-150">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="font-semibold text-xs tracking-tight">Component & Blueprint Studio</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500">1-click insert</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleInsertSnippet('```mermaid\nsequenceDiagram\n  autonumber\n  Client->>Dexie: 0ms Local Write\n  Dexie-->>Client: Instant Render\n  Dexie->>Supabase: Background Sync\n```')}
                    className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 text-left transition-all hover:border-emerald-500/50 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                      <Workflow className="w-3.5 h-3.5" />
                      <span>Sequence Flow</span>
                    </div>
                    <p className="text-[10.5px] text-neutral-400 leading-snug">
                      Live Mermaid sequence flow with instant vector rendering.
                    </p>
                  </button>

                  <button
                    onClick={() => handleInsertSnippet('| Metric | Benchmark | Status |\n| :--- | :--- | :--- |\n| Keystroke Latency | < 0.05ms | ✅ Passed |\n| GC Thrashing | 0 Bytes | ✅ Passed |')}
                    className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 text-left transition-all hover:border-blue-500/50 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold mb-1">
                      <TableIcon className="w-3.5 h-3.5" />
                      <span>Telemetry Table</span>
                    </div>
                    <p className="text-[10.5px] text-neutral-400 leading-snug">
                      Clean Markdown comparison matrix with header alignment.
                    </p>
                  </button>

                  <button
                    onClick={() => handleInsertSnippet('> [!IMPORTANT]\n> High availability storage guarantees zero data loss on unexpected power cuts.')}
                    className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 text-left transition-all hover:border-purple-500/50 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Important Callout</span>
                    </div>
                    <p className="text-[10.5px] text-neutral-400 leading-snug">
                      GitHub alert callout in vivid purple container.
                    </p>
                  </button>

                  <button
                    onClick={() => handleInsertSnippet('- [ ] Stage 1: Local IndexedDB\n- [ ] Stage 2: Supabase Replication\n- [ ] Stage 3: PDF Vector Printing')}
                    className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 text-left transition-all hover:border-amber-500/50 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>Action Checklist</span>
                    </div>
                    <p className="text-[10.5px] text-neutral-400 leading-snug">
                      Interactive checkboxes that toggle live on click.
                    </p>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px]">
                <span className="text-neutral-500">Pick any card to inject directly into editor</span>
                <button
                  onClick={() => setActiveSideTab('write')}
                  className="text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
                >
                  Close Studio →
                </button>
              </div>
            </div>
          )}

          {/* MODE: EXPORT */}
          {activeSideTab === 'export' && (
            <div className="absolute inset-0 z-30 bg-neutral-900/95 backdrop-blur-md p-4 overflow-y-auto flex flex-col items-center animate-in fade-in duration-150">
              <div className="w-full max-w-md bg-white text-neutral-900 rounded-lg shadow-2xl p-6 flex flex-col justify-between min-h-[340px] text-left border border-neutral-200">
                <div>
                  <div className="border-b border-neutral-200 pb-2 mb-4 flex items-center justify-between text-[9px] uppercase tracking-wider text-neutral-500 font-mono">
                    <span>MD WRITER • SYSTEM SPECIFICATION</span>
                    <span className="text-blue-600 font-bold">PDF STUDIO v2.4</span>
                  </div>

                  <h2 className="text-lg font-black text-neutral-950 tracking-tight mb-1">
                    High-Performance Markdown Engine
                  </h2>
                  <p className="text-[10px] text-neutral-500 mb-3">
                    Author: Engineering Core • Status: Verified • Date: September 2026
                  </p>

                  <div className="space-y-2 text-[11px] text-neutral-700 leading-relaxed border-l-2 border-blue-500 pl-3 py-1 bg-blue-50/50 rounded-r">
                    <p className="font-semibold text-neutral-900">
                      Dual-Engine Architecture Overview
                    </p>
                    <p className="text-[10.5px]">
                      MD Writer decouples typing latency from cloud network roundtrips. Every keystroke commits to browser IndexedDB in 0ms with zero React re-renders.
                    </p>
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-3 mt-6 flex items-center justify-between text-[9px] text-neutral-400 font-mono">
                  <span>CONFIDENTIAL • STRICTLY FOR PEER REVIEW</span>
                  <span>PAGE 1 OF 1</span>
                </div>
              </div>

              <div className="w-full max-w-md mt-3 flex items-center justify-between text-xs text-neutral-300">
                <span>Export-ready vector typography</span>
                <button
                  onClick={() => setActiveSideTab('write')}
                  className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  Back to Editor
                </button>
              </div>
            </div>
          )}

          {/* DUAL PANE / SINGLE PANE MAIN VIEW */}
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-neutral-800/80 overflow-hidden">
              {/* LEFT PANE */}
              {(viewMode === 'split' || viewMode === 'code') && (
                <div className={`relative flex flex-col h-full overflow-hidden ${mockupTheme === 'dark' ? 'bg-[#15151b]' : 'bg-neutral-50'} ${viewMode === 'code' ? 'col-span-1 lg:col-span-2' : ''}`}>
                  <div className="flex-1 flex overflow-hidden relative">
                    {/* Line Numbers */}
                    <div className={`w-8 shrink-0 py-3 pr-2 text-right select-none font-mono text-[10.5px] leading-relaxed ${mockupTheme === 'dark' ? 'text-neutral-600 bg-[#131318]' : 'text-neutral-400 bg-neutral-100/70'} border-r ${mockupTheme === 'dark' ? 'border-neutral-800/60' : 'border-neutral-200/60'}`}>
                      {Array.from({ length: Math.max(stats.lines, 12) }).map((_, idx) => (
                        <div key={idx} className="h-[19px]">{idx + 1}</div>
                      ))}
                    </div>

                    {/* Textarea */}
                    <div className="flex-1 relative overflow-hidden">
                      <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => {
                          setContent(e.target.value);
                          emitSparks();
                          if (isAutoTyping) stopAutoType();
                        }}
                        placeholder="Type markdown here..."
                        className={`w-full h-full resize-none p-3 font-mono-code text-[11px] leading-[19px] bg-transparent outline-none select-text ${
                          mockupTheme === 'dark' ? 'text-neutral-200 selection:bg-blue-600/40' : 'text-neutral-800 selection:bg-blue-200'
                        }`}
                        spellCheck={false}
                      />

                      {/* Spark Particles */}
                      {sparks.map((s) => (
                        <div
                          key={s.id}
                          className="absolute pointer-events-none rounded-full animate-ping"
                          style={{
                            left: `${s.x}%`,
                            top: `${s.y}%`,
                            width: s.size,
                            height: s.size,
                            backgroundColor: s.color,
                            boxShadow: `0 0 8px ${s.color}`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Status Bar */}
                  <div className={`px-3 py-1.5 border-t ${mockupTheme === 'dark' ? 'bg-[#121217] border-neutral-800/80 text-neutral-500' : 'bg-neutral-100 border-neutral-200 text-neutral-500'} flex items-center justify-between text-[10px] font-mono shrink-0`}>
                    <div className="flex items-center gap-2">
                      <span 
                        className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400 font-medium cursor-help"
                        title="Hardware-accelerated 2D canvas rendering for lag-free particle effects & carets"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>⚡ Smooth 60fps</span>
                      </span>
                      <span>•</span>
                      <span>Ln {stats.lines}, Col 1</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{stats.words} words</span>
                      <span>{stats.chars} chars</span>
                    </div>
                  </div>
                </div>
              )}

              {/* RIGHT PANE: Markdown Preview */}
              {(viewMode === 'split' || viewMode === 'preview') && (
                <div className={`h-full overflow-y-auto p-4 select-text ${mockupTheme === 'dark' ? 'bg-[#16161f] text-neutral-100' : 'bg-white text-neutral-900'} ${viewMode === 'preview' ? 'col-span-1 lg:col-span-2' : ''}`}>
                  <div className={`max-w-none prose prose-sm ${mockupTheme === 'dark' ? 'prose-invert text-neutral-200' : 'text-neutral-900'} prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600`}>
                    <React.Suspense fallback={
                      <div className="space-y-3 py-2 animate-pulse">
                        <div className="h-5 bg-neutral-200/40 dark:bg-neutral-800/60 rounded w-3/4" />
                        <div className="h-3.5 bg-neutral-200/30 dark:bg-neutral-800/40 rounded w-full" />
                        <div className="h-3.5 bg-neutral-200/30 dark:bg-neutral-800/40 rounded w-5/6" />
                        <div className="h-12 bg-neutral-200/20 dark:bg-neutral-800/30 rounded-xl mt-4" />
                      </div>
                    }>
                      <MarkdownPreview 
                        content={content} 
                        onToggleTask={handleToggleTask} 
                      />
                    </React.Suspense>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Action Tabs on Right Edge */}
      <div className="absolute left-full top-12 -ml-1 flex flex-col gap-1.5 z-20">
        {[
          { id: 'write', label: 'Write' },
          { id: 'organize', label: 'Organize' },
          { id: 'create', label: 'Create' },
          { id: 'export', label: 'Export' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSideTab(tab.id as SideTab)}
            title={`Switch to ${tab.label} mode`}
            className={`px-3 py-1.5 rounded-r-md text-[10.5px] sm:text-[11.5px] font-semibold tracking-wide shadow-xs transition-all cursor-pointer whitespace-nowrap border-y border-r border-l-0 ${
              activeSideTab === tab.id
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 translate-x-1 shadow-sm'
                : 'bg-white/95 dark:bg-neutral-800/95 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:translate-x-0.5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </>
  );
};
