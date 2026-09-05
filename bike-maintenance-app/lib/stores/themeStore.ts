import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

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
      storage: createJSONStorage(() => ({
        getItem: async (name: string) => {
          const raw = await AsyncStorage.getItem(name);
          return raw ?? null;
        },
        setItem: async (name: string, value: string) => {
          await AsyncStorage.setItem(name, value);
        },
        removeItem: async (name: string) => {
          await AsyncStorage.removeItem(name);
        },
      })),
    }
  )
);

export function useTheme() {
  const { isDark, toggle, setDark } = useThemeStore();
  return { isDark, toggle, setDark };
}
