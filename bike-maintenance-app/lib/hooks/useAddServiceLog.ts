import { useMutation, useQueryClient } from '@tanstack/react-query';
import { insertServiceLog, deleteServiceLog } from '@/lib/supabase/queries';
import { useAuth } from './useAuth';
import { useUserDataStore } from '@/lib/stores/userDataStore';
import { AddServiceLogPayload } from '@/lib/types';

export function useAddServiceLog() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const store = useUserDataStore();

  return useMutation({
    mutationFn: async (payload: AddServiceLogPayload) => {
      if (!user?.id) throw new Error('User not authenticated');
      return insertServiceLog({ ...payload, user_id: user.id });
    },
    onSuccess: (newLog) => {
      store.upsertServiceLog(newLog);
      queryClient.invalidateQueries({ queryKey: ['serviceLogs'] });
    },
  });
}

export function useDeleteServiceLog() {
  const queryClient = useQueryClient();
  const store = useUserDataStore();

  return useMutation({
    mutationFn: async (logId: string) => deleteServiceLog(logId),
    onSuccess: (_, logId) => {
      store.removeServiceLog(logId);
      queryClient.invalidateQueries({ queryKey: ['serviceLogs'] });
    },
  });
}
