import { VehicleRow } from '@/lib/supabase/queries';

// Single source of truth: domain interface for Vehicle (wraps DB column names)
export type Vehicle = VehicleRow & {
  // UI-facing aliases — do NOT rename DB columns, just expose consistently
  odometer?: number | null; // alias for current_odometer (DB stays current_odometer)
};
