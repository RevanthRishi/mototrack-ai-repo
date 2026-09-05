import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/lib/hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';

export default function AuthLayout() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading && user === null) {
    // user is already null — don't show spinner, go straight to login form.
    // loading=true here is just a brief Supabase confirmation pulse after sign-out.
    return null;
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas-light dark:bg-canvas-dark">
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: undefined },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
