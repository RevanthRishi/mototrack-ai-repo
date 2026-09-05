import '../global.css';
import { useEffect } from 'react';
import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/lib/hooks/useAuth';
import { useThemeStore } from '@/lib/stores/themeStore';
import { getProfile } from '@/lib/supabase/queries';
import { NotificationProvider } from '@/lib/notifications/NotificationContext';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useUserDataStore } from '@/lib/stores/userDataStore';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function RootLayoutNav() {
  const { user, loading, isLoggingOut } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // On app open / auth-state change: sync DB theme into the store so the
  // persisted AsyncStorage value is authoritative.
  useEffect(() => {
    if (loading || !user?.id) return;
    getProfile(user.id)
      .then((data) => {
        if (data && typeof data.theme_dark === 'boolean') {
          useThemeStore.getState().setDark(data.theme_dark);
        }
      })
      .catch((e) => console.warn('[root] theme sync failed', e));
  }, [user?.id, loading]);

  // Clear the in-memory mirror on logout so the next sign-in starts clean.
  useEffect(() => {
    if (!loading && !user) useUserDataStore.getState().reset();
  }, [user, loading]);

  useEffect(() => {
    if (loading || isLoggingOut) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!user && inAuthGroup) {
      // Already on auth screen, nothing to do
      return;
    }
    if (user && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [user, loading, segments, router, isLoggingOut]);

  return (
    <>
      <Slot />
      <ThemeToggle />
    </>
  );
}

export default function RootLayout() {
  const isDark = useThemeStore((s) => s.isDark);
  return (
    <GestureHandlerRootView style={{ flex: 1 }} className={isDark ? 'dark' : ''}>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <RootLayoutNav />
        </NotificationProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
