import { supabase } from './client';
import { Database } from './database.types';

export type VehicleRow = Database['public']['Tables']['vehicles']['Row'];
export type UserRow = Database['public']['Tables']['users']['Row'];

// Fetch current user's vehicles (with user profile for display)
export async function getVehicles(userId: string): Promise<VehicleRow[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// Fetch user profile (for theme/user info)
export async function getUserProfile(userId: string): Promise<UserRow | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, email, country_code, currency, distance_unit, theme_dark, subscription_tier, subscription_expires_at, avatar_url, created_at')
    .eq('id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found, ok
  return data;
}
