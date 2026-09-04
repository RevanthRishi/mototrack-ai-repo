import React from 'react';
import { View, ViewProps } from 'react-native';
import { clsx } from 'clsx';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Card({
  variant = 'default',
  padding = 'md',
  className,
  children,
  ...props
}: CardProps) {
  const variantClasses = {
    default: 'bg-brand-card',
    elevated: 'bg-brand-card shadow-lg',
    outlined: 'bg-transparent border border-gray-700',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <View
      className={clsx(
        'rounded-2xl',
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}
