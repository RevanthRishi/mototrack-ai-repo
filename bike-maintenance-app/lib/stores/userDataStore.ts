import { create } from 'zustand';
import { VehicleRow, FuelLogRow, ServiceLogRow, UserRow } from '@/lib/supabase/queries';

interface UserData {
  profile: UserRow | null;
  vehicles: VehicleRow[];
  fuelLogs: FuelLogRow[];
  serviceLogs: ServiceLogRow[];
}

interface UserDataActions {
  setProfile: (p: UserRow | null) => void;
  setVehicles: (v: VehicleRow[]) => void;
  setFuelLogs: (f: FuelLogRow[]) => void;
  setServiceLogs: (s: ServiceLogRow[]) => void;
  reset: () => void;
}

/**
 * Read-only mirror of TanStack Query cache. Individual hooks (useVehicles,
 * useFuelLogs, useServiceLogs) own their own useQuery + refetch lifecycle.
 * The mirror lets cross-cutting components (e.g. profile counts) read the
 * latest values without subscribing to every screen's loading state.
 */
export const useUserDataStore = create<UserData & UserDataActions>((set) => ({
  profile: null,
  vehicles: [],
  fuelLogs: [],
  serviceLogs: [],

  setProfile: (profile) => set({ profile }),
  setVehicles: (vehicles) => set({ vehicles }),
  setFuelLogs: (fuelLogs) => set({ fuelLogs }),
  setServiceLogs: (serviceLogs) => set({ serviceLogs }),
  reset: () => set({ profile: null, vehicles: [], fuelLogs: [], serviceLogs: [] }),
}));

export const useProfile = () => useUserDataStore((s) => s.profile);
export const useVehicles = () => useUserDataStore((s) => s.vehicles);
export const useFuelLogs = () => useUserDataStore((s) => s.fuelLogs);
export const useServiceLogs = () => useUserDataStore((s) => s.serviceLogs);
