import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sun, 
  Moon, 
  Download, 
  Save, 
  Columns, 
  PenTool,
  Eye,
  Maximize2,
  Minimize2,
  FileText, 
  CheckCircle2,
  Info,
  ChevronDown,
  Sparkles,
  Copy,
  FolderOpen,
  Table2,
  Timer,
  Play,
  Pause,
  RotateCcw,
  AlignCenterVertical,
  Trash2,
  FileX,
  ListTree
} from 'lucide-react';
import { useThemeStore } from '../stores/useThemeStore';
import { db, saveDocument, getDocumentContent, createNewDocument, DocumentMetadata } from '../db';
import { MarkdownPreview } from '../components/editor/MarkdownPreview';
import { SlashCommandMenu, COMMANDS } from '../components/editor/SlashCommandMenu';
import { DocumentDrawer } from '../components/editor/DocumentDrawer';
import { DocumentSwitcherModal } from '../components/editor/DocumentSwitcherModal';
import { ExportPdfModal } from '../components/editor/ExportPdfModal';
import { TableBuilderModal } from '../components/editor/TableBuilderModal';
import { WritingFxPopover } from '../components/editor/WritingFxPopover';
import { EditorWritingFx } from '../components/editor/EditorWritingFx';
import { DocumentOutlineDrawer, HeadingItem } from '../components/editor/DocumentOutlineDrawer';
import { ProductUpdatesModal } from '../components/home/ProductUpdatesModal';
import { syncDocumentToSupabase, isSupabaseConfigured } from '../lib/supabase';
import { useConfirm } from '../stores/useConfirmStore';

type ViewMode = 'split' | 'write' | 'read' | 'zen';

export const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();
  const confirm = useConfirm();

  const [docId, setDocId] = useState<string>(id || 'doc-getting-started');
  const [docMetadata, setDocMetadata] = useState<DocumentMetadata | null>(null);
  const [title, setTitle] = useState('Getting Started.md');
  const [content, setContent] = useState('');
  
  // UI States
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [isSaved, setIsSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isSlashMenuOpen, setIsSlashMenuOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [slashSelectedIndex, setSlashSelectedIndex] = useState(0);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [copyToast, setCopyToast] = useState<string | null>(null);

  // Free & Pro Features: PDF Studio, Table Builder, Typewriter, Sprint Timer
  const [isPdfStudioOpen, setIsPdfStudioOpen] = useState(false);
  const [isTableBuilderOpen, setIsTableBuilderOpen] = useState(false);
  const [isTypewriterMode, setIsTypewriterMode] = useState(false);
  const [isFxPopoverOpen, setIsFxPopoverOpen] = useState(false);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [isUpdatesOpen, setIsUpdatesOpen] = useState(false);

  // Focus Sprint Timer
  const [isSprintActive, setIsSprintActive] = useState(false);
  const [sprintDuration, setSprintDuration] = useState(25); // minutes
  const [sprintSecondsRemaining, setSprintSecondsRemaining] = useState(25 * 60);
  const [sprintStartWordCount, setSprintStartWordCount] = useState(0);
  const [isSprintPopoverOpen, setIsSprintPopoverOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load document from Dexie on mount or ID change
  useEffect(() => {
    let isMounted = true;
    async function load() {
      let targetId = id;
      if (!targetId) {
        const firstDoc = await db.documents.toCollection().first();
        if (firstDoc) {
          targetId = firstDoc.id;
        } else {
          targetId = await createNewDocument('Getting Started.md');
        }
      }

      const meta = await db.documents.get(targetId);
      const text = await getDocumentContent(targetId);

      if (isMounted) {
        setDocId(targetId);
        setDocMetadata(meta || null);
        setTitle(meta?.title || 'Untitled.md');
        setContent(text);
        setIsSaved(true);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [id]);

  // Global Keyboard Shortcuts (Ctrl+O for File Switcher, Ctrl+S for Save, Esc to exit Zen Mode)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setIsSwitcherOpen(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        executeSave(content, title);
      }
      if (e.key === 'Escape' && viewMode === 'zen' && !isSlashMenuOpen && !isSwitcherOpen && !isDrawerOpen && !isExportMenuOpen) {
        setViewMode('split');
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [content, title, viewMode, isSlashMenuOpen, isSwitcherOpen, isDrawerOpen, isExportMenuOpen]);

  // Reset slash selection when query changes
  useEffect(() => {
    setSlashSelectedIndex(0);
  }, [slashQuery]);


  // Track cursor position & apply Typewriter scrolling
  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    const text = textareaRef.current.value.substring(0, textareaRef.current.selectionStart);
    const lines = text.split('\n');
    const currentLine = lines.length;
    setCursorPos({
      line: currentLine,
      col: lines[lines.length - 1].length + 1
    });

    if (isTypewriterMode) {
      const lineHeight = 24;
      const targetScroll = (currentLine - 1) * lineHeight - (textareaRef.current.clientHeight / 2) + lineHeight;
      textareaRef.current.scrollTop = Math.max(0, targetScroll);
    }
  };

  // Perform Save to Dexie and background Supabase
  const executeSave = useCallback(async (newContent: string, newTitle: string) => {
    setIsSaving(true);
    await saveDocument(docId, newTitle, newContent, docMetadata?.tags);
    const updatedMeta = await db.documents.get(docId);
    if (updatedMeta) {
      setDocMetadata(updatedMeta);
      if (isSupabaseConfigured()) {
        syncDocumentToSupabase(updatedMeta, newContent).catch(console.warn);
      }
    }
    setIsSaving(false);
    setIsSaved(true);
  }, [docId, docMetadata?.tags]);

  // Sprint Timer countdown & word delta tracking
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isSprintActive) {
      interval = setInterval(() => {
        setSprintSecondsRemaining(prev => {
          if (prev <= 1) {
            setIsSprintActive(false);
            const wordsWritten = Math.max(0, (content.trim() ? content.trim().split(/\s+/).length : 0) - sprintStartWordCount);
            setCopyToast(`🎉 Focus Sprint Completed! You wrote ${wordsWritten} words!`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSprintActive, content, sprintStartWordCount]);

  const handleStartSprint = (minutes?: number) => {
    const mins = minutes || sprintDuration;
    const currentWords = content.trim() ? content.trim().split(/\s+/).length : 0;
    setSprintDuration(mins);
    setSprintSecondsRemaining(mins * 60);
    setSprintStartWordCount(currentWords);
    setIsSprintActive(true);
    setIsSprintPopoverOpen(false);
  };

  const handlePauseSprint = () => {
    setIsSprintActive(false);
  };

  const handleResetSprint = () => {
    setIsSprintActive(false);
    setSprintSecondsRemaining(sprintDuration * 60);
  };

  const formatSprintTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Insert Table from Table Builder modal
  const handleInsertTableFromModal = (tableMarkdown: string) => {
    if (!textareaRef.current) {
      const next = content + '\n\n' + tableMarkdown;
      setContent(next);
      executeSave(next, title);
      return;
    }
    const cursor = textareaRef.current.selectionStart;
    const before = content.substring(0, cursor);
    const after = content.substring(cursor);
    const next = before + '\n\n' + tableMarkdown + '\n' + after;
    setContent(next);
    setIsSaved(false);
    executeSave(next, title);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 50);
  };

  // Jump to heading line from Document Outline
  const handleSelectHeading = (heading: HeadingItem) => {
    if (!textareaRef.current) return;
    const lineHeight = 24;
    textareaRef.current.scrollTop = Math.max(0, heading.lineIndex * lineHeight - 60);
    const lines = content.split('\n');
    let charOffset = 0;
    for (let i = 0; i < heading.lineIndex; i++) {
      charOffset += lines[i].length + 1;
    }
    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(charOffset, charOffset + (lines[heading.lineIndex]?.length || 0));
    updateCursorPosition();
  };

  // Handle content changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    setIsSaved(false);
    updateCursorPosition();

    // Slash trigger check
    const cursor = e.target.selectionStart;
    const textBeforeCursor = val.substring(0, cursor);
    const lastSlashIndex = textBeforeCursor.lastIndexOf('/');

    if (lastSlashIndex !== -1) {
      const charBeforeSlash = lastSlashIndex > 0 ? textBeforeCursor[lastSlashIndex - 1] : '\n';
      const textAfterSlash = textBeforeCursor.substring(lastSlashIndex + 1);

      if ((charBeforeSlash === '\n' || charBeforeSlash === ' ') && !textAfterSlash.includes(' ') && !textAfterSlash.includes('\n')) {
        setIsSlashMenuOpen(true);
        setSlashQuery(textAfterSlash);
        return;
      }
    }

    setIsSlashMenuOpen(false);
    setSlashQuery('');

    // Auto-save debounced (1.5 seconds)
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      executeSave(val, title);
    }, 1500);
  };

  // Filtered commands list
  const filteredCommands = COMMANDS.filter(cmd => 
    cmd.title.toLowerCase().includes(slashQuery.toLowerCase()) ||
    cmd.description.toLowerCase().includes(slashQuery.toLowerCase()) ||
    cmd.shortcut.toLowerCase().includes(slashQuery.toLowerCase())
  );

  // Insert slash command snippet at cursor
  const handleInsertSnippet = (snippet: string) => {
    if (!textareaRef.current) return;
    const cursor = textareaRef.current.selectionStart;
    const textBeforeCursor = content.substring(0, cursor);
    const afterCursor = content.substring(cursor);

    const lastSlashIndex = textBeforeCursor.lastIndexOf('/');
    const cleanBefore = lastSlashIndex !== -1 ? textBeforeCursor.substring(0, lastSlashIndex) : textBeforeCursor;

    if (snippet === '__ACTION_OPEN_TABLE_BUILDER__') {
      setContent(cleanBefore + afterCursor);
      setIsSlashMenuOpen(false);
      setSlashQuery('');
      setIsTableBuilderOpen(true);
      return;
    }

    const nextContent = cleanBefore + snippet + afterCursor;
    setContent(nextContent);
    setIsSlashMenuOpen(false);
    setSlashQuery('');
    setSlashSelectedIndex(0);
    setIsSaved(false);

    // Re-focus and update cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPos = cleanBefore.length + snippet.length;
        textareaRef.current.setSelectionRange(newPos, newPos);
        updateCursorPosition();
      }
    }, 20);

    executeSave(nextContent, title);
  };

  // Textarea KeyDown handler for arrow-key navigation in slash palette
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isSlashMenuOpen && filteredCommands.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSlashSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSlashSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        const selected = filteredCommands[slashSelectedIndex % filteredCommands.length];
        if (selected) {
          handleInsertSnippet(selected.insertSnippet);
        }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsSlashMenuOpen(false);
        setSlashQuery('');
        return;
      }
    }
  };

  // Toggle interactive checklist item in markdown by task index
  const handleToggleTask = (taskIndex: number, _currentChecked: boolean) => {
    let counter = 0;
    const taskRegex = /^(\s*[-*+]\s*\[)([ xX])(\]\s.*)$/gm;

    const nextContent = content.replace(taskRegex, (match, prefix, checkChar, suffix) => {
      if (counter === taskIndex) {
        counter++;
        const nextChar = checkChar.trim().toLowerCase() === 'x' ? ' ' : 'x';
        return `${prefix}${nextChar}${suffix}`;
      }
      counter++;
      return match;
    });

    setContent(nextContent);
    setIsSaved(false);
    executeSave(nextContent, title);
  };


  // Update tags from drawer
  const handleUpdateTags = async (newTags: string[]) => {
    if (!docMetadata) return;
    await db.documents.update(docId, { tags: newTags });
    setDocMetadata({ ...docMetadata, tags: newTags });
  };

  // Export functions
  const handleExportMd = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = title.endsWith('.md') ? title : `${title}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setIsExportMenuOpen(false);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(content);
    setCopyToast('Copied Markdown!');
    setIsExportMenuOpen(false);
    setTimeout(() => setCopyToast(null), 2000);
  };

  const handleDeleteCurrentDoc = async () => {
    setIsDrawerOpen(false);
    setIsExportMenuOpen(false);
    const ok = await confirm({
      title: 'Delete Current Document',
      message: (
        <span>
          Are you sure you want to permanently delete <strong className="text-neutral-900 dark:text-white">"{title}"</strong>?
        </span>
      ),
      description: 'This document and its local revisions will be erased from your IndexedDB storage.',
      confirmText: 'Delete Document',
      cancelText: 'Keep Document',
      variant: 'danger',
      icon: 'trash'
    });

    if (ok) {
      await db.documents.delete(docId);
      await db.document_cache.delete(docId);
      navigate('/documents');
    }
  };

  const handleClearContent = async () => {
    setIsDrawerOpen(false);
    setIsExportMenuOpen(false);
    const ok = await confirm({
      title: 'Clear Document Content',
      message: (
        <span>
          Are you sure you want to clear all text in <strong className="text-neutral-900 dark:text-white">"{title}"</strong>?
        </span>
      ),
      description: 'The editor textarea will be emptied immediately and auto-saved to IndexedDB.',
      confirmText: 'Clear Content',
      cancelText: 'Keep My Writing',
      variant: 'warning',
      icon: 'clear'
    });

    if (ok) {
      setContent('');
      setIsSaved(false);
      executeSave('', title);
      setCopyToast('Document content cleared');
      setTimeout(() => setCopyToast(null), 1500);
    }
  };

  // Calculations for status bar
  const lineCount = content.split('\n').length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className={`min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors ${
      viewMode === 'zen' ? 'fixed inset-0 z-50 overflow-hidden' : ''
    }`}>
      
      {/* Toast Notification */}
      {copyToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 px-4 py-2 rounded-xl text-xs font-semibold shadow-xl flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-150 no-print">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{copyToast}</span>
        </div>
      )}

      {/* Floating Exit Zen Mode Button */}
      {viewMode === 'zen' && (
        <div className="fixed top-3 right-5 z-50 animate-in fade-in slide-in-from-top-1 duration-200 no-print">
          <button
            onClick={() => setViewMode('split')}
            className="px-3 py-1.5 rounded-full bg-neutral-900/85 hover:bg-neutral-900 text-white dark:bg-neutral-100/90 dark:hover:bg-white dark:text-neutral-950 text-xs font-semibold backdrop-blur-md shadow-lg flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 select-none ring-1 ring-black/10 dark:ring-white/20"
            title="Exit Zen Mode (or press Esc)"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Exit Zen <kbd className="font-mono text-[10px] bg-white/20 dark:bg-black/15 px-1 py-0.2 rounded ml-0.5">Esc</kbd></span>
          </button>
        </div>
      )}


      {/* Editor Top Navigation Bar */}
      <header className={`h-14 border-b border-neutral-200 dark:border-neutral-800 px-4 flex items-center justify-between bg-white dark:bg-neutral-900 select-none z-30 transition-all no-print ${
        viewMode === 'zen' ? 'opacity-0 hover:opacity-100 duration-200' : ''
      }`}>
        
        {/* Left: Back + Open File Button + Title + Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
            title="Back to Home"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <button
            onClick={() => setIsSwitcherOpen(true)}
            className="px-2 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1 cursor-pointer"
            title="Switch Document (Ctrl+O)"
          >
            <FolderOpen className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden md:inline">Open...</span>
          </button>

          <button
            onClick={() => setIsOutlineOpen(true)}
            className="px-2 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1 cursor-pointer"
            title="Document Outline / Table of Contents"
          >
            <ListTree className="w-3.5 h-3.5 text-purple-500" />
            <span className="hidden md:inline">Outline</span>
          </button>

          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800"></div>

          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setIsSaved(false);
              }}
              onBlur={() => executeSave(content, title)}
              className="bg-transparent font-bold text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 rounded px-1.5 py-0.5 max-w-[150px] sm:max-w-xs truncate"
            />
          </div>

          {/* Status Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs">
            {isSaving ? (
              <span className="text-amber-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                Saving...
              </span>
            ) : isSaved ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved</span>
              </span>
            ) : (
              <span className="text-neutral-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Unsaved changes
              </span>
            )}
          </div>
        </div>

        {/* Center: View Mode Segmented Control */}
        <div className="hidden sm:flex items-center bg-neutral-100 dark:bg-neutral-800/80 p-1 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-700/60">
          <button
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'split' ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-2xs font-semibold' : 'hover:text-neutral-900 dark:hover:text-white'
            }`}
            title="Split Mode (Editor + Live Preview)"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split</span>
          </button>
          <button
            onClick={() => setViewMode('write')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'write' ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-2xs font-semibold' : 'hover:text-neutral-900 dark:hover:text-white'
            }`}
            title="Write Mode (Distraction-Free Editor)"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Write</span>
          </button>
          <button
            onClick={() => setViewMode('read')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'read' ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-2xs font-semibold' : 'hover:text-neutral-900 dark:hover:text-white'
            }`}
            title="Read Mode (Rendered Preview Only)"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Read</span>
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'zen' ? 'split' : 'zen')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'zen' ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-2xs font-semibold' : 'hover:text-neutral-900 dark:hover:text-white'
            }`}
            title="Zen Fullscreen Mode"
          >
            {viewMode === 'zen' ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>Zen</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Manual Save Button */}
          <button
            onClick={() => executeSave(content, title)}
            disabled={isSaved}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isSaved
                ? 'text-neutral-400 bg-neutral-100 dark:bg-neutral-800'
                : 'text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 shadow-2xs'
            }`}
            title="Save immediately (Ctrl+S)"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Visual Table Builder Button */}
          <button
            onClick={() => setIsTableBuilderOpen(true)}
            className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Visual Table Builder (or type /table)"
          >
            <Table2 className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">Table</span>
          </button>

          {/* Writing FX & Cursor Studio Trigger */}
          <button
            onClick={() => setIsFxPopoverOpen(!isFxPopoverOpen)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all ${
              isFxPopoverOpen
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-transparent shadow-md scale-102'
                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200'
            }`}
            title="Writing FX & Cursor Studio (Custom Cursors, Typing Effects)"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Effects</span>
          </button>

          {/* Export Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100 space-y-0.5">
                <button
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    setIsPdfStudioOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2.5 text-neutral-700 dark:text-neutral-300 cursor-pointer bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/30"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <div>
                    <div className="font-bold text-neutral-950 dark:text-white flex items-center gap-1.5">
                      <span>PDF Export Studio</span>
                      <span className="text-[9px] bg-indigo-600 text-white dark:bg-indigo-500 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">NEW</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Custom themes, cover & TOC</div>
                  </div>
                </button>

                <div className="border-t border-neutral-100 dark:border-neutral-800 my-1"></div>

                <button
                  onClick={handleExportMd}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Download .md</span>
                </button>
                <button
                  onClick={handleCopyMarkdown}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Copy Markdown</span>
                </button>

                <div className="border-t border-neutral-100 dark:border-neutral-800 my-1"></div>

                <button
                  onClick={handleClearContent}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2 text-amber-600 dark:text-amber-400 cursor-pointer"
                >
                  <FileX className="w-3.5 h-3.5" />
                  <span>Clear Content...</span>
                </button>

                <button
                  onClick={handleDeleteCurrentDoc}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 text-red-600 dark:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Document...</span>
                </button>
              </div>
            )}
          </div>

          {/* Document Insights / Drawer Trigger */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer relative"
            title="Document details & tags"
          >
            <Info className="w-4 h-4" />
            {docMetadata?.tags?.length ? (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            ) : null}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
          </button>
        </div>

      </header>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Pane: Editor */}
        {(viewMode === 'split' || viewMode === 'write' || viewMode === 'zen') && (
          <div className={`editor-pane-container flex flex-col h-full bg-neutral-50/70 dark:bg-[#18181c] text-neutral-800 dark:text-neutral-200 transition-colors ${
            viewMode === 'split' ? 'w-full md:w-1/2 border-r border-neutral-200 dark:border-neutral-800' : 'w-full'
          }`}>
            
            {/* Editor Sub-header Bar */}
            <div className="px-4 py-2 bg-neutral-100/80 dark:bg-[#1e1e24] border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 select-none no-print transition-colors">
              <span className="flex items-center gap-1.5 font-medium text-neutral-700 dark:text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
                <span>Raw Markdown</span>
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSlashMenuOpen(!isSlashMenuOpen)}
                  className="px-2 py-0.5 rounded bg-amber-50 dark:bg-neutral-800 hover:bg-amber-100 dark:hover:bg-neutral-700 text-amber-800 dark:text-amber-300 border border-amber-200/70 dark:border-transparent font-mono text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-300" />
                  <span>Type / for Blocks</span>
                </button>
              </div>
            </div>

            {/* Textarea Area with Gutter Line Numbers */}
            <div className={`flex-1 flex overflow-hidden relative ${
              viewMode === 'write' || viewMode === 'zen' ? 'max-w-4xl mx-auto w-full' : ''
            }`}>
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
                onChange={handleContentChange}
                onKeyDown={handleTextareaKeyDown}
                onKeyUp={updateCursorPosition}
                onClick={updateCursorPosition}
                placeholder="Start writing here... (Type / for shortcuts)"
                className="flex-1 w-full p-6 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 font-mono-code text-sm resize-none focus:outline-none leading-relaxed overflow-y-auto"
                autoFocus
              />

              {/* Slash Command Palette */}
              <SlashCommandMenu
                isOpen={isSlashMenuOpen}
                selectedIndex={slashSelectedIndex}
                searchQuery={slashQuery}
                onSelect={handleInsertSnippet}
              />
            </div>

          </div>
        )}

        {/* Right Pane: Live Rendered Preview */}
        {(viewMode === 'split' || viewMode === 'read') && (
          <div className={`preview-pane-container flex flex-col h-full bg-white dark:bg-neutral-950 overflow-y-auto transition-all ${
            viewMode === 'split' ? 'hidden md:flex md:w-1/2' : 'w-full'
          }`}>
            
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
            <div className={`flex-1 p-8 sm:p-10 ${
              viewMode === 'read' ? 'max-w-3xl mx-auto w-full' : ''
            }`}>
              <MarkdownPreview 
                content={content} 
                onToggleTask={handleToggleTask} 
              />
            </div>

          </div>
        )}

      </div>

      {/* Editor Status Bar (Bottom) */}
      <footer className={`editor-status-bar h-8 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/90 px-4 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 select-none z-30 transition-all duration-200 no-print ${
        viewMode === 'zen' ? 'opacity-0 hover:opacity-100' : ''
      }`}>
        
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
            onClick={() => {
              const next = !isTypewriterMode;
              setIsTypewriterMode(next);
              setCopyToast(next ? 'Typewriter Mode Activated' : 'Typewriter Mode Off');
              setTimeout(() => setCopyToast(null), 1500);
            }}
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
              onClick={() => setIsSprintPopoverOpen(!isSprintPopoverOpen)}
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
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex items-center justify-between gap-1 text-[10px]">
                  {[15, 25, 45].map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => handleStartSprint(mins)}
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
                      onClick={() => handleStartSprint()}
                      className="flex-1 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center justify-center gap-1 cursor-pointer text-[11px]"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Start Sprint</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePauseSprint}
                      className="flex-1 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold flex items-center justify-center gap-1 cursor-pointer text-[11px]"
                    >
                      <Pause className="w-3 h-3 fill-current" />
                      <span>Pause</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleResetSprint}
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
            onClick={() => setIsUpdatesOpen(true)}
            className="hover:text-neutral-900 dark:hover:text-white cursor-pointer transition-colors flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/20"
            title="What's New & Release Timeline (v2.5)"
          >
            <Sparkles className="w-3 h-3" />
            <span>v2.5 Updates</span>
          </button>
          <span className="text-neutral-300 dark:text-neutral-700">|</span>
          <button
            onClick={() => setIsSwitcherOpen(true)}
            className="hover:text-neutral-900 dark:hover:text-white cursor-pointer transition-colors flex items-center gap-1"
          >
            <FolderOpen className="w-3 h-3" />
            <span>Files (Ctrl+O)</span>
          </button>
          <span className="text-neutral-300 dark:text-neutral-700">|</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {isSupabaseConfigured() ? '⚡ Dexie + ☁️ Supabase' : '⚡ Dexie Offline Cache'}
            </span>
          </div>
        </div>

      </footer>

      {/* Document Drawer */}
      <DocumentDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        metadata={docMetadata}
        onUpdateTags={handleUpdateTags}
        wordCount={wordCount}
        charCount={charCount}
        lineCount={lineCount}
        onDeleteDocument={handleDeleteCurrentDoc}
        onClearContent={handleClearContent}
      />

      {/* Document Switcher Modal */}
      <DocumentSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
        currentDocId={docId}
      />

      {/* Ground-Up Modern PDF Export Studio Modal */}
      <ExportPdfModal
        isOpen={isPdfStudioOpen}
        onClose={() => setIsPdfStudioOpen(false)}
        documentTitle={title}
        documentContent={content}
      />

      {/* Visual Table Builder Modal */}
      <TableBuilderModal
        isOpen={isTableBuilderOpen}
        onClose={() => setIsTableBuilderOpen(false)}
        onInsert={handleInsertTableFromModal}
      />

      {/* Writing FX & Custom Cursor Studio Popover */}
      <WritingFxPopover
        isOpen={isFxPopoverOpen}
        onClose={() => setIsFxPopoverOpen(false)}
      />

      {/* 60FPS Hardware-Accelerated Editor Typing FX Overlay */}
      <EditorWritingFx textareaRef={textareaRef} />

      {/* Interactive Document Outline / TOC Drawer */}
      <DocumentOutlineDrawer
        isOpen={isOutlineOpen}
        onClose={() => setIsOutlineOpen(false)}
        content={content}
        onSelectHeading={handleSelectHeading}
      />

      {/* Crafted-With-Love Product Updates & Release Timeline Modal */}
      <ProductUpdatesModal
        isOpen={isUpdatesOpen}
        onClose={() => setIsUpdatesOpen(false)}
      />

    </div>
  );
};
