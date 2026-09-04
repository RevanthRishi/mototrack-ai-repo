import React from 'react';
import { View, Text } from 'react-native';
import { Wrench, DollarSign, Clock } from 'lucide-react-native';

interface RepairEstimateProps {
  min: number;
  max: number;
  hours: number;
  difficulty: 'easy' | 'medium' | 'hard';
  recommendation: 'DIY' | 'Professional';
  notes?: string;
}

export function RepairEstimate({ min, max, hours, difficulty, recommendation, notes }: RepairEstimateProps) {
  const diffColor = difficulty === 'easy' ? '#10b981' : difficulty === 'medium' ? '#f59e0b' : '#ef4444';
  return (
    <View className="bg-[#0d0d18] rounded-[20px] border border-white/[0.06] p-5 mt-4">
      <Text className="text-[#6b6b80] text-[10px] font-semibold uppercase tracking-[0.25em] mb-4">Repair Estimate</Text>

      <View className="flex-row gap-3 mb-4">
        <View className="flex-1 bg-[#06060f] rounded-2xl p-3 border border-white/[0.04]">
          <View className="flex-row items-center gap-1.5 mb-1.5"><DollarSign size={11} color="#8b7cf6" strokeWidth={1.5} /><Text className="text-[#6b6b80] text-[9px] uppercase tracking-widest">Cost</Text></View>
          <Text className="text-white text-base font-extralight tabular-nums">${min}–${max}</Text>
        </View>
        <View className="flex-1 bg-[#06060f] rounded-2xl p-3 border border-white/[0.04]">
          <View className="flex-row items-center gap-1.5 mb-1.5"><Clock size={11} color="#10b981" strokeWidth={1.5} /><Text className="text-[#6b6b80] text-[9px] uppercase tracking-widest">Time</Text></View>
          <Text className="text-white text-base font-extralight tabular-nums">{hours}h</Text>
        </View>
        <View className="flex-1 bg-[#06060f] rounded-2xl p-3 border border-white/[0.04]">
          <View className="flex-row items-center gap-1.5 mb-1.5"><Wrench size={11} color={diffColor} strokeWidth={1.5} /><Text className="text-[#6b6b80] text-[9px] uppercase tracking-widest">Skill</Text></View>
          <Text className="text-base font-light tracking-tight" style={{ color: diffColor }}>{difficulty}</Text>
        </View>
      </View>

      <View className="bg-[#8b7cf6]/8 border border-[#8b7cf6]/15 rounded-2xl p-3">
        <Text className="text-[#6b6b80] text-[9px] font-semibold uppercase tracking-widest">Recommendation</Text>
        <Text className="text-white text-sm font-light mt-1">{recommendation}</Text>
        {notes && <Text className="text-[#8b8fa3] text-[12px] font-light mt-1.5">{notes}</Text>}
      </View>
    </View>
  );
}
