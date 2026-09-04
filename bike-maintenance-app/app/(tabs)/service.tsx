import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wrench, Clock, DollarSign, ArrowUpRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

const SERVICES = [
  { id: 1, type: 'Oil Change', date: '20 Aug 2024', cost: 45.00, km: '17,800', category: 'Fluid', badge: null },
  { id: 2, type: 'Chain Lubrication', date: '20 Aug 2024', cost: 0, km: '17,800', category: 'Drivetrain', badge: 'DIY' },
  { id: 3, type: 'Tire Replacement', date: '12 Jul 2024', cost: 280.00, km: '15,200', category: 'Tire', badge: null },
  { id: 4, type: 'Brake Pads', date: '5 Jun 2024', cost: 85.00, km: '13,500', category: 'Brake', badge: null },
  { id: 5, type: 'Air Filter', date: '18 May 2024', cost: 22.00, km: '12,000', category: 'Air', badge: null },
];

export default function ServiceScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#06060f]">
      <View className="px-7 pt-7 pb-8 relative overflow-hidden">
        <LinearGradient colors={['#121028', '#0a0915', '#06060f']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
        <LinearGradient colors={['rgba(139,124,246,0.08)', 'transparent 60%']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
        <Animated.View entering={FadeInUp.duration(700)}>
          <Text className="text-[#8b7cf6] text-[10px] font-semibold uppercase tracking-[0.35em]">Service Timeline</Text>
          <Text className="text-white text-[40px] font-light tracking-tight mt-3 leading-[1.05]">Maintained</Text>
        </Animated.View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-7 -mt-5">
        {/* Stats row — editorial cards */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} className="flex-row gap-3 mb-8">
          {[
            { icon: DollarSign, value: '$432', label: 'Spent', color: '#f59e0b', sub: 'Total cost' },
            { icon: Wrench, value: '05', label: 'Records', color: '#8b7cf6', sub: 'Maintenance entries' },
            { icon: Clock, value: '94', label: 'Days', color: '#10b981', sub: 'Since last service' },
          ].map((s) => (
            <View key={s.label} className="flex-1 bg-[#0d0d18] rounded-2xl border border-white/[0.06] px-4 py-5">
              <View className="w-8 h-8 rounded-full bg-[#1a1a2e] border border-white/[0.08] items-center justify-center mb-3">
                <s.icon size={14} color={s.color} strokeWidth={1.8} />
              </View>
              <Text className="text-white text-[22px] font-extralight tracking-tighter tabular-nums">{s.value}</Text>
              <Text className="text-[#6b6b80] text-[9px] font-semibold uppercase tracking-[0.2em] mt-1">{s.label}</Text>
              <Text className="text-[#6b6b80] text-[10px] font-light mt-0.5">{s.sub}</Text>
            </View>
          ))}
        </Animated.View>

        <Text className="text-[#6b6b80] text-[10px] font-semibold uppercase tracking-[0.3em] mb-5">Log · 05</Text>

        {/* Timeline with hairline */}
        <View className="relative pl-5">
          <View className="absolute left-[19px] top-4 bottom-4 w-px bg-[#23233a]" />
          {SERVICES.map((s, i) => (
            <Animated.View
              key={s.id}
              entering={FadeInDown.duration(500).delay(150 + i * 80)}
              className="relative mb-4"
            >
              {/* timeline node */}
              <View className="absolute left-[-21px] top-[22px] w-2.5 h-2.5 rounded-full bg-[#8b7cf6] shadow-[0_0_10px_rgba(139,124,246,0.4)] z-10" />

              <TouchableOpacity activeOpacity={0.85} className="bg-[#0d0d18] rounded-[18px] border border-white/[0.06] px-5 py-4 ml-2">
                <View className="flex-row items-start justify-between mb-2">
                  <View>
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-white text-base font-light tracking-tight">{s.type}</Text>
                      {s.badge && (
                        <View className="bg-[#10b981]/10 border border-[#10b981]/20 px-1.5 py-0.5 rounded-md">
                          <Text className="text-[#10b981] text-[9px] font-bold uppercase">{s.badge}</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-[#6b6b80] text-[10px] font-light">{s.date} · {s.km} km · {s.category}</Text>
                  </View>
                  <Text className="text-white text-sm font-medium tracking-tight">${s.cost.toFixed(2)}</Text>
                </View>
                <View className="flex-row items-center justify-between pt-3 border-t border-white/[0.04]">
                  <View className="flex-row items-center gap-2">
                    <Wrench size={12} color="#8b7cf6" strokeWidth={1.5} />
                    <Text className="text-[#8b8fa3] text-[11px] font-medium">{s.category}</Text>
                  </View>
                  <ArrowUpRight size={14} color="#6b6b80" strokeWidth={1.5} />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
