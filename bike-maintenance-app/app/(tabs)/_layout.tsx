import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '@/lib/stores/themeStore';
import { COLORS, getColors } from '@/lib/theme/theme';
import { Home, Fuel, Wrench, Bot, User } from 'lucide-react-native';

const TABS = [
  { name: 'index', title: 'Garage', Icon: Home },
  { name: 'fuel', title: 'Fuel', Icon: Fuel },
  { name: 'service', title: 'Service', Icon: Wrench },
  { name: 'ai-mechanic', title: 'AI', Icon: Bot },
  { name: 'profile', title: 'Profile', Icon: User },
];

export default function TabLayout() {
  const { isDark } = useTheme();
  const c = getColors(isDark);

  return (
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
  );
}
