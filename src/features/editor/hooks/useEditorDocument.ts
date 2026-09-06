import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  db, 
  saveDocument, 
  getDocumentContent, 
  createNewDocument, 
  createRevisionSnapshot, 
  DocumentMetadata 
} from '../../../db';
import { syncDocumentToSupabase, isSupabaseConfigured } from '../../../lib/supabase';
import { useConfirm } from '../../../stores/useConfirmStore';
import { MarkdownTemplate } from '../../../data/templates';

interface UseEditorDocumentOptions {
  routeDocId?: string;
  onToast?: (message: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function useEditorDocument({ routeDocId, onToast, textareaRef }: UseEditorDocumentOptions) {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const [docId, setDocId] = useState<string>(routeDocId || 'doc-getting-started');
  const [docMetadata, setDocMetadata] = useState<DocumentMetadata | null>(null);
  const [title, setTitle] = useState('Getting Started.md');
  const [content, setContent] = useState('');
  const [isSaved, setIsSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const snapshotTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSnapshotContentRef = useRef<string>('');

  // Load document from Dexie on mount or ID change
  useEffect(() => {
    let isMounted = true;
    async function load() {
      let targetId = routeDocId;
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
        lastSnapshotContentRef.current = text;
        setIsSaved(true);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [routeDocId]);

  // Execute Save to Dexie and Supabase
  const executeSave = useCallback(
    async (newContent: string, newTitle: string) => {
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
    },
    [docId, docMetadata?.tags]
  );

  // Trigger auto-save debounce (1.5s) and snapshot debounce (30s)
  const queueAutoSave = useCallback(
    (newContent: string, currentTitle: string) => {
      setIsSaved(false);

      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        executeSave(newContent, currentTitle);
      }, 1500);

      if (snapshotTimerRef.current) clearTimeout(snapshotTimerRef.current);
      snapshotTimerRef.current = setTimeout(() => {
        if (newContent !== lastSnapshotContentRef.current && newContent.trim()) {
          lastSnapshotContentRef.current = newContent;
          createRevisionSnapshot(docId, currentTitle, newContent, 'Auto-snapshot');
        }
      }, 30000);
    },
    [docId, executeSave]
  );

  // Toggle interactive task in preview
  const handleToggleTask = useCallback(
    (taskIndex: number, _currentChecked: boolean) => {
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
    },
    [content, title, executeSave]
  );

  // Update tags
  const handleUpdateTags = useCallback(
    async (newTags: string[]) => {
      if (!docMetadata) return;
      await db.documents.update(docId, { tags: newTags });
      setDocMetadata({ ...docMetadata, tags: newTags });
    },
    [docId, docMetadata]
  );

  // Delete document
  const handleDeleteCurrentDoc = useCallback(async () => {
    const ok = await confirm({
      title: 'Delete Current Document',
      message: `Are you sure you want to permanently delete "${title}"?`,
      description: 'This document and its local revisions will be erased from your IndexedDB storage.',
      confirmText: 'Delete Document',
      cancelText: 'Keep Document',
      variant: 'danger',
      icon: 'trash',
    });

    if (ok) {
      await db.documents.delete(docId);
      await db.document_cache.delete(docId);
      navigate('/documents');
    }
  }, [confirm, docId, title, navigate]);

  // Clear content
  const handleClearContent = useCallback(async () => {
    const ok = await confirm({
      title: 'Clear Document Content',
      message: `Are you sure you want to clear all text in "${title}"?`,
      description: 'The editor textarea will be emptied immediately and auto-saved to IndexedDB.',
      confirmText: 'Clear Content',
      cancelText: 'Keep My Writing',
      variant: 'warning',
      icon: 'clear',
    });

    if (ok) {
      setContent('');
      setIsSaved(false);
      executeSave('', title);
      onToast?.('Document content cleared');
    }
  }, [confirm, title, executeSave, onToast]);

  // Restore Revision
  const handleRestoreRevision = useCallback(
    (restoredContent: string) => {
      setContent(restoredContent);
      setIsSaved(false);
      executeSave(restoredContent, title);
      onToast?.('✨ Restored document from checkpoint!');
    },
    [title, executeSave, onToast]
  );

  // Select Template
  const handleSelectTemplate = useCallback(
    (template: MarkdownTemplate, action: 'insert' | 'replace') => {
      if (action === 'replace') {
        if (content.trim()) {
          createRevisionSnapshot(docId, title, content, 'Pre-Template Backup');
        }
        setContent(template.content);
        if (title === 'Getting Started.md' || title === 'Untitled Document' || title === 'Untitled.md') {
          setTitle(template.title);
        }
        setIsSaved(false);
        executeSave(template.content, title);
        onToast?.(`✨ Loaded "${template.title}" template`);
      } else {
        const cursor = textareaRef.current?.selectionStart ?? content.length;
        const before = content.substring(0, cursor);
        const after = content.substring(cursor);
        const sep = before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n';
        const newContent = before + sep + template.content + '\n\n' + after;
        setContent(newContent);
        setIsSaved(false);
        executeSave(newContent, title);
        onToast?.(`✨ Inserted "${template.title}" snippet at cursor`);
      }
    },
    [docId, title, content, textareaRef, executeSave, onToast]
  );

  // Insert Table
  const handleInsertTableFromModal = useCallback(
    (tableMarkdown: string) => {
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
    },
    [content, title, textareaRef, executeSave]
  );

  // Export & Copy Helpers
  const handleExportMd = useCallback(() => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = title.endsWith('.md') ? title : `${title}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [content, title]);

  const handleCopyMarkdown = useCallback(() => {
    navigator.clipboard.writeText(content);
    onToast?.('Copied Markdown!');
  }, [content, onToast]);

  return {
    docId,
    docMetadata,
    title,
    setTitle,
    content,
    setContent,
    isSaved,
    isSaving,
    executeSave,
    queueAutoSave,
    handleToggleTask,
    handleUpdateTags,
    handleDeleteCurrentDoc,
    handleClearContent,
    handleRestoreRevision,
    handleSelectTemplate,
    handleInsertTableFromModal,
    handleExportMd,
    handleCopyMarkdown,
  };
}
