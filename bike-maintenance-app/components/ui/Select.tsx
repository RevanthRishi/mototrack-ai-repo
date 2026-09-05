import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  Keyboard,
  ScrollView,
} from 'react-native';
import { ChevronDown, Check, Search } from 'lucide-react-native';

export interface SelectOption {
  label: string;
  value: string;
  meta?: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  value: string | null;
  options: SelectOption[];
  onChange: (value: string) => void;
  onSearchChange?: (query: string) => void;
  loading?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  dataCy?: string;
  searchable?: boolean;
  emptyText?: string;
}

export function Select({
  label,
  placeholder = 'Select…',
  value,
  options,
  onChange,
  onSearchChange,
  loading = false,
  disabled = false,
  error,
  hint,
  dataCy,
  searchable = false,
  emptyText = 'No results',
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (open && searchable) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
    }
  }, [open, searchable]);

  const selected = options.find((o) => o.value === value);
  const filtered = searchable
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-text-muted-light dark:text-text-muted-dark text-[10px] font-semibold uppercase tracking-[0.25em] mb-2.5 ml-1">
          {label}
        </Text>
      )}

      <Pressable
        onPress={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        data-cy={dataCy}
        className={`flex-row items-center rounded-2xl border px-4 py-4 ${
          error
            ? 'border-danger/50 bg-danger/5'
            : open
            ? 'border-accent-violet/60 bg-card-light dark:bg-card-dark'
            : 'border-borderSubtle-light dark:border-borderSubtle-dark bg-card-light dark:bg-card-dark'
        } ${disabled ? 'opacity-40' : ''}`}
      >
        <Text
          className={`flex-1 text-[15px] font-light ${
            selected
              ? 'text-text-primary-light dark:text-text-primary-dark'
              : 'text-text-muted-light dark:text-text-muted-dark'
          }`}
        >
          {selected?.label ?? placeholder}
        </Text>
        {loading ? (
          <ActivityIndicator size="small" color="#8b7cf6" />
        ) : (
          <ChevronDown
            size={15}
            color="#8b7cf6"
            strokeWidth={1.8}
            style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}
          />
        )}
      </Pressable>

      {error && (
        <Text className="text-danger text-[11px] font-medium mt-2 ml-1">{error}</Text>
      )}
      {hint && !error && (
        <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[11px] font-light mt-2 ml-1">
          {hint}
        </Text>
      )}

      {open && (
        <View className="mt-1 rounded-2xl border border-borderSubtle-light dark:border-borderSubtle-dark bg-card-light dark:bg-card-dark overflow-hidden z-50">
          {searchable && (
            <View className="flex-row items-center px-3 py-2.5 bg-white/[0.04] rounded-xl mx-3 my-2">
              <Search size={12} color="#6b6b80" strokeWidth={2} />
              <TextInput
                ref={inputRef}
                value={query}
                onChangeText={(t) => {
                  setQuery(t);
                  onSearchChange?.(t);
                }}
                placeholder="Search…"
                placeholderTextColor="#4a4a60"
                className="flex-1 ml-2 text-[13px] font-light text-text-primary-light dark:text-text-primary-dark"
              />
            </View>
          )}

          <ScrollView
            style={{ maxHeight: 200 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {loading ? (
              <View className="items-center py-8">
                <ActivityIndicator color="#8b7cf6" />
              </View>
            ) : filtered.length === 0 ? (
              <View className="items-center py-8">
                <Text className="text-text-muted-light dark:text-text-muted-dark text-[12px]">{emptyText}</Text>
              </View>
            ) : (
              filtered.map((o) => {
                const isSel = o.value === value;
                return (
                  <Pressable
                    key={o.value}
                    onPress={() => {
                      onChange(o.value);
                      Keyboard.dismiss();
                      setOpen(false);
                    }}
                    data-cy={dataCy ? `${dataCy}-option-${o.value}` : undefined}
                    className={`flex-row items-center px-4 py-3 active:opacity-60 ${
                      isSel ? 'bg-accent-violet/10' : ''
                    }`}
                  >
                    <View className="flex-1">
                      <Text
                        className={`text-[14px] font-light ${
                          isSel
                            ? 'text-accent-violet'
                            : 'text-text-primary-light dark:text-text-primary-dark'
                        }`}
                      >
                        {o.label}
                      </Text>
                      {o.meta && (
                        <Text className="text-text-muted-light dark:text-text-muted-dark text-[11px] mt-0.5">
                          {o.meta}
                        </Text>
                      )}
                    </View>
                    {isSel && (
                      <Check size={13} color="#8b7cf6" strokeWidth={2.5} />
                    )}
                  </Pressable>
                );
              })
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
