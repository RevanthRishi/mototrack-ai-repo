import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function EditVehicleScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-canvas-light dark:bg-canvas-dark">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-7 pt-6">
        <Button variant="ghost" size="sm" onPress={() => router.back()} leftIcon={<ArrowLeft size={16} color="#6b6b80" />} className="mb-4 self-start" data-cy="edit-vehicle-back">Back</Button>
        <Text className="text-text-primary dark:text-text-primary-dark text-3xl font-light tracking-tight mb-6">Edit Vehicle</Text>

        <View className="bg-card-light dark:bg-card-dark rounded-[22px] border border-border-light dark:border-border-dark p-5 mb-6">
          <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.25em] mb-3">Current Vehicle</Text>
          <Text className="text-text-primary dark:text-text-primary-dark text-lg font-light">Yamaha R15 V4</Text>
          <Text className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-light mt-0.5">2024 · 18,230 km</Text>
        </View>

        <Input label="Odometer Reading" placeholder="18,230 km" keyboardType="numeric" defaultValue="18,230" />
        <Input label="Color / Edition" placeholder="Black Edition" defaultValue="Black Edition" />
        <Input label="Registration Number" placeholder="ABC 1234" />

        <View className="flex-row gap-3 mt-6">
          <Button variant="danger" className="flex-1" data-cy="edit-vehicle-delete">Delete</Button>
          <Button variant="primary" className="flex-1" data-cy="edit-vehicle-save">Save Changes</Button>
        </View>

        <View className="h-12" />
      </ScrollView>
    </SafeAreaView>
  );
}
