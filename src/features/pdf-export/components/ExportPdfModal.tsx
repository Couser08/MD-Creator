import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Printer, X, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';
import { 
  PdfPreset, 
  FontFamily, 
  PageSize, 
  MarginSize, 
  ExportPdfModalProps, 
  TocItem 
} from '../types';
import { executePdfPrint } from '../services/pdfPrintService';
import { PdfExportSidebar } from './PdfExportSidebar';
import { PdfExportPreview } from './PdfExportPreview';

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  documentContent,
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

  // Extract Table of Contents from markdown headings (H1, H2, H3)
  const tableOfContents = useMemo<TocItem[]>(() => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;
    while ((match = headingRegex.exec(documentContent)) !== null) {
      items.push({
        level: match[1].length,
        title: match[2].trim(),
      });
    }
    return items;
  }, [documentContent]);

  // Preset switch handler
  const handleSelectPreset = useCallback((p: PdfPreset) => {
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
  }, []);

  // Print PDF trigger
  const handlePrintPdf = useCallback(() => {
    executePdfPrint({
      documentTitle,
      pageSize,
      margins,
      fontFamily,
      accentColor,
      watermarkText,
      includeCoverPage,
      includeToc: includeToc && tableOfContents.length > 0,
    });
  }, [
    documentTitle,
    pageSize,
    margins,
    fontFamily,
    accentColor,
    watermarkText,
    includeCoverPage,
    includeToc,
    tableOfContents.length,
  ]);

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
  }, [isOpen, onClose, handlePrintPdf]);

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
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                High-fidelity print-ready PDF styling & typography engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-2xs">
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.max(50, prev - 10))}
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
                onClick={() => setZoomLevel((prev) => Math.min(125, prev + 10))}
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
          <PdfExportSidebar
            preset={preset}
            onSelectPreset={handleSelectPreset}
            fontFamily={fontFamily}
            onChangeFontFamily={setFontFamily}
            accentColor={accentColor}
            onChangeAccentColor={setAccentColor}
            pageSize={pageSize}
            onChangePageSize={setPageSize}
            margins={margins}
            onChangeMargins={setMargins}
            includeCoverPage={includeCoverPage}
            onChangeIncludeCoverPage={setIncludeCoverPage}
            coverSubtitle={coverSubtitle}
            onChangeCoverSubtitle={setCoverSubtitle}
            coverAuthor={coverAuthor}
            onChangeCoverAuthor={setCoverAuthor}
            coverOrg={coverOrg}
            onChangeCoverOrg={setCoverOrg}
            includeToc={includeToc}
            onChangeIncludeToc={setIncludeToc}
            tableOfContents={tableOfContents}
            includePageNumbers={includePageNumbers}
            onChangeIncludePageNumbers={setIncludePageNumbers}
            watermarkText={watermarkText}
            onChangeWatermarkText={setWatermarkText}
          />

          <PdfExportPreview
            zoomLevel={zoomLevel}
            includeCoverPage={includeCoverPage}
            coverOrg={coverOrg}
            preset={preset}
            accentColor={accentColor}
            documentTitle={documentTitle}
            coverSubtitle={coverSubtitle}
            coverAuthor={coverAuthor}
            fontFamily={fontFamily}
            watermarkText={watermarkText}
            includeToc={includeToc}
            tableOfContents={tableOfContents}
            includePageNumbers={includePageNumbers}
            documentContent={documentContent}
          />
        </div>
      </div>
    </div>
  );
};
