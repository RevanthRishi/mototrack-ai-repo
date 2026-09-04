import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
}

export function LoadingState({ message = 'Loading...', size = 'large' }: LoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center bg-brand-dark p-6">
      <ActivityIndicator size={size} color="#22c55e" />
      {message && (
        <Text className="text-gray-400 text-base mt-4 text-center">{message}</Text>
      )}
    </View>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center bg-brand-dark p-6">
      {icon && <View className="mb-4">{icon}</View>}
      <Text className="text-white text-xl font-bold text-center mb-2">{title}</Text>
      {description && (
        <Text className="text-gray-400 text-base text-center mb-6">{description}</Text>
      )}
      {action}
    </View>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center bg-brand-dark p-6">
      <View className="w-16 h-16 bg-red-500/20 rounded-full items-center justify-center mb-4">
        <Text className="text-red-400 text-2xl">⚠️</Text>
      </View>
      <Text className="text-white text-xl font-bold text-center mb-2">{title}</Text>
      <Text className="text-gray-400 text-base text-center mb-6">{message}</Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="bg-primary-500 px-6 py-3 rounded-2xl"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
