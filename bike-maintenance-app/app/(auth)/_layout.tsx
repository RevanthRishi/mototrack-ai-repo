import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/lib/hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';

export default function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-dark">
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#06060f' },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
