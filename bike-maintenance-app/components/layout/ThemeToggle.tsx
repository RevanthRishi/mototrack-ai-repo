import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useTheme } from '@/lib/stores/themeStore';
import { COLORS } from '@/lib/theme/theme';
import { getSupabase } from '@/lib/supabase/client';
import { updateTheme } from '@/lib/supabase/queries';

export function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  const handlePress = () => {
    toggle();
    getSupabase().auth.getUser().then(({ data }) => {
      if (data.user?.id) {
        updateTheme(data.user.id, !isDark);
      }
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      className="absolute top-24 right-5 w-11 h-11 rounded-full items-center justify-center bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark z-50"
      style={{ elevation: 8 }}
      data-cy="theme-toggle-fab"
      testID="theme-toggle-fab"
    >
      {isDark ? (
        <Sun size={17} color={COLORS.accent.amber} strokeWidth={1.8} />
      ) : (
        <Moon size={17} color={COLORS.accent.violet} strokeWidth={1.8} />
      )}
    </TouchableOpacity>
  );
}
