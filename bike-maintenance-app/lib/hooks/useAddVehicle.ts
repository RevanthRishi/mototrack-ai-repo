import { useMutation, useQueryClient } from '@tanstack/react-query';
import { insertVehicle } from '@/lib/supabase/queries';
import { useAuth } from './useAuth';
import { useUserDataStore } from '@/lib/stores/userDataStore';

export function useAddVehicle() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const store = useUserDataStore();

  return useMutation({
    mutationFn: async (data: { make: string; model: string; year: number; odometer: number }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return insertVehicle({
        user_id: user.id,
        make: data.make,
        model: data.model,
        name: `${data.make} ${data.model}`,
        year: data.year,
        odometer: data.odometer,
      });
    },
    onSuccess: (newVehicle) => {
      store.upsertVehicle(newVehicle);        // other tabs see immediately
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}
