import React, { useEffect, useState, useRef } from 'react';
import mermaid from 'mermaid';
import { useThemeStore } from '../../stores/useThemeStore';
import { GitBranch, AlertCircle, Copy, Check } from 'lucide-react';

interface MermaidBlockProps {
  chart: string;
}

export const MermaidBlock: React.FC<MermaidBlockProps> = ({ chart }) => {
  const { isDark } = useThemeStore();
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const chartIdRef = useRef(`mermaid_${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    let isCancelled = false;

    async function renderChart() {
      try {
        setError(null);
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily: 'inherit'
        });

        // Clean any existing element with this ID from previous failed render
        const id = `svg_${chartIdRef.current}_${Math.floor(Math.random() * 10000)}`;
        const { svg } = await mermaid.render(id, chart.trim());
        
        if (!isCancelled) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.warn('Mermaid render error:', err);
          setError(err?.message || 'Failed to render Mermaid diagram. Check syntax.');
        }
      }
    }

    if (chart.trim()) {
      renderChart();
    }

    return () => {
      isCancelled = true;
    };
  }, [chart, isDark]);

  const handleCopy = () => {
    navigator.clipboard.writeText(chart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="my-4 p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-xs">
        <div className="flex items-center justify-between gap-2 mb-2 text-red-700 dark:text-red-400 font-semibold">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            <span>Mermaid Diagram Syntax</span>
          </div>
          <button
            onClick={handleCopy}
            className="text-[11px] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy code'}</span>
          </button>
        </div>
        <pre className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-red-200/60 dark:border-red-900/30 overflow-x-auto text-[11px] font-mono-code text-red-600 dark:text-red-300">
          {chart}
        </pre>
      </div>
    );
  }

  return (
    <div className="my-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-4 sm:p-6 overflow-hidden flex flex-col items-center group relative shadow-2xs transition-colors">
      <div className="w-full flex items-center justify-between text-[11px] text-neutral-400 mb-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-500 uppercase tracking-wider">
          <GitBranch className="w-3.5 h-3.5 text-indigo-500" />
          <span>Interactive Flowchart / Architecture</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer"
          title="Copy Mermaid source"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
          <span className="text-[10px]">{copied ? 'Copied' : 'Source'}</span>
        </button>
      </div>

      <div 
        className="mermaid-render-container w-full overflow-x-auto flex justify-center py-2 [&>svg]:max-w-full [&>svg]:h-auto"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
};
