import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DocumentMetadata } from '../db';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are provided and not placeholders
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your-anon-key')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Pushes document metadata and full content to Supabase in the background.
 */
export async function syncDocumentToSupabase(doc: DocumentMetadata, content: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    // 1. Upsert document metadata
    const { error: metaError } = await supabase.from('documents').upsert({
      id: doc.id,
      title: doc.title,
      snippet: doc.snippet,
      tags: doc.tags,
      is_pinned: doc.isPinned,
      is_favorite: doc.isFavorite,
      word_count: doc.wordCount,
      size_bytes: doc.sizeBytes,
      updated_at: new Date(doc.updatedAt).toISOString()
    });

    if (metaError) {
      console.warn('[Supabase Sync] Metadata error:', metaError.message);
      return false;
    }

    // 2. Upsert document full content
    const { error: contentError } = await supabase.from('document_contents').upsert({
      id: doc.id,
      content,
      updated_at: new Date(doc.updatedAt).toISOString()
    });

    if (contentError) {
      console.warn('[Supabase Sync] Content error:', contentError.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('[Supabase Sync] Failed to sync:', err);
    return false;
  }
}

/**
 * Pulls a document from Supabase if missing locally.
 */
export async function fetchDocumentFromSupabase(id: string): Promise<{ meta: DocumentMetadata; content: string } | null> {
  if (!supabase) return null;

  try {
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (docError || !docData) return null;

    const { data: contentData } = await supabase
      .from('document_contents')
      .select('content')
      .eq('id', id)
      .single();

    const meta: DocumentMetadata = {
      id: docData.id,
      title: docData.title,
      snippet: docData.snippet || '',
      tags: docData.tags || [],
      createdAt: new Date(docData.created_at).getTime(),
      updatedAt: new Date(docData.updated_at).getTime(),
      lastOpenedAt: Date.now(),
      openCount: 1,
      isPinned: docData.is_pinned || false,
      isFavorite: docData.is_favorite || false,
      wordCount: docData.word_count || 0,
      sizeBytes: docData.size_bytes || 0
    };

    return {
      meta,
      content: contentData?.content || ''
    };
  } catch (err) {
    console.warn('[Supabase Fetch] Error:', err);
    return null;
  }
}
