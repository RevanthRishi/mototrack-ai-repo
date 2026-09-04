import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Fuel, Wrench, Bot, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

const TABS = [
  { name: 'index', title: 'Garage', Icon: Home },
  { name: 'fuel', title: 'Fuel', Icon: Fuel },
  { name: 'service', title: 'Service', Icon: Wrench },
  { name: 'ai-mechanic', title: 'AI', Icon: Bot },
  { name: 'profile', title: 'Profile', Icon: User },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          height: 88,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={70}
            tint="dark"
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(6, 6, 15, 0.92)',
              borderTopWidth: 1,
              borderTopColor: 'rgba(255,255,255,0.05)',
            }}
          />
        ),
        tabBarActiveTintColor: '#8b7cf6',
        tabBarInactiveTintColor: '#3a3a50',
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
