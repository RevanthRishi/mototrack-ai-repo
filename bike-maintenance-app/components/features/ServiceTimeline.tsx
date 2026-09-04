import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Wrench, ArrowUpRight } from 'lucide-react-native';

export interface ServiceItem {
  id: number | string;
  type: string;
  date: string;
  cost: number;
  km: string;
  category: string;
  badge?: string | null;
}

interface ServiceTimelineProps {
  items: ServiceItem[];
  onItemPress?: (item: ServiceItem) => void;
}

export function ServiceTimeline({ items, onItemPress }: ServiceTimelineProps) {
  return (
    <View className="relative pl-5">
      <View className="absolute left-[19px] top-4 bottom-4 w-px bg-[#23233a]" />
      {items.map((s) => (
        <View key={s.id} className="relative mb-4">
          <View className="absolute left-[-21px] top-[22px] w-2.5 h-2.5 rounded-full bg-[#8b7cf6] shadow-[0_0_10px_rgba(139,124,246,0.4)] z-10" />
          <TouchableOpacity activeOpacity={0.85} onPress={() => onItemPress?.(s)} className="bg-[#0d0d18] rounded-[18px] border border-white/[0.06] px-5 py-4 ml-2">
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
        </View>
      ))}
    </View>
  );
}
