import { Database } from '../supabase/database.types';

export type UserRow = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    reminders: boolean;
    push: boolean;
    email: boolean;
  };
  biometric_enabled: boolean;
}

export type VehicleRow = Database['public']['Tables']['vehicles']['Row'];
export type VehicleInsert = Database['public']['Tables']['vehicles']['Insert'];
export type VehicleUpdate = Database['public']['Tables']['vehicles']['Update'];

export type VehicleType = 'motorcycle' | 'scooter' | 'moped';
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid';
export type VehicleStatus = 'active' | 'sold' | 'retired' | 'stolen';

export interface VehicleWithStats extends VehicleRow {
  totalFuelCost?: number;
  totalServiceCost?: number;
  averageMileage?: number;
  lastServiceDate?: string;
  nextServiceDueKm?: number;
  nextServiceDueDate?: string;
}

export type FuelLogRow = Database['public']['Tables']['fuel_logs']['Row'];
export type FuelLogInsert = Database['public']['Tables']['fuel_logs']['Insert'];
export type FuelLogUpdate = Database['public']['Tables']['fuel_logs']['Update'];

export type ServiceLogRow = Database['public']['Tables']['service_logs']['Row'];
export type ServiceLogInsert = Database['public']['Tables']['service_logs']['Insert'];
export type ServiceLogUpdate = Database['public']['Tables']['service_logs']['Update'];

export type ServiceSeverity = 'routine' | 'urgent' | 'critical';

export type ReminderRow = Database['public']['Tables']['reminders']['Row'];
export type ReminderInsert = Database['public']['Tables']['reminders']['Insert'];
export type ReminderUpdate = Database['public']['Tables']['reminders']['Update'];

export type ReminderType = 'odometer' | 'date' | 'both';
export type ReminderStatus = 'active' | 'snoozed' | 'completed' | 'dismissed';

export type AIDiagnosticRow = Database['public']['Tables']['ai_diagnostics']['Row'];
export type AIDiagnosticInsert = Database['public']['Tables']['ai_diagnostics']['Insert'];

export type DiagnosticSeverity = 'safe' | 'caution' | 'urgent' | 'critical';
export type DiagnosticRecommendation = 'diy' | 'professional' | 'immediate';

export interface DiagnosticResult {
  symptoms: string[];
  probableCauses: string[];
  estimatedCost: {
    min: number;
    max: number;
    currency: string;
  };
  severity: DiagnosticSeverity;
  recommendation: DiagnosticRecommendation;
  explanation: string;
  suggestedParts?: string[];
}
