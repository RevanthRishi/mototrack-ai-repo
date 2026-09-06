import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, Eye, EyeOff, User, Sparkles, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { RegisterFormData, registerSchema } from '@/lib/utils/validation';
import { signUpWithEmail } from '@/lib/utils/auth';
import { useNotification } from '@/lib/notifications/NotificationContext';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { useGoogleSignIn } from '@/lib/hooks/useGoogleSignIn';
import { useTheme } from '@/lib/stores/themeStore';
import { AuthShell } from '@/components/auth/AuthShell';

function PasswordRule({ met, label }: { met: boolean; label: string }) {
  return (
    <View className="flex-row items-center gap-2 mb-0.5">
      <View className={`w-4 h-4 rounded-full items-center justify-center ${met ? 'bg-emerald-500/20' : 'bg-white/10'}`}>
        {met && <Check size={10} color="#10b981" />}
      </View>
      <Text className={`text-xs ${met ? 'text-emerald-400' : 'text-white/40'}`}>{label}</Text>
    </View>
  );
}

export default function RegisterScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { notify } = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loading: googleLoading, trigger: triggerGoogle } = useGoogleSignIn();

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', fullName: '' },
  });

  const watchedPassword = useWatch({ control, name: 'password' });

  const rules = [
    { met: (watchedPassword?.length ?? 0) >= 8, label: 'At least 8 characters' },
    { met: /[A-Z]/.test(watchedPassword ?? ''), label: 'One uppercase letter' },
    { met: /[a-z]/.test(watchedPassword ?? ''), label: 'One lowercase letter' },
    { met: /\d/.test(watchedPassword ?? ''), label: 'One number' },
  ];

  const onRegisterPress = async (data: RegisterFormData) => {
    setIsLoading(true);
    const res = await signUpWithEmail(data.email, data.password, data.fullName);
    setIsLoading(false);
    if (!res.success) {
      notify(res.error ?? 'Something went wrong', 'error');
      return;
    }
    notify('Account created!', 'success');
    router.replace('/(tabs)');
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
          {/* Logo */}
          <Animated.View entering={FadeInUp.duration(600)} className="items-center mb-8">
            <View className="w-20 h-20 rounded-3xl items-center justify-center mb-5 shadow-[0_12px_40px_rgba(139,124,246,0.45)] bg-gradient-to-br from-[#8b7cf6] to-[#4f3eb3]">
              <Sparkles size={36} color="#fff" strokeWidth={2.2} />
            </View>
            <Text className="text-text-primary dark:text-white text-[2rem] font-extrabold tracking-tight leading-tight">Create Account</Text>
            <Text className="text-text-secondary dark:text-white/60 text-[15px] mt-1.5 tracking-wide">Join MotoTrack AI today</Text>
          </Animated.View>

          {/* Glass card */}
          <Animated.View entering={FadeInUp.duration(600).delay(120)} className="rounded-3xl p-7 mb-5" style={{
            backgroundColor: isDark ? 'rgba(18,18,30,0.65)' : 'rgba(255,255,255,0.72)',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.70)',
            shadowColor: '#8b7cf6',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: isDark ? 0.25 : 0.12,
            shadowRadius: 30,
          }}>
            <Text className="text-text-primary dark:text-white text-xl font-extrabold mb-0.5">Get started</Text>
            <Text className="text-text-secondary dark:text-white/50 text-sm mb-5">Create your garage profile</Text>

            <View className="space-y-4">
              {/* Full Name */}
              <View>
                <View className="absolute left-4 top-3 z-10"><User size={18} color={isDark ? '#8b8fa3' : '#6b6b80'} /></View>
                <Controller control={control} name="fullName" render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Full name" placeholderTextColor={isDark ? '#8b8fa3' : '#6b6b80'}
                    className={`rounded-xl pl-11 pr-4 py-3.5 text-[15px] border ${isDark ? 'bg-[#0c0a18] text-[#e2e0ed] border-white/10 focus:border-[#8b7cf6]/70' : 'bg-[#f8f6f2] text-[#0f172a] border-[#0f172a]/8 focus:border-[#8b7cf6]/60'}`}
                    autoCapitalize="words" value={value} onChangeText={onChange} onBlur={onBlur} editable={!isLoading}
                    data-cy="register-name-input"
                  />
                )} />
                {errors.fullName && <Text className="text-red-500 text-xs mt-1.5 font-medium">{errors.fullName.message}</Text>}
              </View>

              {/* Email */}
              <View>
                <View className="absolute left-4 top-3 z-10"><Mail size={18} color={isDark ? '#8b8fa3' : '#6b6b80'} /></View>
                <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Email address" placeholderTextColor={isDark ? '#8b8fa3' : '#6b6b80'}
                    className={`rounded-xl pl-11 pr-4 py-3.5 text-[15px] border ${isDark ? 'bg-[#0c0a18] text-[#e2e0ed] border-white/10 focus:border-[#8b7cf6]/70' : 'bg-[#f8f6f2] text-[#0f172a] border-[#0f172a]/8 focus:border-[#8b7cf6]/60'}`}
                    keyboardType="email-address" autoCapitalize="none" value={value} onChangeText={onChange} onBlur={onBlur} editable={!isLoading}
                    data-cy="register-email-input"
                  />
                )} />
                {errors.email && <Text className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</Text>}
              </View>

              {/* Password */}
              <View>
                <View className="absolute left-4 top-3 z-10"><Lock size={18} color={isDark ? '#8b8fa3' : '#6b6b80'} /></View>
                <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Password" placeholderTextColor={isDark ? '#8b8fa3' : '#6b6b80'}
                    className={`rounded-xl pl-11 pr-11 py-3.5 text-[15px] border ${isDark ? 'bg-[#0c0a18] text-[#e2e0ed] border-white/10 focus:border-[#8b7cf6]/70' : 'bg-[#f8f6f2] text-[#0f172a] border-[#0f172a]/8 focus:border-[#8b7cf6]/60'}`}
                    secureTextEntry={!showPassword} autoCapitalize="none" value={value} onChangeText={onChange} onBlur={onBlur} editable={!isLoading}
                    data-cy="register-password-input"
                  />
                )} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3" disabled={isLoading} data-cy="register-toggle-password">
                  {showPassword ? <EyeOff size={18} color={isDark ? '#8b8fa3' : '#6b6b80'} /> : <Eye size={18} color={isDark ? '#8b8fa3' : '#6b6b80'} />}
                </TouchableOpacity>
                {errors.password && <Text className="text-red-500 text-xs mt-1.5 font-medium">{errors.password.message}</Text>}

                {/* Real-time rules */}
                <View className="mt-2 pt-2 border-t border-white/10 dark:border-white/10">
                  {rules.map((r, i) => <PasswordRule key={i} met={r.met} label={r.label} />)}
                </View>
              </View>

              {/* Confirm */}
              <View>
                <View className="absolute left-4 top-3 z-10"><Lock size={18} color={isDark ? '#8b8fa3' : '#6b6b80'} /></View>
                <Controller control={control} name="confirmPassword" render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Confirm password" placeholderTextColor={isDark ? '#8b8fa3' : '#6b6b80'}
                    className={`rounded-xl pl-11 pr-11 py-3.5 text-[15px] border ${isDark ? 'bg-[#0c0a18] text-[#e2e0ed] border-white/10 focus:border-[#8b7cf6]/70' : 'bg-[#f8f6f2] text-[#0f172a] border-[#0f172a]/8 focus:border-[#8b7cf6]/60'}`}
                    secureTextEntry={!showConfirmPassword} autoCapitalize="none" value={value} onChangeText={onChange} onBlur={onBlur} editable={!isLoading}
                    data-cy="register-confirm-password-input"
                  />
                )} />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-3" disabled={isLoading} data-cy="register-toggle-confirm-password">
                  {showConfirmPassword ? <EyeOff size={18} color={isDark ? '#8b8fa3' : '#6b6b80'} /> : <Eye size={18} color={isDark ? '#8b8fa3' : '#6b6b80'} />}
                </TouchableOpacity>
                {errors.confirmPassword && <Text className="text-red-500 text-xs mt-1.5 font-medium">{errors.confirmPassword.message}</Text>}
              </View>

              <Text className="text-text-secondary-dark text-[12px] text-center mt-1 leading-relaxed">
                By creating an account, you agree to our <Text className="text-[#8b7cf6]">Terms</Text> and <Text className="text-[#8b7cf6]">Privacy</Text>.
              </Text>

              <TouchableOpacity onPress={handleSubmit(onRegisterPress)} disabled={isLoading} className="mt-1" data-cy="register-submit">
                <LinearGradient colors={['#8b7cf6', '#6d5ae6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="rounded-2xl py-3.5 shadow-[0_8px_30px_rgba(139,124,246,0.45)]">
                  {isLoading ? <ActivityIndicator color="white" /> : <Text className="text-white text-center text-base font-bold tracking-wide">Create Account</Text>}
                </LinearGradient>
              </TouchableOpacity>

              <GoogleSignInButton label="Sign up with Google" loading={googleLoading} onPress={triggerGoogle} />
            </View>
          </Animated.View>

          {/* Bottom link */}
          <Animated.View entering={FadeInUp.duration(600).delay(300)} className="items-center">
            <Text className="text-text-muted dark:text-white/40 text-[15px]">Already have an account?</Text>
            <TouchableOpacity onPress={() => router.back()} disabled={isLoading} data-cy="register-login-link">
              <Text className="text-[#8b7cf6] text-base font-extrabold mt-0.5">Log In</Text>
            </TouchableOpacity>
          </Animated.View>

          <View className="h-8" />
        </ScrollView>
      </AuthShell>
    </KeyboardAvoidingView>
  );
}
