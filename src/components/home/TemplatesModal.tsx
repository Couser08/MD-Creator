import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  Search, 
  FileText, 
  Layers, 
  Plus 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MARKDOWN_TEMPLATES, MarkdownTemplate } from '../../data/templates';
import { useCreateDocument } from '../../hooks/useDocuments';

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
  const [activeTemplateForAction, setActiveTemplateForAction] = useState<MarkdownTemplate | null>(null);

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
      // In editor mode, if there is existing content, trigger choice modal
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 gap-3 bg-white dark:bg-neutral-900">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-neutral-950 dark:text-white">
                {isEditorMode ? 'Insert Markdown Template' : 'Choose a Markdown Template'}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200/50 dark:border-blue-900/40">
                8 Curated Blueprints
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {isEditorMode 
                ? 'Apply structured industry presets directly into your active workspace'
                : 'Start writing immediately with structured specs, READMEs, RFCs and journals'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
              />
            </div>
            
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="px-6 py-2.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 flex items-center gap-1.5 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-2xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-1 bg-white dark:bg-neutral-900">
          {filteredTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-neutral-800/50 flex flex-col justify-between transition-all hover:shadow-md group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded font-mono">
                    {tmpl.category}
                  </span>
                  {tmpl.badge && (
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.2 rounded-full border border-amber-200/50 dark:border-amber-900/40">
                      {tmpl.badge}
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-sm text-neutral-950 dark:text-white mt-1 mb-1.5">
                  {tmpl.title}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3">
                  {tmpl.desc}
                </p>
              </div>

              <button
                onClick={() => handleUseTemplate(tmpl)}
                className="mt-5 w-full py-2 px-3 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-700/70 text-neutral-800 dark:text-neutral-200 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-950 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>{isEditorMode ? 'Use Template' : 'Start with Template'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* In-Editor Dual Action Confirmation Sub-Modal */}
        {activeTemplateForAction && (
          <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-20 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/50">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-neutral-950 dark:text-white">
                    How would you like to apply this template?
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    "{activeTemplateForAction.title}"
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleConfirmAction('insert')}
                  className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer group"
                >
                  <div className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-blue-500" />
                    <span>Insert at Cursor (Recommended)</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Appends this template directly at your cursor without altering your current writing.
                  </p>
                </button>

                <button
                  onClick={() => handleConfirmAction('replace')}
                  className="w-full p-3 rounded-xl border border-amber-200/80 dark:border-amber-900/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 text-left transition-colors cursor-pointer group"
                >
                  <div className="font-bold text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Replace Entire Document</span>
                  </div>
                  <p className="text-[11px] text-amber-600/80 dark:text-amber-400/70 mt-0.5">
                    Replaces current document content with this template. (Auto-snapshot will be created).
                  </p>
                </button>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveTemplateForAction(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-neutral-50 dark:bg-neutral-950/60 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500">
          <span>All templates save locally in your IndexedDB library with zero cloud dependencies.</span>
          <button
            onClick={onClose}
            className="font-medium text-neutral-700 dark:text-neutral-300 hover:underline cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
