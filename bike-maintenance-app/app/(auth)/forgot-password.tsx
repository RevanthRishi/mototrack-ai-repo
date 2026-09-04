import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { ArrowLeft, Mail, KeyRound } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [sent, setSent] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#06060f]">
      <ScrollView showsVerticalScrollIndicator={false} className="px-7 pt-6 pb-8" contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="flex-row items-center gap-2 mb-8">
          <ArrowLeft size={16} color="#8b8fa3" strokeWidth={1.5} />
          <Text className="text-[#8b8fa3] text-sm font-light">Back to login</Text>
        </TouchableOpacity>

        <Animated.View entering={FadeInUp.duration(700)}>
          <LinearGradient colors={['#8b7cf6', '#6d5ae6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0.7 }} className="w-16 h-16 rounded-[20px] items-center justify-center shadow-[0_0_24px_rgba(139,124,246,0.3)] mb-6">
            <KeyRound size={28} color="#fff" strokeWidth={1.5} />
          </LinearGradient>
          <Text className="text-white text-[28px] font-light tracking-tight">Reset Password</Text>
          <Text className="text-[#6b6b80] text-sm font-light mt-2">Enter your email and we will send a reset link.</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(700).delay(120)} className="mt-10 flex-1">
          {sent ? (
            <View className="bg-[#10b981]/8 border border-[#10b981]/20 rounded-2xl p-5 mb-6">
              <Text className="text-[#10b981] text-sm font-medium">Reset link sent.</Text>
              <Text className="text-[#8b8fa3] text-[12px] font-light mt-1">Check your inbox and follow the link to reset your password.</Text>
            </View>
          ) : (
            <Input
              label="Email"
              placeholder="you@email.com"
              keyboardType="email-address"
              leftIcon={<Mail size={15} color="#6b6b80" strokeWidth={1.5} />}
            />
          )}

          {!sent && (
            <Button variant="primary" size="lg" onPress={() => setSent(true)} className="mt-4">
              Send Reset Link
            </Button>
          )}

          {sent && (
            <Button variant="secondary" size="lg" onPress={() => router.replace('/(auth)/login')}>
              Return to Login
            </Button>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
