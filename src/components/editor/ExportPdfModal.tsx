import React, { useState, useMemo, useEffect } from 'react';
import { 
  Printer, 
  X, 
  Check, 
  Palette, 
  Type, 
  Layout, 
  BookOpen, 
  Terminal, 
  GraduationCap, 
  Briefcase, 
  Feather,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Sliders
} from 'lucide-react';
import { MarkdownPreview } from './MarkdownPreview';

export type PdfPreset = 'editorial' | 'technical' | 'academic' | 'corporate' | 'minimalist';
export type FontFamily = 'sans' | 'serif' | 'mono';
export type PageSize = 'a4' | 'letter';
export type MarginSize = 'compact' | 'normal' | 'wide';

interface ExportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentContent: string;
}

const ACCENT_COLORS = [
  { id: 'indigo', name: 'Indigo Blue', hex: '#4f46e5' },
  { id: 'emerald', name: 'Emerald Green', hex: '#059669' },
  { id: 'rose', name: 'Crimson Rose', hex: '#e11d48' },
  { id: 'purple', name: 'Royal Violet', hex: '#7c3aed' },
  { id: 'amber', name: 'Amber Gold', hex: '#d97706' },
  { id: 'slate', name: 'Graphite Slate', hex: '#0f172a' },
];

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  documentContent
}) => {
  // Preset & Typography state
  const [preset, setPreset] = useState<PdfPreset>('editorial');
  const [fontFamily, setFontFamily] = useState<FontFamily>('sans');
  const [accentColor, setAccentColor] = useState<string>('#4f46e5');
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [margins, setMargins] = useState<MarginSize>('normal');

  // Structural Toggles
  const [includeCoverPage, setIncludeCoverPage] = useState<boolean>(false);
  const [coverSubtitle, setCoverSubtitle] = useState<string>('Technical Architecture & Specifications');
  const [coverAuthor, setCoverAuthor] = useState<string>('Engineering Team');
  const [coverOrg, setCoverOrg] = useState<string>('MD Creator Publishing');

  const [includeToc, setIncludeToc] = useState<boolean>(false);
  const [includePageNumbers, setIncludePageNumbers] = useState<boolean>(true);
  const [watermarkText, setWatermarkText] = useState<string>('');

  // Preview zoom
  const [zoomLevel, setZoomLevel] = useState<number>(85);

  // Extract Table of Contents from markdown headings
  const tableOfContents = useMemo(() => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const items: { level: number; title: string }[] = [];
    let match;
    while ((match = headingRegex.exec(documentContent)) !== null) {
      items.push({
        level: match[1].length,
        title: match[2].trim()
      });
    }
    return items;
  }, [documentContent]);

  // Preset switch handler
  const handleSelectPreset = (p: PdfPreset) => {
    setPreset(p);
    if (p === 'editorial') {
      setFontFamily('sans');
      setAccentColor('#4f46e5');
      setMargins('normal');
    } else if (p === 'technical') {
      setFontFamily('mono');
      setAccentColor('#0f172a');
      setMargins('compact');
    } else if (p === 'academic') {
      setFontFamily('serif');
      setAccentColor('#059669');
      setMargins('wide');
      setIncludeCoverPage(true);
    } else if (p === 'corporate') {
      setFontFamily('sans');
      setAccentColor('#0284c7');
      setMargins('normal');
      setIncludeCoverPage(true);
      setIncludeToc(true);
    } else if (p === 'minimalist') {
      setFontFamily('sans');
      setAccentColor('#0f172a');
      setMargins('wide');
      setIncludeCoverPage(false);
      setIncludeToc(false);
    }
  };

  // Trigger high-res isolated vector print/export
  const handlePrintPdf = () => {
    // 1. Target the rendered content sheets
    const coverEl = includeCoverPage ? document.getElementById('pdf-render-cover') : null;
    const tocEl = includeToc && tableOfContents.length > 0 ? document.getElementById('pdf-render-toc') : null;
    const bodyEl = document.getElementById('pdf-render-body');

    if (!bodyEl) return;

    // 2. Extract their pure HTML
    const coverHtml = coverEl ? coverEl.outerHTML : '';
    const tocHtml = tocEl ? tocEl.outerHTML : '';
    const bodyHtml = bodyEl.outerHTML;

    // 3. Margin & Font rules
    const marginCss = margins === 'compact' ? '12mm' : margins === 'wide' ? '26mm' : '18mm';
    const fontCss = fontFamily === 'serif' 
      ? "'Merriweather', 'Georgia', serif" 
      : fontFamily === 'mono' 
      ? "'JetBrains Mono', 'Courier New', monospace" 
      : "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif";

    // 4. Create an isolated hidden print iframe
    let printIframe = document.getElementById('pdf-hidden-print-frame') as HTMLIFrameElement | null;
    if (!printIframe) {
      printIframe = document.createElement('iframe');
      printIframe.id = 'pdf-hidden-print-frame';
      printIframe.style.position = 'fixed';
      printIframe.style.right = '0';
      printIframe.style.bottom = '0';
      printIframe.style.width = '1024px';
      printIframe.style.height = '768px';
      printIframe.style.border = '0';
      printIframe.style.opacity = '0';
      printIframe.style.pointerEvents = 'none';
      printIframe.style.zIndex = '-9999';
      document.body.appendChild(printIframe);
    }

    const doc = printIframe.contentDocument || printIframe.contentWindow?.document;
    if (!doc) return;

    // Copy stylesheet links and styles from parent (KaTeX, Tailwind tokens, highlights)
    const styleTags = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map(s => s.outerHTML)
      .join('\n');

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${documentTitle}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
        ${styleTags}
        <style>
          @page {
            size: ${pageSize === 'a4' ? 'A4 portrait' : 'letter portrait'};
            margin: ${marginCss};
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box;
          }
          html, body {
            background-color: #ffffff !important;
            color: #111827 !important;
            font-family: ${fontCss} !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
          /* Strip screen shadow and card borders from printable sheets */
          #pdf-render-cover, #pdf-render-toc, #pdf-render-body {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            min-height: auto !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          #pdf-render-cover {
            min-height: 88vh !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            page-break-after: always !important;
            break-after: page !important;
            border-top: 12px solid ${accentColor} !important;
            padding-top: 24pt !important;
            padding-bottom: 24pt !important;
          }
          #pdf-render-body {
            min-height: 88vh !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }
          #pdf-render-body > div.prose {
            flex: 1 1 auto !important;
          }
          .pdf-running-footer {
            margin-top: auto !important;
            padding-top: 10pt !important;
            border-top: 1px solid #e5e7eb !important;
          }
          #pdf-render-toc {
            page-break-after: always !important;
            break-after: page !important;
            border-left: 6px solid ${accentColor} !important;
            padding-left: 20pt !important;
            padding-top: 12pt !important;
            margin-bottom: 30pt !important;
          }
          .pdf-watermark-overlay {
            position: fixed !important;
            top: 45% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) rotate(-35deg) !important;
            font-size: 72pt !important;
            font-weight: 900 !important;
            text-transform: uppercase !important;
            color: rgba(180, 180, 180, 0.14) !important;
            pointer-events: none !important;
            z-index: 9999 !important;
            letter-spacing: 0.15em !important;
            white-space: nowrap !important;
          }
          .canvas-watermark {
            display: none !important;
          }
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          pre, blockquote, table, tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        </style>
      </head>
      <body>
        ${watermarkText ? `<div class="pdf-watermark-overlay">${watermarkText}</div>` : ''}
        ${coverHtml}
        ${tocHtml}
        ${bodyHtml}
      </body>
      </html>
    `);
    doc.close();

    // Trigger isolated print
    setTimeout(() => {
      printIframe?.contentWindow?.focus();
      printIframe?.contentWindow?.print();
    }, 400);
  };

  // Keyboard shortcut listener: Ctrl+P / Cmd+P to print, Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrintPdf();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const currentFontFamilyCss = fontFamily === 'serif' 
    ? 'font-serif' 
    : fontFamily === 'mono' 
    ? 'font-mono' 
    : 'font-sans';

  if (!isOpen) return null;

  return (
    <div 
      data-pdf-studio-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
    >
      <div className="w-full h-full max-w-[1550px] max-h-[96vh] m-2 sm:m-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Studio Top Navigation Bar */}
        <div className="px-6 py-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/80 dark:bg-neutral-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-neutral-950 dark:text-white">
                  PDF Export Studio
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Vector Engine
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-sm sm:max-w-md">
                Publishing: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{documentTitle}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Zoom Controls */}
            <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs shadow-2xs">
              <button
                type="button"
                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-semibold px-1 min-w-[42px] text-center text-[11px] text-neutral-600 dark:text-neutral-300">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel(Math.min(125, zoomLevel + 10))}
                className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Print Action Button */}
            <button
              type="button"
              onClick={handlePrintPdf}
              className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-blue-400 dark:text-blue-600" />
              <span>Print / Save as PDF</span>
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Close Studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Main Workspace (Split View) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left Controls Drawer (Customizer) */}
          <div className="w-full lg:w-[380px] xl:w-[420px] border-b lg:border-b-0 lg:border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 overflow-y-auto p-5 space-y-6 shrink-0 text-xs">
            
            {/* Section 1: Themes & Presets */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-blue-500" />
                  <span>Design Presets</span>
                </label>
                <span className="text-[10px] text-neutral-400">Curated Styles</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'editorial', name: 'Editorial', desc: 'Modern & Clean', icon: BookOpen },
                  { id: 'technical', name: 'Technical RFC', desc: 'Monospace Spec', icon: Terminal },
                  { id: 'academic', name: 'Academic', desc: 'Formal Serif & Citations', icon: GraduationCap },
                  { id: 'corporate', name: 'Corporate', desc: 'Executive Brief', icon: Briefcase },
                  { id: 'minimalist', name: 'Minimalist', desc: 'Pure Swiss Whitespace', icon: Feather },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = preset === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectPreset(item.id as PdfPreset)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950 shadow-md font-semibold'
                          : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 opacity-80" />
                        <span className="text-xs font-bold">{item.name}</span>
                      </div>
                      <p className={`text-[10px] leading-tight ${isSelected ? 'opacity-80' : 'text-neutral-400'}`}>
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Typography & Colors */}
            <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/70">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-emerald-500" />
                <span>Typography & Accents</span>
              </label>

              {/* Font Family */}
              <div className="space-y-1.5">
                <span className="text-neutral-600 dark:text-neutral-400 font-medium">Font Family</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'sans', label: 'Sans-Serif' },
                    { id: 'serif', label: 'Serif' },
                    { id: 'mono', label: 'Mono' }
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFontFamily(f.id as FontFamily)}
                      className={`py-1.5 px-2 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                        fontFamily === f.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold'
                          : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color Picker */}
              <div className="space-y-1.5">
                <span className="text-neutral-600 dark:text-neutral-400 font-medium">Brand Accent Color</span>
                <div className="flex items-center gap-2">
                  {ACCENT_COLORS.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setAccentColor(c.hex)}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer relative flex items-center justify-center ${
                        accentColor === c.hex ? 'ring-2 ring-offset-2 ring-neutral-900 dark:ring-white scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {accentColor === c.hex && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Paper & Layout */}
            <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/70">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5 text-amber-500" />
                <span>Paper & Margins</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <span className="text-neutral-600 dark:text-neutral-400 font-medium">Paper Format</span>
                  <div className="flex rounded-lg border border-neutral-200 dark:border-neutral-800 p-0.5 bg-neutral-100 dark:bg-neutral-800">
                    <button
                      type="button"
                      onClick={() => setPageSize('a4')}
                      className={`flex-1 py-1 rounded-md text-center font-semibold cursor-pointer ${
                        pageSize === 'a4' ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-2xs' : 'text-neutral-500'
                      }`}
                    >
                      A4
                    </button>
                    <button
                      type="button"
                      onClick={() => setPageSize('letter')}
                      className={`flex-1 py-1 rounded-md text-center font-semibold cursor-pointer ${
                        pageSize === 'letter' ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-2xs' : 'text-neutral-500'
                      }`}
                    >
                      US Letter
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-neutral-600 dark:text-neutral-400 font-medium">Page Margins</span>
                  <div className="flex rounded-lg border border-neutral-200 dark:border-neutral-800 p-0.5 bg-neutral-100 dark:bg-neutral-800">
                    {(['compact', 'normal', 'wide'] as MarginSize[]).map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMargins(m)}
                        className={`flex-1 py-1 rounded-md text-center capitalize font-semibold cursor-pointer ${
                          margins === m ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-2xs' : 'text-neutral-500'
                        }`}
                      >
                        {m[0].toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Document Structure Elements */}
            <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800/70">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-500" />
                <span>Structure & Branding</span>
              </label>

              {/* Cover Page Toggle */}
              <div className="space-y-2 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    Standalone Cover Page
                  </span>
                  <input
                    type="checkbox"
                    checked={includeCoverPage}
                    onChange={(e) => setIncludeCoverPage(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </div>
                {includeCoverPage && (
                  <div className="pt-2 space-y-2 border-t border-neutral-200 dark:border-neutral-700 animate-in fade-in duration-100">
                    <input
                      type="text"
                      value={coverSubtitle}
                      onChange={(e) => setCoverSubtitle(e.target.value)}
                      placeholder="Subtitle or Document Phase"
                      className="w-full px-2.5 py-1 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                    />
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        value={coverAuthor}
                        onChange={(e) => setCoverAuthor(e.target.value)}
                        placeholder="Author"
                        className="px-2.5 py-1 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                      />
                      <input
                        type="text"
                        value={coverOrg}
                        onChange={(e) => setCoverOrg(e.target.value)}
                        placeholder="Company / Org"
                        className="px-2.5 py-1 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Auto Table of Contents */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
                <div>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                    Table of Contents (TOC)
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Auto-generated from H1/H2/H3 headings ({tableOfContents.length} found)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={includeToc}
                  onChange={(e) => setIncludeToc(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
              </div>

              {/* Running Header & Footers */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
                <div>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                    Page Numbers & Header
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Document title and running footer
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={includePageNumbers}
                  onChange={(e) => setIncludePageNumbers(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
              </div>

              {/* Watermark */}
              <div className="space-y-1.5 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                  Document Watermark
                </span>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="e.g. DRAFT, CONFIDENTIAL"
                  className="w-full px-2.5 py-1 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 uppercase font-mono text-[11px]"
                />
              </div>
            </div>

          </div>

          {/* Right Live Paper Canvas Area */}
          <div className="flex-1 bg-neutral-100 dark:bg-neutral-950 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
            <div 
              style={{ 
                transform: `scale(${zoomLevel / 100})`, 
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out'
              }}
              className="w-full max-w-[800px] flex flex-col gap-8 shadow-2xl relative"
            >
              
              {/* PAGE 1: COVER PAGE (If Enabled) */}
              {includeCoverPage && (
                <div 
                  id="pdf-render-cover"
                  className={`bg-white text-neutral-900 rounded-sm shadow-xl p-12 min-h-[950px] flex flex-col justify-between relative overflow-hidden border border-neutral-200 ${currentFontFamilyCss}`}
                  style={{ borderTop: `12px solid ${accentColor}` }}
                >
                  {/* Watermark in Canvas */}
                  {watermarkText && (
                    <div className="canvas-watermark absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
                      <span className="text-7xl font-black text-neutral-200 tracking-widest uppercase rotate-[-35deg] opacity-40">
                        {watermarkText}
                      </span>
                    </div>
                  )}

                  {/* Top Org Banner */}
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                      {coverOrg || 'Technical Publication'}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>

                  {/* Center Hero Title */}
                  <div className="my-auto space-y-4 max-w-xl">
                    <div 
                      className="inline-block px-3 py-1 rounded-md text-xs font-bold text-white uppercase tracking-wider mb-2"
                      style={{ backgroundColor: accentColor }}
                    >
                      {preset.toUpperCase()} SPECIFICATION
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-950 leading-tight">
                      {documentTitle}
                    </h1>
                    {coverSubtitle && (
                      <p className="text-lg text-neutral-600 font-medium leading-relaxed">
                        {coverSubtitle}
                      </p>
                    )}
                  </div>

                  {/* Bottom Author Strip */}
                  <div className="border-t border-neutral-200 pt-6 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold">Author</div>
                      <div className="text-sm font-bold text-neutral-900">{coverAuthor || 'Engineering Team'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold">Engine</div>
                      <div className="text-xs font-mono text-neutral-600">MD Creator Studio v2</div>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 2: TABLE OF CONTENTS (If Enabled) */}
              {includeToc && tableOfContents.length > 0 && (
                <div 
                  id="pdf-render-toc"
                  className={`bg-white text-neutral-900 rounded-sm shadow-xl p-12 min-h-[950px] relative border border-neutral-200 ${currentFontFamilyCss}`}
                  style={{ borderLeft: `6px solid ${accentColor}` }}
                >
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-8">
                    <h2 className="text-xl font-bold tracking-tight text-neutral-950">
                      Table of Contents
                    </h2>
                    <span className="text-xs font-mono text-neutral-400">{documentTitle}</span>
                  </div>

                  <div className="space-y-3">
                    {tableOfContents.map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-baseline justify-between text-xs py-1 ${
                          item.level === 1 ? 'font-bold text-neutral-950 border-b border-neutral-100 pb-1 mt-3' : item.level === 2 ? 'pl-4 text-neutral-700 font-medium' : 'pl-8 text-neutral-500'
                        }`}
                      >
                        <span className="truncate pr-4">{item.title}</span>
                        <div className="flex-1 border-b border-dotted border-neutral-300 mx-2"></div>
                        <span className="font-mono text-[11px] text-neutral-400">§ {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MAIN CONTENT SHEET */}
              <div 
                id="pdf-render-body"
                className={`bg-white text-neutral-900 rounded-sm shadow-xl p-8 sm:p-14 min-h-[1050px] flex flex-col justify-between relative border border-neutral-200 ${currentFontFamilyCss}`}
              >
                {/* Watermark in Canvas */}
                {watermarkText && (
                  <div className="canvas-watermark absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
                    <span className="text-7xl font-black text-neutral-200 tracking-widest uppercase rotate-[-35deg] opacity-30">
                      {watermarkText}
                    </span>
                  </div>
                )}

                {/* Running Header */}
                {includePageNumbers && (
                  <div className="pdf-running-header flex items-center justify-between text-[11px] text-neutral-400 border-b border-neutral-100 pb-3 mb-8 font-mono">
                    <span>{documentTitle}</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                )}

                {/* Document Body Rendered */}
                <div 
                  className={`prose prose-neutral max-w-none flex-1 ${
                    preset === 'technical' ? 'prose-headings:font-mono' : ''
                  }`}
                  style={{
                    // Custom CSS variables for the preview container
                    ['--tw-prose-links' as any]: accentColor,
                    ['--tw-prose-headings' as any]: preset === 'corporate' ? accentColor : undefined
                  }}
                >
                  <MarkdownPreview content={documentContent} />
                </div>

                {/* Running Footer */}
                {includePageNumbers && (
                  <div className="pdf-running-footer flex items-center justify-between text-[10px] text-neutral-400 border-t border-neutral-100 pt-4 mt-auto font-mono">
                    <span>Published with MD Creator</span>
                    <span>Page 1 of 1</span>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
