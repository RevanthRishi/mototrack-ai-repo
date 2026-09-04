import React from 'react';
import { ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function Screen({ children, className, ...props }: ScreenProps) {
  return (
    <SafeAreaView className={`flex-1 bg-[#06060f] ${className ?? ''}`} {...props}>
      {children}
    </SafeAreaView>
  );
}
