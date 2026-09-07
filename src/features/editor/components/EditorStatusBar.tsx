import React from 'react';
import { 
  AlignCenterVertical, 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  FolderOpen 
} from 'lucide-react';
import { CursorPosition, ViewMode } from '../types';
import { isSupabaseConfigured } from '../../../lib/supabase';

interface EditorStatusBarProps {
  viewMode: ViewMode;
  cursorPos: CursorPosition;
  lineCount: number;
  wordCount: number;
  charCount: number;
  readingTime: number;
  isTypewriterMode: boolean;
  onToggleTypewriter: () => void;
  isSprintActive: boolean;
  sprintDuration: number;
  sprintSecondsRemaining: number;
  sprintStartWordCount: number;
  formatSprintTime: (seconds: number) => string;
  isSprintPopoverOpen: boolean;
  setIsSprintPopoverOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  onStartSprint: (minutes?: number) => void;
  onPauseSprint: () => void;
  onResetSprint: () => void;
  onOpenUpdates: () => void;
  onOpenSwitcher: () => void;
}

export const EditorStatusBar: React.FC<EditorStatusBarProps> = React.memo(({
  viewMode,
  cursorPos,
  lineCount,
  wordCount,
  charCount,
  readingTime,
  isTypewriterMode,
  onToggleTypewriter,
  isSprintActive,
  sprintDuration,
  sprintSecondsRemaining,
  sprintStartWordCount,
  formatSprintTime,
  isSprintPopoverOpen,
  setIsSprintPopoverOpen,
  onStartSprint,
  onPauseSprint,
  onResetSprint,
  onOpenUpdates,
  onOpenSwitcher,
}) => {
  return (
    <footer
      className={`editor-status-bar h-8 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/90 px-4 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 select-none z-30 transition-all duration-200 no-print ${
        viewMode === 'zen' ? 'opacity-0 hover:opacity-100' : ''
      }`}
    >
      {/* Left Stats: Cursor & Document Telemetry */}
      <div className="flex items-center gap-3">
        <span className="font-mono">
          Ln {cursorPos.line}, Col {cursorPos.col}
        </span>
        <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">|</span>
        <span>{lineCount} lines</span>
        <span>{wordCount} words</span>
        <span>{charCount} chars</span>
        <span className="hidden md:inline text-neutral-300 dark:text-neutral-700">|</span>
        <span className="hidden md:inline">~{readingTime} min read</span>
      </div>

      {/* Center Actions: Typewriter Mode & Focus Sprint Timer */}
      <div className="flex items-center gap-2">
        {/* Typewriter Scrolling Toggle */}
        <button
          type="button"
          onClick={onToggleTypewriter}
          className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer text-[10px] font-semibold ${
            isTypewriterMode
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'hover:bg-neutral-200/60 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
          }`}
          title="Typewriter Scrolling: Keeps active writing line centered vertically"
        >
          <AlignCenterVertical className="w-3 h-3" />
          <span className="hidden sm:inline">Typewriter</span>
        </button>

        {/* Focus Sprint Timer Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSprintPopoverOpen((prev) => !prev)}
            className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer text-[10px] font-semibold ${
              isSprintActive
                ? 'bg-amber-500 text-white animate-pulse shadow-2xs'
                : 'hover:bg-neutral-200/60 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
            title="Focus Sprint Timer: 15/25/45 min writing intervals"
          >
            <Timer className="w-3 h-3" />
            <span>
              {formatSprintTime(sprintSecondsRemaining)}
              {isSprintActive && (
                <span className="ml-1 opacity-90">
                  (+{Math.max(0, wordCount - sprintStartWordCount)}w)
                </span>
              )}
            </span>
          </button>

          {/* Sprint Timer Popover */}
          {isSprintPopoverOpen && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-52 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-3 z-50 text-xs space-y-2.5 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-1.5">
                <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 text-xs">
                  <Timer className="w-3.5 h-3.5 text-amber-500" />
                  <span>Focus Sprint</span>
                </span>
                <button
                  onClick={() => setIsSprintPopoverOpen(false)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center justify-between gap-1 text-[10px]">
                {[15, 25, 45].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => onStartSprint(mins)}
                    className={`flex-1 py-1 rounded border text-center font-medium cursor-pointer ${
                      sprintDuration === mins && isSprintActive
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-600 font-bold'
                        : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                {!isSprintActive ? (
                  <button
                    type="button"
                    onClick={() => onStartSprint()}
                    className="flex-1 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center justify-center gap-1 cursor-pointer text-[11px]"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Start Sprint</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onPauseSprint}
                    className="flex-1 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold flex items-center justify-center gap-1 cursor-pointer text-[11px]"
                  >
                    <Pause className="w-3 h-3 fill-current" />
                    <span>Pause</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onResetSprint}
                  className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                  title="Reset Sprint"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Status: Storage & Quick Help */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenUpdates}
          className="hover:text-neutral-900 dark:hover:text-white cursor-pointer transition-colors flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/20"
          title="What's New & Release Timeline (v2.5)"
        >
          <Sparkles className="w-3 h-3" />
          <span>v3.1 Updates</span>
        </button>
        <span className="text-neutral-300 dark:text-neutral-700">|</span>
        <button
          onClick={onOpenSwitcher}
          className="hover:text-neutral-900 dark:hover:text-white cursor-pointer transition-colors flex items-center gap-1"
        >
          <FolderOpen className="w-3 h-3" />
          <span>Files (Ctrl+O)</span>
        </button>
        <span className="text-neutral-300 dark:text-neutral-700">|</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            {isSupabaseConfigured() ? '⚡ Dexie + ☁️ Supabase' : '⚡ Dexie Offline Cache'}
          </span>
        </div>
      </div>
    </footer>
  );
});

EditorStatusBar.displayName = 'EditorStatusBar';
