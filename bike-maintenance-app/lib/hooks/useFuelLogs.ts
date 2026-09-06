import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFuelLogs, FuelLogRow } from '@/lib/supabase/queries';
import { useUserDataStore } from '@/lib/stores/userDataStore';

export function useFuelLogs(userId?: string | null) {
  const store = useUserDataStore();
  const query = useQuery<FuelLogRow[]>({
    queryKey: ['fuelLogs', userId],
    queryFn: () => getFuelLogs(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    store.setLoading('fuelLogs', query.isLoading);
    if (query.error) store.setError('fuelLogs', (query.error as Error).message);
    else if (query.data !== undefined) store.setError('fuelLogs', null);
  }, [query.isLoading, query.error, query.data]);

  useEffect(() => {
    if (query.data) store.setFuelLogs(query.data);
  }, [query.data]);

  return {
    logs: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refresh: () => query.refetch(),
  };
}
