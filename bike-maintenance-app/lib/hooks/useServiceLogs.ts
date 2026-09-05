import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getServiceLogs, ServiceLogRow } from '@/lib/supabase/queries';
import { useUserDataStore } from '@/lib/stores/userDataStore';

export function useServiceLogs(userId?: string | null) {
  const query = useQuery<ServiceLogRow[]>({
    queryKey: ['serviceLogs', userId],
    queryFn: () => getServiceLogs(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (query.data) useUserDataStore.getState().setServiceLogs(query.data);
  }, [query.data]);

  return {
    logs: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refresh: () => query.refetch(),
  };
}
