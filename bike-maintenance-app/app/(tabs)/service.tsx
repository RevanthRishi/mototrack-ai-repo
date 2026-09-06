import { useAuth } from '@/lib/hooks/useAuth';
import { useServiceLogs, useUserErrors, useUserLoading } from '@/lib/stores/userDataStore';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/LoadingState';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wrench, Clock, DollarSign } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useThemedGradient, useThemedSheen, THEME_GRADIENTS } from '@/lib/hooks/useThemedGradient';
import { useQueryClient } from '@tanstack/react-query';

function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function ServiceScreen() {
  const { user } = useAuth();
  const logs = useServiceLogs();
  const errors = useUserErrors();
  const loadingState = useUserLoading();
  const loading = loadingState.serviceLogs;
  const error = errors.serviceLogs;
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['serviceLogs', user?.id] });
  const heroGradient = useThemedGradient(THEME_GRADIENTS.heroService.light, THEME_GRADIENTS.heroService.dark);
  const sheen = useThemedSheen('violet');

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-canvas-light dark:bg-canvas-dark">
        <View className="px-7 pt-7 pb-8 relative overflow-hidden">
          <LinearGradient colors={heroGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
          <LinearGradient colors={sheen} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
          <Animated.View entering={FadeInUp.duration(700)}>
            <Text className="text-accent-violet text-[10px] font-semibold uppercase tracking-[0.35em]">Service Timeline</Text>
            <Text className="text-text-primary dark:text-text-primary-dark text-[40px] font-light tracking-tight mt-3 leading-[1.05]">Maintained</Text>
          </Animated.View>
        </View>
        <View className="flex-1 px-7 -mt-5">
          <LoadingState label="Loading service history…" />
        </View>
      </SafeAreaView>
    );
  }

  if (error && !loading) {
    return (
      <SafeAreaView className="flex-1 bg-canvas-light dark:bg-canvas-dark">
        <View className="px-7 pt-7 pb-8 relative overflow-hidden">
          <LinearGradient colors={heroGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
          <LinearGradient colors={sheen} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
          <Animated.View entering={FadeInUp.duration(700)}>
            <Text className="text-accent-violet text-[10px] font-semibold uppercase tracking-[0.35em]">Service Timeline</Text>
            <Text className="text-text-primary dark:text-text-primary-dark text-[40px] font-light tracking-tight mt-3 leading-[1.05]">Maintained</Text>
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
          <LinearGradient colors={sheen} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
          <Animated.View entering={FadeInUp.duration(700)}>
            <Text className="text-accent-violet text-[10px] font-semibold uppercase tracking-[0.35em]">Service Timeline</Text>
            <Text className="text-text-primary dark:text-text-primary-dark text-[40px] font-light tracking-tight mt-3 leading-[1.05]">Maintained</Text>
          </Animated.View>
        </View>
        <View className="flex-1 px-7 -mt-5">
          <EmptyState
            title="No service records"
            message="Keep your bike in top shape — log your first service now."
            action={{ label: 'Add Service', onPress: () => console.log('add service') }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const totalCost = logs.reduce((s, l) => s + l.cost, 0);
  const recentDate = logs[0]?.date ? new Date(logs[0].date) : new Date();
  const daysSince = Math.floor((Date.now() - recentDate.getTime()) / 86400000);

  return (
    <SafeAreaView className="flex-1 bg-canvas-light dark:bg-canvas-dark">
      <View className="px-7 pt-7 pb-8 relative overflow-hidden">
        <LinearGradient colors={heroGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
        <LinearGradient colors={sheen} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
        <Animated.View entering={FadeInUp.duration(700)}>
          <Text className="text-accent-violet text-[10px] font-semibold uppercase tracking-[0.35em]">Service Timeline</Text>
          <Text className="text-text-primary dark:text-text-primary-dark text-[40px] font-light tracking-tight mt-3 leading-[1.05]">Maintained</Text>
        </Animated.View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-7 -mt-5">
        {/* Stats row — editorial cards */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} className="flex-row gap-3 mb-8">
          {[
            { icon: DollarSign, value: `$${totalCost.toFixed(0)}`, label: 'Spent', color: '#f59e0b', sub: 'Total cost' },
            { icon: Wrench, value: String(logs.length).padStart(2, '0'), label: 'Records', color: '#8b7cf6', sub: 'Maintenance entries' },
            { icon: Clock, value: String(daysSince), label: 'Days', color: '#10b981', sub: 'Since last service' },
          ].map((s) => (
            <View key={s.label} className="flex-1 bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark px-4 py-5 shadow-[0_4px_16px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.35)]" data-cy={`service-stat-${s.label.toLowerCase()}`}>
              <View className="w-8 h-8 rounded-full bg-elevated-light dark:bg-elevated-dark border border-border-light dark:border-border-dark items-center justify-center mb-3">
                <s.icon size={14} color={s.color} strokeWidth={1.8} />
              </View>
              <Text className="text-text-primary dark:text-text-primary-dark text-[22px] font-extralight tracking-tighter tabular-nums">{s.value}</Text>
              <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[9px] font-semibold uppercase tracking-[0.2em] mt-1">{s.label}</Text>
              <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[10px] font-light mt-0.5">{s.sub}</Text>
            </View>
          ))}
        </Animated.View>

        <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.3em] mb-5">Log · {String(logs.length).padStart(2, '0')}</Text>

        {/* Timeline with hairline */}
        <View className="relative pl-5">
          <View className="absolute left-[19px] top-4 bottom-4 w-px bg-border-light dark:bg-border-dark" />
          {logs.map((s, i) => (
            <Animated.View
              key={s.id}
              entering={FadeInDown.duration(500).delay(150 + i * 80)}
              className="relative mb-4"
            >
              {/* timeline node */}
              <View className="absolute left-[-21px] top-[22px] w-2.5 h-2.5 rounded-full bg-accent-violet shadow-[0_0_10px_rgba(139,124,246,0.4)] z-10" />

              <TouchableOpacity activeOpacity={0.85} className="bg-card-light dark:bg-card-dark rounded-[18px] border border-border-light dark:border-border-dark px-5 py-4 ml-2 shadow-[0_4px_16px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.35)]" data-cy={`service-item-${s.id}`}>
                <View className="flex-row items-start justify-between mb-2">
                  <View>
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-text-primary dark:text-text-primary-dark text-base font-light tracking-tight">{s.service_type}</Text>
                      {s.cost === 0 && (
                        <View className="bg-accent-emerald/10 border border-accent-emerald/20 px-1.5 py-0.5 rounded-md">
                          <Text className="text-accent-emerald text-[9px] font-bold uppercase">DIY</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[10px] font-light">{formatDate(s.date)} · {s.odometer.toLocaleString()} km</Text>
                  </View>
                  <Text className="text-text-primary dark:text-text-primary-dark text-sm font-medium tracking-tight">${s.cost.toFixed(2)}</Text>
                </View>
                {s.notes ? (
                  <View className="flex-row items-center gap-2 pt-3 border-t border-border-light dark:border-border-dark">
                    <Wrench size={12} color="#8b7cf6" strokeWidth={1.5} />
                    <Text className="text-text-muted-light dark:text-text-muted-dark text-[11px] font-medium flex-1" numberOfLines={1}>{s.notes}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
