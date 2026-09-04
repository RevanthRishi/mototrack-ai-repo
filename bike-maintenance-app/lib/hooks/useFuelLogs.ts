import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

export function useFuelLogs() {
  const { user } = useAuth();
  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ['fuel_logs', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('fuel_logs')
        .select('id, date, liters, cost, odometer, notes')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user?.id,
    staleTime: 3 * 60 * 1000,
  });
  return { logs: data, loading: isLoading, error: error instanceof Error ? error.message : null, refresh: refetch };
}
