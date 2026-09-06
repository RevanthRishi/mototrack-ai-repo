/**
 * AuthShell — shared animated background for login + register.
 * Replaces the old blueprint-grid + floating-icons approach.
 * Light mode: warm cream base with indigo/violet blobs.
 * Dark mode: deep navy base with violet/cyan blobs.
 * No heavy blur, no clutter — just animated depth.
 */
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming,
  withSequence, Easing, interpolate, FadeIn,
} from 'react-native-reanimated';

const { width: W, height: H } = Dimensions.get('window');

/** Single blob: a radial gradient patch that drifts and breathes */
function Blob({
  fromColor, toColor, size, startX, startY, duration, delay,
}: {
  fromColor: string; toColor: string; size: number;
  startX: number; startY: number; duration: number; delay: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration, easing: Easing.inOut(Easing.sin) }),
      ),
      -1, false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const tx = interpolate(progress.value, [0, 1], [-size * 0.25, size * 0.25]);
    const ty = interpolate(progress.value, [0, 1], [-size * 0.2, size * 0.2]);
    return {
      transform: [{ translateX: tx }, { translateY: ty }],
    };
  });

  return (
    <Animated.View
      entering={FadeIn.duration(1000).delay(delay)}
      style={[
        {
          position: 'absolute',
          left: startX - size / 2,
          top: startY - size / 2,
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: 'hidden',
        },
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={[fromColor, toColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      />
    </Animated.View>
  );
}

interface AuthShellProps {
  children: React.ReactNode;
  isDark: boolean;
}

export function AuthShell({ children, isDark }: AuthShellProps) {
  // Light palette — warm cream + indigo/violet blobs
  const lightBlobs = [
    { fromColor: 'rgba(139,124,246,0.28)', toColor: 'rgba(109,90,230,0.10)', size: 380, startX: W * 0.1, startY: H * 0.08, duration: 9000, delay: 0 },
    { fromColor: 'rgba(99,102,241,0.22)', toColor: 'rgba(139,92,246,0.08)', size: 300, startX: W * 0.75, startY: H * 0.62, duration: 11000, delay: 200 },
    { fromColor: 'rgba(168,85,247,0.18)', toColor: 'rgba(79,70,229,0.06)', size: 260, startX: W * 0.5, startY: H * 0.35, duration: 13000, delay: 400 },
  ];

  // Dark palette — deep navy + violet/cyan blobs
  const darkBlobs = [
    { fromColor: 'rgba(139,92,246,0.35)', toColor: 'rgba(79,70,229,0.08)', size: 420, startX: W * -0.1, startY: H * 0.05, duration: 10000, delay: 0 },
    { fromColor: 'rgba(59,130,246,0.25)', toColor: 'rgba(139,92,246,0.06)', size: 320, startX: W * 0.8, startY: H * 0.55, duration: 12000, delay: 300 },
    { fromColor: 'rgba(168,85,247,0.20)', toColor: 'rgba(59,130,246,0.05)', size: 280, startX: W * 0.45, startY: H * 0.7, duration: 14000, delay: 150 },
  ];

  const blobs = isDark ? darkBlobs : lightBlobs;
  const baseBg = isDark ? '#06060f' : '#faf7f0';

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: baseBg }]}>
      {blobs.map((b, i) => (
        <Blob key={i} {...b} />
      ))}

      {/* Vignette overlay for depth */}
      <View
        pointerEvents="none"
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: isDark
            ? 'rgba(6,6,15,0.45)'
            : 'rgba(250,247,240,0.30)',
        }}
      />

      {children}
    </View>
  );
}
