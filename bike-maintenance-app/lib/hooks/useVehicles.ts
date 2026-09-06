import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getVehicles, VehicleRow } from '@/lib/supabase/queries';
import { useUserDataStore } from '@/lib/stores/userDataStore';

export function useVehicles(userId?: string | null) {
  const store = useUserDataStore();
  const query = useQuery<VehicleRow[]>({
    queryKey: ['vehicles', userId],
    queryFn: () => getVehicles(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    store.setLoading('vehicles', query.isLoading);
    if (query.error) store.setError('vehicles', (query.error as Error).message);
    else if (query.data !== undefined) store.setError('vehicles', null);
  }, [query.isLoading, query.error, query.data]);

  useEffect(() => {
    if (query.data) store.setVehicles(query.data);
  }, [query.data]);

  return {
    vehicles: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refresh: () => query.refetch(),
  };
}
