import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-950 font-bold text-xs">
              M
            </div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-white">
              MD Writer Interactive Tour
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="rounded-xl bg-neutral-950 p-5 text-white font-mono-code text-xs space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-[11px] text-neutral-400">
              <span>Interactive Workflow Preview</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Ready
              </span>
            </div>
            <div className="text-neutral-400">// 1. Slash commands for rapid blocks</div>
            <div className="text-sky-300">/heading &nbsp;&nbsp;→ H1, H2, H3 instantly</div>
            <div className="text-emerald-300">/code &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ Syntax highlighted blocks</div>
            <div className="text-amber-300">/table &nbsp;&nbsp;&nbsp;&nbsp;→ Pre-formatted markdown tables</div>
            <div className="text-neutral-400 pt-2">// 2. Dexie IndexedDB caching</div>
            <div className="text-neutral-300">Fast lazy loading: 2-3 line snippets in lists, full text cached on open.</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-center">
              <span className="text-lg font-bold text-neutral-900 dark:text-white block">0 ms</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Input Latency</span>
            </div>
            <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-center">
              <span className="text-lg font-bold text-neutral-900 dark:text-white block">100%</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Offline Capable</span>
            </div>
            <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-center">
              <span className="text-lg font-bold text-neutral-900 dark:text-white block">PDF / MD</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Pristine Exports</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-100 dark:border-neutral-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/editor');
            }}
            className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>Launch Editor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
