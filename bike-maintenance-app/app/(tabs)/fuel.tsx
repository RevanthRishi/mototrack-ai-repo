import { useAuth } from '@/lib/hooks/useAuth';
import { useFuelLogs, useUserErrors, useUserLoading } from '@/lib/stores/userDataStore';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/LoadingState';
import { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fuel, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useThemedGradient, THEME_GRADIENTS } from '@/lib/hooks/useThemedGradient';
import { useQueryClient } from '@tanstack/react-query';

function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

export default function FuelScreen() {
  const { user } = useAuth();
  const logs = useFuelLogs();
  const errors = useUserErrors();
  const loadingState = useUserLoading();
  const loading = loadingState.fuelLogs;
  const error = errors.fuelLogs;
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['fuelLogs', user?.id] });
  const heroGradient = useThemedGradient(THEME_GRADIENTS.heroFuel.light, THEME_GRADIENTS.heroFuel.dark);

  const stats = useMemo(() => {
    if (logs.length === 0) return { avgKmL: 0, totalL: 0, totalCost: 0, lastKm: 0 };
    const totalL = logs.reduce((s, l) => s + l.liters, 0);
    const totalCost = logs.reduce((s, l) => s + l.cost, 0);
    const lastKm = Math.max(...logs.map((l) => l.odometer));
    // Efficiency: total km travelled / total liters, between first and last odometer
    const firstKm = Math.min(...logs.map((l) => l.odometer));
    const km = Math.max(0, lastKm - firstKm);
    const avgKmL = totalL > 0 ? km / totalL : 0;
    return { avgKmL, totalL, totalCost, lastKm };
  }, [logs]);

  const recent = logs.slice(0, 3);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-canvas-light dark:bg-canvas-dark">
        <View className="px-7 pt-7 pb-8 relative overflow-hidden">
          <LinearGradient colors={heroGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
          <Animated.View entering={FadeInUp.duration(700)}>
            <Text className="text-accent-emerald text-[10px] font-semibold uppercase tracking-[0.35em]">Fuel Economy</Text>
            <Text className="text-text-primary dark:text-text-primary-dark text-[40px] font-light tracking-tight mt-3 leading-[1.05]">Consumption</Text>
          </Animated.View>
        </View>
        <View className="flex-1 px-7 -mt-5">
          <LoadingState label="Loading fuel logs…" />
        </View>
      </SafeAreaView>
    );
  }

  if (error && !loading) {
    return (
      <SafeAreaView className="flex-1 bg-canvas-light dark:bg-canvas-dark">
        <View className="px-7 pt-7 pb-8 relative overflow-hidden">
          <LinearGradient colors={heroGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
          <Animated.View entering={FadeInUp.duration(700)}>
            <Text className="text-accent-emerald text-[10px] font-semibold uppercase tracking-[0.35em]">Fuel Economy</Text>
            <Text className="text-text-primary dark:text-text-primary-dark text-[40px] font-light tracking-tight mt-3 leading-[1.05]">Consumption</Text>
          </Animated.View>
        </View>
        <View className="flex-1 px-7 -mt-5">
          <ErrorState message={error} onRetry={refresh} />
        </View>
      </SafeAreaView>
    );
  }

  if (logs.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-canvas-light dark:bg-canvas-dark">
        <View className="px-7 pt-7 pb-8 relative overflow-hidden">
          <LinearGradient colors={heroGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
          <Animated.View entering={FadeInUp.duration(700)}>
            <Text className="text-accent-emerald text-[10px] font-semibold uppercase tracking-[0.35em]">Fuel Economy</Text>
            <Text className="text-text-primary dark:text-text-primary-dark text-[40px] font-light tracking-tight mt-3 leading-[1.05]">Consumption</Text>
          </Animated.View>
        </View>
        <View className="flex-1 px-7 -mt-5">
          <EmptyState
            title="No refills yet"
            message="Log your first fuel refill to start tracking efficiency and spend."
            action={{ label: 'Log Fuel', onPress: () => console.log('log fuel') }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-canvas-light dark:bg-canvas-dark">
      {/* Editorial hero */}
      <View className="px-7 pt-7 pb-8 relative overflow-hidden">
        <LinearGradient
          colors={heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute inset-0"
        />
        <LinearGradient
          colors={['rgba(139,124,246,0.10)', 'transparent 60%']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute inset-0"
        />

        <Animated.View entering={FadeInUp.duration(700)}>
          <Text className="text-accent-emerald text-[10px] font-semibold uppercase tracking-[0.35em]">Fuel Economy</Text>
          <Text className="text-text-primary dark:text-text-primary-dark text-[40px] font-light tracking-tight mt-3 leading-[1.05]">Consumption</Text>
        </Animated.View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-7 -mt-5">
        {/* Hero stat — dominant number */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)}>
          <View className="bg-card-light dark:bg-card-dark rounded-[22px] overflow-hidden mb-6 shadow-[0_4px_20px_rgba(15,23,42,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative">
            <LinearGradient colors={["rgba(139,124,246,0.03)","transparent 70%"]} start={{x:0,y:1}} end={{x:0,y:0}} className="absolute inset-0" />
            <View className="px-7 pt-8 pb-7">
              <View className="flex-row items-end gap-3 mb-1">
                <Text className="text-text-primary dark:text-text-primary-dark text-7xl font-extralight tracking-tighter tabular-nums leading-none">{stats.avgKmL.toFixed(1)}</Text>
                <Text className="text-accent-emerald text-[18px] font-light mb-2 tracking-wide">km / l</Text>
              </View>
              <View className="flex-row items-center gap-2 mt-2">
                <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[11px] font-medium">Average efficiency · Across {logs.length} refills</Text>
              </View>
            </View>

            {/* hairline divider */}
            <View className="h-px mx-7 bg-border-light dark:bg-white/[0.06]" />

            {/* 3-col stats */}
            <View className="flex-row px-7 py-5">
              {[
                { label: 'Fuel Used', value: stats.totalL.toFixed(1), unit: 'L' },
                { label: 'Distance', value: stats.lastKm.toLocaleString(), unit: 'km' },
                { label: 'Spent', value: stats.totalCost.toFixed(2), unit: '' },
              ].map((s, i) => (
                <View key={s.label} className={`flex-1 ${i < 2 ? 'border-r border-border-light dark:border-white/[0.06] pr-5 mr-5' : ''}`}>
                  <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[9px] font-semibold uppercase tracking-[0.25em]">{s.label}</Text>
                  <Text className="text-text-primary dark:text-text-primary-dark text-[20px] font-extralight mt-1 tracking-tighter tabular-nums">{s.value}</Text>
                  {s.unit && <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[10px] font-light">{s.unit}</Text>}
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Log list header */}
        <Animated.View entering={FadeInDown.duration(600).delay(180)} className="flex-row items-center justify-between mb-4">
          <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.3em]">Refill Log · {String(recent.length).padStart(2, '0')}</Text>
          <TouchableOpacity data-cy="fuel-see-all">
            <Text className="text-accent-violet text-[10px] font-semibold tracking-widest uppercase">See All</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Log rows */}
        {recent.map((log, i) => (
          <Animated.View
            key={log.id}
            entering={FadeInDown.duration(500).delay(220 + i * 70)}
            className="mb-3"
          >
            <TouchableOpacity
              activeOpacity={0.85}
              className="bg-card-light dark:bg-card-dark rounded-[18px] border border-border-light dark:border-border-dark px-5 py-5 shadow-[0_4px_16px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
              data-cy={`fuel-log-item-${log.id}`}
            >
              <View className="flex-row items-center">
                {/* icon */}
                <View className="w-11 h-11 rounded-full bg-accent-emerald/10 items-center justify-center border border-accent-emerald/15">
                  <Fuel size={16} color="#10b981" strokeWidth={1.8} />
                </View>

                {/* center info */}
                <View className="flex-1 ml-4">
                  <Text className="text-text-primary dark:text-text-primary-dark text-[15px] font-light tracking-tight">{formatDate(log.date)}</Text>
                  <View className="flex-row items-center gap-2 mt-0.5">
                    <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[11px] font-light">{log.liters} L</Text>
                    <View className="w-px h-3 bg-border-light dark:bg-white/[0.12]" />
                    <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[11px] font-light">${log.cost.toFixed(2)}</Text>
                    <View className="w-px h-3 bg-border-light dark:bg-white/[0.12]" />
                    <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[11px] font-light">{log.odometer.toLocaleString()} km</Text>
                  </View>
                </View>

                <ChevronRight size={15} color="#3a3a50" strokeWidth={1.5} />
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}

        <View className="h-28" />
      </ScrollView>
    </SafeAreaView>
  );
}
