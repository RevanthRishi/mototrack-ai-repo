import React, { useState } from 'react';
import { Text, ScrollView, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useAddVehicle } from '@/lib/hooks/useAddVehicle';
import { useNotification } from '@/lib/notifications/NotificationContext';

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1999 }, (_, i) => {
  const year = CURRENT_YEAR - i;
  return { label: String(year), value: String(year) };
});

const MAKE_OPTIONS = [
  'Aprilia', 'Bajaj', 'Benelli', 'BMW', 'Buell', 'CFMOTO', 'Ducati',
  'Harley-Davidson', 'Honda', 'Hyosung', 'Indian', 'Kawasaki', 'KTM',
  'Mahindra', 'MV Agusta', 'Royal Enfield', 'Suzuki', 'Triumph',
  'TVS', 'Vespa', 'Yamaha', 'Zero',
].map((m) => ({ label: m, value: m }));

const MODEL_OPTIONS: Record<string, { label: string; value: string }[]> = {
  'Aprilia': [{ label: 'RS 660', value: 'RS 660' }, { label: 'Tuono V4 1100', value: 'Tuono V4 1100' }],
  Bajaj: [{ label: 'Dominar 400', value: 'Dominar 400' }, { label: 'Pulsar RS 200', value: 'Pulsar RS 200' }],
  Benelli: [{ label: 'Toro 302', value: 'Toro 302' }, { label: 'Leoncino 500', value: 'Leoncino 500' }],
  BMW: [{ label: 'G 310 R', value: 'G 310 R' }, { label: 'S 1000 RR', value: 'S 1000 RR' }],
  Ducati: [{ label: 'Monster 821', value: 'Monster 821' }, { label: 'Panigale V2', value: 'Panigale V2' }],
  'Harley-Davidson': [{ label: 'Street 750', value: 'Street 750' }, { label: 'Sportster S', value: 'Sportster S' }],
  Honda: [{ label: 'CBR500R', value: 'CBR500R' }, { label: 'NC750X', value: 'NC750X' }],
  Kawasaki: [{ label: 'Z750', value: 'Z750' }, { label: 'Ninja H2R', value: 'Ninja H2R' }],
  KTM: [{ label: 'Duke 390', value: 'Duke 390' }, { label: 'RC 390', value: 'RC 390' }],
  'Royal Enfield': [
    { label: 'Super Meteor 350', value: 'Super Meteor 350' },
    { label: 'Interceptor 650', value: 'Interceptor 650' },
    { label: 'Classic 350', value: 'Classic 350' },
  ],
  Suzuki: [{ label: 'GSX-S1000', value: 'GSX-S1000' }, { label: 'V-Strom 1000', value: 'V-Strom 1000' }],
  Triumph: [{ label: 'Speed Triple', value: 'Speed Triple' }, { label: 'Bonneville T100', value: 'Bonneville T100' }],
  Yamaha: [{ label: 'MT-07', value: 'MT-07' }, { label: 'YZF-R6', value: 'YZF-R6' }],
};

export default function AddVehicleScreen() {
  const [make, setMake] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [odometer, setOdometer] = useState('');

  const router = useRouter();
  const { notify } = useNotification();
  const addVehicle = useAddVehicle();

  const handleSave = () => {
    if (!make || !model || !year || !odometer) return;

    addVehicle.mutate(
      { make, model, year: parseInt(year, 10), odometer: parseInt(odometer, 10) },
      {
        onSuccess: () => {
          notify('Vehicle saved!', 'success');
          router.push('/(tabs)');
        },
        onError: (error: any) => {
          notify(error?.message || 'Failed to save vehicle', 'error');
        },
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas-light dark:bg-canvas-dark">
      <View className="px-4 pt-3 flex-row items-center">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/(tabs)')}
          data-cy="add-vehicle-back"
          hitSlop={12}
          className="w-10 h-10 items-center justify-center rounded-full"
        >
          <ArrowLeft size={20} color="#8b7cf6" strokeWidth={1.8} />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-7 pt-6" keyboardShouldPersistTaps="handled">
        <Text className="text-text-primary dark:text-text-primary-dark text-3xl font-light tracking-tight mb-6">Add Vehicle</Text>
        <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[12px] font-light mb-6">
          Enter your vehicle details below.
        </Text>

        <Select
          label="Brand"
          placeholder="Select brand…"
          value={make}
          options={MAKE_OPTIONS}
          onChange={setMake}
          searchable
          dataCy="add-vehicle-make"
          emptyText="No makes found"
        />

        <Input
          label="Model"
          placeholder={make ? `e.g. ${MODEL_OPTIONS[make]?.[0]?.label ?? 'model'}` : 'Select a brand first'}
          value={model ?? undefined}
          onChangeText={setModel}
          data-cy="add-vehicle-model"
        />

        <Select
          label="Year"
          placeholder="Select year…"
          value={year}
          options={YEAR_OPTIONS}
          onChange={setYear}
          dataCy="add-vehicle-year"
        />

        <Input
          label="Odometer"
          placeholder="18,230 km"
          keyboardType="numeric"
          value={odometer}
          onChangeText={setOdometer}
          data-cy="add-vehicle-odometer"
        />

        <Button
          variant="primary"
          className="mt-2"
          disabled={!make || !model || !year || !odometer || addVehicle.isPending}
          isLoading={addVehicle.isPending}
          data-cy="add-vehicle-save"
          onPress={handleSave}
        >
          Save Vehicle
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
