import { FuelLogRow } from '@/lib/supabase/queries';

/** Single source of truth for fuel log domain.
 *  DB column `quantity` exposed as UI alias `liters`; `odometer` stays `odometer`. */
export type FuelLog = FuelLogRow & {
  liters?: number; // alias for DB quantity
};
