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
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

import { LoginFormData, loginSchema } from '@/lib/utils/validation';

import { authenticateWithBiometrics, checkBiometricCapabilities, getBiometricTypeName } from '@/lib/security/biometric';
import { signInWithEmail } from '@/lib/utils/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');

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
      <StatusBar style="light" />
      <LinearGradient colors={['#06060f', '#0f0e18', '#140f2d']} className="flex-1">
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-8 py-14"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo Mark */}
          <Animated.View entering={FadeInUp.duration(700).springify()} className="items-center mb-10">
            <LinearGradient
              colors={['#8b7cf6', '#6d5ae6', '#4f3eb3']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              className="w-24 h-24 rounded-[28px] items-center justify-center mb-5 shadow-[0_20px_50px_rgba(139,124,246,0.35)]"
            >
              <ShieldCheck size={42} color="#fff" strokeWidth={2.2} />
            </LinearGradient>
            <Text className="text-white text-[2.2rem] font-extrabold tracking-tight leading-tight">MotoTrack AI</Text>
            <Text className="text-[#9ca3af] text-[15px] mt-2 tracking-wide">Your Smart Bike Companion</Text>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.duration(700).delay(150).springify()} className="space-y-5">
            {/* Email */}
            <View className="relative">
              <View className="absolute left-4 top-3.5 z-10"><Mail size={18} color="#8b8fa3" /></View>
              <Controller
                control={control} name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Email address" placeholderTextColor="#6b6e80"
                    className="bg-[#161625] rounded-[20px] pl-11 pr-4 py-[14px] text-white text-[15px] border border-[#23233a] focus:border-[#8b7cf6]/50"
                    keyboardType="email-address" autoCapitalize="none"
                    value={value} onChangeText={onChange} onBlur={onBlur} editable={!isLoading}
                  />
                )}
              />
              {errors.email && <Text className="text-[#f87171] text-xs mt-1.5 ml-1 font-medium">{errors.email.message}</Text>}
            </View>

            {/* Password */}
            <View className="relative">
              <View className="absolute left-4 top-3.5 z-10"><Lock size={18} color="#8b8fa3" /></View>
              <Controller
                control={control} name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Password" placeholderTextColor="#6b6e80"
                    className="bg-[#161625] rounded-[20px] pl-11 pr-11 py-[14px] text-white text-[15px] border border-[#23233a] focus:border-[#8b7cf6]/50"
                    secureTextEntry={!showPassword} autoCapitalize="none"
                    value={value} onChangeText={onChange} onBlur={onBlur} editable={!isLoading}
                  />
                )}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5" disabled={isLoading}>
                {showPassword ? <EyeOff size={18} color="#8b8fa3" /> : <Eye size={18} color="#8b8fa3" />}
              </TouchableOpacity>
              {errors.password && <Text className="text-[#f87171] text-xs mt-1.5 ml-1 font-medium">{errors.password.message}</Text>}
            </View>

            <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} disabled={isLoading} className="self-end">
              <Text className="text-[#8b7cf6]/80 text-sm font-semibold">Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login */}
            <TouchableOpacity
              onPress={handleSubmit(onLoginPress)} disabled={isLoading}
              className="mt-3 active:opacity-90"
            >
              <LinearGradient colors={['#8b7cf6', '#6d5ae6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="rounded-[20px] py-[14px] shadow-[0_8px_30px_rgba(139,124,246,0.35)]">
                {isLoading ? <ActivityIndicator color="white" /> : <Text className="text-white text-center text-base font-bold tracking-wide">Log In</Text>}
              </LinearGradient>
            </TouchableOpacity>

            {/* Biometric */}
            {biometricAvailable && (
              <TouchableOpacity onPress={handleBiometricLogin} disabled={isLoading} className="mt-2 active:opacity-80">
                <View className="flex-row items-center justify-center bg-[#161625] rounded-[20px] py-[14px] border border-[#23233a] gap-2.5">
                  <Fingerprint size={20} color="#8b7cf6" />
                  <Text className="text-white text-sm font-semibold">Log in with {biometricType}</Text>
                </View>
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-[#23233a]" />
            <Text className="text-[#5b5b6e] px-4 text-xs font-bold uppercase tracking-[0.15em]">or</Text>
            <View className="flex-1 h-px bg-[#23233a]" />
          </View>

          {/* Sign up */}
          <Animated.View entering={FadeInUp.duration(600).delay(300)} className="items-center">
            <Text className="text-[#a1a1b0] text-[15px]">New to MotoTrack?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')} disabled={isLoading} className="mt-1">
              <Text className="text-[#8b7cf6] text-base font-extrabold">Create an account</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
