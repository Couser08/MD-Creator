import React, { useState } from 'react';
import { 
  FileText, 
  Star, 
  Folder, 
  Clock, 
  Plus, 
  Bold, 
  Italic, 
  Link2, 
  Image as ImageIcon, 
  List, 
  Table2, 
  ArrowLeftRight, 
  MoreHorizontal, 
  ChevronDown, 
  Zap, 
  LayoutTemplate, 
  UploadCloud, 
  Check,
  Eye
} from 'lucide-react';

interface CtaFloatingEditorProps {
  onOpenTemplates?: () => void;
  onOpenEditor?: () => void;
}

export const CtaFloatingEditor: React.FC<CtaFloatingEditorProps> = ({ 
  onOpenTemplates, 
  onOpenEditor 
}) => {
  const [activeNav, setActiveNav] = useState<'doc' | 'starred' | 'templates' | 'recents'>('doc');
  const [tasks, setTasks] = useState<{ id: string; label: string; done: boolean }[]>([
    { id: '1', label: 'Write', done: true },
    { id: '2', label: 'Learn', done: true },
    { id: '3', label: 'Build', done: false },
    { id: '4', label: 'Repeat', done: false },
  ]);
  const [isPreviewActive, setIsPreviewActive] = useState(false);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div className="relative w-full max-w-[680px] mx-auto select-none pt-14 pb-14 px-2 sm:px-4">
      
      {/* 1. Top-Left Floating Card: Fast & Distraction Free (Static, NO bounce) */}
      <div className="absolute top-1 left-2 sm:left-6 z-30">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-[0_10px_25px_rgba(0,0,0,0.06)] dark:shadow-none text-left">
          <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold text-xs text-neutral-950 dark:text-white">Fast &amp; Distraction Free</div>
            <div className="text-[10px] text-neutral-400 dark:text-neutral-500">Focus on what matters.</div>
          </div>
        </div>
      </div>

      {/* Curved SVG Arrow 1: Fast & Distraction Free -> Editor Toolbar */}
      <svg 
        className="absolute top-9 left-48 sm:left-56 w-11 h-9 text-neutral-400 dark:text-neutral-500 pointer-events-none z-20 hidden sm:block" 
        viewBox="0 0 50 40" 
        fill="none"
      >
        <path 
          d="M 5 6 C 18 12, 30 22, 38 32" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
        />
        <path 
          d="M 30 30 L 38 32 L 36 23" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>

      {/* 2. Top-Right Handwritten Cursive Annotation (Placed safely above-right without overlapping buttons) */}
      <div className="hidden sm:block absolute top-0 right-0 sm:right-2 z-20 select-none text-right font-handwriting text-neutral-400 dark:text-neutral-500 text-sm sm:text-base leading-[1.2]">
        <div>Write</div>
        <div>Preview</div>
        <div>Export</div>
        <div className="font-semibold text-neutral-600 dark:text-neutral-300">
          All in one place.
        </div>
      </div>

      {/* Curved SVG Arrow 2: Handwritten Note -> Top of Preview Pane */}
      <svg 
        className="absolute top-8 right-24 sm:right-28 w-11 h-10 text-neutral-400 dark:text-neutral-500 pointer-events-none z-20 hidden sm:block" 
        viewBox="0 0 50 45" 
        fill="none"
      >
        <path 
          d="M 42 6 C 26 12, 14 24, 8 36" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
        />
        <path 
          d="M 16 33 L 8 36 L 7 26" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>

      {/* 3. Main Floating macOS Window Chassis with subtle 3D tilt */}
      <div className="relative rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-none overflow-hidden transition-all lg:[transform:perspective(1200px)_rotateY(-2.5deg)_rotateX(1.5deg)]">
        
        {/* Window Topbar */}
        <div className="px-4 py-2.5 bg-white dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-850 flex items-center justify-between">
          {/* Traffic Light Dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
          </div>

          {/* Right Action Utilities: Preview Pill & Export Black Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreviewActive(!isPreviewActive)}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                isPreviewActive
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-transparent'
                  : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200/90 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Eye className="w-3 h-3 text-neutral-500" />
              <span>Preview</span>
            </button>

            <button
              onClick={onOpenEditor}
              className="px-3.5 py-1 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <span>Export</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Window Body: 3-Column Layout (Sidebar + Editor + Preview) */}
        <div className="grid grid-cols-12 divide-x divide-neutral-150 dark:divide-neutral-850 min-h-[250px] text-xs">
          
          {/* Column 1: Left Mini Sidebar */}
          <div className="col-span-3 sm:col-span-3 p-2.5 sm:p-3 bg-[#fbfbfd] dark:bg-neutral-900/40 flex flex-col justify-between">
            <div className="space-y-1">
              <button
                onClick={() => setActiveNav('doc')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeNav === 'doc'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate hidden sm:inline">Document</span>
              </button>

              <button
                onClick={() => setActiveNav('starred')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl font-medium flex items-center gap-2 transition-all cursor-pointer ${
                  activeNav === 'starred'
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60'
                }`}
              >
                <Star className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate hidden sm:inline">Starred</span>
              </button>

              <button
                onClick={() => {
                  setActiveNav('templates');
                  onOpenTemplates?.();
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl font-medium flex items-center gap-2 transition-all cursor-pointer ${
                  activeNav === 'templates'
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60'
                }`}
              >
                <Folder className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate hidden sm:inline">Templates</span>
              </button>

              <button
                onClick={() => setActiveNav('recents')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl font-medium flex items-center gap-2 transition-all cursor-pointer ${
                  activeNav === 'recents'
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60'
                }`}
              >
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate hidden sm:inline">Recents</span>
              </button>
            </div>

            <button
              onClick={onOpenEditor}
              className="mt-4 w-full py-1 px-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 text-neutral-600 dark:text-neutral-300 font-medium text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span className="hidden sm:inline">New</span>
            </button>
          </div>

          {/* Column 2: Center Raw Markdown Editor */}
          <div className="col-span-5 sm:col-span-5 p-3 sm:p-4 bg-white dark:bg-neutral-950 flex flex-col justify-between font-mono-code text-[11px]">
            <div>
              {/* Mini Toolbar */}
              <div className="flex items-center gap-2.5 pb-2 mb-3 border-b border-neutral-100 dark:border-neutral-850 text-neutral-400 text-[10px]">
                <span className="font-bold text-neutral-900 dark:text-white">H</span>
                <Bold className="w-2.5 h-2.5 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer" />
                <Italic className="w-2.5 h-2.5 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer" />
                <Link2 className="w-2.5 h-2.5 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer" />
                <ImageIcon className="w-2.5 h-2.5 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer" />
                <List className="w-2.5 h-2.5 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer" />
                <Table2 className="w-2.5 h-2.5 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer" />
                <ArrowLeftRight className="w-2.5 h-2.5 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer" />
                <MoreHorizontal className="w-2.5 h-2.5 ml-auto" />
              </div>

              {/* Title & Body */}
              <div className="space-y-2">
                <div>
                  <span className="text-blue-600 font-bold"># </span>
                  <span className="font-bold text-xs text-neutral-900 dark:text-white font-sans">
                    Ideas that matter
                  </span>
                </div>

                {/* Subtitle / Quote bar */}
                <div className="border-l-2 border-neutral-300 dark:border-neutral-700 pl-2 text-[11px] text-neutral-500 dark:text-neutral-400 font-sans my-1.5">
                  Small steps create big changes.
                </div>

                {/* Clickable Interactive Task Checkboxes */}
                <div className="pt-2 space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className="flex items-center gap-2.5 text-[11px] cursor-pointer group/task"
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-all ${
                          task.done
                            ? 'bg-blue-600 border border-blue-600 text-white'
                            : 'border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 group-hover/task:border-blue-500'
                        }`}
                      >
                        {task.done && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                      </div>
                      <span
                        className={`font-sans text-[11px] transition-colors ${
                          task.done
                            ? 'text-neutral-900 dark:text-white font-medium'
                            : 'text-neutral-500 dark:text-neutral-400'
                        }`}
                      >
                        {task.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Right Rendered Output Pane */}
          <div className="col-span-4 sm:col-span-4 p-3 sm:p-4 bg-[#fbfbfd]/60 dark:bg-neutral-900/30 font-sans flex flex-col">
            <h4 className="font-bold text-xs text-neutral-950 dark:text-white tracking-tight">
              Ideas that matter
            </h4>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-snug mt-1 mb-2.5">
              Small steps create big changes.
            </p>

            <ul className="text-[10.5px] text-neutral-700 dark:text-neutral-300 space-y-1.5 list-disc pl-3.5 leading-snug">
              {tasks.map((t) => (
                <li
                  key={t.id}
                  className={`transition-all ${
                    t.done 
                      ? 'text-neutral-900 dark:text-white font-medium' 
                      : 'text-neutral-400 dark:text-neutral-500'
                  }`}
                >
                  {t.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Bottom-Left Floating Card: Beautiful Templates (Static, NO bounce) */}
      <div 
        onClick={onOpenTemplates}
        className="absolute bottom-1 left-0 sm:left-4 z-30 cursor-pointer group/callout"
      >
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-[0_10px_25px_rgba(0,0,0,0.06)] dark:shadow-none text-left hover:border-emerald-400 transition-colors">
          <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <LayoutTemplate className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold text-xs text-neutral-950 dark:text-white group-hover/callout:text-emerald-600 transition-colors">
              Beautiful Templates
            </div>
            <div className="text-[10px] text-neutral-400 dark:text-neutral-500">Notes, docs, resumes &amp; more.</div>
          </div>
        </div>
      </div>

      {/* Curved SVG Arrow 3: Beautiful Templates -> Bottom of Sidebar */}
      <svg 
        className="absolute bottom-8 left-48 sm:left-56 w-11 h-8 text-neutral-400 dark:text-neutral-500 pointer-events-none z-20 hidden sm:block" 
        viewBox="0 0 50 35" 
        fill="none"
      >
        <path 
          d="M 5 18 C 18 28, 30 24, 40 8" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
        />
        <path 
          d="M 33 10 L 40 8 L 38 16" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>

      {/* 5. Bottom-Right Floating Card: Export Anywhere (Static, NO bounce) */}
      <div 
        onClick={onOpenEditor}
        className="absolute bottom-1 right-0 sm:right-4 z-30 cursor-pointer group/callout"
      >
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-[0_10px_25px_rgba(0,0,0,0.06)] dark:shadow-none text-left hover:border-purple-400 transition-colors">
          <div className="w-7 h-7 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <UploadCloud className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold text-xs text-neutral-950 dark:text-white group-hover/callout:text-purple-600 transition-colors">
              Export Anywhere
            </div>
            <div className="text-[10px] text-neutral-400 dark:text-neutral-500">PDF, HTML, DOCX and more.</div>
          </div>
        </div>
      </div>

      {/* Curved SVG Arrow 4: Export Anywhere -> Bottom of Preview List */}
      <svg 
        className="absolute bottom-10 right-48 sm:right-56 w-10 h-10 text-neutral-400 dark:text-neutral-500 pointer-events-none z-20 hidden sm:block" 
        viewBox="0 0 45 45" 
        fill="none"
      >
        <path 
          d="M 36 34 C 24 22, 16 14, 6 6" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
        />
        <path 
          d="M 15 5 L 6 6 L 7 15" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>

    </div>
  );
};
