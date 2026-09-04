import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LogOut, Bell, Shield, HelpCircle, Crown, ChevronRight, X } from 'lucide-react-native';
import { signOut } from '@/lib/utils/auth';
import { useTheme } from '@/lib/stores/themeStore';
import { useAuth } from '@/lib/hooks/useAuth';
import { getUserProfile } from '@/lib/supabase/queries';
import { LoadingState } from '@/components/ui/LoadingState';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemedGradient, useThemedSheen, useChromeRibbon, THEME_GRADIENTS } from '@/lib/hooks/useThemedGradient';

const SETTINGS = [
  { icon: Bell, label: 'Notifications', color: '#10b981', desc: 'Reminders & alerts' },
  { icon: Shield, label: 'Privacy', color: '#8b7cf6', desc: 'Security settings' },
  { icon: HelpCircle, label: 'Support', color: '#38bdf8', desc: 'Help center' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { user, reset } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['user_profile', user?.id],
    queryFn: () => (user?.id ? getUserProfile(user.id) : Promise.resolve(null)),
    enabled: !!user?.id,
  });

  const displayName = profile?.full_name ?? 'Guest User';
  const displayEmail = profile?.email ?? 'user@mototrack.app';
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleString('default', { month: 'short', year: 'numeric' })
    : 'Sep 2026';

  const heroGradient = useThemedGradient(THEME_GRADIENTS.heroProfile.light, THEME_GRADIENTS.heroProfile.dark);
  const sheen = useThemedSheen('violet');
  const chrome = useChromeRibbon();
  const profileGradient = useThemedGradient(THEME_GRADIENTS.profileCard.light, THEME_GRADIENTS.profileCard.dark);

  const performLogout = async () => {
    console.log('[LOGOUT] pressed — starting sequence');
    setLoggingOut(true);
    let errorMsg: string | null = null;
    try {
      const signOutPromise = signOut();
      const timeoutPromise = new Promise<{ error: { message: string } }>((resolve) =>
        setTimeout(() => resolve({ error: { message: 'Sign out timed out' } }), 3000)
      );
      const { error } = await Promise.race([signOutPromise, timeoutPromise]);
      console.log('[LOGOUT] signOut result, error:', error);
      if (error) errorMsg = error.message;
    } catch (e: any) {
      errorMsg = e?.message ?? 'Sign out failed';
      console.error('Logout error:', e);
    }
    console.log('[LOGOUT] calling reset()');
    reset();
    setConfirmOpen(false);
    setLoggingOut(false);
    if (errorMsg) console.warn('Logout warning:', errorMsg);
    console.log('[LOGOUT] calling router.replace');
    router.replace('/(auth)/login');
  };

  const handleLogout = () => {
    console.log('[LOGOUT] handleLogout called');
    setConfirmOpen(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas-light dark:bg-canvas-dark">
      <View className="px-7 pt-7 pb-8 relative overflow-hidden">
        <LinearGradient colors={heroGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
        <LinearGradient colors={sheen} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
        <Animated.View entering={FadeInUp.duration(700)}>
          <Text className="text-accent-violet text-[10px] font-semibold uppercase tracking-[0.35em]">Account</Text>
          <Text className="text-text-primary dark:text-text-primary-dark text-[40px] font-light tracking-tight mt-3 leading-[1.05]">Profile</Text>
        </Animated.View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-7 -mt-5">
        {/* User card — elevated with chrome edge */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)}>
          <View className="rounded-[28px] overflow-hidden border border-border-light dark:border-border-dark mb-8 shadow-[0_8px_30px_rgba(15,23,42,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
            <LinearGradient colors={profileGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
            <LinearGradient colors={chrome} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="absolute top-0 left-0 right-0 h-px" />
            <View className="relative z-10 p-7">
              <View className="flex-row items-center gap-5">
                <View className="w-[72px] h-[72px] rounded-full bg-accent-violet/10 border border-accent-violet/15 items-center justify-center shadow-[0_0_20px_rgba(139,124,246,0.15)]">
                  <Text className="text-text-primary dark:text-text-primary-dark text-3xl font-extralight tracking-tight">U</Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2.5">
                    <Text className="text-text-primary dark:text-text-primary-dark text-xl font-light tracking-tight">{displayName}</Text>
                    <View className="bg-accent-amber/10 border border-accent-amber/20 px-2 py-0.5 rounded-full flex-row items-center gap-1">
                      <Crown size={9} color="#f59e0b" strokeWidth={2} />
                      <Text className="text-accent-amber text-[9px] font-bold uppercase tracking-[0.15em]">Free</Text>
                    </View>
                  </View>
                  <Text className="text-text-muted-light dark:text-text-muted-dark text-[13px] font-light">{displayEmail}</Text>
                  <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[11px] font-light mt-1">2 vehicles · Member since {memberSince}</Text>
                </View>

                {/* Upgrade — right end of user row */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-[0_2px_8px_rgba(245,158,11,0.15)] dark:shadow-[0_2px_8px_rgba(245,158,11,0.25)]"
                  data-cy="profile-upgrade-premium"
                >
                  <Crown size={11} color="#f59e0b" strokeWidth={1.8} />
                  <Text className="text-accent-amber text-[10px] font-semibold tracking-wide">Upgrade</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Stats — hairline divider row */}
        <Animated.View entering={FadeInDown.duration(600).delay(150)} className="flex-row mb-8">
          {[
            { value: '2', label: 'Vehicles' },
            { value: '12', label: 'Logs' },
            { value: '5', label: 'Services' },
          ].map((s, i) => (
            <View key={s.label} className={`flex-1 px-3 ${i < 2 ? 'border-r border-border-light dark:border-border-dark' : ''}`}>
              <Text className="text-text-primary dark:text-text-primary-dark text-[22px] font-extralight tracking-tighter tabular-nums text-center">{s.value}</Text>
              <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[9px] font-semibold uppercase tracking-[0.25em] text-center mt-1">{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Settings */}
        <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.3em] mb-3">Preferences</Text>
        <View className="bg-card-light dark:bg-card-dark rounded-[20px] border border-border-light dark:border-border-dark overflow-hidden mb-4 shadow-[0_4px_16px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.35)]">
          {SETTINGS.map((s, i) => (
            <TouchableOpacity key={s.label} className={`flex-row items-center p-4 ${i < SETTINGS.length - 1 ? 'border-b border-border-light dark:border-border-dark' : ''} active:opacity-70`} data-cy={`profile-setting-${s.label.toLowerCase()}`}>
              <View className="w-9 h-9 rounded-xl items-center justify-center" style={{ backgroundColor: `${s.color}12` }}>
                <s.icon size={16} color={s.color} strokeWidth={1.8} />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-text-primary dark:text-text-primary-dark text-[15px] font-light tracking-tight">{s.label}</Text>
                <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[11px] font-light">{s.desc}</Text>
              </View>
              <ChevronRight size={16} color="#6b6b80" strokeWidth={1.5} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity onPress={handleLogout} className="flex-row items-center justify-center bg-danger/10 border border-danger/15 rounded-[20px] p-5 active:opacity-80" data-cy="profile-logout">
          <LogOut size={16} color="#ef4444" strokeWidth={1.8} />
          <Text className="text-danger text-[15px] font-light tracking-tight ml-2">Log Out</Text>
        </TouchableOpacity>

        <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[10px] text-center mt-8 tracking-[0.2em]">MotoTrack AI · v1.0.0</Text>
        <View className="h-8" />
      </ScrollView>

      <Modal visible={confirmOpen} transparent animationType="fade" onRequestClose={() => setConfirmOpen(false)}>
        <View className="flex-1 bg-black/60 items-center justify-center px-6">
          <View className="bg-card-light dark:bg-card-dark rounded-3xl p-7 w-full max-w-sm border border-border-light dark:border-border-dark">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-text-primary-light dark:text-text-primary-dark text-lg font-light tracking-tight">Log Out</Text>
              <TouchableOpacity onPress={() => setConfirmOpen(false)} disabled={loggingOut} data-cy="logout-cancel">
                <X size={18} color="#6b6b80" />
              </TouchableOpacity>
            </View>
            <Text className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-light mb-6">
              Are you sure you want to log out?
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setConfirmOpen(false)}
                disabled={loggingOut}
                className="flex-1 bg-elevated-light dark:bg-elevated-dark rounded-2xl py-3.5 items-center"
                data-cy="logout-cancel"
              >
                <Text className="text-text-primary-light dark:text-text-primary-dark text-[15px] font-light">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={performLogout}
                disabled={loggingOut}
                className="flex-1 bg-danger/10 border border-danger/20 rounded-2xl py-3.5 items-center"
                data-cy="logout-confirm"
              >
                <Text className="text-danger text-[15px] font-semibold">{loggingOut ? 'Logging out…' : 'Log Out'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
