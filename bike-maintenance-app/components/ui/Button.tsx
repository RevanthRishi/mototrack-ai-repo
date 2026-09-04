import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  children,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const sizeConfig = {
    sm: { py: 'py-2.5', px: 'px-5', text: 'text-[13px]', icon: 14 },
    md: { py: 'py-3.5', px: 'px-6', text: 'text-[15px]', icon: 17 },
    lg: { py: 'py-4.5', px: 'px-8', text: 'text-[16px]', icon: 20 },
  };
  const s = sizeConfig[size];

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={isDisabled}
        className={`overflow-hidden rounded-2xl ${s.py} ${s.px} ${isDisabled ? 'opacity-50' : ''} ${className ?? ''}`}
        {...props}
      >
        <LinearGradient
          colors={isDisabled ? ['#3a3a50', '#2a2a40'] : ['#8b7cf6', '#6d5ae6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute inset-0"
          style={isDisabled ? {} : { shadowColor: '#8b7cf6', shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8 }}
        />
        <View className="flex-row items-center justify-center">
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              {leftIcon && <View className="mr-2.5">{leftIcon}</View>}
              <Text className={`text-white font-semibold ${s.text} tracking-tight`}>{children}</Text>
              {rightIcon && <View className="ml-2.5">{rightIcon}</View>}
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={isDisabled}
        className={`rounded-2xl border border-borderSubtle-light dark:border-borderSubtle-dark bg-card-light dark:bg-card-dark ${s.py} ${s.px} ${isDisabled ? 'opacity-50' : ''} ${className ?? ''}`}
        {...props}
      >
        <View className="flex-row items-center justify-center">
          {leftIcon && <View className="mr-2.5">{leftIcon}</View>}
          <Text className={`text-text-primary-light dark:text-text-primary-dark font-light ${s.text} tracking-tight`}>{children}</Text>
          {rightIcon && <View className="ml-2.5">{rightIcon}</View>}
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={isDisabled}
        className={`rounded-2xl border border-accent-violet/30 bg-accent-violet/5 ${s.py} ${s.px} ${isDisabled ? 'opacity-50' : ''} ${className ?? ''}`}
        {...props}
      >
        <View className="flex-row items-center justify-center">
          {leftIcon && <View className="mr-2.5">{leftIcon}</View>}
          <Text className={`text-accent-violet font-light ${s.text} tracking-tight`}>{children}</Text>
          {rightIcon && <View className="ml-2.5">{rightIcon}</View>}
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'ghost') {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={isDisabled}
        className={`rounded-2xl ${s.py} ${s.px} ${isDisabled ? 'opacity-50' : ''} ${className ?? ''}`}
        {...props}
      >
        <View className="flex-row items-center justify-center">
          {leftIcon && <View className="mr-2.5">{leftIcon}</View>}
          <Text className={`text-text-muted-light dark:text-text-muted-dark font-light ${s.text} tracking-tight`}>{children}</Text>
          {rightIcon && <View className="ml-2.5">{rightIcon}</View>}
        </View>
      </TouchableOpacity>
    );
  }

  // danger
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={isDisabled}
      className={`rounded-2xl bg-danger/10 border border-danger/20 ${s.py} ${s.px} ${isDisabled ? 'opacity-50' : ''} ${className ?? ''}`}
      {...props}
    >
      <View className="flex-row items-center justify-center">
        {leftIcon && <View className="mr-2.5">{leftIcon}</View>}
        <Text className={`text-danger font-light ${s.text} tracking-tight`}>{children}</Text>
        {rightIcon && <View className="ml-2.5">{rightIcon}</View>}
      </View>
    </TouchableOpacity>
  );
}
