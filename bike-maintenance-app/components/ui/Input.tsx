import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,


} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightElement,
  className,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-[#8b8fa3] text-[10px] font-semibold uppercase tracking-[0.25em] mb-2.5 ml-1">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center rounded-[18px] border px-4 py-3.5 ${
          error
            ? 'border-[#ef4444]/50 bg-[#1a0c0c]'
            : focused
            ? 'border-[#8b7cf6]/60 bg-[#0d0d18]'
            : 'border-white/[0.08] bg-[#0d0d18]'
        }`}
        style={{ shadowColor: focused && !error ? '#8b7cf6' : 'transparent', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } }}
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}
        <TextInput
          placeholderTextColor="#4a4a60"
          className="flex-1 text-white text-[15px] font-light tracking-tight"
          style={{ paddingVertical: 0 }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {rightElement && <View className="ml-3">{rightElement}</View>}
      </View>
      {error && (
        <Text className="text-[#ef4444] text-[11px] font-medium mt-2 ml-1">{error}</Text>
      )}
      {hint && !error && (
        <Text className="text-[#6b6b80] text-[11px] font-light mt-2 ml-1">{hint}</Text>
      )}
    </View>
  );
}
