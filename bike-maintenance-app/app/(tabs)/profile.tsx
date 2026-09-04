import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LogOut, Bell, Shield, HelpCircle, Crown, ChevronRight, Sun, Moon } from 'lucide-react-native';
import { signOut } from '@/lib/utils/auth';
import { useTheme } from '@/lib/stores/themeStore';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const SETTINGS = [
  { icon: Bell, label: 'Notifications', color: '#10b981', desc: 'Reminders & alerts' },
  { icon: Shield, label: 'Privacy', color: '#8b7cf6', desc: 'Security settings' },
  { icon: HelpCircle, label: 'Support', color: '#38bdf8', desc: 'Help center' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { isDark, toggle } = useTheme();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: async () => {
        try {
          await signOut();
        } catch (e) {
          console.error('Logout error:', e);
        }
        router.replace('/(auth)/login');
      }},
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#06060f]">
      <View className="px-7 pt-7 pb-8 relative overflow-hidden">
        <LinearGradient colors={['#0d0b20', '#090915', '#06060f']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
        <LinearGradient colors={['rgba(139,124,246,0.06)', 'transparent 60%']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
        <Animated.View entering={FadeInUp.duration(700)}>
          <Text className="text-[#8b7cf6] text-[10px] font-semibold uppercase tracking-[0.35em]">Account</Text>
          <Text className="text-white text-[40px] font-light tracking-tight mt-3 leading-[1.05]">Profile</Text>
        </Animated.View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-7 -mt-5">
        {/* User card — elevated with chrome edge */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)}>
          <View className="rounded-[28px] overflow-hidden border border-white/[0.08] mb-8">
            <LinearGradient colors={['#120b28', '#090714']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-7">
              <LinearGradient colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.02)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="absolute top-0 left-0 right-0 h-px" />
              <View className="flex-row items-center gap-5">
                <View className="w-[72px] h-[72px] rounded-full bg-[#8b7cf6]/8 border border-[#8b7cf6]/15 items-center justify-center shadow-[0_0_20px_rgba(139,124,246,0.15)]">
                  <Text className="text-white text-3xl font-extralight tracking-tight">U</Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2.5">
                    <Text className="text-white text-xl font-light tracking-tight">Guest User</Text>
                    <View className="bg-[#f59e0b]/8 border border-[#f59e0b]/20 px-2 py-0.5 rounded-full flex-row items-center gap-1">
                      <Crown size={9} color="#f59e0b" strokeWidth={2} />
                      <Text className="text-[#f59e0b] text-[9px] font-bold uppercase tracking-[0.15em]">Free</Text>
                    </View>
                  </View>
                  <Text className="text-[#8b8fa3] text-[13px] font-light">user@mototrack.app</Text>
                  <Text className="text-[#6b6b80] text-[11px] font-light mt-1">2 vehicles · Member since Sep 2026</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Stats — hairline divider row */}
        <Animated.View entering={FadeInDown.duration(600).delay(150)} className="flex-row mb-8">
          {[
            { value: '2', label: 'Vehicles' },
            { value: '12', label: 'Logs' },
            { value: '5', label: 'Services' },
          ].map((s, i) => (
            <View key={s.label} className={`flex-1 px-3 ${i < 2 ? 'border-r border-white/[0.06]' : ''}`}>
              <Text className="text-white text-[22px] font-extralight tracking-tighter tabular-nums text-center">{s.value}</Text>
              <Text className="text-[#6b6b80] text-[9px] font-semibold uppercase tracking-[0.25em] text-center mt-1">{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Settings */}
        <Text className="text-[#6b6b80] text-[10px] font-semibold uppercase tracking-[0.3em] mb-3">Preferences</Text>
        <View className="bg-[#0d0d18] rounded-[20px] border border-white/[0.06] overflow-hidden mb-4">
          {SETTINGS.map((s, i) => (
            <TouchableOpacity key={s.label} className={`flex-row items-center p-4 ${i < SETTINGS.length - 1 ? 'border-b border-white/[0.06]' : ''} active:opacity-70`}>
              <View className="w-9 h-9 rounded-xl items-center justify-center" style={{ backgroundColor: `${s.color}12` }}>
                <s.icon size={16} color={s.color} strokeWidth={1.8} />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-white text-[15px] font-light tracking-tight">{s.label}</Text>
                <Text className="text-[#6b6b80] text-[11px] font-light">{s.desc}</Text>
              </View>
              <ChevronRight size={16} color="#6b6b80" strokeWidth={1.5} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Upgrade banner */}
        <TouchableOpacity activeOpacity={0.85} className="rounded-[20px] overflow-hidden border border-[#f59e0b]/15 mb-6">
          <LinearGradient colors={['#1a0f08', '#0c0804']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-5 flex-row items-center gap-4">
            <View className="w-10 h-10 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/15 items-center justify-center">
              <Crown size={17} color="#f59e0b" strokeWidth={1.5} />
            </View>
            <View className="flex-1">
              <Text className="text-white text-[15px] font-light tracking-tight">Upgrade to Premium</Text>
              <Text className="text-[#8b8fa3] text-[11px] font-light">Unlimited AI queries & advanced analytics</Text>
            </View>
            <ChevronRight size={15} color="#f59e0b" strokeWidth={1.5} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Appearance toggle */}
        <TouchableOpacity onPress={toggle} className="bg-[#0d0d18] rounded-[20px] border border-white/[0.06] overflow-hidden mb-4 active:opacity-70" testID="theme-toggle">
          <View className="flex-row items-center p-4">
            <View className="w-9 h-9 rounded-xl items-center justify-center" style={{ backgroundColor: '#f59e0b12' }}>
              {isDark ? <Moon size={16} color="#f59e0b" strokeWidth={1.8} /> : <Sun size={16} color="#f59e0b" strokeWidth={1.8} />}
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-white text-[15px] font-light tracking-tight">Appearance</Text>
              <Text className="text-[#6b6b80] text-[11px] font-light">{isDark ? 'Dark' : 'Light'} mode</Text>
            </View>
            <Text className="text-[#f59e0b] text-[12px] font-semibold">{isDark ? 'Dark' : 'Light'}</Text>
          </View>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity onPress={handleLogout} className="flex-row items-center justify-center bg-[#1a0c14] border border-[#ef4444]/15 rounded-[20px] p-5 active:opacity-80">
          <LogOut size={16} color="#ef4444" strokeWidth={1.8} />
          <Text className="text-[#ef4444] text-[15px] font-light tracking-tight ml-2">Log Out</Text>
        </TouchableOpacity>

        <Text className="text-[#3a3a50] text-[10px] text-center mt-8 tracking-[0.2em]">MotoTrack AI · v1.0.0</Text>
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
