import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bot, Send } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemedGradient, useThemedSheen, THEME_GRADIENTS } from '@/lib/hooks/useThemedGradient';

export default function AIMechanicScreen() {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, from: 'ai', text: 'Describe any symptom — smoke, noise, vibration, warning light. I will identify probable causes and show repair estimates.' },
  ]);
  const msgIdRef = React.useRef(2);

  const heroGradient = useThemedGradient(THEME_GRADIENTS.heroAI.light, THEME_GRADIENTS.heroAI.dark);
  const sheen = useThemedSheen('violet');

  const send = () => {
    if (!msg.trim()) return;
    const userId = msgIdRef.current++;
    setMessages((prev) => [...prev, { id: userId, from: 'user', text: msg }]);
    setMsg('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: msgIdRef.current++, from: 'ai', text: 'Likely cause: chain tension or spark plug wear. Repair estimate: $35–$80 depending on shop. Would you like a DIY guide?' }]);
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas-light dark:bg-canvas-dark">
      <View className="px-7 pt-7 pb-8 relative overflow-hidden">
        <LinearGradient colors={heroGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <LinearGradient colors={sheen} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <Animated.View entering={FadeInUp.duration(700)}>
          <Text className="text-accent-violet text-[10px] font-semibold uppercase tracking-[0.35em]">AI Mechanic</Text>
          <Text className="text-text-primary dark:text-text-primary-dark text-[40px] font-light tracking-tight mt-3 leading-[1.05]">Pocket Expert</Text>
        </Animated.View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-7 -mt-5" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Welcome card */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)}>
          <View className="bg-card-light dark:bg-card-dark rounded-[24px] border border-border-light dark:border-border-dark mb-6 relative ">
            <View className="px-6 py-6">
              <View className="flex-row items-center gap-3 mb-2">
                <View className="w-10 h-10 rounded-full bg-accent-violet/10 border border-accent-violet/20 items-center justify-center">
                  <Bot size={18} color="#8b7cf6" strokeWidth={1.5} />
                </View>
                <Text className="text-text-primary dark:text-text-primary-dark text-lg font-light tracking-tight">Pocket Mechanic</Text>
              </View>
              <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[14px] font-light leading-relaxed">
                Plain-language symptom diagnosis, repair cost estimates, and DIY vs professional recommendations.
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Symptoms */}
        <Text className="text-text-secondary-light dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.3em] mb-3">Common Symptoms</Text>
        <View className="flex-wrap flex-row gap-2 mb-6">
          {['Engine knocking', 'Hard start', 'Smoke', 'Vibration', 'Oil leak', 'Brake noise'].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setMsg(t)}
              className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark px-3 py-2 active:opacity-70 "
              data-cy={`ai-symptom-${t.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Text className="text-accent-violet text-[11px] font-medium">{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chat */}
        <View className="space-y-3">
          {messages.map((m) => (
            <View key={m.id} className={`flex-row ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <View className={`max-w-[82%] rounded-2xl px-4 py-3.5 ${m.from === 'user' ? 'bg-accent-violet/15 border border-accent-violet/20' : 'bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark '}`}>
                <Text className={`text-[14px] leading-relaxed font-light ${m.from === 'user' ? 'text-white' : 'text-text-primary dark:text-text-primary-dark'}`}>
                  {m.text}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View className="h-20" />
      </ScrollView>

      {/* Input */}
      <View className="absolute bottom-0 left-0 right-0 bg-canvas-light dark:bg-canvas-dark border-t border-border-light dark:border-border-dark px-7 py-4 flex-row gap-2 items-center">
        <TextInput
          value={msg}
          onChangeText={setMsg}
          placeholder="Describe symptoms..."
          placeholderTextColor="#9ca3af"
          className="flex-1 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl px-5 py-3.5 text-text-primary dark:text-text-primary-dark text-[15px] font-light"
          data-cy="ai-message-input"
          onSubmitEditing={send}
        />
        <TouchableOpacity onPress={send} className="w-11 h-11 rounded-2xl bg-accent-violet items-center justify-center shadow-lg shadow-accent-violet/15 active:scale-95" data-cy="ai-send-message">
          <Send size={17} color="#fff" strokeWidth={1.8} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
