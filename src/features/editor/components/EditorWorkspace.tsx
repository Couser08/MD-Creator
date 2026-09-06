import React from 'react';
import { Columns, Sparkles, Minimize2 } from 'lucide-react';
import { ViewMode } from '../types';
import { SlashCommandMenu } from '../../../components/editor/SlashCommandMenu';
import { MarkdownPreview } from '../../../components/editor/MarkdownPreview';
import { EditorWritingFx } from '../../../components/editor/EditorWritingFx';

interface EditorWorkspaceProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  content: string;
  lineCount: number;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onTextareaKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onCursorEvent: () => void;
  isSlashMenuOpen: boolean;
  setIsSlashMenuOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  slashSelectedIndex: number;
  slashQuery: string;
  onInsertSnippet: (snippet: string) => void;
  onToggleTask: (taskIndex: number, currentChecked: boolean) => void;
}

export const EditorWorkspace: React.FC<EditorWorkspaceProps> = React.memo(({
  viewMode,
  setViewMode,
  content,
  lineCount,
  textareaRef,
  onContentChange,
  onTextareaKeyDown,
  onCursorEvent,
  isSlashMenuOpen,
  setIsSlashMenuOpen,
  slashSelectedIndex,
  slashQuery,
  onInsertSnippet,
  onToggleTask,
}) => {
  return (
    <>
      {/* Floating Exit Zen Mode Button */}
      {viewMode === 'zen' && (
        <div className="fixed top-3 right-5 z-50 animate-in fade-in slide-in-from-top-1 duration-200 no-print">
          <button
            onClick={() => setViewMode('split')}
            className="px-3 py-1.5 rounded-full bg-neutral-900/85 hover:bg-neutral-900 text-white dark:bg-neutral-100/90 dark:hover:bg-white dark:text-neutral-950 text-xs font-semibold backdrop-blur-md shadow-lg flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 select-none ring-1 ring-black/10 dark:ring-white/20"
            title="Exit Zen Mode (or press Esc)"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>
              Exit Zen <kbd className="font-mono text-[10px] bg-white/20 dark:bg-black/15 px-1 py-0.2 rounded ml-0.5">Esc</kbd>
            </span>
          </button>
        </div>
      )}

      {/* Main Split / Single Pane Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Pane: Editor */}
        {(viewMode === 'split' || viewMode === 'write' || viewMode === 'zen') && (
          <div
            className={`editor-pane-container flex flex-col h-full bg-neutral-50/70 dark:bg-[#18181c] text-neutral-800 dark:text-neutral-200 transition-colors ${
              viewMode === 'split' ? 'w-full md:w-1/2 border-r border-neutral-200 dark:border-neutral-800' : 'w-full'
            }`}
          >
            {/* Editor Sub-header Bar */}
            <div className="px-4 py-2 bg-neutral-100/80 dark:bg-[#1e1e24] border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 select-none no-print transition-colors">
              <span className="flex items-center gap-1.5 font-medium text-neutral-700 dark:text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                <span>Raw Markdown</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSlashMenuOpen((prev) => !prev)}
                  className="px-2 py-0.5 rounded bg-amber-50 dark:bg-neutral-800 hover:bg-amber-100 dark:hover:bg-neutral-700 text-amber-800 dark:text-amber-300 border border-amber-200/70 dark:border-transparent font-mono text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-300" />
                  <span>Type / for Blocks</span>
                </button>
              </div>
            </div>

            {/* Textarea Area with Gutter Line Numbers */}
            <div
              className={`flex-1 flex overflow-hidden relative ${
                viewMode === 'write' || viewMode === 'zen' ? 'max-w-4xl mx-auto w-full' : ''
              }`}
            >
              {/* Line Numbers Gutter */}
              <div className="hidden sm:block select-none py-6 pl-4 pr-3 text-right font-mono-code text-xs text-neutral-400 dark:text-neutral-600 space-y-0.5 overflow-hidden">
                {Array.from({ length: Math.max(lineCount, 25) }, (_, i) => (
                  <div key={i + 1} className="leading-relaxed">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Markdown Input Area */}
              <textarea
                ref={textareaRef}
                value={content}
                onChange={onContentChange}
                onKeyDown={onTextareaKeyDown}
                onKeyUp={onCursorEvent}
                onClick={onCursorEvent}
                placeholder="Start writing here... (Type / for shortcuts)"
                className="flex-1 w-full p-6 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 font-mono-code text-sm resize-none focus:outline-none leading-relaxed overflow-y-auto"
                autoFocus
              />

              {/* Slash Command Palette */}
              <SlashCommandMenu
                isOpen={isSlashMenuOpen}
                selectedIndex={slashSelectedIndex}
                searchQuery={slashQuery}
                onSelect={onInsertSnippet}
              />
            </div>
          </div>
        )}

        {/* Right Pane: Live Rendered Preview */}
        {(viewMode === 'split' || viewMode === 'read') && (
          <div
            className={`preview-pane-container flex flex-col h-full bg-white dark:bg-neutral-950 overflow-y-auto transition-all ${
              viewMode === 'split' ? 'hidden md:flex md:w-1/2' : 'w-full'
            }`}
          >
            {/* Preview Sub-header */}
            <div className="px-5 py-2 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 flex items-center justify-between text-xs text-neutral-500 select-none no-print">
              <span className="flex items-center gap-1.5 font-semibold text-neutral-700 dark:text-neutral-300">
                <Columns className="w-3.5 h-3.5" />
                Live Rendered Preview
              </span>
              <span className="text-[11px] text-neutral-400">
                GFM + KaTeX Math + Highlights
              </span>
            </div>

            {/* Rendered Preview Document */}
            <div
              className={`flex-1 p-8 sm:p-10 ${
                viewMode === 'read' ? 'max-w-3xl mx-auto w-full' : ''
              }`}
            >
              <MarkdownPreview 
                content={content} 
                onToggleTask={onToggleTask} 
              />
            </div>
          </div>
        )}
      </div>

      {/* 60FPS Hardware-Accelerated Editor Typing FX Overlay */}
      <EditorWritingFx textareaRef={textareaRef} />
    </>
  );
});

EditorWorkspace.displayName = 'EditorWorkspace';
