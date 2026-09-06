import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PostgrestError } from '@supabase/supabase-js';
import { getFuelLogs } from '@/lib/supabase/queries';
import { FuelLog } from '@/lib/types';
import { useUserDataStore } from '@/lib/stores/userDataStore';

function friendlyFuelError(error: PostgrestError): string {
  if (error.code === 'PGRST204') return 'Fuel log column not found — check database schema.';
  if (error.code === 'PGRST116') return 'Fuel log not found.';
  if (error.code === '42501') return 'Access denied to fuel logs — please sign in again.';
  if (error.code === '400') {
    if (error.details?.includes('user_id')) return 'Query error — fuel logs require a valid vehicle. Add a vehicle first.';
    return `Couldn't load fuel logs. ${error.message}`;
  }
  if (error.code === '503') return 'Database unavailable — check your connection.';
  return `Fuel log error: ${error.message}`;
}

export function useFuelLogs(userId?: string | null) {
  const store = useUserDataStore();
  const query = useQuery<FuelLog[], PostgrestError>({
    queryKey: ['fuelLogs', userId],
    queryFn: () => getFuelLogs(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    store.setLoading('fuelLogs', query.isLoading);
    if (query.error) store.setError('fuelLogs', friendlyFuelError(query.error));
    else if (query.data !== undefined) store.setError('fuelLogs', null);
  }, [query.isLoading, query.error, query.data]);

  useEffect(() => {
    if (query.data) store.setFuelLogs(query.data);
  }, [query.data]);

  return {
    logs: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? friendlyFuelError(query.error) : null,
    refresh: () => query.refetch(),
  };
}
