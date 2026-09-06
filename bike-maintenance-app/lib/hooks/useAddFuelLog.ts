import { useMutation, useQueryClient } from '@tanstack/react-query';
import { insertFuelLog, deleteFuelLog } from '@/lib/supabase/queries';
import { useAuth } from './useAuth';
import { useUserDataStore } from '@/lib/stores/userDataStore';
import { AddFuelLogPayload } from '@/lib/types';

export function useAddFuelLog() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const store = useUserDataStore();

  return useMutation({
    mutationFn: async (payload: AddFuelLogPayload) => {
      if (!user?.id) throw new Error('User not authenticated');
      return insertFuelLog({ ...payload, user_id: user.id });
    },
    onSuccess: (newLog) => {
      store.upsertFuelLog(newLog);
      queryClient.invalidateQueries({ queryKey: ['fuelLogs'] });
    },
  });
}

export function useDeleteFuelLog() {
  const queryClient = useQueryClient();
  const store = useUserDataStore();

  return useMutation({
    mutationFn: async (logId: string) => deleteFuelLog(logId),
    onSuccess: (_, logId) => {
      store.removeFuelLog(logId);
      queryClient.invalidateQueries({ queryKey: ['fuelLogs'] });
    },
  });
}
