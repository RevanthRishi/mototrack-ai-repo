import React from 'react';
import { View, ScrollView, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft, Gauge, Fuel, Wrench } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Button } from '@/components/ui/Button';
import { ServiceTimeline, ServiceItem } from '@/components/features/ServiceTimeline';

const SERVICES: ServiceItem[] = [
  { id: 1, type: 'Oil Change', date: '20 Aug 2024', cost: 45, km: '17,800', category: 'Fluid', badge: null },
  { id: 2, type: 'Chain Lubrication', date: '20 Aug 2024', cost: 0, km: '17,800', category: 'Drivetrain', badge: 'DIY' },
];

export default function VehicleDetailScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-canvas-dark">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-7 pt-6" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="flex-row items-center gap-2" data-cy="vehicle-detail-back">
            <ArrowLeft size={16} color="#8b8fa3" strokeWidth={1.5} />
            <Text className="text-text-muted-dark text-sm font-light">Garage</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} data-cy="vehicle-detail-edit">
            <Text className="text-accent-violet text-sm font-medium">Edit</Text>
          </TouchableOpacity>
        </View>

        <Animated.View entering={FadeInUp.duration(700)}>
          <View className="rounded-[28px] overflow-hidden border border-white/[0.08] mb-6">
            <LinearGradient colors={['#1f1638', '#110b22', '#0a0814']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-7 relative">
              <LinearGradient colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.04)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="absolute top-0 left-0 right-0 h-px" />
              <Text className="text-accent-violet text-[10px] font-semibold uppercase tracking-[0.3em]">Primary</Text>
              <Text className="text-white text-[36px] font-extralight tracking-tight mt-3 leading-none">Yamaha</Text>
              <Text className="text-white text-[36px] font-extralight tracking-tight">R15 <Text className="text-accent-violet">V4</Text></Text>
              <Text className="text-text-muted-dark text-[13px] font-light mt-3">2024 · Black Edition · 18,230 km</Text>
            </LinearGradient>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(120)} className="flex-row gap-3 mb-8">
          <View className="flex-1 bg-card-light dark:bg-card-dark rounded-2xl border border-white/[0.06] px-4 py-5">
            <Gauge size={18} color="#f59e0b" strokeWidth={1.5} />
            <Text className="text-white text-[22px] font-extralight mt-3 tracking-tighter tabular-nums">94<Text className="text-accent-emerald/60 text-sm">%</Text></Text>
            <Text className="text-text-secondary-dark dark:text-text-secondary-light text-[9px] uppercase tracking-[0.2em] mt-1">Health</Text>
          </View>
          <View className="flex-1 bg-card-light dark:bg-card-dark rounded-2xl border border-white/[0.06] px-4 py-5">
            <Fuel size={18} color="#10b981" strokeWidth={1.5} />
            <Text className="text-white text-[22px] font-extralight mt-3 tracking-tighter tabular-nums">42.3</Text>
            <Text className="text-text-secondary-dark dark:text-text-secondary-light text-[9px] uppercase tracking-[0.2em] mt-1">km / l</Text>
          </View>
          <View className="flex-1 bg-card-light dark:bg-card-dark rounded-2xl border border-white/[0.06] px-4 py-5">
            <Wrench size={18} color="#f97316" strokeWidth={1.5} />
            <Text className="text-white text-[22px] font-extralight mt-3 tracking-tighter tabular-nums">01</Text>
            <Text className="text-text-secondary-dark dark:text-text-secondary-light text-[9px] uppercase tracking-[0.2em] mt-1">Service</Text>
          </View>
        </Animated.View>

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-text-secondary-dark dark:text-text-secondary-light text-[10px] font-semibold uppercase tracking-[0.3em]">Recent Service</Text>
          <TouchableOpacity data-cy="vehicle-detail-see-all"><Text className="text-accent-violet text-[10px] font-medium tracking-widest">See All</Text></TouchableOpacity>
        </View>
        <ServiceTimeline items={SERVICES} />

        <View className="h-12" />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-canvas-dark border-t border-white/[0.06] px-7 py-4 flex-row gap-3">
        <Button variant="secondary" className="flex-1" leftIcon={<Wrench size={15} color="#fff" strokeWidth={1.5} />} data-cy="vehicle-detail-service-btn">Service</Button>
        <Button variant="primary" className="flex-1" leftIcon={<Fuel size={15} color="#fff" strokeWidth={1.5} />} data-cy="vehicle-detail-log-fuel-btn">Log Fuel</Button>
      </View>
    </SafeAreaView>
  );
}
