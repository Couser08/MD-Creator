import { create } from 'zustand';
import { supabase, isSupabaseConfigured, checkEmailExists, syncAllDocuments } from '../lib/supabase';

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
const LOCAL_USERS_STORAGE_KEY = 'md_writer_registered_accounts';

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

          // Run background cloud sync on app start
          syncAllDocuments().catch(console.warn);
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
    const cleanEmail = email.trim().toLowerCase();

    // If Supabase is configured
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      if (error) {
        const friendlyMessage = error.message.toLowerCase().includes('invalid login credentials')
          ? 'Invalid email or password. Please verify your credentials or sign up.'
          : error.message;
        set({ error: friendlyMessage, isLoading: false });
        return { success: false, error: friendlyMessage };
      }

      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          displayName: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
          avatarUrl: data.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          isDemoUser: false
        };
        set({ user: profile, isLoading: false });

        // Pull latest cloud documents on sign in
        syncAllDocuments().catch(console.warn);
        return { success: true };
      }
    }

    // Fallback if Supabase not configured: verify against local accounts registry
    const rawAccounts = localStorage.getItem(LOCAL_USERS_STORAGE_KEY);
    const localAccounts: Array<{ email: string; name: string }> = rawAccounts ? JSON.parse(rawAccounts) : [];
    const found = localAccounts.find(acc => acc.email === cleanEmail);

    const demoUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      displayName: found ? found.name : cleanEmail.split('@')[0] || 'Rahul Mehta',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isDemoUser: true
    };
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
    set({ user: demoUser, isLoading: false });
    return { success: true };
  },

  signUp: async (email: string, password: string, name?: string) => {
    set({ isLoading: true, error: null });
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured() && supabase) {
      // 1. Explicit check if email already exists in profiles
      const exists = await checkEmailExists(cleanEmail);
      if (exists) {
        const msg = 'An account with this email address already exists. Please sign in instead.';
        set({ error: msg, isLoading: false });
        return { success: false, error: msg };
      }

      // 2. Perform Supabase auth registration
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: name || cleanEmail.split('@')[0],
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          }
        }
      });

      if (error) {
        const errorMsg = error.message.toLowerCase().includes('already registered')
          ? 'An account with this email address already exists. Please sign in instead.'
          : error.message;
        set({ error: errorMsg, isLoading: false });
        return { success: false, error: errorMsg };
      }

      // If Supabase has email confirmation enabled, identities array is empty when user already exists
      if (data.user?.identities && data.user.identities.length === 0) {
        const msg = 'An account with this email address already exists. Please sign in instead.';
        set({ error: msg, isLoading: false });
        return { success: false, error: msg };
      }

      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          displayName: name || cleanEmail.split('@')[0],
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          isDemoUser: false
        };
        set({ user: profile, isLoading: false });

        // Sync documents immediately on signup
        syncAllDocuments().catch(console.warn);
        return { success: true };
      }
    }

    // Fallback demo signup: check local registered accounts
    const rawAccounts = localStorage.getItem(LOCAL_USERS_STORAGE_KEY);
    const localAccounts: Array<{ email: string; name: string }> = rawAccounts ? JSON.parse(rawAccounts) : [];
    if (localAccounts.some(acc => acc.email === cleanEmail)) {
      const msg = 'An account with this email address already exists. Please sign in instead.';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }

    localAccounts.push({ email: cleanEmail, name: name || cleanEmail.split('@')[0] });
    localStorage.setItem(LOCAL_USERS_STORAGE_KEY, JSON.stringify(localAccounts));

    const demoUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      displayName: name || cleanEmail.split('@')[0] || 'Rahul Mehta',
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
