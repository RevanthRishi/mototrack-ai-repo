import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export function useServiceLogs(userId: string | null) {
  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ['service_logs', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('service_logs')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId,
    staleTime: 3 * 60 * 1000,
  });
  return { logs: data, loading: isLoading, error: error instanceof Error ? error.message : null, refresh: refetch };
}
