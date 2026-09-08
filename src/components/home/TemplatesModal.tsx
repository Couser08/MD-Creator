import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  Search, 
  Copy, 
  Check, 
  Layers, 
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MARKDOWN_TEMPLATES, MarkdownTemplate } from '../../data/templates';
import { useCreateDocument } from '../../hooks/useDocuments';
import { MarkdownPreview } from '../editor/MarkdownPreview';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate?: (template: MarkdownTemplate, action: 'insert' | 'replace') => void;
  currentDocTitle?: string;
  hasExistingContent?: boolean;
}

const CATEGORIES = ['All', 'Work', 'Personal', 'Content & Dev'] as const;

export const TemplatesModal: React.FC<TemplatesModalProps> = ({ 
  isOpen, 
  onClose,
  onSelectTemplate,
  hasExistingContent = false
}) => {
  const navigate = useNavigate();
  const createDocMutation = useCreateDocument();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<MarkdownTemplate>(MARKDOWN_TEMPLATES[0]);
  const [activeTemplateForAction, setActiveTemplateForAction] = useState<MarkdownTemplate | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isEditorMode = Boolean(onSelectTemplate);

  const filteredTemplates = MARKDOWN_TEMPLATES.filter((tmpl) => {
    const matchesCat = selectedCategory === 'All' || tmpl.category === selectedCategory;
    const matchesSearch = tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tmpl.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleUseTemplate = async (template: MarkdownTemplate) => {
    if (isEditorMode) {
      if (hasExistingContent) {
        setActiveTemplateForAction(template);
      } else {
        onSelectTemplate!(template, 'replace');
        onClose();
      }
    } else {
      const docId = await createDocMutation.mutateAsync({
        title: template.title,
        content: template.content
      });
      onClose();
      navigate(`/editor/${docId}`);
    }
  };

  const handleConfirmAction = (action: 'insert' | 'replace') => {
    if (activeTemplateForAction && onSelectTemplate) {
      onSelectTemplate(activeTemplateForAction, action);
      setActiveTemplateForAction(null);
      onClose();
    }
  };

  const handleCopyMarkdown = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTemplate = selectedTemplate || filteredTemplates[0] || MARKDOWN_TEMPLATES[0];
  const wordCount = currentTemplate.content.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <div 
        className="relative w-full max-w-5xl bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col h-[90vh] max-h-[760px]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-neutral-950 dark:text-white">
                  Markdown Templates Studio
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold border border-blue-200/50 dark:border-blue-900/40">
                  {MARKDOWN_TEMPLATES.length} Presets
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {isEditorMode 
                  ? 'Apply publication-ready blueprints directly into your active workspace'
                  : 'Start writing immediately with structured engineering specs, READMEs and docs'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Workspace: 2-Pane Split */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-neutral-200/80 dark:divide-neutral-800">
          
          {/* Left Pane: Template Picker (5 cols) */}
          <div className="md:col-span-5 flex flex-col h-full bg-neutral-50/40 dark:bg-neutral-900/40 overflow-hidden">
            {/* Search and Category Strip */}
            <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800 space-y-3 shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search blueprints..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Card List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredTemplates.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-500">
                  No templates match your search.
                </div>
              ) : (
                filteredTemplates.map(tmpl => {
                  const isSelected = currentTemplate.id === tmpl.id;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => setSelectedTemplate(tmpl)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer group ${
                        isSelected
                          ? 'border-blue-500/80 bg-blue-50/50 dark:bg-blue-950/30 shadow-xs ring-1 ring-blue-500/20'
                          : 'border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 hover:border-neutral-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
                          {tmpl.category}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {tmpl.content.trim().split(/\s+/).length} words
                        </span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {tmpl.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                        {tmpl.desc}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Pane: Live Rich Preview & Actions (7 cols) */}
          <div className="md:col-span-7 flex flex-col h-full bg-white dark:bg-neutral-950 overflow-hidden">
            {/* Preview Toolbar */}
            <div className="px-6 py-3.5 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/30 dark:bg-neutral-900/30 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                    {currentTemplate.title}
                  </span>
                  <span className="text-[11px] text-neutral-400 ml-2 font-mono">
                    • ~{readingTime} min read
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleCopyMarkdown(currentTemplate.content)}
                className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                title="Copy raw markdown to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Markdown Render Area */}
            <div className="flex-1 overflow-y-auto p-6 select-text">
              <div className="max-w-none prose prose-sm dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-500">
                <MarkdownPreview content={currentTemplate.content} />
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="p-4 px-6 border-t border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/60 flex items-center justify-between gap-4 shrink-0">
              <div className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block">
                Ready to edit and customize
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUseTemplate(currentTemplate)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow cursor-pointer"
                >
                  <span>{isEditorMode ? 'Insert into Document' : 'Use This Template'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Content Overwrite / Insert Choice Dialog */}
        {activeTemplateForAction && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4">
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                How would you like to apply this template?
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Your current document already has content. You can either append this template to the end or replace existing text.
              </p>
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleConfirmAction('insert')}
                  className="w-full py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
                >
                  Append at Cursor Position
                </button>
                <button
                  onClick={() => handleConfirmAction('replace')}
                  className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Replace All Content
                </button>
                <button
                  onClick={() => setActiveTemplateForAction(null)}
                  className="w-full py-2 text-xs font-medium text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
