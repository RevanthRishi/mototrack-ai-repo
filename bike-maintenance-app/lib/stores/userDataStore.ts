import { create } from 'zustand';
import { Vehicle, FuelLog, ServiceLog, UserProfile } from '@/lib/types';

/**
 * Read-only mirror of TanStack Query cache.
 * Single source of truth: Garage (index tab) fetches all data once;
 * other tabs read from this store. Mutations update the store directly
 * so other tabs see the change without re-fetching.
 */
interface UserData {
  profile: UserProfile | null;
  vehicles: Vehicle[];
  fuelLogs: FuelLog[];
  serviceLogs: ServiceLog[];
  loading: { vehicles: boolean; fuelLogs: boolean; serviceLogs: boolean; profile: boolean };
  errors: { vehicles: string | null; fuelLogs: string | null; serviceLogs: string | null; profile: string | null };
}

interface UserDataActions {
  setProfile: (p: UserProfile | null) => void;
  setVehicles: (v: Vehicle[]) => void;
  setFuelLogs: (f: FuelLog[]) => void;
  setServiceLogs: (s: ServiceLog[]) => void;
  setLoading: (key: keyof UserData['loading'], value: boolean) => void;
  setError: (key: keyof UserData['errors'], value: string | null) => void;
  // Mutation actions — keep store in sync without triggering refetch storms
  upsertVehicle: (v: Vehicle) => void;
  removeVehicle: (id: string) => void;
  upsertFuelLog: (f: FuelLog) => void;
  removeFuelLog: (id: string) => void;
  upsertServiceLog: (s: ServiceLog) => void;
  removeServiceLog: (id: string) => void;
  reset: () => void;
}

const initial = (): UserData => ({
  profile: null,
  vehicles: [],
  fuelLogs: [],
  serviceLogs: [],
  loading: { vehicles: false, fuelLogs: false, serviceLogs: false, profile: false },
  errors: { vehicles: null, fuelLogs: null, serviceLogs: null, profile: null },
});

export const useUserDataStore = create<UserData & UserDataActions>((set) => ({
  ...initial(),

  setProfile: (profile) => set({ profile }),
  setVehicles: (vehicles) => set({ vehicles }),
  setFuelLogs: (fuelLogs) => set({ fuelLogs }),
  setServiceLogs: (serviceLogs) => set({ serviceLogs }),
  setLoading: (key, value) =>
    set((s) => ({ loading: { ...s.loading, [key]: value } })),
  setError: (key, value) =>
    set((s) => ({ errors: { ...s.errors, [key]: value } })),

  upsertVehicle: (v) =>
    set((s) => {
      const idx = s.vehicles.findIndex((x) => x.id === v.id);
      const next = idx >= 0 ? [...s.vehicles] : [v, ...s.vehicles];
      if (idx >= 0) next[idx] = v;
      return { vehicles: next };
    }),
  removeVehicle: (id) =>
    set((s) => ({ vehicles: s.vehicles.filter((v) => v.id !== id) })),

  upsertFuelLog: (f) =>
    set((s) => {
      const idx = s.fuelLogs.findIndex((x) => x.id === f.id);
      const next = idx >= 0 ? [...s.fuelLogs] : [f, ...s.fuelLogs];
      if (idx >= 0) next[idx] = f;
      return { fuelLogs: next };
    }),
  removeFuelLog: (id) =>
    set((s) => ({ fuelLogs: s.fuelLogs.filter((f) => f.id !== id) })),

  upsertServiceLog: (s) =>
    set((st) => {
      const idx = st.serviceLogs.findIndex((x) => x.id === s.id);
      const next = idx >= 0 ? [...st.serviceLogs] : [s, ...st.serviceLogs];
      if (idx >= 0) next[idx] = s;
      return { serviceLogs: next };
    }),
  removeServiceLog: (id) =>
    set((st) => ({ serviceLogs: st.serviceLogs.filter((l) => l.id !== id) })),

  reset: () => set(initial()),
}));

// Selectors
export const useProfile = () => useUserDataStore((s) => s.profile);
export const useVehicles = () => useUserDataStore((s) => s.vehicles);
export const useFuelLogs = () => useUserDataStore((s) => s.fuelLogs);
export const useServiceLogs = () => useUserDataStore((s) => s.serviceLogs);
export const useUserLoading = () => useUserDataStore((s) => s.loading);
export const useUserErrors = () => useUserDataStore((s) => s.errors);
