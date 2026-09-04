import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { signInWithGoogle } from '@/lib/utils/auth';

export function useGoogleSignIn() {
  const [loading, setLoading] = useState(false);

  const trigger = useCallback(async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    setLoading(false);
    if (error) {
      Alert.alert('Google sign-in failed', error.message);
      return false;
    }
    return true;
  }, []);

  return { loading, trigger };
}
