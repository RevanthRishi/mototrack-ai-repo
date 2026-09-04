import React, { useRef } from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '@/lib/stores/themeStore';
import { supabase } from '@/lib/supabase/client';
import { COLORS, getColors } from '@/lib/theme/theme';
import { Home, Fuel, Wrench, Bot, User, Sun, Moon } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';

const TABS = [
  { name: 'index', title: 'Garage', Icon: Home },
  { name: 'fuel', title: 'Fuel', Icon: Fuel },
  { name: 'service', title: 'Service', Icon: Wrench },
  { name: 'ai-mechanic', title: 'AI', Icon: Bot },
  { name: 'profile', title: 'Profile', Icon: User },
];

export default function TabLayout() {
  const { isDark, toggle } = useTheme();
  const c = getColors(isDark);
  const flash = useSharedValue(0);

  const handleToggleTheme = async () => {
    // Quick fade-flash animation
    flash.value = withSequence(withTiming(0.25, { duration: 120 }), withTiming(0, { duration: 120 }));
    toggle();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.id) {
        supabase.from('users').update({ theme_dark: !isDark }).eq('id', data.user.id).then(({ error }) => {
          if (error) console.warn('[theme] DB sync failed', error.message);
        });
      }
    });
  };

  const flashStyle = useAnimatedStyle(() => ({
    opacity: 1 - flash.value,
  }));

  return (
    <View className="flex-1">
      <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          height: 88,
          borderTopWidth: 1,
          borderTopColor: c.border,
          backgroundColor: c.canvas,
          elevation: 0,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarActiveTintColor: COLORS.accent.violet,
        tabBarInactiveTintColor: c.textSecondary,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', letterSpacing: 0.05 },
        tabBarIconStyle: { marginTop: 2 },
      }}
    >
      {TABS.map(({ name, title, Icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, size }) => (
              <Icon size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
      ))}
    </Tabs>

    {/* Theme toggle FAB — visible from all tabs */}
    <TouchableOpacity
      onPress={handleToggleTheme}
      activeOpacity={0.8}
      className="absolute top-12 right-5 w-11 h-11 rounded-full items-center justify-center bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-[0_4px_16px_rgba(15,23,42,0.10)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.5)] z-50"
      style={{ elevation: 8 }}
      data-cy="theme-toggle-fab"
      testID="theme-toggle-fab"
    >
      {isDark ? (
        <Sun size={17} color={COLORS.accent.amber} strokeWidth={1.8} />
      ) : (
        <Moon size={17} color={COLORS.accent.violet} strokeWidth={1.8} />
      )}
    </TouchableOpacity>
  </View>
  );
}
