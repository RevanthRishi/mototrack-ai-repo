import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fuel, TrendingDown, ChevronRight, ArrowDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

const LOGS = [
  { id: 1, date: '4 Sep', liters: 12.4, cost: 128.50, km: 432, efficiency: 42.3, trend: 'up' },
  { id: 2, date: '1 Sep', liters: 10.8, cost: 112.00, km: 389, efficiency: 36.0, trend: 'down' },
  { id: 3, date: '28 Aug', liters: 14.2, cost: 146.30, km: 550, efficiency: 38.7, trend: 'up' },
];

export default function FuelScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#06060f]">
      {/* Editorial hero */}
      <View className="px-7 pt-7 pb-8 relative overflow-hidden">
        <LinearGradient
          colors={['#0f1a12', '#090e0b', '#06060f']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute inset-0"
        />
        <LinearGradient
          colors={['rgba(16,185,129,0.08)', 'transparent 60%']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute inset-0"
        />

        <Animated.View entering={FadeInUp.duration(700)}>
          <Text className="text-[#10b981] text-[10px] font-semibold uppercase tracking-[0.35em]">Fuel Economy</Text>
          <Text className="text-white text-[40px] font-light tracking-tight mt-3 leading-[1.05]">Consumption</Text>
        </Animated.View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-7 -mt-5">
        {/* Hero stat — dominant number */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)}>
          <View className="bg-[#0d0d18] rounded-[22px] border border-white/[0.06] overflow-hidden mb-6">
            <View className="px-7 pt-8 pb-7">
              <View className="flex-row items-end gap-3 mb-1">
                <Text className="text-white text-7xl font-extralight tracking-tighter tabular-nums leading-none">42.3</Text>
                <Text className="text-[#10b981] text-[18px] font-light mb-2 tracking-wide">km / l</Text>
              </View>
              <View className="flex-row items-center gap-2 mt-2">
                <Text className="text-[#6b6b80] text-[11px] font-medium">Average efficiency · Last 30 days</Text>
              </View>
            </View>

            {/* hairline divider */}
            <View className="h-px mx-7 bg-white/[0.06]" />

            {/* 3-col stats */}
            <View className="flex-row px-7 py-5">
              {[
                { label: 'Fuel Used', value: '120.3', unit: 'L' },
                { label: 'Distance', value: '5,088', unit: 'km' },
                { label: 'Spent', value: '$841', unit: '' },
              ].map((s, i) => (
                <View key={s.label} className={`flex-1 ${i < 2 ? 'border-r border-white/[0.06] pr-5 mr-5' : ''}`}>
                  <Text className="text-[#6b6b80] text-[9px] font-semibold uppercase tracking-[0.25em]">{s.label}</Text>
                  <Text className="text-white text-[20px] font-extralight mt-1 tracking-tighter tabular-nums">{s.value}</Text>
                  {s.unit && <Text className="text-[#6b6b80] text-[10px] font-light">{s.unit}</Text>}
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Log list header */}
        <Animated.View entering={FadeInDown.duration(600).delay(180)} className="flex-row items-center justify-between mb-4">
          <Text className="text-[#6b6b80] text-[10px] font-semibold uppercase tracking-[0.3em]">Refill Log · 03</Text>
          <TouchableOpacity>
            <Text className="text-[#8b7cf6] text-[10px] font-semibold tracking-widest uppercase">See All</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Log rows */}
        {LOGS.map((log, i) => (
          <Animated.View
            key={log.id}
            entering={FadeInDown.duration(500).delay(220 + i * 70)}
            className="mb-3"
          >
            <TouchableOpacity activeOpacity={0.85} className="bg-[#0d0d18] rounded-[18px] border border-white/[0.06] px-5 py-5">
              <View className="flex-row items-center">
                {/* icon */}
                <View className="w-11 h-11 rounded-full bg-[#10b981]/8 items-center justify-center border border-[#10b981]/15">
                  <Fuel size={16} color="#10b981" strokeWidth={1.8} />
                </View>

                {/* center info */}
                <View className="flex-1 ml-4">
                  <Text className="text-white text-[15px] font-light tracking-tight">{log.date}</Text>
                  <View className="flex-row items-center gap-2 mt-0.5">
                    <Text className="text-[#6b6b80] text-[11px] font-light">{log.liters} L</Text>
                    <View className="w-px h-3 bg-white/[0.12]" />
                    <Text className="text-[#6b6b80] text-[11px] font-light">${log.cost.toFixed(2)}</Text>
                    <View className="w-px h-3 bg-white/[0.12]" />
                    <Text className="text-[#6b6b80] text-[11px] font-light">{log.km} km</Text>
                  </View>
                </View>

                {/* efficiency */}
                <View className="items-end mr-2">
                  <View className="flex-row items-center gap-1">
                    {log.trend === 'up' ? (
                      <TrendingDown size={11} color="#10b981" strokeWidth={2} />
                    ) : (
                      <ArrowDown size={11} color="#f97316" strokeWidth={2} />
                    )}
                    <Text
                      className={`text-[15px] font-light tracking-tighter tabular-nums ${log.trend === 'up' ? 'text-[#10b981]' : 'text-[#f97316]'}`}
                    >
                      {log.efficiency}
                    </Text>
                  </View>
                  <Text className="text-[#6b6b80] text-[9px] font-medium mt-0.5">km / l</Text>
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
