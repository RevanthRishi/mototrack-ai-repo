import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function EditVehicleScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#06060f]">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-7 pt-6">
        <Button variant="ghost" size="sm" onPress={() => router.back()} leftIcon={<ArrowLeft size={16} color="#8b8fa3" />} className="mb-4 self-start">Back</Button>
        <Text className="text-white text-3xl font-light tracking-tight mb-6">Edit Vehicle</Text>

        <View className="bg-[#0d0d18] rounded-[22px] border border-white/[0.06] p-5 mb-6">
          <Text className="text-[#6b6b80] text-[10px] font-semibold uppercase tracking-[0.25em] mb-3">Current Vehicle</Text>
          <Text className="text-white text-lg font-light">Yamaha R15 V4</Text>
          <Text className="text-[#6b6b80] text-sm font-light mt-0.5">2024 · 18,230 km</Text>
        </View>

        <Input label="Odometer Reading" placeholder="18,230 km" keyboardType="numeric" defaultValue="18,230" />
        <Input label="Color / Edition" placeholder="Black Edition" defaultValue="Black Edition" />
        <Input label="Registration Number" placeholder="ABC 1234" />

        <View className="flex-row gap-3 mt-6">
          <Button variant="danger" className="flex-1">Delete</Button>
          <Button variant="primary" className="flex-1">Save Changes</Button>
        </View>

        <View className="h-12" />
      </ScrollView>
    </SafeAreaView>
  );
}
