import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFuelLogs, FuelLogRow } from '@/lib/supabase/queries';
import { useUserDataStore } from '@/lib/stores/userDataStore';

export function useFuelLogs(userId?: string | null) {
  const query = useQuery<FuelLogRow[]>({
    queryKey: ['fuelLogs', userId],
    queryFn: () => getFuelLogs(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (query.data) useUserDataStore.getState().setFuelLogs(query.data);
  }, [query.data]);

  return {
    logs: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refresh: () => query.refetch(),
  };
}
