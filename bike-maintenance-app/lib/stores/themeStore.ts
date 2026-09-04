import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
  setDark: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: true,
      toggle: () => set((s) => ({ isDark: !s.isDark })),
      setDark: (dark: boolean) => set({ isDark: dark }),
    }),
    {
      name: 'mototrack-theme',
      storage: {
        getItem: async (name) => {
          const raw = await AsyncStorage.getItem(name);
          return raw ? JSON.parse(raw) : null;
        },
        setItem: async (name, value) => await AsyncStorage.setItem(name, JSON.stringify(value)),
        removeItem: async (name) => await AsyncStorage.removeItem(name),
      },
    }
  )
);

export function useTheme() {
  const { isDark, toggle, setDark } = useThemeStore();
  return { isDark, toggle, setDark };
}
