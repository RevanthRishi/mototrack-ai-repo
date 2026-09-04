import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { FuelLogRow, FuelLogInsert, FuelLogUpdate } from '@/lib/types';

export interface UseFuelLogsReturn {
  logs: FuelLogRow[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addLog: (data: FuelLogInsert) => Promise<FuelLogRow | null>;
  updateLog: (id: string, data: FuelLogUpdate) => Promise<FuelLogRow | null>;
  deleteLog: (id: string) => Promise<boolean>;
}

export function useFuelLogs(vehicleId: string | null): UseFuelLogsReturn {
  const [logs, setLogs] = useState<FuelLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!vehicleId) {
      setLogs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('fuel_logs' as never)
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('date', { ascending: false });
      if (err) throw err;
      setLogs((data || []) as FuelLogRow[]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load fuel logs');
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  const addLog = useCallback(async (data: FuelLogInsert): Promise<FuelLogRow | null> => {
    setError(null);
    try {
      const { data: result, error: err } = await supabase
        .from('fuel_logs' as never)
        .insert(data as never)
        .select()
        .single();
      if (err) throw err;
      await refresh();
      return result as FuelLogRow;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to add fuel log');
      return null;
    }
  }, [refresh]);

  const updateLog = useCallback(async (id: string, data: FuelLogUpdate): Promise<FuelLogRow | null> => {
    setError(null);
    try {
      const { data: result, error: err } = await supabase
        .from('fuel_logs' as never)
        .update(data as never)
        .eq('id', id)
        .select()
        .single();
      if (err) throw err;
      await refresh();
      return result as FuelLogRow;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update fuel log');
      return null;
    }
  }, [refresh]);

  const deleteLog = useCallback(async (id: string): Promise<boolean> => {
    setError(null);
    try {
      const { error: err } = await supabase.from('fuel_logs' as never).delete().eq('id', id);
      if (err) throw err;
      await refresh();
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete fuel log');
      return false;
    }
  }, [refresh]);

  return { logs, loading, error, refresh, addLog, updateLog, deleteLog };
}
