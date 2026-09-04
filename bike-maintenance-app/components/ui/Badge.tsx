import React from 'react';
import { View, Text } from 'react-native';
import { clsx } from 'clsx';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = 'default',
  size = 'md',
  children,
  className,
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-gray-700 text-gray-200',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/20 text-red-400',
    info: 'bg-blue-500/20 text-blue-400',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <View
      className={clsx(
        'rounded-full self-start',
        variantClasses[variant],
        className
      )}
    >
      <Text className={clsx('font-medium', sizeClasses[size], variantClasses[variant])}>
        {children}
      </Text>
    </View>
  );
}
