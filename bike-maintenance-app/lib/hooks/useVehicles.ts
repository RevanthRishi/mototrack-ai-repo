import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { VehicleRow, VehicleInsert, VehicleUpdate } from '@/lib/types';

export interface UseVehiclesReturn {
  vehicles: VehicleRow[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addVehicle: (data: VehicleInsert) => Promise<VehicleRow | null>;
  updateVehicle: (id: string, data: VehicleUpdate) => Promise<VehicleRow | null>;
  deleteVehicle: (id: string) => Promise<boolean>;
}

export function useVehicles(): UseVehiclesReturn {
  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('vehicles' as never)
        .select('*')
        .order('created_at', { ascending: false });
      if (err) throw err;
      setVehicles((data || []) as VehicleRow[]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  }, []);

  const addVehicle = useCallback(async (data: VehicleInsert): Promise<VehicleRow | null> => {
    setError(null);
    try {
      const { data: result, error: err } = await supabase
        .from('vehicles' as never)
        .insert(data as never)
        .select()
        .single();
      if (err) throw err;
      await refresh();
      return result as VehicleRow;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to add vehicle');
      return null;
    }
  }, [refresh]);

  const updateVehicle = useCallback(async (id: string, data: VehicleUpdate): Promise<VehicleRow | null> => {
    setError(null);
    try {
      const { data: result, error: err } = await supabase
        .from('vehicles' as never)
        .update(data as never)
        .eq('id', id)
        .select()
        .single();
      if (err) throw err;
      await refresh();
      return result as VehicleRow;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update vehicle');
      return null;
    }
  }, [refresh]);

  const deleteVehicle = useCallback(async (id: string): Promise<boolean> => {
    setError(null);
    try {
      const { error: err } = await supabase.from('vehicles' as never).delete().eq('id', id);
      if (err) throw err;
      await refresh();
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete vehicle');
      return false;
    }
  }, [refresh]);

  return { vehicles, loading, error, refresh, addVehicle, updateVehicle, deleteVehicle };
}
