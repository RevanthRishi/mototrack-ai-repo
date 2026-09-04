import { useQuery } from '@tanstack/react-query';
import { getVehicles } from '@/lib/supabase/queries';
import { useAuth } from './useAuth';

export function useVehicles() {
  const { user } = useAuth();

  const { data: vehicles = [], isLoading, error, refetch } = useQuery({
    queryKey: ['vehicles', user?.id],
    queryFn: () => (user?.id ? getVehicles(user.id) : Promise.resolve([])),
    enabled: !!user?.id,
  });

  return {
    vehicles,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    refresh: refetch,
  };
}
