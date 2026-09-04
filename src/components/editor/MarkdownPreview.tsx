import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import { Copy, Check } from 'lucide-react';

interface MarkdownPreviewProps {
  content: string;
  onToggleTask?: (taskIndex: number, currentChecked: boolean) => void;
}

// Helper to recursively extract plain text from React elements/AST
const extractTextFromReactNode = (node: React.ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractTextFromReactNode).join('');
  }
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return props?.children ? extractTextFromReactNode(props.children) : '';
  }
  return '';
};

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, onToggleTask }) => {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div data-markdown-preview="true" className="w-full text-neutral-800 dark:text-neutral-200 leading-relaxed text-sm select-text">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white mt-6 mb-3 tracking-tight pb-1.5 border-b border-neutral-100 dark:border-neutral-800">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-5 mb-2.5 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-4 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold text-neutral-900 dark:text-neutral-200 mt-3 mb-1.5">
              {children}
            </h4>
          ),

          // Paragraphs
          p: ({ children }) => (
            <p className="mb-3 text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {children}
            </p>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-3 space-y-1 marker:text-neutral-400 dark:marker:text-neutral-600">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-3 space-y-1 marker:text-neutral-400 dark:marker:text-neutral-600">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {children}
            </li>
          ),

          // Interactive Checkboxes
          input: ({ type, checked, disabled: _disabled, node: _node, ...props }: any) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={Boolean(checked)}
                  onChange={(e) => {
                    if (onToggleTask) {
                      const root = e.currentTarget.closest('[data-markdown-preview="true"]') || e.currentTarget.closest('.preview-pane-container');
                      const allCheckboxes = root ? Array.from(root.querySelectorAll('input[type="checkbox"]')) : [];
                      const taskIndex = allCheckboxes.indexOf(e.currentTarget);
                      if (taskIndex !== -1) {
                        onToggleTask(taskIndex, Boolean(checked));
                      }
                    }
                  }}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0 mr-2 align-middle cursor-pointer accent-neutral-900 dark:accent-white"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },

          // Blockquotes & Callouts
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-sky-500 dark:border-sky-400 bg-sky-50/60 dark:bg-sky-950/30 p-3.5 my-3.5 rounded-r-xl text-neutral-800 dark:text-neutral-200 italic shadow-2xs">
              {children}
            </blockquote>
          ),

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
              <table className="w-full text-left text-xs divide-y divide-neutral-200 dark:divide-neutral-800">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 font-semibold uppercase tracking-wider text-[10px]">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2.5 font-bold border-b border-neutral-200 dark:border-neutral-800">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 text-neutral-600 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/60">
              {children}
            </td>
          ),

          // Code blocks & Inline Code
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && typeof children === 'string' && !children.includes('\n');
            const rawCode = extractTextFromReactNode(children).replace(/\n$/, '');
            const codeId = `code_${Math.random().toString(36).substr(2, 6)}`;

            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-amber-300 font-mono-code text-[12px] border border-neutral-200 dark:border-neutral-700/60"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="relative my-4 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-[#121215] shadow-2xs group transition-colors">
                {/* Code Header Bar */}
                <div className="flex items-center justify-between px-3.5 py-1.5 bg-neutral-100/90 dark:bg-[#1a1a1f] border-b border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono select-none transition-colors">
                  <span className="text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-[10px] font-semibold">
                    {match ? match[1] : 'code'}
                  </span>
                  <button
                    onClick={() => handleCopyCode(rawCode, codeId)}
                    className="flex items-center gap-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedCodeId === codeId ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[10px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                {/* Code Body */}
                <pre className="p-4 overflow-x-auto text-[12px] font-mono-code leading-relaxed text-neutral-800 dark:text-neutral-200">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              {children}
            </a>
          ),

          // Horizontal rule
          hr: () => (
            <hr className="my-6 border-neutral-200 dark:border-neutral-800" />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
