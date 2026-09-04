import React from 'react';
import { ScrollView, SafeAreaView, Text } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AddVehicleScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-canvas-dark">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-7 pt-6">
        <Button variant="ghost" size="sm" onPress={() => router.back()} leftIcon={<ArrowLeft size={16} color="#8b8fa3" />} className="mb-4 self-start" data-cy="add-vehicle-back">Back</Button>
        <Text className="text-white text-3xl font-light tracking-tight mb-1">Add Vehicle</Text>
        <Input label="Make" placeholder="Yamaha, Honda, etc." />
        <Input label="Model" placeholder="R15 V4, CB350" />
        <Input label="Year" placeholder="2024" keyboardType="number-pad" />
        <Input label="Odometer" placeholder="18,230 km" keyboardType="numeric" />
        <Button variant="primary" className="mt-2" data-cy="add-vehicle-save">Save Vehicle</Button>
      </ScrollView>
    </SafeAreaView>
  );
}
