import { useEffect } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { useUserDataStore } from '@/lib/stores/userDataStore';
import { useQuery } from '@tanstack/react-query';
import { getServiceLogs } from '@/lib/supabase/queries';
import { ServiceLog } from '@/lib/types';

function friendlyServiceError(error: PostgrestError): string {
  if (error.code === 'PGRST204') return 'Service log column not found — check database schema.';
  if (error.code === 'PGRST116') return 'Service log not found.';
  if (error.code === '42501') return 'Access denied to service logs — please sign in again.';
  if (error.code === '400') {
    if (error.details?.includes('user_id')) return 'Query error — service logs require a valid vehicle. Add a vehicle first.';
    return `Couldn't load service logs. ${error.message}`;
  }
  if (error.code === '503') return 'Database unavailable — check your connection.';
  return `Service log error: ${error.message}`;
}

export function useServiceLogs(userId?: string | null) {
  const store = useUserDataStore();
  const query = useQuery<ServiceLog[], PostgrestError>({
    queryKey: ['serviceLogs', userId],
    queryFn: () => getServiceLogs(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    store.setLoading('serviceLogs', query.isLoading);
    if (query.error) store.setError('serviceLogs', friendlyServiceError(query.error));
    else if (query.data !== undefined) store.setError('serviceLogs', null);
  }, [query.isLoading, query.error, query.data]);

  useEffect(() => {
    if (query.data) store.setServiceLogs(query.data);
  }, [query.data]);

  return {
    logs: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? friendlyServiceError(query.error) : null,
    refresh: () => query.refetch(),
  };
}
