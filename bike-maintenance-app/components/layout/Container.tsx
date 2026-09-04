import React from 'react';
import { View, ViewProps, ScrollView } from 'react-native';

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  scroll?: boolean;
  className?: string;
}

export function Container({ children, scroll = false, className, ...props }: ContainerProps) {
  const baseClasses = `px-7 ${className ?? ''}`;
  if (scroll) {
    return (
      <ScrollView showsVerticalScrollIndicator={false} className={`flex-1 ${baseClasses}`} {...(props as any)}>
        {children}
      </ScrollView>
    );
  }
  return (
    <View className={`flex-1 ${baseClasses}`} {...props}>
      {children}
    </View>
  );
}
