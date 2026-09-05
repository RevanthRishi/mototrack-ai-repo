import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, Eye, EyeOff, Fingerprint, ShieldCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';

import { LoginFormData, loginSchema } from '@/lib/utils/validation';

import { authenticateWithBiometrics, checkBiometricCapabilities, getBiometricTypeName } from '@/lib/security/biometric';
import { signInWithEmail } from '@/lib/utils/auth';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { useGoogleSignIn } from '@/lib/hooks/useGoogleSignIn';
import { useTheme } from '@/lib/stores/themeStore';
import { THEME_GRADIENTS, useThemedGradient } from '@/lib/hooks/useThemedGradient';

export default function LoginScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const bgGradient = useThemedGradient(THEME_GRADIENTS.loginBg.light, THEME_GRADIENTS.loginBg.dark);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');
  const { loading: googleLoading, trigger: triggerGoogle } = useGoogleSignIn();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  React.useEffect(() => {
    checkBiometricCapabilities().then((c) => {
      setBiometricAvailable(c.isAvailable);
      setBiometricType(getBiometricTypeName(c.biometricType));
    });
  }, []);

  const onLoginPress = async (data: LoginFormData) => {
    setIsLoading(true);
    const { error } = await signInWithEmail(data.email, data.password);
    setIsLoading(false);
    if (error) {
      Alert.alert('Sign in failed', error.message);
      return;
    }
    router.replace('/(tabs)');
  };

  const handleBiometricLogin = async () => {
    const result = await authenticateWithBiometrics('Log in to MotoTrack AI');
    if (result.success) router.replace('/(tabs)');
    else if (result.error) Alert.alert('Failed', result.error);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <LinearGradient colors={bgGradient} className="flex-1">
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-8 py-14"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo Mark */}
          <Animated.View entering={FadeIn.duration(500)} className="items-center mb-10">
            <LinearGradient
              colors={['#8b7cf6', '#6d5ae6', '#4f3eb3']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              className="w-24 h-24 rounded-[28px] items-center justify-center mb-5 shadow-[0_20px_50px_rgba(139,124,246,0.35)]"
            >
              <ShieldCheck size={42} color="#fff" strokeWidth={2.2} />
            </LinearGradient>
            <Text className="text-text-primary dark:text-text-primary-dark text-[2.2rem] font-extrabold tracking-tight leading-tight">MotoTrack AI</Text>
            <Text className="text-text-secondary dark:text-text-secondary-dark text-[15px] mt-2 tracking-wide">Your Smart Bike Companion</Text>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeIn.duration(500).delay(80)} className="space-y-5">
            {/* Email */}
            <View className="relative">
              <View className="absolute left-4 top-3.5 z-10"><Mail size={18} color={isDark ? '#8b8fa3' : '#6b6b80'} /></View>
              <Controller
                control={control} name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Email address" placeholderTextColor={isDark ? '#6b6e80' : '#9ca3af'}
                    className="bg-card-light dark:bg-card-dark rounded-[20px] pl-11 pr-4 py-[14px] text-text-primary dark:text-text-primary-dark text-[15px] border border-card-elevated focus:border-accent-violet/50"
                    keyboardType="email-address" autoCapitalize="none"
                    value={value} onChangeText={onChange} onBlur={onBlur} editable={!isLoading}
                    data-cy="login-email-input"
                  />
                )}
              />
              {errors.email && <Text className="text-danger text-xs mt-1.5 ml-1 font-medium">{errors.email.message}</Text>}
            </View>

            {/* Password */}
            <View className="relative">
              <View className="absolute left-4 top-3.5 z-10"><Lock size={18} color={isDark ? '#8b8fa3' : '#6b6b80'} /></View>
              <Controller
                control={control} name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Password" placeholderTextColor={isDark ? '#6b6e80' : '#9ca3af'}
                    className="bg-card-light dark:bg-card-dark rounded-[20px] pl-11 pr-11 py-[14px] text-text-primary dark:text-text-primary-dark text-[15px] border border-card-elevated focus:border-accent-violet/50"
                    secureTextEntry={!showPassword} autoCapitalize="none"
                    value={value} onChangeText={onChange} onBlur={onBlur} editable={!isLoading}
                    data-cy="login-password-input"
                  />
                )}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5" disabled={isLoading} data-cy="login-toggle-password">
                {showPassword ? <EyeOff size={18} color={isDark ? '#8b8fa3' : '#6b6b80'} /> : <Eye size={18} color={isDark ? '#8b8fa3' : '#6b6b80'} />}
              </TouchableOpacity>
              {errors.password && <Text className="text-danger text-xs mt-1.5 ml-1 font-medium">{errors.password.message}</Text>}
            </View>

            <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} disabled={isLoading} className="self-end" data-cy="login-forgot-password">
              <Text className="text-accent-violet/80 text-sm font-semibold">Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login */}
            <TouchableOpacity
              onPress={handleSubmit(onLoginPress)} disabled={isLoading}
              className="mt-3 active:opacity-90"
              data-cy="login-submit"
            >
              <LinearGradient colors={['#8b7cf6', '#6d5ae6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="rounded-[20px] py-[14px] shadow-[0_8px_30px_rgba(139,124,246,0.35)]">
                {isLoading ? <ActivityIndicator color="white" /> : <Text className="text-white text-center text-base font-bold tracking-wide">Log In</Text>}
              </LinearGradient>
            </TouchableOpacity>

            {/* Biometric */}
            {biometricAvailable && (
              <TouchableOpacity onPress={handleBiometricLogin} disabled={isLoading} className="mt-2 active:opacity-80" data-cy="login-biometric">
                <View className="flex-row items-center justify-center bg-card-light dark:bg-card-dark rounded-[20px] py-[14px] border border-card-elevated gap-2.5">
                  <Fingerprint size={20} color="#8b7cf6" />
                  <Text className="text-text-primary dark:text-text-primary-dark text-sm font-semibold">Log in with {biometricType}</Text>
                </View>
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* Google Sign In */}
          <GoogleSignInButton loading={googleLoading} onPress={triggerGoogle} />

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-card-elevated dark:bg-card-elevated" />
            <Text className="text-text-secondary dark:text-text-secondary-dark px-4 text-xs font-bold uppercase tracking-[0.15em]">or</Text>
            <View className="flex-1 h-px bg-card-elevated dark:bg-card-elevated" />
          </View>

          {/* Sign up */}
          <Animated.View entering={FadeIn.duration(500).delay(200)} className="items-center">
            <Text className="text-text-secondary dark:text-text-secondary-dark text-[15px]">New to MotoTrack?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')} disabled={isLoading} className="mt-1" data-cy="login-create-account">
              <Text className="text-accent-violet text-base font-extrabold">Create an account</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
