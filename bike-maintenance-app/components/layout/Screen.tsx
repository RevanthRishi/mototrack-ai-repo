import React from 'react';
import { ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function Screen({ children, className, ...props }: ScreenProps) {
  return (
    <SafeAreaView className={`flex-1 bg-canvas-light dark:bg-canvas-dark ${className ?? ''}`} {...props}>
      {children}
    </SafeAreaView>
  );
}
