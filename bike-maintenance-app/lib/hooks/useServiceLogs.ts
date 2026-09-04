import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { ServiceLogRow, ServiceLogInsert, ServiceLogUpdate } from '@/lib/types';

export interface UseServiceLogsReturn {
  logs: ServiceLogRow[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addLog: (data: ServiceLogInsert) => Promise<ServiceLogRow | null>;
  updateLog: (id: string, data: ServiceLogUpdate) => Promise<ServiceLogRow | null>;
  deleteLog: (id: string) => Promise<boolean>;
}

export function useServiceLogs(vehicleId: string | null): UseServiceLogsReturn {
  const [logs, setLogs] = useState<ServiceLogRow[]>([]);
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
        .from('service_logs' as never)
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('date', { ascending: false });
      if (err) throw err;
      setLogs((data || []) as ServiceLogRow[]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load service logs');
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  const addLog = useCallback(async (data: ServiceLogInsert): Promise<ServiceLogRow | null> => {
    setError(null);
    try {
      const { data: result, error: err } = await supabase
        .from('service_logs' as never)
        .insert(data as never)
        .select()
        .single();
      if (err) throw err;
      await refresh();
      return result as ServiceLogRow;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to add service log');
      return null;
    }
  }, [refresh]);

  const updateLog = useCallback(async (id: string, data: ServiceLogUpdate): Promise<ServiceLogRow | null> => {
    setError(null);
    try {
      const { data: result, error: err } = await supabase
        .from('service_logs' as never)
        .update(data as never)
        .eq('id', id)
        .select()
        .single();
      if (err) throw err;
      await refresh();
      return result as ServiceLogRow;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update service log');
      return null;
    }
  }, [refresh]);

  const deleteLog = useCallback(async (id: string): Promise<boolean> => {
    setError(null);
    try {
      const { error: err } = await supabase.from('service_logs' as never).delete().eq('id', id);
      if (err) throw err;
      await refresh();
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete service log');
      return false;
    }
  }, [refresh]);

  return { logs, loading, error, refresh, addLog, updateLog, deleteLog };
}
