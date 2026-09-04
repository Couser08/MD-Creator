import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { EditorPage } from './pages/EditorPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { AuthPage } from './pages/AuthPage';
import { seedInitialDocuments } from './db/seed';
import { useAuthStore } from './stores/useAuthStore';

export const App: React.FC = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // 1. Seed initial demo documents into IndexedDB
    seedInitialDocuments().catch(console.error);

    // 2. Check active auth state (Supabase / local demo session)
    checkAuth().catch(console.error);
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/editor/:id" element={<EditorPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
