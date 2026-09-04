import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, Eye, EyeOff, User, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

import { RegisterFormData, registerSchema } from '@/lib/utils/validation';
import { signUpWithEmail } from '@/lib/utils/auth';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { useGoogleSignIn } from '@/lib/hooks/useGoogleSignIn';


export default function RegisterScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loading: googleLoading, trigger: triggerGoogle } = useGoogleSignIn();

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', fullName: '' },
  });

  const onRegisterPress = async (data: RegisterFormData) => {
    setIsLoading(true);
    const { error } = await signUpWithEmail(data.email, data.password, data.fullName);
    setIsLoading(false);
    if (error) {
      Alert.alert('Sign up failed', error.message);
      return;
    }
    Alert.alert('Success!', 'Account created.', [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]);
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
          {/* Logo + Header */}
          <Animated.View entering={FadeInUp.duration(700).springify()} className="items-center mb-10">
            <LinearGradient
              colors={['#8b7cf6', '#6d5ae6', '#4f3eb3']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              className="w-24 h-24 rounded-[28px] items-center justify-center mb-5 shadow-[0_20px_50px_rgba(139,124,246,0.35)]"
            >
              <Sparkles size={42} color="#fff" strokeWidth={2.2} />
            </LinearGradient>
            <Text className="text-white text-[2rem] font-extrabold tracking-tight">Create Account</Text>
            <Text className="text-[#9ca3af] text-[15px] mt-2 tracking-wide">Join MotoTrack AI today</Text>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.duration(700).delay(150).springify()} className="space-y-4">
            {/* Full Name */}
            <View className="relative">
              <View className="absolute left-4 top-3.5 z-10"><User size={18} color="#8b8fa3" /></View>
              <Controller
                control={control} name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Full name" placeholderTextColor="#6b6e80"
                    className="bg-[#161625] rounded-[18px] pl-11 pr-4 py-[13px] text-white text-[15px] border border-[#23233a] focus:border-[#8b7cf6]/50"
                    autoCapitalize="words" value={value} onChangeText={onChange} onBlur={onBlur} editable={!isLoading}
                  />
                )}
              />
              {errors.fullName && <Text className="text-[#f87171] text-xs mt-1.5 ml-1">{errors.fullName.message}</Text>}
            </View>

            {/* Email */}
            <View className="relative">
              <View className="absolute left-4 top-3.5 z-10"><Mail size={18} color="#8b8fa3" /></View>
              <Controller
                control={control} name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Email address" placeholderTextColor="#6b6e80"
                    className="bg-[#161625] rounded-[18px] pl-11 pr-4 py-[13px] text-white text-[15px] border border-[#23233a] focus:border-[#8b7cf6]/50"
                    keyboardType="email-address" autoCapitalize="none" value={value} onChangeText={onChange} onBlur={onBlur} editable={!isLoading}
                  />
                )}
              />
              {errors.email && <Text className="text-[#f87171] text-xs mt-1.5 ml-1">{errors.email.message}</Text>}
            </View>

            {/* Password */}
            <View className="relative">
              <View className="absolute left-4 top-3.5 z-10"><Lock size={18} color="#8b8fa3" /></View>
              <Controller
                control={control} name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Password" placeholderTextColor="#6b6e80"
                    className="bg-[#161625] rounded-[18px] pl-11 pr-11 py-[13px] text-white text-[15px] border border-[#23233a] focus:border-[#8b7cf6]/50"
                    secureTextEntry={!showPassword} autoCapitalize="none" value={value} onChangeText={onChange} onBlur={onBlur} editable={!isLoading}
                  />
                )}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5" disabled={isLoading}>
                {showPassword ? <EyeOff size={18} color="#8b8fa3" /> : <Eye size={18} color="#8b8fa3" />}
              </TouchableOpacity>
              {errors.password && <Text className="text-[#f87171] text-xs mt-1.5 ml-1">{errors.password.message}</Text>}
            </View>

            {/* Confirm Password */}
            <View className="relative">
              <View className="absolute left-4 top-3.5 z-10"><Lock size={18} color="#8b8fa3" /></View>
              <Controller
                control={control} name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Confirm password" placeholderTextColor="#6b6e80"
                    className="bg-[#161625] rounded-[18px] pl-11 pr-11 py-[13px] text-white text-[15px] border border-[#23233a] focus:border-[#8b7cf6]/50"
                    secureTextEntry={!showConfirmPassword} autoCapitalize="none" value={value} onChangeText={onChange} onBlur={onBlur} editable={!isLoading}
                  />
                )}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-3.5" disabled={isLoading}>
                {showConfirmPassword ? <EyeOff size={18} color="#8b8fa3" /> : <Eye size={18} color="#8b8fa3" />}
              </TouchableOpacity>
              {errors.confirmPassword && <Text className="text-[#f87171] text-xs mt-1.5 ml-1">{errors.confirmPassword.message}</Text>}
            </View>

            {/* Terms */}
            <Text className="text-[#6b6e80] text-[12px] text-center mt-2 leading-relaxed">
              By creating an account, you agree to our{' '}
              <Text className="text-[#8b7cf6]/80">Terms of Service</Text> and{' '}
              <Text className="text-[#8b7cf6]/80">Privacy Policy</Text>
            </Text>

            {/* Register Button */}
            <TouchableOpacity onPress={handleSubmit(onRegisterPress)} disabled={isLoading} className="mt-3 active:opacity-90">
              <LinearGradient colors={['#8b7cf6', '#6d5ae6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="rounded-[18px] py-[14px] shadow-[0_8px_30px_rgba(139,124,246,0.35)]">
                {isLoading ? <ActivityIndicator color="white" /> : <Text className="text-white text-center text-base font-bold tracking-wide">Create Account</Text>}
              </LinearGradient>
            </TouchableOpacity>

            {/* Google Sign In */}
            <GoogleSignInButton label="Sign up with Google" loading={googleLoading} onPress={triggerGoogle} />
          </Animated.View>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-[#23233a]" />
            <Text className="text-[#5b5b6e] px-4 text-xs font-bold uppercase tracking-[0.15em]">or</Text>
            <View className="flex-1 h-px bg-[#23233a]" />
          </View>

          {/* Login link */}
          <Animated.View entering={FadeInUp.duration(600).delay(300)} className="items-center">
            <Text className="text-[#a1a1b0] text-[15px]">Already have an account?</Text>
            <TouchableOpacity onPress={() => router.back()} disabled={isLoading} className="mt-1">
              <Text className="text-[#8b7cf6] text-base font-extrabold">Log In</Text>
            </TouchableOpacity>
          </Animated.View>

          <View className="h-6" />
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
