import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, Eye, EyeOff, Fingerprint, Sparkles, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';

import { LoginFormData, loginSchema } from '@/lib/utils/validation';
import { authenticateWithBiometrics, checkBiometricCapabilities, getBiometricTypeName } from '@/lib/security/biometric';
import { signInWithEmail } from '@/lib/utils/auth';
import { useGoogleSignIn } from '@/lib/hooks/useGoogleSignIn';
import { useTheme } from '@/lib/stores/themeStore';
import { useNotification } from '@/lib/notifications/NotificationContext';
import { AuthShell } from '@/components/auth/AuthShell';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';


export default function LoginScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { notify } = useNotification();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState('');
  const { loading: googleLoading, trigger: triggerGoogle } = useGoogleSignIn();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    checkBiometricCapabilities().then((c) => {
      setBiometricAvailable(c.isAvailable);
      setBiometricType(getBiometricTypeName(c.biometricType));
    });
  }, []);

  const onLoginPress = async (data: LoginFormData) => {
    setIsLoading(true);
    const res = await signInWithEmail(data.email, data.password);
    setIsLoading(false);
    if (!res.success) {
      notify(res.error ?? 'Something went wrong', 'error');
      return;
    }
    router.replace('/(tabs)');
  };

  const handleBiometricLogin = async () => {
    const result = await authenticateWithBiometrics('Log in to MotoTrack AI');
    if (result.success) router.replace('/(tabs)');
    else if (result.error) {
      notify(result.error, 'error');
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AuthShell isDark={isDark}>
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-16"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top bar: logo only */}
          <Animated.View entering={FadeIn.duration(400)} className="items-center mb-10">
            <View className="w-11 h-11 rounded-xl items-center justify-center bg-gradient-to-br from-[#8b7cf6] to-[#4f3eb3] shadow-[0_6px_20px_rgba(139,124,246,.4)]">
              <Sparkles size={20} color="#fff" strokeWidth={2} />
            </View>
          </Animated.View>

          {/* Eyebrow + heading */}
          <Animated.View entering={FadeInUp.duration(500)}>
            <Text className="text-[#8b7cf6] text-xs font-semibold tracking-widest uppercase mb-2">Sign in</Text>
            <Text className={`text-[2.2rem] font-extrabold tracking-tight leading-none mb-1 ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>
              Welcome{'\n'}
              <Text className="text-[#8b7cf6]">back</Text>
              <Text className={`font-light ${isDark ? 'text-white/30' : 'text-[#0f172a]/30'}`}>.</Text>
            </Text>
            <Text className={`text-sm mt-2 mb-8 ${isDark ? 'text-white/50' : 'text-[#0f172a]/60'}`}>Enter your credentials to access your garage.</Text>
          </Animated.View>

          {/* Glass card */}
          <Animated.View entering={FadeInUp.duration(500).delay(80)} className="rounded-3xl p-6 mb-4" style={{
            backgroundColor: isDark ? 'rgba(18,18,30,0.65)' : 'rgba(255,255,255,0.72)',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.70)',
            shadowColor: '#8b7cf6',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: isDark ? 0.25 : 0.12,
            shadowRadius: 30,
            backdropFilter: 'blur(18px)',
          }}>
            <View className="space-y-4">
              {/* Email */}
              <View>
                <View className="absolute left-4 top-3.5 z-10">
                  <Mail size={18} color={isDark ? '#8b8fa3' : '#6b6b80'} />
                </View>
                <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Email address"
                    placeholderTextColor={isDark ? '#8b8fa3' : '#6b6b80'}
                    className={`rounded-2xl pl-11 pr-4 py-3.5 text-[16px] border ${isDark ? 'bg-white/[0.04] text-[#f6f3ee] border-white/[0.08]' : 'bg-[#f8f6f2] text-[#0f172a] border-[#0f172a]/8'}`}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!isLoading}
                    data-cy="login-email-input"
                  />
                )} />
                {errors.email && <Text className="text-red-400 text-xs mt-1.5 font-medium">{errors.email.message}</Text>}
              </View>

              {/* Password */}
              <View>
                <View className="absolute left-4 top-3.5 z-10">
                  <Lock size={18} color={isDark ? '#8b8fa3' : '#6b6b80'} />
                </View>
                <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor={isDark ? '#8b8fa3' : '#6b6b80'}
                    className={`rounded-2xl pl-11 pr-11 py-3.5 text-[16px] border ${isDark ? 'bg-white/[0.04] text-[#f6f3ee] border-white/[0.08]' : 'bg-[#f8f6f2] text-[#0f172a] border-[#0f172a]/8'}`}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!isLoading}
                    data-cy="login-password-input"
                  />
                )} />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5"
                  disabled={isLoading}
                  data-cy="login-toggle-password"
                >
                  {showPassword
                    ? <EyeOff size={18} color={isDark ? '#8b8fa3' : '#6b6b80'} />
                    : <Eye size={18} color={isDark ? '#8b8fa3' : '#6b6b80'} />}
                </TouchableOpacity>
                {errors.password && <Text className="text-red-400 text-xs mt-1.5 font-medium">{errors.password.message}</Text>}
              </View>

              {/* Forgot password */}
              <TouchableOpacity
                onPress={() => router.push('/(auth)/forgot-password')}
                disabled={isLoading}
                className="self-end"
                data-cy="login-forgot-password"
              >
                <Text className="text-[#8b7cf6] text-sm font-semibold">Forgot Password?</Text>
              </TouchableOpacity>

              {/* CTA */}
              <TouchableOpacity
                onPress={handleSubmit(onLoginPress)}
                disabled={isLoading}
                className="mt-1"
                data-cy="login-submit"
              >
                <LinearGradient
                  colors={['#8b7cf6', '#6d5ae6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-2xl py-3.5 flex-row items-center justify-center gap-2 shadow-[0_8px_32px_rgba(139,124,246,.4)]"
                >
                  {isLoading
                    ? <ActivityIndicator color="white" />
                    : <>
                        <Text className="text-white text-base font-semibold tracking-wide">Continue</Text>
                        <ArrowRight size={16} color="#fff" />
                      </>}
                </LinearGradient>
              </TouchableOpacity>

              {/* Biometric */}
              {biometricAvailable && (
                <TouchableOpacity
                  onPress={handleBiometricLogin}
                  disabled={isLoading}
                  className="flex-row items-center justify-center gap-2 py-2"
                  data-cy="login-biometric"
                >
                  <Fingerprint size={18} color={isDark ? '#8b8fa3' : '#6b6b80'} />
                  <Text className={`text-sm font-medium ${isDark ? 'text-white/50' : 'text-[#0f172a]/50'}`}>Use {biometricType}</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>

          {/* Divider */}
          <View className="flex-row items-center my-3">
            <View className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8b7cf6]/30 to-transparent" />
            <Text className={`px-3 text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-[#0f172a]/30'}`}>or</Text>
            <View className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8b7cf6]/30 to-transparent" />
          </View>

          {/* Google + Create */}
          <View className="space-y-3">
            <GoogleSignInButton label="Continue with Google" loading={googleLoading} onPress={triggerGoogle} />
            <TouchableOpacity
              onPress={() => router.push('/(auth)/register')}
              disabled={isLoading}
              className={`flex-row items-center justify-center rounded-2xl py-3.5 border ${isDark ? 'border-white/10 bg-white/[0.06]' : 'border-[#0f172a]/10 bg-white/60'}`}
              data-cy="login-create-account"
            >
              <Text className={`text-base font-bold tracking-wide ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>Create account</Text>
            </TouchableOpacity>
          </View>

                  </ScrollView>
      </AuthShell>
    </KeyboardAvoidingView>
  );
}
