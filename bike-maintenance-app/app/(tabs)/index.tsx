import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, ArrowUpRight, Gauge, Fuel, Wrench, Activity } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useThemedGradient, useThemedSheen, useChromeRibbon, THEME_GRADIENTS } from '@/lib/hooks/useThemedGradient';

const STATS = [
  { label: 'Odometer', value: '28,450', unit: 'km', icon: Gauge, accent: '#f59e0b' },
  { label: 'Economy', value: '42.3', unit: 'km / l', icon: Fuel, accent: '#10b981' },
  { label: 'Attention', value: '01', unit: 'overdue', icon: Wrench, accent: '#f97316' },
];

export default function GarageScreen() {
  const router = useRouter();
  const heroGradient = useThemedGradient(THEME_GRADIENTS.heroGarage.light, THEME_GRADIENTS.heroGarage.dark);
  const sheen = useThemedSheen('violet');
  const featuredGradient = useThemedGradient(THEME_GRADIENTS.heroFeatured.light, THEME_GRADIENTS.heroFeatured.dark);
  const chrome = useChromeRibbon();

  return (
    <SafeAreaView className="flex-1 bg-canvas-light dark:bg-canvas-dark">
      {/* Hero — deep editorial gradient with hairline chrome edge */}
      <View className="px-7 pt-7 pb-10 relative overflow-hidden">
        <LinearGradient
          colors={heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute inset-0"
        />
        {/* faint diagonal sheen */}
        <LinearGradient
          colors={sheen}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute inset-0"
        />

        <Animated.View entering={FadeInUp.duration(700)} className="flex-row items-center justify-between">
          <View>
            <Text className="text-accent-violet text-[10px] font-semibold uppercase tracking-[0.35em]">MotoTrack · Est. 2026</Text>
            <Text className="text-text-primary dark:text-text-primary-dark text-[2.5rem] sm:text-[40px] font-light tracking-tight mt-3 leading-[1.05]">The{'\n'}Garage</Text>
          </View>
          <View className="items-end pr-14">
            <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-widest">Curated</Text>
            <Text className="text-text-primary dark:text-text-primary-dark text-2xl font-extralight tracking-tighter mt-1">02</Text>
            <Text className="text-text-secondary dark:text-text-secondary-dark text-[9px] uppercase tracking-[0.3em]">vehicles</Text>
          </View>
        </Animated.View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5 sm:px-7 -mt-6">
        {/* Editorial stats row — hairline dividers, monospace numbers */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(100)}
          className="bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark flex-row overflow-hidden"
        >
          {STATS.map((s, i) => (
            <TouchableOpacity
              key={s.label}
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/fuel')}
              className={`flex-1 px-4 py-5 ${i < STATS.length - 1 ? 'border-r border-border-light dark:border-border-dark' : ''}`}
              data-cy={`home-stat-${s.label.toLowerCase()}`}
            >
              <View className="flex-row items-center gap-1.5 mb-3">
                <s.icon size={11} color={s.accent} strokeWidth={2} />
                <Text className="text-text-secondary dark:text-text-secondary-dark text-[9px] font-semibold uppercase tracking-[0.2em]">{s.label}</Text>
              </View>
              <Text className="text-text-primary dark:text-text-primary-dark text-2xl font-extralight tracking-tighter tabular-nums">{s.value}</Text>
              <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] mt-0.5 font-medium">{s.unit}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Section label */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} className="flex-row items-center justify-between mt-10 mb-5">
          <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.3em]">Featured · 01</Text>
          <View className="h-px flex-1 ml-4 bg-border-light dark:bg-border-dark" />
          <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.3em] ml-4">R15 V4</Text>
        </Animated.View>

        {/* Featured — magazine spread with chrome ribbon */}
        <Animated.View entering={FadeInDown.duration(700).delay(250)}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/vehicle/1')} data-cy="home-featured-vehicle">
            <View className="rounded-[28px] overflow-hidden relative border border-border-light dark:border-border-dark shadow-[0_8px_30px_rgba(15,23,42,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
              <LinearGradient colors={featuredGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-7">
                {/* chrome ribbon */}
                <LinearGradient
                  colors={chrome}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="absolute top-0 left-0 right-0 h-px"
                />

                <View className="flex-row items-start justify-between">
                  <View>
                    <Text className="text-accent-violet text-[10px] font-semibold uppercase tracking-[0.3em]">Primary</Text>
                    <Text className="text-text-primary dark:text-text-primary-dark text-[34px] font-extralight tracking-tight mt-3 leading-none">Yamaha</Text>
                    <Text className="text-text-primary dark:text-text-primary-dark text-[34px] font-extralight tracking-tight">R15 <Text className="text-accent-violet">V4</Text></Text>
                  </View>
                  <View className="items-end">
                    <View className="w-9 h-9 rounded-full border border-border-light dark:border-border-dark items-center justify-center">
                      <ArrowUpRight size={16} color="#e2e0ed" strokeWidth={1.5} />
                    </View>
                  </View>
                </View>

                <Text className="text-text-muted dark:text-text-muted-dark text-[13px] font-light mt-3">2024 · Black Edition · 18,230 km</Text>

                {/* Hairline divider with side dot */}
                <View className="flex-row items-center my-6">
                  <View className="h-px flex-1 bg-border-light dark:bg-border-dark" />
                  <View className="w-1 h-1 rounded-full bg-accent-violet mx-3" />
                  <View className="h-px flex-1 bg-border-light dark:bg-border-dark" />
                </View>

                <View className="flex-row gap-6">
                  <View className="flex-1">
                    <Text className="text-text-secondary dark:text-text-secondary-dark text-[9px] font-semibold uppercase tracking-[0.25em]">Next Service</Text>
                    <Text className="text-text-primary dark:text-text-primary-dark text-[22px] font-extralight mt-1 tabular-nums">1,770<Text className="text-text-secondary dark:text-text-secondary-dark text-sm font-light"> km</Text></Text>
                  </View>
                  <View className="w-px bg-border-light dark:bg-border-dark" />
                  <View className="flex-1">
                    <Text className="text-text-secondary dark:text-text-secondary-dark text-[9px] font-semibold uppercase tracking-[0.25em]">Health</Text>
                    <Text className="text-accent-emerald text-[22px] font-extralight mt-1 tabular-nums">94<Text className="text-accent-emerald/60 text-sm font-light">%</Text></Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Second vehicle — editorial list row */}
        <Animated.View entering={FadeInDown.duration(600).delay(350)} className="mt-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.3em]">Collection · 02</Text>
            <View className="h-px flex-1 ml-4 bg-border-light dark:bg-border-dark" />
          </View>

          <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/vehicle/2')} data-cy="home-collection-vehicle">
            <View className="flex-row items-center py-5 border-t border-b border-border-light dark:border-border-dark">
              <View className="w-12 h-12 rounded-full bg-elevated-light dark:bg-elevated-dark border border-border-light dark:border-border-dark items-center justify-center">
                <Text className="text-2xl">🏍️</Text>
              </View>
              <View className="flex-1 ml-5">
                <Text className="text-text-primary dark:text-text-primary-dark text-lg font-light tracking-tight">Honda CB350</Text>
                <Text className="text-text-secondary dark:text-text-secondary-dark text-[12px] font-light mt-0.5">2022 · Matte Gunmetal · 10,220 km</Text>
              </View>
              <View className="items-end">
                <View className="bg-accent-orange/10 border border-accent-orange/30 px-2.5 py-1 rounded-full">
                  <Text className="text-accent-orange text-[9px] font-bold tracking-widest">OIL DUE</Text>
                </View>
                <ArrowUpRight size={14} color="#6b6b80" strokeWidth={1.5} className="mt-2" />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Actions — refined monogram tiles */}
        <Animated.View entering={FadeInUp.duration(600).delay(450)} className="mt-10">
          <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.3em] mb-4">Atelier</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/vehicle/add')}
              className="flex-1"
              data-cy="home-add-vehicle"
            >
              <View className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl p-5 h-32 justify-between">
                <View className="flex-row items-center justify-between">
                  <Plus size={18} color="#8b7cf6" strokeWidth={1.5} />
                  <Text className="text-text-secondary dark:text-text-secondary-dark text-[9px] font-semibold tracking-[0.25em]">01</Text>
                </View>
                <View>
                  <Text className="text-text-primary dark:text-text-primary-dark text-[15px] font-light">Add Vehicle</Text>
                  <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] mt-0.5">New to garage</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/(tabs)/fuel')} className="flex-1" data-cy="home-log-fuel">
              <View className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl p-5 h-32 justify-between">
                <View className="flex-row items-center justify-between">
                  <Activity size={18} color="#10b981" strokeWidth={1.5} />
                  <Text className="text-text-secondary dark:text-text-secondary-dark text-[9px] font-semibold tracking-[0.25em]">02</Text>
                </View>
                <View>
                  <Text className="text-text-primary dark:text-text-primary-dark text-[15px] font-light">Log Fuel</Text>
                  <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] mt-0.5">Refill entry</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View className="h-32" />
      </ScrollView>
    </SafeAreaView>
  );
}
