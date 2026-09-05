import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { X, ChevronDown, Check, Search } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { useMotorcycleSearch } from '@/lib/hooks/useMotorcycleSearch';

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1999 }, (_, i) => ({
  label: String(CURRENT_YEAR - i),
  value: String(CURRENT_YEAR - i),
}));

interface Option { label: string; value: string; meta?: string; }
interface Props { onClose: () => void; onSave?: (data: { make: string; model: string; year: string; odometer: string }) => void; }

function OptionPicker({ label, value, options, onChange, onSearchChange, loading, searchable, placeholder, disabled }: any) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const filtered = searchable ? options.filter((o: Option) => o.label.toLowerCase().includes(query.toLowerCase())) : options;
  const selected = options.find((o: Option) => o.value === value);
  return (
    <View className="mb-3">
      <Text className="text-white/40 text-[10px] font-semibold uppercase tracking-[0.2em] mb-2 ml-1">{label}</Text>
      <Pressable onPress={() => !disabled && setOpen(true)} disabled={disabled} className={`flex-row items-center rounded-xl border px-4 py-3.5 ${open ? 'border-accent-violet/60 bg-white/[0.05]' : 'border-white/[0.08] bg-white/[0.04]'} ${disabled ? 'opacity-40' : ''}`}>
        <Text className={`flex-1 text-[14px] font-light ${selected ? 'text-white/90' : 'text-white/30'}`}>{selected?.label ?? placeholder ?? `Select ${label}...`}</Text>
        {loading ? <View className="w-4 h-4 rounded-full border-2 border-accent-violet/40 border-t-accent-violet animate-spin" /> : <ChevronDown size={14} color="#6b6b80" strokeWidth={1.8} />}
      </Pressable>
      {open && (
        <View className="mt-2 rounded-2xl border border-white/[0.08] bg-[#13132a] overflow-hidden">
          {searchable && (
            <View className="flex-row items-center px-3 py-2.5 border-b border-white/[0.05]">
              <Search size={12} color="#505070" strokeWidth={2} />
              <TextInput value={query} onChangeText={(t: string) => { setQuery(t); onSearchChange?.(t); }} placeholder="Search..." placeholderTextColor="#404060" className="flex-1 ml-2 text-[13px] font-light text-white" />
            </View>
          )}
          <ScrollView className="max-h-48" showsVerticalScrollIndicator={false}>
            {loading ? (
              <View className="items-center py-8">
                <View className="w-5 h-5 rounded-full border-2 border-accent-violet/40 border-t-accent-violet animate-spin" />
              </View>
            ) : filtered.length === 0 ? (
              <View className="items-center py-8">
                <Text className="text-white/25 text-[12px] font-light">No results</Text>
              </View>
            ) : filtered.map((o: Option) => {
                const isSel = o.value === value;
              return (
                <Pressable
                  key={o.value}
                  onPress={() => { onChange(o.value); setOpen(false); setQuery(''); }}
                  className={`flex-row items-center px-3 py-3 active:opacity-60 ${isSel ? 'bg-accent-violet/12' : ''}`}
                >
                  <Text className={`flex-1 text-[14px] font-light ${isSel ? 'text-accent-violet' : 'text-white/80'}`}>{o.label}</Text>
                  {isSel && <Check size={12} color="#8b7cf6" strokeWidth={2.5} />}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

export function AddVehicleSheet({ onClose, onSave }: Props) {
  const [make, setMake] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [makeQuery, setMakeQuery] = useState('');
  const [modelQuery, setModelQuery] = useState('');
  const [odometer, setOdometer] = useState('');
  const [saving, setSaving] = useState(false);
  const { results: makeResults, loading: makesLoading } = useMotorcycleSearch(makeQuery);
  const { results: modelResults, loading: modelsLoading } = useMotorcycleSearch(modelQuery);
  const makeOptions = makeResults.map((r: any) => ({ label: r.make, value: r.make }));
  const modelOptions = modelResults.map((r: any) => ({ label: `${r.model}${r.year ? ` · ${r.year}` : ''}`, value: r.model }));
  const handleSave = async () => { if (!make || !model || !year) return; setSaving(true); try { onSave?.({ make, model, year, odometer }); onClose(); } finally { setSaving(false); } };
  return (
    <View className="flex-1 bg-black/60 items-center justify-center px-6" data-cy="add-vehicle-sheet">
      <Pressable className="absolute inset-0" onPress={onClose} />
      <View className="bg-card-light dark:bg-card-dark rounded-3xl p-7 w-full max-w-sm border border-border-light dark:border-border-dark relative z-[60]">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-text-primary-light dark:text-text-primary-dark text-lg font-light tracking-tight">Add Vehicle</Text>
          <Pressable onPress={onClose} data-cy="add-vehicle-sheet-close"><X size={18} color="#6b6b80" /></Pressable>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <OptionPicker label="Make" value={make} options={makeOptions} onChange={(v: string) => { setMake(v); setModel(null); }} onSearchChange={setMakeQuery} loading={makesLoading} searchable placeholder="Search make (e.g. Yamaha)" />
          <OptionPicker label="Model" value={model} options={modelOptions} onChange={setModel} onSearchChange={setModelQuery} loading={modelsLoading} searchable disabled={!make} placeholder={make ? 'Search model...' : 'Select make first'} />
          <OptionPicker label="Year" value={year} options={YEAR_OPTIONS} onChange={setYear} />
          <View className="mb-6"><Text className="text-white/40 text-[10px] font-semibold uppercase tracking-[0.2em] mb-2 ml-1">Odometer (km)</Text><TextInput value={odometer} onChangeText={setOdometer} placeholder="18,230" placeholderTextColor="#404060" keyboardType="numeric" className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-[14px] font-light text-white" /></View>
          <Button variant="primary" isLoading={saving} disabled={!make || !model || !year} onPress={handleSave} data-cy="add-vehicle-sheet-save" className="mt-1">Save Vehicle</Button>
        </ScrollView>
      </View>
    </View>
  );
}
