import { useState, useEffect, useCallback, useMemo } from 'react';
import { COMMANDS } from '../../../components/editor/SlashCommandMenu';

interface UseSlashCommandsOptions {
  content: string;
  setContent: (val: string) => void;
  executeSave: (content: string, title: string) => void;
  title: string;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  updateCursorPosition: () => void;
  onOpenTableBuilder: () => void;
  onOpenTemplates: () => void;
  onOpenMathStudio: () => void;
  onOpenImageModal?: () => void;
  onExportMd?: () => void;
  onOpenPdfStudio?: () => void;
}

export function useSlashCommands({
  content,
  setContent,
  executeSave,
  title,
  textareaRef,
  updateCursorPosition,
  onOpenTableBuilder,
  onOpenTemplates,
  onOpenMathStudio,
  onOpenImageModal,
  onExportMd,
  onOpenPdfStudio,
}: UseSlashCommandsOptions) {
  const [isSlashMenuOpen, setIsSlashMenuOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [slashSelectedIndex, setSlashSelectedIndex] = useState(0);

  // Reset slash selection when query changes
  useEffect(() => {
    setSlashSelectedIndex(0);
  }, [slashQuery]);

  // Filtered commands list
  const filteredCommands = useMemo(() => {
    return COMMANDS.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(slashQuery.toLowerCase()) ||
        cmd.description.toLowerCase().includes(slashQuery.toLowerCase()) ||
        cmd.shortcut.toLowerCase().includes(slashQuery.toLowerCase())
    );
  }, [slashQuery]);

  // Insert slash command snippet at cursor
  const handleInsertSnippet = useCallback(
    (snippet: string) => {
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
        onOpenTableBuilder();
        return;
      }

      if (snippet === '__ACTION_OPEN_TEMPLATES__') {
        setContent(cleanBefore + afterCursor);
        setIsSlashMenuOpen(false);
        setSlashQuery('');
        onOpenTemplates();
        return;
      }

      if (snippet === '__ACTION_OPEN_MATH_STUDIO__') {
        setContent(cleanBefore + afterCursor);
        setIsSlashMenuOpen(false);
        setSlashQuery('');
        onOpenMathStudio();
        return;
      }

      if (snippet === '__ACTION_OPEN_IMAGE_MODAL__') {
        setContent(cleanBefore + afterCursor);
        setIsSlashMenuOpen(false);
        setSlashQuery('');
        onOpenImageModal?.();
        return;
      }

      if (snippet === '__ACTION_EXPORT_MD__') {
        setContent(cleanBefore + afterCursor);
        setIsSlashMenuOpen(false);
        setSlashQuery('');
        onExportMd?.();
        return;
      }

      if (snippet === '__ACTION_OPEN_PDF_STUDIO__') {
        setContent(cleanBefore + afterCursor);
        setIsSlashMenuOpen(false);
        setSlashQuery('');
        onOpenPdfStudio?.();
        return;
      }

      if (snippet === '__ACTION_INSERT_FRONTMATTER__') {
        const todayStr = new Date().toISOString().slice(0, 10);
        const yamlBlock = `---\ntitle: "${title || 'Untitled Document'}"\ndate: ${todayStr}\nauthor: "Author Name"\ntags: ["documentation", "guide"]\ndraft: false\n---\n\n`;
        
        let nextContent = '';
        if (content.startsWith('---')) {
          nextContent = cleanBefore + yamlBlock + afterCursor;
        } else {
          const stripped = cleanBefore + afterCursor;
          nextContent = yamlBlock + stripped;
        }

        setContent(nextContent);
        setIsSlashMenuOpen(false);
        setSlashQuery('');
        executeSave(nextContent, title);
        setTimeout(() => {
          if (textareaRef.current) {
            const prevScroll = textareaRef.current.scrollTop;
            textareaRef.current.focus({ preventScroll: true });
            const newPos = yamlBlock.length;
            textareaRef.current.setSelectionRange(newPos, newPos);
            textareaRef.current.scrollTop = prevScroll;
            updateCursorPosition();
          }
        }, 20);
        return;
      }

      const nextContent = cleanBefore + snippet + afterCursor;
      setContent(nextContent);
      setIsSlashMenuOpen(false);
      setSlashQuery('');
      setSlashSelectedIndex(0);

      setTimeout(() => {
        if (textareaRef.current) {
          const prevScroll = textareaRef.current.scrollTop;
          textareaRef.current.focus({ preventScroll: true });
          const newPos = cleanBefore.length + snippet.length;
          textareaRef.current.setSelectionRange(newPos, newPos);
          textareaRef.current.scrollTop = prevScroll;
          updateCursorPosition();
        }
      }, 20);

      executeSave(nextContent, title);
    },
    [content, title, setContent, executeSave, textareaRef, updateCursorPosition, onOpenTableBuilder, onOpenTemplates, onOpenMathStudio, onOpenImageModal]
  );

  // Keyboard navigation inside textarea for slash palette
  const handleTextareaKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (isSlashMenuOpen && filteredCommands.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSlashSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSlashSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
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
    },
    [isSlashMenuOpen, filteredCommands, slashSelectedIndex, handleInsertSnippet]
  );

  // Check cursor position for slash command activation on text change
  const checkSlashTrigger = useCallback((val: string, cursor: number) => {
    const textBeforeCursor = val.substring(0, cursor);
    const lastSlashIndex = textBeforeCursor.lastIndexOf('/');

    if (lastSlashIndex !== -1) {
      const charBeforeSlash = lastSlashIndex > 0 ? textBeforeCursor[lastSlashIndex - 1] : '\n';
      const textAfterSlash = textBeforeCursor.substring(lastSlashIndex + 1);

      if (
        (charBeforeSlash === '\n' || charBeforeSlash === ' ') &&
        !textAfterSlash.includes(' ') &&
        !textAfterSlash.includes('\n')
      ) {
        setIsSlashMenuOpen(true);
        setSlashQuery(textAfterSlash);
        return;
      }
    }

    setIsSlashMenuOpen(false);
    setSlashQuery('');
  }, []);

  return {
    isSlashMenuOpen,
    setIsSlashMenuOpen,
    slashQuery,
    slashSelectedIndex,
    setSlashSelectedIndex,
    filteredCommands,
    handleInsertSnippet,
    handleTextareaKeyDown,
    checkSlashTrigger,
  };
}
