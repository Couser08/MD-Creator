import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { App } from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Suppress benign browser extension runtime message channel closed errors
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const msg = event?.reason?.message || String(event?.reason || '');
    if (
      msg.includes('message channel closed') ||
      msg.includes('listener indicated an asynchronous response') ||
      msg.includes('runtime.lastError')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
    }
  });
}

// Register PWA service worker immediately for offline capability & install prompt
registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
