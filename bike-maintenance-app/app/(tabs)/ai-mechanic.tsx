import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bot, Send } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function AIMechanicScreen() {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, from: 'ai', text: 'Describe any symptom — smoke, noise, vibration, warning light. I will identify probable causes and show repair estimates.' },
  ]);
  const msgIdRef = React.useRef(2);

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
    <SafeAreaView className="flex-1 bg-[#06060f]">
      <View className="px-7 pt-7 pb-8 relative overflow-hidden">
        <LinearGradient colors={['#0c0d20', '#080814', '#06060f']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <LinearGradient colors={['rgba(139,124,246,0.08)', 'transparent 60%']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <Animated.View entering={FadeInUp.duration(700)}>
          <Text className="text-[#8b7cf6] text-[10px] font-semibold uppercase tracking-[0.35em]">AI Mechanic</Text>
          <Text className="text-white text-[40px] font-light tracking-tight mt-3 leading-[1.05]">Pocket Expert</Text>
        </Animated.View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-7 -mt-5" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Welcome card */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)}>
          <View className="rounded-[24px] overflow-hidden border border-white/[0.06] mb-6 relative">
            <LinearGradient colors={['#1a1030', '#0f0c18']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 24 }}>
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <View className="flex-row items-center gap-3 mb-2">
                <View className="w-10 h-10 rounded-full bg-[#8b7cf6]/10 border border-[#8b7cf6]/20 items-center justify-center">
                  <Bot size={18} color="#8b7cf6" strokeWidth={1.5} />
                </View>
                <Text className="text-white text-lg font-light tracking-tight">Pocket Mechanic</Text>
              </View>
              <Text className="text-[#8b7cf6]/70 text-[14px] font-light leading-relaxed">
                Plain-language symptom diagnosis, repair cost estimates, and DIY vs professional recommendations.
              </Text>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Symptoms */}
        <Text className="text-[#6b6b80] text-[10px] font-semibold uppercase tracking-[0.3em] mb-3">Common Symptoms</Text>
        <View className="flex-wrap flex-row gap-2 mb-6">
          {['Engine knocking', 'Hard start', 'Smoke', 'Vibration', 'Oil leak', 'Brake noise'].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setMsg(t)}
              className="bg-[#0d0d18] border border-white/[0.06] rounded-xl px-3 py-2 active:opacity-70"
            >
              <Text className="text-[#c4b5fd] text-[11px] font-medium">{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chat */}
        <View className="space-y-3">
          {messages.map((m) => (
            <View key={m.id} className={`flex-row ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <View className={`max-w-[82%] rounded-2xl px-4 py-3.5 ${m.from === 'user' ? 'bg-[#8b7cf6]/15 border border-[#8b7cf6]/20' : 'bg-[#0d0d18] border border-white/[0.06]'}`}>
                <Text className={`text-[14px] leading-relaxed ${m.from === 'user' ? 'text-white font-light' : 'text-[#e2e0ed] font-light'}`}>
                  {m.text}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View className="h-20" />
      </ScrollView>

      {/* Input */}
      <View className="absolute bottom-0 left-0 right-0 bg-[#06060f]/95 backdrop-blur-xl border-t border-white/[0.06] px-7 py-4 flex-row gap-2 items-center">
        <TextInput
          value={msg}
          onChangeText={setMsg}
          placeholder="Describe symptoms..."
          placeholderTextColor="#4a4a60"
          className="flex-1 bg-[#0d0d18] border border-white/[0.08] rounded-2xl px-5 py-3.5 text-white text-[15px] font-light"
          onSubmitEditing={send}
        />
        <TouchableOpacity onPress={send} className="w-11 h-11 rounded-2xl bg-[#8b7cf6]/90 items-center justify-center shadow-lg shadow-[#8b7cf6]/15 active:scale-95">
          <Send size={17} color="#fff" strokeWidth={1.8} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
