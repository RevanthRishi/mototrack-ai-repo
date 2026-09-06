import { useEffect } from 'react';
import { useUserDataStore } from '@/lib/stores/userDataStore';
import { useQuery } from '@tanstack/react-query';
import { getServiceLogs, ServiceLogRow } from '@/lib/supabase/queries';

export function useServiceLogs(userId?: string | null) {
  const store = useUserDataStore();
  const query = useQuery<ServiceLogRow[]>({
    queryKey: ['serviceLogs', userId],
    queryFn: () => getServiceLogs(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    store.setLoading('serviceLogs', query.isLoading);
    if (query.error) store.setError('serviceLogs', (query.error as Error).message);
    else if (query.data !== undefined) store.setError('serviceLogs', null);
  }, [query.isLoading, query.error, query.data]);

  useEffect(() => {
    if (query.data) store.setServiceLogs(query.data);
  }, [query.data]);

  return {
    logs: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refresh: () => query.refetch(),
  };
}
