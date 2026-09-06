import React from 'react';
import { MarkdownPreview } from '../../../components/editor/MarkdownPreview';
import { FontFamily, PdfPreset, TocItem } from '../types';

interface PdfExportPreviewProps {
  zoomLevel: number;
  includeCoverPage: boolean;
  coverOrg: string;
  preset: PdfPreset;
  accentColor: string;
  documentTitle: string;
  coverSubtitle: string;
  coverAuthor: string;
  fontFamily: FontFamily;
  watermarkText: string;
  includeToc: boolean;
  tableOfContents: TocItem[];
  includePageNumbers: boolean;
  documentContent: string;
}

export const PdfExportPreview: React.FC<PdfExportPreviewProps> = React.memo(({
  zoomLevel,
  includeCoverPage,
  coverOrg,
  preset,
  accentColor,
  documentTitle,
  coverSubtitle,
  coverAuthor,
  fontFamily,
  watermarkText,
  includeToc,
  tableOfContents,
  includePageNumbers,
  documentContent,
}) => {
  const currentFontFamilyCss =
    fontFamily === 'serif'
      ? 'font-serif'
      : fontFamily === 'mono'
      ? 'font-mono'
      : 'font-sans';

  return (
    <div className="flex-1 bg-neutral-100 dark:bg-neutral-950 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
      <div
        style={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: 'top center',
          transition: 'transform 0.15s ease-out',
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
                    item.level === 1
                      ? 'font-bold text-neutral-950 border-b border-neutral-100 pb-1 mt-3'
                      : item.level === 2
                      ? 'pl-4 text-neutral-700 font-medium'
                      : 'pl-8 text-neutral-500'
                  }`}
                >
                  <span className="truncate pr-4">{item.title}</span>
                  <div className="flex-1 border-b border-dotted border-neutral-300 mx-2" />
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
              ['--tw-prose-links' as any]: accentColor,
              ['--tw-prose-headings' as any]: preset === 'corporate' ? accentColor : undefined,
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
  );
});

PdfExportPreview.displayName = 'PdfExportPreview';
