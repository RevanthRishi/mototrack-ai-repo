import React from 'react';
import { View, ScrollView, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Gauge, Fuel, Wrench } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Button } from '@/components/ui/Button';
import { ServiceTimeline, ServiceItem } from '@/components/features/ServiceTimeline';
import { useVehicle } from '@/lib/hooks/useVehicle';
import { useServiceLogs } from '@/lib/hooks/useServiceLogs';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTheme } from '@/lib/stores/themeStore';
import { THEME_GRADIENTS, useThemedGradient, useChromeRibbon } from '@/lib/hooks/useThemedGradient';

const EMPTY_SERVICES: ServiceItem[] = [];

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isDark } = useTheme();
  const featuredGradient = useThemedGradient(THEME_GRADIENTS.heroFeatured.light, THEME_GRADIENTS.heroFeatured.dark);
  const chrome = useChromeRibbon();
  const { user } = useAuth();
  const { data: vehicle, isLoading } = useVehicle(id ?? '');
  const { logs: serviceLogs } = useServiceLogs(user?.id ?? '');

  const handleEdit = () => {
    if (id) router.push(`/vehicle/edit/${id}`);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)');
    }
  };

  const serviceItems: ServiceItem[] = (serviceLogs ?? [])
    .slice(0, 3)
    .map((log) => ({
      id: log.id,
      type: log.service_type ?? 'Service',
      date: new Date(log.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      cost: log.cost ?? 0,
      km: log.odometer ? String(log.odometer) : '—',
      category: log.notes ? 'Custom' : 'General',
      badge: null,
    }));

  return (
    <SafeAreaView className="flex-1 bg-canvas-light dark:bg-canvas-dark">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-7 pt-6" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={handleBack} activeOpacity={0.7} className="flex-row items-center gap-2" data-cy="vehicle-detail-back">
            <ArrowLeft size={16} color={isDark ? '#8b8fa3' : '#6b6b80'} strokeWidth={1.5} />
            <Text className={`text-sm font-light ${isDark ? 'text-text-muted-dark' : 'text-text-secondary-light'}`}>Garage</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEdit} activeOpacity={0.7} data-cy="vehicle-detail-edit">
            <Text className="text-accent-violet text-sm font-medium">Edit</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View className="rounded-[28px] overflow-hidden border border-border-light dark:border-border-dark mb-6 bg-card-light dark:bg-card-dark p-7">
            <Text className="text-text-secondary-light dark:text-text-secondary-dark text-lg font-light">Loading…</Text>
          </View>
        ) : vehicle ? (
          <Animated.View entering={FadeInUp.duration(700)}>
            <View className="rounded-[28px] overflow-hidden border border-border-light dark:border-white/[0.08] mb-6 ">
              <LinearGradient colors={featuredGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-7 relative">
                <LinearGradient colors={chrome} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="absolute top-0 left-0 right-0 h-px" />
                <Text className="text-accent-violet text-[10px] font-semibold uppercase tracking-[0.3em]">Primary</Text>
                <Text className="text-text-primary dark:text-text-primary-dark text-[36px] font-extralight tracking-tight mt-3 leading-none">{vehicle.make}</Text>
                <Text className="text-text-primary dark:text-text-primary-dark text-[36px] font-extralight tracking-tight">
                  {vehicle.model}
                  {vehicle.variant ? <Text className="text-accent-violet"> {vehicle.variant}</Text> : null}
                </Text>
                <Text className="text-text-muted dark:text-text-muted-dark text-[13px] font-light mt-3">
                  {vehicle.year}{vehicle.variant ? ` · ${vehicle.variant}` : ''} · {vehicle.current_odometer?.toLocaleString() ?? vehicle.odometer?.toLocaleString() ?? '—'} km
                </Text>
              </LinearGradient>
            </View>
          </Animated.View>
        ) : (
          <View className="rounded-[28px] border border-border-light dark:border-border-dark mb-6 p-7 bg-card-light dark:bg-card-dark">
            <Text className="text-text-secondary-light dark:text-text-secondary-dark font-light">Vehicle not found</Text>
          </View>
        )}

        <Animated.View entering={FadeInUp.duration(600).delay(120)} className="flex-row gap-3 mb-8">
          <View className="flex-1 bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-white/[0.06] px-4 py-5">
            <Gauge size={18} color="#f59e0b" strokeWidth={1.5} />
            <Text className="text-white text-[22px] font-extralight mt-3 tracking-tighter tabular-nums">—<Text className="text-accent-emerald/60 text-sm">%</Text></Text>
            <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[9px] uppercase tracking-[0.2em] mt-1">Health</Text>
          </View>
          <View className="flex-1 bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-white/[0.06] px-4 py-5">
            <Fuel size={18} color="#10b981" strokeWidth={1.5} />
            <Text className="text-white text-[22px] font-extralight mt-3 tracking-tighter tabular-nums">—</Text>
            <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[9px] uppercase tracking-[0.2em] mt-1">km / l</Text>
          </View>
          <View className="flex-1 bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-white/[0.06] px-4 py-5">
            <Wrench size={18} color="#f97316" strokeWidth={1.5} />
            <Text className="text-white text-[22px] font-extralight mt-3 tracking-tighter tabular-nums">{(serviceLogs?.length ?? 0).toString().padStart(2, '0')}</Text>
            <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[9px] uppercase tracking-[0.2em] mt-1">Service</Text>
          </View>
        </Animated.View>

        <View className="flex-row items-center justify-between mb-4">
          <Text className={`text-[10px] font-semibold uppercase tracking-[0.3em] ${isDark ? 'text-text-secondary-dark' : 'text-text-secondary-light'}`}>Recent Service</Text>
          <TouchableOpacity data-cy="vehicle-detail-see-all" onPress={() => router.push('/(tabs)/service')}>
            <Text className="text-accent-violet text-[10px] font-medium tracking-widest">See All</Text>
          </TouchableOpacity>
        </View>
        <ServiceTimeline items={serviceItems.length > 0 ? serviceItems : EMPTY_SERVICES} />

        <View className="h-12" />
      </ScrollView>

      <View className={`absolute bottom-0 left-0 right-0 border-t px-7 py-4 flex-row gap-3 ${isDark ? 'bg-canvas-dark border-white/[0.06]' : 'bg-canvas-light border-border-light'}`}>
        <Button variant="secondary" className="flex-1" leftIcon={<Wrench size={15} color="#fff" strokeWidth={1.5} />} data-cy="vehicle-detail-service-btn">Service</Button>
        <Button variant="primary" className="flex-1" leftIcon={<Fuel size={15} color="#fff" strokeWidth={1.5} />} data-cy="vehicle-detail-log-fuel-btn">Log Fuel</Button>
      </View>
    </SafeAreaView>
  );
}
