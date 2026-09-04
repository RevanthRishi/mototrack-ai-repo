import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = 'Loading...' }: LoadingStateProps) {
  return (
    <View className="px-7 py-16 items-center">
      <View className="w-12 h-12 rounded-full border-2 border-accent-violet border-t-transparent animate-spin mb-4" />
      <Text className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-light">{label}</Text>
    </View>
  );
}

interface EmptyStateProps {
  title: string;
  message: string;
  action?: { label: string; onPress: () => void };
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <Animated.View entering={FadeInDown.duration(500)} className="px-7 py-12 items-center">
      <View className="w-16 h-16 rounded-full bg-accent-violet/10 border border-accent-violet/15 items-center justify-center mb-4">
        <Text className="text-accent-violet text-2xl">+</Text>
      </View>
      <Text className="text-text-primary dark:text-text-primary-dark text-lg font-light tracking-tight mb-2">{title}</Text>
      <Text className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-light text-center max-w-[260px] mb-5">{message}</Text>
      {action && (
        <TouchableOpacity
          onPress={action.onPress}
          className="bg-accent-violet rounded-2xl px-6 py-3 active:opacity-80"
          data-cy={`empty-state-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <Text className="text-white text-[14px] font-medium">{action.label}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <Animated.View entering={FadeInDown.duration(500)} className="px-7 py-12 items-center">
      <View className="w-14 h-14 rounded-full bg-danger/10 border border-danger/15 items-center justify-center mb-4">
        <Text className="text-danger text-xl">!</Text>
      </View>
      <Text className="text-text-primary dark:text-text-primary-dark text-base font-light mb-2">{message}</Text>
      <TouchableOpacity
        onPress={onRetry}
        className="flex-row items-center gap-2 mt-2 px-5 py-2.5 rounded-full border border-accent-violet/20 bg-accent-violet/10"
        data-cy="error-retry"
      >
        <Text className="text-accent-violet text-sm font-medium">Try again</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
