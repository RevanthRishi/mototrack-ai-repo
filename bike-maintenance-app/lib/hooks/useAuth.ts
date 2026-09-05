import { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase/client';
import { upsertUserProfile } from '@/lib/utils/users';
import { getProfile } from '@/lib/supabase/queries';
import { useThemeStore } from '@/lib/stores/themeStore';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    getSupabase().auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange((event, session) => {
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

        // Read profile + theme in one query
        getProfile(session.user.id)
          .then((data) => {
            if (data && typeof data.theme_dark === 'boolean') {
              useThemeStore.getState().setDark(data.theme_dark);
            }
          })
          .catch((e) => console.warn('[useAuth] profile read failed', e));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const reset = () => {
    // Don't null user here — let auth state change drive it naturally.
    // Manual reset causes a brief loading=true/user=null gap that flashes
    // the AuthLayout spinner on logout.
  };

  const setLoggingOut = (val: boolean) => setIsLoggingOut(val);

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    reset,
    isLoggingOut,
    setLoggingOut,
  };
}
