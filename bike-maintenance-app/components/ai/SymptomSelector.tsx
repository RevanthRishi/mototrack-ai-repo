import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface SymptomSelectorProps {
  symptoms: string[];
  selected: string[];
  onToggle: (symptom: string) => void;
}

export function SymptomSelector({ symptoms, selected, onToggle }: SymptomSelectorProps) {
  return (
    <View className="flex-wrap flex-row gap-2">
      {symptoms.map((s) => {
        const isSelected = selected.includes(s);
        return (
          <TouchableOpacity
            key={s}
            onPress={() => onToggle(s)}
            activeOpacity={0.7}
            className={`rounded-xl px-3 py-2 border ${
              isSelected ? 'bg-[#8b7cf6]/15 border-[#8b7cf6]/40' : 'bg-[#0d0d18] border-white/[0.06]'
            }`}
          >
            <Text className={`text-[11px] font-medium ${isSelected ? 'text-white' : 'text-[#c4b5fd]'}`}>{s}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
