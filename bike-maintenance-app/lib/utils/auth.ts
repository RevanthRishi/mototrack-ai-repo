import { supabase } from '@/lib/supabase/client';
import { AuthError, Session, User } from '@supabase/supabase-js';

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return {
    user: data.user,
    session: data.session,
    error,
  };
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName?: string
): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  // Create user profile after signup
  if (data.user && !error) {
    // Auto-create user profile row on signup (RLS allows own id)
    await supabase.from('users' as never).insert([{
      id: data.user.id,
      email: data.user.email!,
      full_name: fullName || null,
    }] as never);
  }

  return {
    user: data.user,
    session: data.session,
    error,
  };
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'mototrack://reset-password',
  });
  return { error };
}

/**
 * Get current session
 */
export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}
