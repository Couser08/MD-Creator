import React, { useState, useMemo, useCallback } from 'react';
import { X, Search, Copy, Check, Plus, Sigma, Sparkles, BookOpen } from 'lucide-react';
import katex from 'katex';
import { KATEX_FORMULAS, KatexFormula, FormulaCategory } from '../../data/katexFormulas';

interface KatexFormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertFormula?: (latexSnippet: string) => void;
}

const CATEGORIES: { id: FormulaCategory; label: string }[] = [
  { id: 'all', label: 'All Formulas' },
  { id: 'calculus', label: 'Calculus' },
  { id: 'algebra', label: 'Linear Algebra' },
  { id: 'physics', label: 'Physics' },
  { id: 'stats', label: 'Statistics' },
  { id: 'discrete', label: 'Discrete & Logic' },
];

export const KatexFormulaModal: React.FC<KatexFormulaModalProps> = ({
  isOpen,
  onClose,
  onInsertFormula,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FormulaCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter formulas
  const filteredFormulas = useMemo(() => {
    return KATEX_FORMULAS.filter((f) => {
      const matchCategory = selectedCategory === 'all' || f.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.latex.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Copy LaTeX code to clipboard
  const handleCopyLatex = useCallback((formula: KatexFormula) => {
    const formatted = `$$\n${formula.latex}\n$$`;
    navigator.clipboard.writeText(formatted);
    setCopiedId(formula.id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  // Insert formula into active editor
  const handleInsert = useCallback(
    (formula: KatexFormula) => {
      const formatted = `$$\n${formula.latex}\n$$`;
      if (onInsertFormula) {
        onInsertFormula(formatted);
        onClose();
      } else {
        handleCopyLatex(formula);
      }
    },
    [onInsertFormula, onClose, handleCopyLatex]
  );

  // Render KaTeX HTML safely
  const renderFormulaHtml = useCallback((latex: string) => {
    try {
      return katex.renderToString(latex, {
        displayMode: true,
        throwOnError: false,
      });
    } catch {
      return latex;
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-6 overflow-hidden animate-in fade-in duration-150 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-neutral-900 dark:text-neutral-100">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/70 dark:bg-neutral-950/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sigma className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-950 dark:text-white">
                  KaTeX Formula Studio
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  Ready-to-Use Math
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Browse, preview, and inject publication-ready LaTeX formulas with 1-click
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

        {/* Filter Bar: Search & Category Pills */}
        <div className="px-6 py-3.5 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row items-center gap-3 shrink-0">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formulas, symbols..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Formula Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFormulas.map((formula) => {
            const isCopied = copiedId === formula.id;
            return (
              <div
                key={formula.id}
                className="group p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/40 hover:bg-white dark:hover:bg-neutral-900 transition-all hover:shadow-md hover:border-indigo-500/40 flex flex-col justify-between gap-3"
              >
                {/* Card Top Title & Badge */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-xs font-bold text-neutral-950 dark:text-white">
                      {formula.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 shrink-0">
                      {formula.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                    {formula.description}
                  </p>
                </div>

                {/* Rendered Math Canvas */}
                <div
                  className="py-3 px-4 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 overflow-x-auto text-neutral-900 dark:text-white text-center flex items-center justify-center min-h-[60px]"
                  dangerouslySetInnerHTML={{ __html: renderFormulaHtml(formula.latex) }}
                />

                {/* Raw Code Snippet */}
                <div className="text-[10.5px] font-mono-code text-neutral-500 dark:text-neutral-400 bg-neutral-100/70 dark:bg-neutral-900/90 px-2.5 py-1.5 rounded-lg border border-neutral-200/40 dark:border-neutral-800/40 truncate select-all">
                  {formula.latex}
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-neutral-200/50 dark:border-neutral-800/50">
                  <button
                    onClick={() => handleCopyLatex(formula)}
                    className="flex-1 py-1.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Copy LaTeX</span>
                      </>
                    )}
                  </button>

                  {onInsertFormula && (
                    <button
                      onClick={() => handleInsert(formula)}
                      className="py-1.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-all hover:shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Insert</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredFormulas.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-neutral-400">
              <BookOpen className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs font-medium">No formulas found matching "{searchQuery}"</p>
            </div>
          )}
        </div>

        {/* Modal Footer Tip */}
        <div className="px-6 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 flex items-center justify-between text-[11px] text-neutral-500 shrink-0 font-mono">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Tip: Type <kbd className="bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded">/math</kbd> inside the editor to open this studio instantly</span>
          </div>
          <span>{filteredFormulas.length} formulas</span>
        </div>
      </div>
    </div>
  );
};
