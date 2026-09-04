import '../global.css';
import { useEffect } from 'react';
import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/lib/hooks/useAuth';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60, // 60 minutes (previously cacheTime)
    },
  },
});

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (user && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [user, loading, segments, router]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" />
        <RootLayoutNav />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
