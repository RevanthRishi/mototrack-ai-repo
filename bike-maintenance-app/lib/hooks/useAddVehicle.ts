import { useMutation, useQueryClient } from '@tanstack/react-query';
import { insertVehicle } from '@/lib/supabase/queries';
import { useAuth } from './useAuth';

export function useAddVehicle() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: { make: string; model: string; year: number; odometer: number }) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const result = await insertVehicle({
        user_id: user.id,
        make: data.make,
        model: data.model,
        name: `${data.make} ${data.model}`,
        year: data.year,
        odometer: data.odometer,
      });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}
