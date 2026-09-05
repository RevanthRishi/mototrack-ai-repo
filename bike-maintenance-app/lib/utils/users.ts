import { getSupabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

type UserInsert = Database['public']['Tables']['users']['Insert'];

export interface CreateUserProfileInput {
  id: string;
  email: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  themeDark?: boolean | null;
}

/**
 * Build a typed insert payload for the public.users table.
 * Centralized so the email/full_name/avatar_url mapping is not duplicated
 * between email signup and OAuth callback paths.
 */
export function buildUserProfileInsert(input: CreateUserProfileInput): UserInsert {
  return {
    id: input.id,
    email: input.email,
    full_name: input.fullName ?? null,
    avatar_url: input.avatarUrl ?? null,
    theme_dark: input.themeDark ?? true,
  };
}

/**
 * Upsert a public.users row for the given auth user.
 * Silently no-ops on failure — profile rows are best-effort and RLS-protected;
 * the auth flow must not be blocked by a profile write.
 */
/**
 * Upsert a public.users row for the given auth user.
 * Silently no-ops on failure — profile rows are best-effort and RLS-protected;
 * the auth flow must not be blocked by a profile write.
 */
export async function upsertUserProfile(input: CreateUserProfileInput): Promise<void> {
  const { error } = await getSupabase()
    .from('users')
    .upsert(buildUserProfileInsert(input), { onConflict: 'id' });
  if (error) {
    console.warn('[users] upsert failed', { id: input.id, message: error.message });
  }
}

// Re-export Database so other modules can import the row type from one place.
export type { Database };
