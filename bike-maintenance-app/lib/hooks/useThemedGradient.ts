import { useMemo } from 'react';
import { useThemeStore } from '@/lib/stores/themeStore';
import { COLORS } from '@/lib/theme/theme';

export type GradientStops = readonly [string, string, ...string[]];

export function useThemedGradient(
  light: GradientStops,
  dark: GradientStops
): GradientStops {
  const isDark = useThemeStore((s) => s.isDark);
  return useMemo(() => (isDark ? dark : light), [isDark, light, dark]);
}

export function useThemedSheen(variant: 'violet' | 'green' = 'violet'): GradientStops {
  const isDark = useThemeStore((s) => s.isDark);
  const g = COLORS.gradients;
  if (variant === 'green') return isDark ? g.sheenGreen.dark : g.sheenGreen.light;
  return isDark ? g.sheenViolet.dark : g.sheenViolet.light;
}

export function useChromeRibbon(): GradientStops {
  const isDark = useThemeStore((s) => s.isDark);
  const g = COLORS.gradients;
  return isDark ? g.chromeRibbon.dark : g.chromeRibbon.light;
}

export const THEME_GRADIENTS = {
  heroGarage: { light: COLORS.gradients.hero.light, dark: COLORS.gradients.hero.dark },
  heroFuel:  { light: COLORS.gradients.hero.light, dark: COLORS.gradients.hero.dark },
  heroService: { light: COLORS.gradients.hero.light, dark: COLORS.gradients.hero.dark },
  heroAI:    { light: COLORS.gradients.hero.light, dark: COLORS.gradients.hero.dark },
  heroProfile:{ light: COLORS.gradients.hero.light, dark: COLORS.gradients.hero.dark },
  heroFeatured:{ light: COLORS.gradients.heroFeatured.light, dark: COLORS.gradients.heroFeatured.dark },
  aiCard:    { light: COLORS.gradients.aiCard.light, dark: COLORS.gradients.aiCard.dark },
  profileCard:{ light: COLORS.gradients.profileCard.light, dark: COLORS.gradients.profileCard.dark },
  upgrade:   { light: COLORS.gradients.upgrade.light, dark: COLORS.gradients.upgrade.dark },
  loginBg:   { light: COLORS.gradients.loginBg.light, dark: COLORS.gradients.loginBg.dark },
  authBg:    { light: COLORS.gradients.loginBg.light, dark: COLORS.gradients.loginBg.dark },
  gold:      { light: COLORS.gradients.gold.light, dark: COLORS.gradients.gold.dark },
} as const;
