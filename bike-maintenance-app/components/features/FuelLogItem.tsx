import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Fuel, TrendingDown, ArrowDown, ChevronRight } from 'lucide-react-native';

interface FuelLogItemProps {
  date: string;
  liters: number;
  cost: number;
  km: number;
  efficiency: number;
  trend: 'up' | 'down';
  onPress?: () => void;
}

export function FuelLogItem({ date, liters, cost, km, efficiency, trend, onPress }: FuelLogItemProps) {
  const trendColor = trend === 'up' ? '#10b981' : '#f97316';
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} className="bg-[#0d0d18] rounded-[18px] border border-white/[0.06] px-5 py-5 mb-3">
      <View className="flex-row items-center">
        <View className="w-11 h-11 rounded-full items-center justify-center border" style={{ backgroundColor: `${trendColor}14`, borderColor: `${trendColor}26` }}>
          <Fuel size={16} color={trendColor} strokeWidth={1.8} />
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-white text-[15px] font-light tracking-tight">{date}</Text>
          <View className="flex-row items-center gap-2 mt-0.5">
            <Text className="text-[#6b6b80] text-[11px] font-light">{liters} L</Text>
            <View className="w-px h-3 bg-white/[0.12]" />
            <Text className="text-[#6b6b80] text-[11px] font-light">${cost.toFixed(2)}</Text>
            <View className="w-px h-3 bg-white/[0.12]" />
            <Text className="text-[#6b6b80] text-[11px] font-light">{km} km</Text>
          </View>
        </View>
        <View className="items-end mr-2">
          <View className="flex-row items-center gap-1">
            {trend === 'up' ? <TrendingDown size={11} color={trendColor} strokeWidth={2} /> : <ArrowDown size={11} color={trendColor} strokeWidth={2} />}
            <Text className="text-[15px] font-light tracking-tighter tabular-nums" style={{ color: trendColor }}>{efficiency}</Text>
          </View>
          <Text className="text-[#6b6b80] text-[9px] font-medium mt-0.5">km / l</Text>
        </View>
        <ChevronRight size={15} color="#3a3a50" strokeWidth={1.5} />
      </View>
    </TouchableOpacity>
  );
}
