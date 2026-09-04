import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCreateDocument } from '../../hooks/useDocuments';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TEMPLATES = [
  {
    id: 'readme',
    title: 'Project README.md',
    category: 'Engineering',
    desc: 'Standard GitHub-ready project documentation template with badges and setup steps.',
    content: `# Project Name

> A concise one-sentence description of what this project does.

## Features
- Blazing fast performance
- Offline-first architecture
- Zero dependencies

## Installation
\`\`\`bash
npm install
\`\`\`
`
  },
  {
    id: 'spec',
    title: 'Technical Design Spec.md',
    category: 'Product',
    desc: 'Architecture decision record with problem statement, design tradeoffs, and verification.',
    content: `# Technical Design Document: [Feature Name]

## Problem Statement
What problem are we solving and why now?

## Proposed Architecture
- Frontend: React 19 + Tailwind v4
- Storage: Dexie.js (IndexedDB)
- State: Zustand + TanStack Query
`
  },
  {
    id: 'journal',
    title: 'Daily Notes & Planner.md',
    category: 'Personal',
    desc: 'Focus journaling format with daily priorities, log of thoughts, and retro.',
    content: `# Daily Log — ${new Date().toLocaleDateString()}

## Top 3 Priorities
- [ ] Complete Home Page build
- [ ] Test Dexie IndexedDB caching
- [ ] Review app.md documentation
`
  }
];

export const TemplatesModal: React.FC<TemplatesModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const createDocMutation = useCreateDocument();

  if (!isOpen) return null;

  const handleUseTemplate = async (template: typeof TEMPLATES[0]) => {
    const docId = await createDocMutation.mutateAsync({
      title: template.title,
      content: template.content
    });
    onClose();
    navigate(`/editor/${docId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-white">
              Choose a Markdown Template
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Start writing instantly with curated professional presets
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto">
          {TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-500 bg-white dark:bg-neutral-800/60 flex flex-col justify-between transition-all group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded">
                  {tmpl.category}
                </span>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white mt-2.5 mb-1.5">
                  {tmpl.title}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {tmpl.desc}
                </p>
              </div>

              <button
                onClick={() => handleUseTemplate(tmpl)}
                className="mt-5 w-full py-2 px-3 rounded-lg text-xs font-semibold bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-900 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Use Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500">
          <span>All templates save locally in your IndexedDB library.</span>
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
