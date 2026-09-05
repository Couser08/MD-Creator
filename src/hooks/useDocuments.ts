import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, DocumentMetadata, getDocumentContent, saveDocument, createNewDocument, deleteDocument, togglePinDocument, getStorageStats } from '../db';
import { pullCloudDocuments } from '../lib/supabase';

export function useDocuments(searchQuery = '', activeTag = 'All') {
  const queryClient = useQueryClient();

  // Background cloud pull to synchronize latest cloud documents into Dexie
  useEffect(() => {
    let isMounted = true;
    pullCloudDocuments().then((pulled) => {
      if (isMounted && pulled > 0) {
        queryClient.invalidateQueries({ queryKey: ['documents'] });
        queryClient.invalidateQueries({ queryKey: ['storage-stats'] });
      }
    }).catch(console.warn);
    return () => { isMounted = false; };
  }, [queryClient]);

  return useQuery({
    queryKey: ['documents', searchQuery, activeTag],
    queryFn: async (): Promise<DocumentMetadata[]> => {
      let docs = await db.documents.toArray();

      if (activeTag && activeTag !== 'All') {
        docs = docs.filter(doc => doc.tags.includes(activeTag));
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        docs = docs.filter(
          doc =>
            doc.title.toLowerCase().includes(q) ||
            doc.snippet.toLowerCase().includes(q) ||
            doc.tags.some(t => t.toLowerCase().includes(q))
        );
      }

      // Pinned first, then sorted by updatedAt descending
      return docs.sort((a, b) => {
        if (a.isPinned === b.isPinned) {
          return b.updatedAt - a.updatedAt;
        }
        return a.isPinned ? -1 : 1;
      });
    }
  });
}

/**
 * Lazy content fetcher: only called when opening the document in editor or preview modal.
 */
export function useDocumentContent(id: string | null | undefined) {
  return useQuery({
    queryKey: ['document-content', id],
    queryFn: async () => {
      if (!id) return '';
      return await getDocumentContent(id);
    },
    enabled: !!id
  });
}

export function useStorageStats() {
  return useQuery({
    queryKey: ['storage-stats'],
    queryFn: async () => {
      return await getStorageStats();
    }
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ title, content }: { title?: string; content?: string }) => {
      return await createNewDocument(title, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['storage-stats'] });
    }
  });
}

export function useSaveDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, title, content, tags }: { id: string; title: string; content: string; tags?: string[] }) => {
      await saveDocument(id, title, content, tags);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document-content', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['storage-stats'] });
    }
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDocument(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['storage-stats'] });
    }
  });
}

export function useTogglePin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await togglePinDocument(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    }
  });
}
