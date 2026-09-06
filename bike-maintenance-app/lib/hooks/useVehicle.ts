import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVehicle, updateVehicle, deleteVehicle } from '@/lib/supabase/queries';
import { useAuth } from './useAuth';
import { useUserDataStore } from '@/lib/stores/userDataStore';

export function useVehicle(vehicleId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: () => getVehicle(vehicleId),
    enabled: !!user?.id && !!vehicleId,
  });
}

export function useUpdateVehicle(vehicleId: string) {
  const queryClient = useQueryClient();
  const store = useUserDataStore();

  return useMutation({
    mutationFn: async (data: {
      name?: string; make?: string; model?: string; year?: number;
      variant?: string; vehicle_type?: string; current_odometer?: number;
    }) => updateVehicle(vehicleId, data),
    onSuccess: (updated) => {
      store.upsertVehicle(updated);
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', vehicleId] });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  const store = useUserDataStore();

  return useMutation({
    mutationFn: async (vehicleId: string) => deleteVehicle(vehicleId),
    onSuccess: (_, vehicleId) => {
      store.removeVehicle(vehicleId);
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}
