import { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { upsertUserProfile } from '@/lib/utils/users';
import { useThemeStore } from '@/lib/stores/themeStore';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // On every new sign-in, sync the public.users profile row with
      // whatever metadata the auth provider supplied. OAuth providers
      // (Google, Apple, etc.) deliver name + avatar only at sign-in time,
      // so this is the only safe place to capture them.
      if (session?.user && event === 'SIGNED_IN') {
        upsertUserProfile({
          id: session.user.id,
          email: session.user.email ?? '',
          fullName: session.user.user_metadata?.full_name ?? session.user.user_metadata?.name ?? null,
        }).catch((e) => console.warn('[useAuth] profile upsert threw', e));

        // Read per-user theme preference from DB
        supabase.from('users').select('theme_dark').eq('id', session.user.id).single()
          .then(({ data }) => {
            if (data && typeof data.theme_dark === 'boolean') {
              useThemeStore.getState().setDark(data.theme_dark);
            }
          })
          .catch((e) => console.warn('[useAuth] theme read failed', e));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const reset = () => {
    setUser(null);
    setSession(null);
  };

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    reset,
  };
}
