import { FontFamily, MarginSize, PageSize } from '../types';

export interface PrintPdfOptions {
  documentTitle: string;
  pageSize: PageSize;
  margins: MarginSize;
  fontFamily: FontFamily;
  accentColor: string;
  watermarkText?: string;
  includeCoverPage?: boolean;
  includeToc?: boolean;
}

export function executePdfPrint(options: PrintPdfOptions): void {
  const {
    documentTitle,
    pageSize,
    margins,
    fontFamily,
    accentColor,
    watermarkText = '',
    includeCoverPage = false,
    includeToc = false,
  } = options;

  // 1. Target the rendered content sheets
  const coverEl = includeCoverPage ? document.getElementById('pdf-render-cover') : null;
  const tocEl = includeToc ? document.getElementById('pdf-render-toc') : null;
  const bodyEl = document.getElementById('pdf-render-body');

  if (!bodyEl) return;

  // 2. Extract their pure HTML
  const coverHtml = coverEl ? coverEl.outerHTML : '';
  const tocHtml = tocEl ? tocEl.outerHTML : '';
  const bodyHtml = bodyEl.outerHTML;

  // 3. Margin & Font rules
  const marginCss = margins === 'compact' ? '12mm' : margins === 'wide' ? '26mm' : '18mm';
  const fontCss =
    fontFamily === 'serif'
      ? "'Merriweather', 'Georgia', serif"
      : fontFamily === 'mono'
      ? "'JetBrains Mono', 'Courier New', monospace"
      : "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif";

  // 4. Create or reuse an isolated hidden print iframe
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
    .map((s) => s.outerHTML)
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
}
