import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  isDemoUser?: boolean;
}

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  demoSignIn: (name?: string, email?: string) => void;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const DEMO_USER_STORAGE_KEY = 'md_writer_demo_user';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,

  checkAuth: async () => {
    // 1. Check local demo user first
    const savedDemo = localStorage.getItem(DEMO_USER_STORAGE_KEY);
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        set({ user: parsed, isLoading: false });
        return;
      } catch (e) {
        localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      }
    }

    // 2. If Supabase configured, check active session
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const u = session.user;
          set({
            user: {
              id: u.id,
              email: u.email || '',
              displayName: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Writer',
              avatarUrl: u.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              isDemoUser: false
            },
            isLoading: false
          });
          return;
        }
      } catch (err) {
        console.warn('Supabase getSession check failed:', err);
      }
    }

    set({ user: null, isLoading: false });
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    // If Supabase is configured
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        set({ error: error.message, isLoading: false });
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          displayName: data.user.user_metadata?.full_name || email.split('@')[0],
          avatarUrl: data.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          isDemoUser: false
        };
        set({ user: profile, isLoading: false });
        return { success: true };
      }
    }

    // Fallback if Supabase not configured: simulate demo sign in
    const demoUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email,
      displayName: email.split('@')[0] || 'Rahul Mehta',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isDemoUser: true
    };
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
    set({ user: demoUser, isLoading: false });
    return { success: true };
  },

  signUp: async (email: string, password: string, name?: string) => {
    set({ isLoading: true, error: null });

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name || email.split('@')[0],
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          }
        }
      });

      if (error) {
        set({ error: error.message, isLoading: false });
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          displayName: name || email.split('@')[0],
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          isDemoUser: false
        };
        set({ user: profile, isLoading: false });
        return { success: true };
      }
    }

    // Fallback demo signup
    const demoUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email,
      displayName: name || email.split('@')[0] || 'Rahul Mehta',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isDemoUser: true
    };
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
    set({ user: demoUser, isLoading: false });
    return { success: true };
  },

  demoSignIn: (name = 'Rahul Mehta', email = 'rahul.mehta@example.com') => {
    const demoUser: UserProfile = {
      id: 'usr_rahul_mehta_demo',
      email,
      displayName: name,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isDemoUser: true
    };
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
    set({ user: demoUser, isLoading: false, error: null });
  },

  signOut: async () => {
    localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut().catch(console.warn);
    }
    set({ user: null, isLoading: false, error: null });
  }
}));
