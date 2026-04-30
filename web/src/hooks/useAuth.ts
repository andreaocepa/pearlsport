import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    set({ isLoading: true });
    const supabase = createClient();
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      throw new Error(authError.message);
    }

    if (authData.user) {
      // Fetch profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profile) {
        set({
          user: {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            avatarUrl: profile.avatar_url,
          } as User,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
    }
    
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  logout: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    const supabase = createClient();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        set({
          user: {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            avatarUrl: profile.avatar_url,
          } as User,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
