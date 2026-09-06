import { Platform } from 'react-native';
import { getSupabase } from '@/lib/supabase/client';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { upsertUserProfile } from './users';
import { ApiResponse, okResponse, failResponse } from '@/lib/types/api-response';

/**
 * Returns a human-readable error message grouped by failure type.
 * Centralizes Supabase auth error messaging so UI does not guess.
 */
export function getAuthErrorMessage(error: AuthError | null | undefined): string {
  if (!error) return 'An unexpected error occurred';

  const msg = error.message?.toLowerCase() ?? '';
  const code = error.code ?? '';

  if (msg.includes('invalid login') || msg.includes('invalid credentials') || msg.includes('wrong password')) {
    return 'Incorrect email or password. Please try again.';
  }
  if (msg.includes('email') && msg.includes('not registered')) {
    return 'No account found with this email. Sign up first.';
  }
  if (msg.includes('user already') || code === 'user_already_exists') {
    return 'An account with this email already exists. Try logging in.';
  }
  if (msg.includes('email') && msg.includes('confirm')) {
    return 'Please verify your email first. Check your inbox.';
  }
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('connection')) {
    return 'Network error. Check your connection and try again.';
  }
  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (msg.includes('weak password')) {
    return 'Password is too weak. Use at least 8 characters with numbers and symbols.';
  }
  return error.message ?? 'Something went wrong. Please try again.';
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<ApiResponse<{ user: User | null; session: Session | null }>> {
  const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
  if (error) return failResponse(getAuthErrorMessage(error), error.code);
  return okResponse({ user: data.user, session: data.session });
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName?: string
): Promise<ApiResponse<{ user: User | null; session: Session | null }>> {
  const { data, error } = await getSupabase().auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) return failResponse(getAuthErrorMessage(error), error.code);
  if (data.user) {
    upsertUserProfile({ id: data.user.id, email: data.user.email ?? '', fullName: fullName ?? null });
  }
  return okResponse({ user: data.user, session: data.session });
}

/**
 * Sign in with Google OAuth.
 * After the redirect, the auth state listener (root layout) receives the session
 * and upserts the user profile with Google metadata (full_name, avatar_url).
 * This function returns immediately after launching the OAuth flow.
 */
export async function signInWithGoogle(): Promise<ApiResponse<null>> {
  const isWeb = Platform.OS === 'web';
  type WindowLike = { location?: { origin?: string } };
  const origin: string = isWeb ? ((globalThis as unknown as WindowLike).location?.origin ?? '') : '';
  const redirectTo = isWeb ? `${origin}/(tabs)` : 'mototrack://(tabs)';

  const { error } = await getSupabase().auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: !isWeb, queryParams: { prompt: 'select_account' } },
  });
  if (error) return failResponse(getAuthErrorMessage(error), error.code);
  return okResponse(null);
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<ApiResponse<null>> {
  const { error } = await getSupabase().auth.signOut();
  if (error) return failResponse(getAuthErrorMessage(error), error.code);
  return okResponse(null);
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<ApiResponse<null>> {
  const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
    redirectTo: 'mototrack://reset-password',
  });
  if (error) return failResponse(getAuthErrorMessage(error), error.code);
  return okResponse(null);
}

/**
 * Get current session
 */
export async function getSession(): Promise<ApiResponse<Session | null>> {
  const { data, error } = await getSupabase().auth.getSession();
  if (error) return failResponse(getAuthErrorMessage(error), error.code);
  return okResponse(data.session);
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<ApiResponse<User | null>> {
  const { data, error } = await getSupabase().auth.getUser();
  if (error) return failResponse(getAuthErrorMessage(error), error.code);
  return okResponse(data.user);
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  return getSupabase().auth.onAuthStateChange(callback);
}
