import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { ArrowLeft, Mail, KeyRound } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/lib/stores/themeStore';
import { THEME_GRADIENTS, useThemedGradient } from '@/lib/hooks/useThemedGradient';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const bgGradient = useThemedGradient(THEME_GRADIENTS.loginBg.light, THEME_GRADIENTS.loginBg.dark);
  const [sent, setSent] = useState(false);

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient colors={bgGradient} className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} className="px-7 pt-6 pb-8" contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="flex-row items-center gap-2 mb-8" data-cy="forgot-back">
          <ArrowLeft size={16} color={isDark ? '#8b8fa3' : '#6b6b80'} strokeWidth={1.5} />
          <Text className={`text-sm font-light ${isDark ? 'text-text-muted-dark' : 'text-text-secondary-light'}`}>Back to login</Text>
        </TouchableOpacity>

        <Animated.View entering={FadeInUp.duration(700)}>
          <LinearGradient colors={['#8b7cf6', '#6d5ae6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0.7 }} className="w-16 h-16 rounded-[20px] items-center justify-center shadow-[0_0_24px_rgba(139,124,246,0.3)] mb-6">
            <KeyRound size={28} color="#fff" strokeWidth={1.5} />
          </LinearGradient>
          <Text className="text-text-primary dark:text-text-primary-dark text-[28px] font-light tracking-tight">Reset Password</Text>
          <Text className="text-text-secondary dark:text-text-secondary-dark text-sm font-light mt-2">Enter your email and we will send a reset link.</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(700).delay(120)} className="mt-10 flex-1">
          {sent ? (
            <View className="bg-accent-emerald/10 border border-accent-emerald/20 rounded-2xl p-5 mb-6">
              <Text className="text-accent-emerald text-sm font-medium">Reset link sent.</Text>
              <Text className={`text-[12px] font-light mt-1 ${isDark ? 'text-text-muted-dark' : 'text-text-secondary-light'}`}>Check your inbox and follow the link to reset your password.</Text>
            </View>
          ) : (
            <Input
              label="Email"
              placeholder="you@email.com"
              keyboardType="email-address"
              leftIcon={<Mail size={15} color={isDark ? '#6b6b80' : '#6b6b80'} strokeWidth={1.5} />}
            />
          )}

          {!sent && (
            <Button variant="primary" size="lg" onPress={() => setSent(true)} className="mt-4" data-cy="forgot-send-link">
              Send Reset Link
            </Button>
          )}

          {sent && (
            <Button variant="secondary" size="lg" onPress={() => router.replace('/(auth)/login')} data-cy="forgot-return-login">
              Return to Login
            </Button>
          )}
        </Animated.View>
      </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
