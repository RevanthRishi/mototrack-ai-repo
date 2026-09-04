import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { Database } from './database.types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Lazy initialization to avoid SSR issues
let supabaseInstance: SupabaseClient<Database> | null = null;

const getSecureStorageAdapter = () => ({
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        return await AsyncStorage.getItem(key);
      }
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch {
      // Storage error handling
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch {
      // Deletion error handling
    }
  },
});

export const getSupabase = (): SupabaseClient<Database> => {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: getSecureStorageAdapter(),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: Platform.OS === 'web',
      },
    });
  }
  return supabaseInstance;
};

// For backwards compatibility - returns the lazy singleton
export const supabase = {
  get auth() {
    return getSupabase().auth;
  },

  get realtime() {
    return getSupabase().realtime;
  },
  get storage() {
    return getSupabase().storage;
  },
  get from() {
    return getSupabase().from.bind(getSupabase());
  },
  get rpc() {
    return getSupabase().rpc.bind(getSupabase());
  },
};
