import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Bell, Clock, Wrench } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useResponsive } from '@/lib/hooks/useResponsive';

export default function RemindersScreen() {
  const { isMobile } = useResponsive();
  const [reminders] = useState([
    { id: 1, title: 'Oil Change', due: 'In 200 km', type: 'service', icon: Wrench },
    { id: 2, title: 'Chain Lube', due: 'In 500 km', type: 'service', icon: Wrench },
    { id: 3, title: 'Brake Check', due: 'In 1,000 km', type: 'service', icon: Wrench },
  ]);

  return (
    <ScrollView className="flex-1 bg-[#06060f] px-5 pt-6" contentContainerClassName="pb-10">
      <LinearGradient colors={['#8b7cf6', '#6d5ae6']} className="rounded-3xl p-6 mb-6 shadow-[0_8px_30px_rgba(139,124,246,0.3)]">
        <Bell size={28} color="#fff" strokeWidth={1.5} />
        <Text className="text-white text-xl font-extrabold mt-3">Reminders</Text>
        <Text className="text-[#d6d6e6] text-sm mt-1">Odometer-based service alerts</Text>
      </LinearGradient>
      {reminders.map(r => (
        <TouchableOpacity key={r.id} className="bg-[#161625] rounded-2xl p-4 mb-3 border border-[#23233a] active:opacity-90">
          <View className="flex-row items-center gap-3">
            <View className="bg-[#8b7cf6]/10 p-2.5 rounded-xl"><r.icon size={18} color="#8b7cf6" strokeWidth={1.5} /></View>
            <View className="flex-1"><Text className="text-white font-semibold">{r.title}</Text><Text className="text-[#9ca3af] text-xs">{r.due}</Text></View>
            <Clock size={16} color="#6b6e80" />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
