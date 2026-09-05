import { useQuery } from '@tanstack/react-query';

export interface MotorcycleResult {
  make: string;
  model: string;
  year: number;
}

export function useMotorcycleSearch(query: string) {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['motorcycles', query],
    queryFn: async () => {
      if (!query || query.length < 2) return [] as MotorcycleResult[];
      const key = process.env.EXPO_PUBLIC_NINJA_API_KEY;
      if (!key || key.includes('your-')) {
        console.warn('[MotorcycleSearch] No valid EXPO_PUBLIC_NINJA_API_KEY');
        return [] as MotorcycleResult[];
      }
      try {
        const url = new URL('https://api.api-ninjas.com/v1/motorcycles');
        url.searchParams.set('make', query);
        url.searchParams.set('limit', '15');
        const res = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'X-Api-Key': key,
          },
        });
        if (!res.ok) {
          console.warn(`[MotorcycleSearch] API error: ${res.status}`);
          return [] as MotorcycleResult[];
        }
        const json = await res.json();
        if (!Array.isArray(json)) return [] as MotorcycleResult[];
        return json as MotorcycleResult[];
      } catch (e) {
        console.warn('[MotorcycleSearch] fetch error:', e);
        return [] as MotorcycleResult[];
      }
    },
    enabled: !!query && query.length >= 2,
    staleTime: 10 * 60 * 1000,
  });
  return { results: data, loading: isLoading, error: error instanceof Error ? error.message : null };
}
