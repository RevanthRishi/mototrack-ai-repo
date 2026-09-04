import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowUpRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface VehicleCardProps {
  make: string;
  model: string;
  year: number;
  color: string;
  km: number;
  status?: { label: string; color: string } | null;
  onPress?: () => void;
  variant?: 'featured' | 'list';
}

export function VehicleCard({ make, model, year, color, km, status, onPress, variant = 'list' }: VehicleCardProps) {
  if (variant === 'featured') {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <View className="rounded-[28px] overflow-hidden relative border border-white/[0.08]">
          <LinearGradient colors={['#1f1638', '#110b22', '#0a0814']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-7">
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.18)' }} />
            <View className="flex-row items-start justify-between mb-6">
              <View>
                <Text className="text-[#c4b5fd] text-[10px] font-semibold uppercase tracking-[0.3em]">Primary</Text>
                <Text className="text-white text-[34px] font-extralight tracking-tight mt-3 leading-none">{make}</Text>
                <Text className="text-white text-[34px] font-extralight tracking-tight">{model.split(' ')[0]} <Text className="text-[#8b7cf6]">{model.split(' ').slice(1).join(' ')}</Text></Text>
              </View>
              <View className="w-9 h-9 rounded-full border border-white/15 items-center justify-center">
                <ArrowUpRight size={16} color="#fff" strokeWidth={1.5} />
              </View>
            </View>
            <Text className="text-[#8b8fa3] text-[13px] font-light">{year} · {color} · {km.toLocaleString()} km</Text>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <View className="flex-row items-center py-5 border-t border-b border-white/[0.06]">
        <View className="w-12 h-12 rounded-full bg-[#13131f] border border-white/[0.08] items-center justify-center">
          <Text className="text-2xl">🏍️</Text>
        </View>
        <View className="flex-1 ml-5">
          <Text className="text-white text-lg font-light tracking-tight">{make} {model}</Text>
          <Text className="text-[#6b6b80] text-[12px] font-light mt-0.5">{year} · {color} · {km.toLocaleString()} km</Text>
        </View>
        {status && (
          <View className="items-end">
            <View className="px-2.5 py-1 rounded-full" style={{ backgroundColor: `${status.color}18`, borderWidth: 1, borderColor: `${status.color}4D` }}>
              <Text className="text-[9px] font-bold tracking-widest" style={{ color: status.color }}>{status.label}</Text>
            </View>
            <ArrowUpRight size={14} color="#6b6b80" strokeWidth={1.5} className="mt-2" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
