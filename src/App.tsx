import React, { useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { seedInitialDocuments } from './db/seed';
import { useAuthStore } from './stores/useAuthStore';
import { GlobalConfirmDialog } from './components/common/GlobalConfirmDialog';
import { PageLoader } from './components/common/PageLoader';
import { useCommandPalette } from './hooks/useCommandPalette';
import { CommandPaletteModal } from './components/common/CommandPaletteModal';

// Code-split route level chunks
const HomePage = React.lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const EditorPage = React.lazy(() => import('./pages/EditorPage').then((m) => ({ default: m.EditorPage })));
const DocumentsPage = React.lazy(() => import('./pages/DocumentsPage').then((m) => ({ default: m.DocumentsPage })));
const AuthPage = React.lazy(() => import('./pages/AuthPage').then((m) => ({ default: m.AuthPage })));
const PricingPage = React.lazy(() => import('./pages/PricingPage').then((m) => ({ default: m.PricingPage })));
const BlogPage = React.lazy(() => import('./pages/BlogPage').then((m) => ({ default: m.BlogPage })));
const UpdatesPage = React.lazy(() => import('./pages/UpdatesPage').then((m) => ({ default: m.UpdatesPage })));

export const App: React.FC = () => {
  const { checkAuth } = useAuthStore();
  const cmd = useCommandPalette();

  useEffect(() => {
    // 1. Seed initial demo documents into IndexedDB
    seedInitialDocuments().catch(console.error);

    // 2. Check active auth state (Supabase / local demo session)
    checkAuth().catch(console.error);
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <GlobalConfirmDialog />
      <CommandPaletteModal isOpen={cmd.isOpen} onClose={cmd.closePalette} />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/updates" element={<UpdatesPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/editor/:id" element={<EditorPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
