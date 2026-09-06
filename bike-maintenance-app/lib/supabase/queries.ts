import { getSupabase } from './client';
import { Database } from './database.types';

export type VehicleRow = Database['public']['Tables']['vehicles']['Row'];
export type FuelLogRow = Database['public']['Tables']['fuel_logs']['Row'];
export type ServiceLogRow = Database['public']['Tables']['service_logs']['Row'];
export type UserRow = Database['public']['Tables']['users']['Row'];

// ── Vehicles ──────────────────────────────────────────────────────────────────

export async function getVehicle(vehicleId: string): Promise<VehicleRow | null> {
  const { data, error } = await getSupabase()
    .from('vehicles')
    .select('*')
    .eq('id', vehicleId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data ?? null;
}

export async function updateVehicle(
  vehicleId: string,
  updates: Partial<Pick<VehicleRow, 'name' | 'make' | 'model' | 'year' | 'variant' | 'vehicle_type' | 'odometer'>>
): Promise<VehicleRow> {
  const { data, error } = await getSupabase()
    .from('vehicles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', vehicleId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteVehicle(vehicleId: string): Promise<void> {
  const { error } = await getSupabase()
    .from('vehicles')
    .delete()
    .eq('id', vehicleId);
  if (error) throw error;
}

export async function getVehicles(userId: string): Promise<VehicleRow[]> {
  const { data, error } = await getSupabase()
    .from('vehicles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function insertVehicle(data: {
  user_id: string;
  make: string;
  model: string;
  name: string;
  year: number;
  odometer: number;
}): Promise<VehicleRow> {
  const { data: result, error } = await getSupabase()
    .from('vehicles')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return result;
}

// ── Fuel Logs ─────────────────────────────────────────────────────────────────

export async function getFuelLogs(userId: string): Promise<FuelLogRow[]> {
  const { data, error } = await getSupabase()
    .from('fuel_logs')
    .select('id, date, quantity, cost, odometer, notes, vehicle_id, user_id, created_at')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  if (error) throw error;
  // DB column is `quantity`; expose as `liters` for UI consistency
  return ((data ?? []) as any[]).map((r) => ({ ...r, liters: r.quantity }));
}

export async function insertFuelLog(data: {
  user_id: string;
  vehicle_id: string;
  date: string;
  quantity: number;
  cost: number;
  odometer: number;
  notes?: string | null;
}): Promise<FuelLogRow> {
  const { data: result, error } = await getSupabase()
    .from('fuel_logs')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return { ...(result as any), liters: (result as any)?.quantity };
}

export async function deleteFuelLog(logId: string): Promise<void> {
  const { error } = await getSupabase().from('fuel_logs').delete().eq('id', logId);
  if (error) throw error;
}

// ── Service Logs ─────────────────────────────────────────────────────────────

export async function getServiceLogs(userId: string): Promise<ServiceLogRow[]> {
  const { data, error } = await getSupabase()
    .from('service_logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function insertServiceLog(data: {
  user_id: string;
  vehicle_id: string;
  date: string;
  service_type: string;
  cost: number;
  odometer: number;
  notes?: string | null;
}): Promise<ServiceLogRow> {
  const { data: result, error } = await getSupabase()
    .from('service_logs')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return result;
}

export async function deleteServiceLog(logId: string): Promise<void> {
  const { error } = await getSupabase().from('service_logs').delete().eq('id', logId);
  if (error) throw error;
}

// ── User Profile ──────────────────────────────────────────────────────────────

/** Fetch user profile + theme in one query. Used by useAuth on sign-in. */
export async function getProfile(userId: string): Promise<UserRow | null> {
  const { data, error } = await getSupabase()
    .from('users')
    .select(
      'id, email, full_name, avatar_url, country_code, currency, distance_unit, volume_unit, preferences, subscription_tier, subscription_expires_at, theme_dark, created_at, updated_at'
    )
    .eq('id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return (data ?? null) as UserRow | null;
}

/** Persist theme preference to DB. Called by theme toggle. */
export async function updateTheme(userId: string, themeDark: boolean): Promise<void> {
  const { error } = await getSupabase()
    .from('users')
    .update({ theme_dark: themeDark })
    .eq('id', userId);
  if (error) console.warn('[queries] updateTheme failed', error.message);
}
