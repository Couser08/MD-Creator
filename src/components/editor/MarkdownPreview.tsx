import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import { 
  Copy, 
  Check, 
  Info, 
  Lightbulb, 
  AlertTriangle, 
  Sparkles, 
  ShieldAlert, 
  ChevronRight 
} from 'lucide-react';
import { MermaidBlock } from './MermaidBlock';

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

// Alert Callout configuration for GitHub-style blockquotes
interface AlertCalloutConfig {
  type: 'note' | 'tip' | 'warning' | 'important' | 'caution';
  title: string;
  icon: React.ElementType;
  containerClass: string;
  titleClass: string;
  iconClass: string;
}

const ALERT_CONFIGS: Record<string, AlertCalloutConfig> = {
  note: {
    type: 'note',
    title: 'Note',
    icon: Info,
    containerClass: 'border-l-4 border-blue-500 bg-blue-50/70 dark:bg-blue-950/30 text-blue-950 dark:text-blue-200',
    titleClass: 'text-blue-700 dark:text-blue-400 font-bold',
    iconClass: 'text-blue-600 dark:text-blue-400'
  },
  tip: {
    type: 'tip',
    title: 'Tip',
    icon: Lightbulb,
    containerClass: 'border-l-4 border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200',
    titleClass: 'text-emerald-700 dark:text-emerald-400 font-bold',
    iconClass: 'text-emerald-600 dark:text-emerald-400'
  },
  warning: {
    type: 'warning',
    title: 'Warning',
    icon: AlertTriangle,
    containerClass: 'border-l-4 border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200',
    titleClass: 'text-amber-700 dark:text-amber-400 font-bold',
    iconClass: 'text-amber-600 dark:text-amber-400'
  },
  important: {
    type: 'important',
    title: 'Important',
    icon: Sparkles,
    containerClass: 'border-l-4 border-purple-500 bg-purple-50/70 dark:bg-purple-950/30 text-purple-950 dark:text-purple-200',
    titleClass: 'text-purple-700 dark:text-purple-400 font-bold',
    iconClass: 'text-purple-600 dark:text-purple-400'
  },
  caution: {
    type: 'caution',
    title: 'Caution',
    icon: ShieldAlert,
    containerClass: 'border-l-4 border-rose-500 bg-rose-50/70 dark:bg-rose-950/30 text-rose-950 dark:text-rose-200',
    titleClass: 'text-rose-700 dark:text-rose-400 font-bold',
    iconClass: 'text-rose-600 dark:text-rose-400'
  }
};

/**
 * Inspects blockquote children to see if it starts with [!NOTE], [!TIP], etc.
 */
const extractAlertInfo = (children: React.ReactNode): { config: AlertCalloutConfig; content: React.ReactNode } | null => {
  const childrenArray = React.Children.toArray(children);
  if (childrenArray.length === 0) return null;

  const firstChild = childrenArray[0];
  if (!React.isValidElement(firstChild)) return null;

  const innerProps = (firstChild as any).props;
  const innerChildren = innerProps?.children;
  const innerText = extractTextFromReactNode(innerChildren).trimStart();

  const match = innerText.match(/^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]/i);
  if (!match) return null;

  const alertType = match[1].toLowerCase();
  const config = ALERT_CONFIGS[alertType];
  if (!config) return null;

  // Strip "[!NOTE]" prefix from first paragraph
  const textWithoutMarker = innerText.replace(/^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*/i, '');

  let remainingFirstChild: React.ReactNode = null;
  if (textWithoutMarker.length > 0) {
    remainingFirstChild = React.cloneElement(firstChild as React.ReactElement<any>, {
      children: textWithoutMarker
    });
  }

  const remainingChildren = [
    remainingFirstChild,
    ...childrenArray.slice(1)
  ].filter(Boolean);

  return { config, content: remainingChildren };
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
        rehypePlugins={[rehypeRaw, rehypeKatex, rehypeHighlight]}
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

          // Blockquotes & Callout Alerts
          blockquote: ({ children }) => {
            const alertData = extractAlertInfo(children);

            if (alertData) {
              const { config, content: alertContent } = alertData;
              const IconComp = config.icon;

              return (
                <div className={`my-4 p-4 rounded-r-2xl shadow-2xs ${config.containerClass}`}>
                  <div className="flex items-center gap-2 mb-1.5 select-none">
                    <IconComp className={`w-4 h-4 shrink-0 ${config.iconClass}`} />
                    <span className={`text-xs uppercase tracking-wider font-mono ${config.titleClass}`}>
                      {config.title}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm leading-relaxed pl-6">
                    {alertContent}
                  </div>
                </div>
              );
            }

            // Standard Quote
            return (
              <blockquote className="border-l-4 border-neutral-300 dark:border-neutral-700 bg-neutral-50/60 dark:bg-neutral-900/40 p-4 my-3.5 rounded-r-2xl text-neutral-700 dark:text-neutral-300 italic shadow-2xs">
                {children}
              </blockquote>
            );
          },

          // Collapsible Accordion (details & summary)
          details: ({ children, ...props }: any) => (
            <details 
              className="my-3.5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/40 overflow-hidden transition-all group open:bg-white dark:open:bg-neutral-900 shadow-2xs"
              {...props}
            >
              {children}
            </details>
          ),
          summary: ({ children, ...props }: any) => (
            <summary 
              className="px-4 py-3 font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white cursor-pointer select-none hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60 transition-colors flex items-center gap-2 list-none marker:hidden"
              {...props}
            >
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-open:rotate-90 transition-transform duration-150 shrink-0" />
              <span className="flex-1">{children}</span>
            </summary>
          ),

          // Keyboard Badges (<kbd>)
          kbd: ({ children, ...props }: any) => (
            <kbd 
              className="px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 font-mono text-[11px] text-neutral-800 dark:text-neutral-200 shadow-2xs font-semibold inline-block"
              {...props}
            >
              {children}
            </kbd>
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

          // Code blocks, Inline Code & Mermaid Diagrams
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

            // Interactive Mermaid Diagram
            if (match && match[1] === 'mermaid') {
              return <MermaidBlock chart={rawCode} />;
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
