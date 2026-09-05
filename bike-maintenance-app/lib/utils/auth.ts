import { Platform } from 'react-native';
import { getSupabase } from '@/lib/supabase/client';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { upsertUserProfile } from './users';

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthResponse> {
  const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
  return { user: data.user, session: data.session, error };
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName?: string
): Promise<AuthResponse> {
  const { data, error } = await getSupabase().auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (data.user && !error) {
    upsertUserProfile({ id: data.user.id, email: data.user.email ?? '', fullName: fullName ?? null });
  }
  return { user: data.user, session: data.session, error };
}

/**
 * Sign in with Google OAuth.
 * After the redirect, the auth state listener (root layout) receives the session
 * and upserts the user profile with Google metadata (full_name, avatar_url).
 * This function returns immediately after launching the OAuth flow.
 */
export async function signInWithGoogle(): Promise<AuthResponse> {
  const isWeb = Platform.OS === 'web';
  type WindowLike = { location?: { origin?: string } };
  const origin: string = isWeb ? ((globalThis as unknown as WindowLike).location?.origin ?? '') : '';
  const redirectTo = isWeb ? `${origin}/(tabs)` : 'mototrack://(tabs)';

  const { error } = await getSupabase().auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: !isWeb, queryParams: { prompt: 'select_account' } },
  });
  return { user: null, session: null, error };
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await getSupabase().auth.signOut();
  return { error };
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
    redirectTo: 'mototrack://reset-password',
  });
  return { error };
}

/**
 * Get current session
 */
export async function getSession(): Promise<Session | null> {
  const { data } = await getSupabase().auth.getSession();
  return data.session;
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data } = await getSupabase().auth.getUser();
  return data.user;
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  return getSupabase().auth.onAuthStateChange(callback);
}
