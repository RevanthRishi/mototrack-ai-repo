import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, Text, Modal, TouchableOpacity } from 'react-native';
import { ArrowLeft, X } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useVehicle, useUpdateVehicle, useDeleteVehicle } from '@/lib/hooks/useVehicle';
import { useNotification } from '@/lib/notifications/NotificationContext';
import { useTheme } from '@/lib/stores/themeStore';

export default function EditVehicleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isDark } = useTheme();
  const { notify } = useNotification();
  const { data: vehicle, isLoading } = useVehicle(id ?? '');
  const updateMutation = useUpdateVehicle(id ?? '');
  const deleteMutation = useDeleteVehicle();

  const [name, setName] = useState(vehicle?.name ?? '');
  const [make, setMake] = useState(vehicle?.make ?? '');
  const [model, setModel] = useState(vehicle?.model ?? '');
  const [yearStr, setYearStr] = useState(vehicle?.year ? String(vehicle.year) : '');
  const [variant, setVariant] = useState(vehicle?.variant ?? '');
  const [odometerStr, setOdometerStr] = useState(vehicle?.odometer ? String(vehicle.odometer) : '');

  React.useEffect(() => {
    if (vehicle) {
      setName(vehicle.name ?? '');
      setMake(vehicle.make ?? '');
      setModel(vehicle.model ?? '');
      setYearStr(vehicle.year ? String(vehicle.year) : '');
      setVariant(vehicle.variant ?? '');
      setOdometerStr(vehicle.odometer ? String(vehicle.odometer) : '');
    }
  }, [vehicle]);

  const handleSave = () => {
    if (!id || !vehicle) return;
    const yearVal = yearStr ? parseInt(yearStr, 10) : undefined;
    const odometerVal = odometerStr ? parseInt(odometerStr, 10) : undefined;

    updateMutation.mutate(
      {
        name: name || `${make} ${model}`,
        make,
        model,
        year: yearVal,
        variant: variant || undefined,
        current_odometer: odometerVal,
      },
      {
        onSuccess: () => {
          notify('Vehicle updated', 'success');
          router.back();
        },
        onError: (err: any) => {
          notify(err?.message || 'Failed to update', 'error');
        },
      }
    );
  };

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleDelete = () => {
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!id) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        notify('Vehicle deleted', 'success');
        router.replace('/(tabs)');
      },
      onError: (err: any) => {
        notify(err?.message || 'Failed to delete', 'error');
      },
    });
    setDeleteConfirmOpen(false);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas-light dark:bg-canvas-dark">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-7 pt-6">
        <Button
          variant="ghost"
          size="sm"
          onPress={handleBack}
          leftIcon={<ArrowLeft size={16} color={isDark ? '#6b6b80' : '#6b6b80'} />}
          className="mb-4 self-start"
          data-cy="edit-vehicle-back"
        >
          Back
        </Button>
        <Text className="text-text-primary dark:text-text-primary-dark text-3xl font-light tracking-tight mb-6">Edit Vehicle</Text>

        {isLoading ? (
          <View className="bg-card-light dark:bg-card-dark rounded-[22px] border border-border-light dark:border-border-dark p-5 mb-6 items-center">
            <Text className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-light">Loading…</Text>
          </View>
        ) : vehicle ? (
          <View className="bg-card-light dark:bg-card-dark rounded-[22px] border border-border-light dark:border-border-dark p-5 mb-6">
            <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.25em] mb-3">Current Vehicle</Text>
            <Text className="text-text-primary dark:text-text-primary-dark text-lg font-light">{vehicle.name || `${vehicle.make} ${vehicle.model}`}</Text>
            <Text className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-light mt-0.5">{vehicle.year} · {vehicle.current_odometer ? `${vehicle.current_odometer.toLocaleString()} km` : (vehicle.odometer ? `${vehicle.odometer.toLocaleString()} km` : '—')}</Text>
          </View>
        ) : (
          <View className="bg-card-light dark:bg-card-dark rounded-[22px] border border-border-light dark:border-border-dark p-5 mb-6">
            <Text className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-light">Vehicle not found</Text>
          </View>
        )}

        <Input label="Name" placeholder="My Bike" value={name} onChangeText={setName} data-cy="edit-vehicle-name" />
        <Input label="Make / Brand" placeholder="Yamaha" value={make} onChangeText={setMake} data-cy="edit-vehicle-make" />
        <Input label="Model" placeholder="MT-07" value={model} onChangeText={setModel} data-cy="edit-vehicle-model" />
        <Input label="Year" placeholder="2024" keyboardType="numeric" value={yearStr} onChangeText={setYearStr} data-cy="edit-vehicle-year" />
        <Input label="Variant / Edition" placeholder="Black Edition" value={variant} onChangeText={setVariant} data-cy="edit-vehicle-variant" />
        <Input label="Odometer (km)" placeholder="18,230" keyboardType="numeric" value={odometerStr} onChangeText={setOdometerStr} data-cy="edit-vehicle-odometer" />

        <View className="flex-row gap-3 mt-6">
          <Button variant="danger" className="flex-1" data-cy="edit-vehicle-delete" onPress={handleDelete} isLoading={deleteMutation.isPending} disabled={deleteMutation.isPending}>
            Delete
          </Button>
          <Button variant="primary" className="flex-1" data-cy="edit-vehicle-save" onPress={handleSave} isLoading={updateMutation.isPending} disabled={updateMutation.isPending || !vehicle}>
            Save Changes
          </Button>
        </View>

        <View className="h-12" />

        {/* Delete Confirmation Modal */}
        <Modal visible={deleteConfirmOpen} transparent animationType="fade" onRequestClose={() => setDeleteConfirmOpen(false)}>
          <View className={`flex-1 items-center justify-center px-6 ${isDark ? 'bg-black/60' : 'bg-black/30'}`}>
            <View className={`rounded-3xl p-7 w-full max-w-sm border ${isDark ? 'bg-[#0d0d18] border-white/[0.06]' : 'bg-[#ffffff] border-[rgba(15,23,42,0.08)]'}`}>
              <View className="flex-row items-center justify-between mb-4">
                <Text className={`text-lg font-light tracking-tight ${isDark ? 'text-[#e2e0ed]' : 'text-[#0f172a]'}`}>Delete Vehicle</Text>
                <TouchableOpacity onPress={() => setDeleteConfirmOpen(false)} data-cy="delete-cancel" disabled={deleteMutation.isPending}>
                  <X size={18} color={isDark ? '#8b8fa3' : '#6b6b80'} />
                </TouchableOpacity>
              </View>
              <Text className={`text-sm font-light mb-6 ${isDark ? 'text-[#6b6b80]' : 'text-[#4b5563]'}`}>
                Are you sure? This action cannot be undone.
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setDeleteConfirmOpen(false)}
                  disabled={deleteMutation.isPending}
                  className={`flex-1 rounded-2xl py-3.5 items-center ${isDark ? 'bg-[#13131f]' : 'bg-[#e8e9f0]'}`}
                  data-cy="delete-cancel"
                >
                  <Text className={`text-[15px] font-light ${isDark ? 'text-[#e2e0ed]' : 'text-[#0f172a]'}`}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={confirmDelete}
                  disabled={deleteMutation.isPending}
                  className="flex-1 bg-danger/10 border border-danger/20 rounded-2xl py-3.5 items-center"
                  data-cy="delete-confirm"
                >
                  <Text className="text-danger text-[15px] font-semibold">{deleteMutation.isPending ? 'Deleting…' : 'Delete'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
