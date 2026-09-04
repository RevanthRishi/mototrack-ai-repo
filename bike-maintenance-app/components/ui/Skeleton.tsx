import React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { clsx } from 'clsx';

interface SkeletonProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export function Skeleton({
  width = 100 as number,
  height = 20,
  borderRadius = 8,
  className,
}: SkeletonProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withRepeat(
        withSequence(
          withTiming(0.5, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        false
      ),
    };
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
        },
        animatedStyle,
      ]}
      className={clsx('bg-gray-700', className)}
    />
  );
}

// Preset skeleton components for common use cases
export function SkeletonCard() {
  return (
    <View className="bg-brand-card rounded-2xl p-4 space-y-3">
      <Skeleton width={60 as unknown as number} height={24} />
      <Skeleton width={100 as unknown as number} height={16} />
      <Skeleton width={40 as unknown as number} height={16} />
    </View>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}
