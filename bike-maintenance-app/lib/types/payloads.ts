/**
 * Centralized request payload interfaces for every backend/DB/API call.
 * Use these instead of inline object types so other devs know exactly what
 * to pass and what comes back.
 */
import type { Session, User } from '@supabase/supabase-js';
import type { Database } from '../supabase/database.types';

export type VehicleRow = Database['public']['Tables']['vehicles']['Row'];
export type FuelLogRow = Database['public']['Tables']['fuel_logs']['Row'];
export type ServiceLogRow = Database['public']['Tables']['service_logs']['Row'];
export type UserRow = Database['public']['Tables']['users']['Row'];

// ── Auth payloads ────────────────────────────────────────────────────────────

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload extends SignInPayload {
  fullName?: string;
}

export interface AuthResult {
  user: User | null;
  session: Session | null;
}

export interface ResetPasswordPayload {
  email: string;
}

// ── Vehicle payloads ─────────────────────────────────────────────────────────

export interface AddVehiclePayload {
  user_id: string;
  make: string;
  model: string;
  name: string;
  year: number;
  odometer: number;
}

export interface UpdateVehiclePayload {
  name?: string;
  make?: string;
  model?: string;
  year?: number;
  variant?: string;
  vehicle_type?: string;
  odometer?: number;
}

// ── Profile payloads ─────────────────────────────────────────────────────────

export interface UpdateProfilePayload {
  full_name?: string;
  avatar_url?: string;
  theme_dark?: boolean;
  country_code?: string;
  currency?: string;
  distance_unit?: string;
  volume_unit?: string;
  preferences?: Record<string, unknown>;
}
