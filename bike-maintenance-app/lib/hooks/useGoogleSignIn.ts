import { useState, useCallback } from 'react';
import { signInWithGoogle } from '@/lib/utils/auth';
import { useNotification } from '@/lib/notifications/NotificationContext';

export function useGoogleSignIn() {
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();

  const trigger = useCallback(async () => {
    setLoading(true);
    const res = await signInWithGoogle();
    setLoading(false);
    if (!res.success) {
      notify(res.error ?? 'Google sign-in failed', 'error');
      return false;
    }
    return true;
  }, [notify]);

  return { loading, trigger };
}
