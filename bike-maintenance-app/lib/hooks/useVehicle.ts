import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVehicle, updateVehicle, deleteVehicle } from '@/lib/supabase/queries';
import { useAuth } from './useAuth';

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

  return useMutation({
    mutationFn: async (data: {
      name?: string;
      make?: string;
      model?: string;
      year?: number;
      variant?: string;
      vehicle_type?: string;
      odometer?: number;
    }) => updateVehicle(vehicleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', vehicleId] });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicleId: string) => deleteVehicle(vehicleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}
