import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Fuel, Timer, Navigation, Gauge, MapPin, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchNearbyStations, haversineDistance, GpsCoords } from '@/lib/gps/locationService';
import { useTheme } from '@/lib/stores/themeStore';
import { useVehicles } from '@/lib/hooks/useVehicles';
import { useAuth } from '@/lib/hooks/useAuth';
import * as Location from 'expo-location';

const { height: SCREEN_H } = Dimensions.get('window');

export default function VehicleTrackerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { vehicles } = useVehicles(user?.id ?? null);
  const vehicle = vehicles.find(v => v.id === id);

  const [tracking, setTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentLoc, setCurrentLoc] = useState<GpsCoords | null>(null);
  const [stationNearby, setStationNearby] = useState(false);
  const [stationName, setStationName] = useState('');
  const [stationTime, setStationTime] = useState(0);
  const [notified, setNotified] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const lastLocRef = useRef<GpsCoords | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startTrip = async () => {
    setConfirmed(true);
    setTracking(true);
    setStartTime(new Date());
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
      const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      setCurrentLoc(coords);
      lastLocRef.current = coords;
    } catch { /* ignore */ }
  };
  const cancelTrip = () => router.back();

  const toggleTracking = () => {
    if (tracking) {
      setTracking(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (stationTimerRef.current) clearInterval(stationTimerRef.current);
    } else {
      setTracking(true);
      if (!startTime) setStartTime(new Date());
    }
  };

  useEffect(() => {
    let mounted = true;
    if (!confirmed) return () => { mounted = false; };

    timerRef.current = setInterval(async () => {
      if (!tracking || !mounted) return;
      try {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
        setCurrentLoc(coords);
        if (lastLocRef.current) {
          const d = haversineDistance(lastLocRef.current, coords);
          if (d > 0 && d < 0.5) setDistance(prev => prev + d);
        }
        lastLocRef.current = coords;
        try {
          const nearby = await fetchNearbyStations(coords, 0.3, 5);
          if (nearby.length > 0) {
            setStationNearby(true);
            setStationName(nearby[0].name);
          } else {
            setStationNearby(false);
            setStationName('');
            setStationTime(0);
            setNotified(false);
          }
        } catch { /* ignore overpass errors */ }
      } catch { /* ignore location errors */ }
    }, 3000);

    stationTimerRef.current = setInterval(() => {
      if (stationNearby && !notified) {
        setStationTime(prev => prev + 3);
        if (stationTime >= 120) setNotified(true);
      } else if (!stationNearby) {
        setStationTime(0);
        setNotified(false);
      }
    }, 3000);

    return () => {
      mounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (stationTimerRef.current) clearInterval(stationTimerRef.current);
    };
  }, [confirmed, tracking, stationNearby, stationTime, notified]);

  const formatDuration = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h > 0 ? `${h}h ` : ''}${m > 0 ? `${m}m ` : ''}${s}s`;
  };

  const elapsedMs = startTime ? Date.now() - startTime.getTime() : 0;
  const avgSpeed = elapsedMs > 0 ? (distance / (elapsedMs / 3600000)) : 0; // km/h
  const gradient = (isDark ? ['#06060f', '#0d1117', '#13131f'] : ['#e8e9f0', '#d5d8e4', '#f0f1f6']) as [string, string, string];

  // Confirmation screen
  if (!confirmed) {
    return (
      <SafeAreaView className="flex-1 bg-canvas-light dark:bg-canvas-dark">
        <View className="flex-1 px-6 pt-10 justify-center">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-1 mb-10">
            <ChevronLeft size={18} color="#8b7cf6" strokeWidth={2} />
            <Text className="text-accent-violet text-sm font-medium">Back</Text>
          </TouchableOpacity>
          <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.3em] mb-4">Trip Tracker</Text>
          <Text className="text-text-primary dark:text-text-primary-dark text-3xl font-extralight tracking-tight leading-[1.1] mb-3">
            Start tracking for {vehicle?.make} {vehicle?.model}?
          </Text>
          <Text className="text-text-secondary dark:text-text-secondary-dark text-sm font-light leading-relaxed mb-8">
            We'll use your location to track distance and detect fuel stops. You can cancel anytime.
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={cancelTrip}
              className="flex-1 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark py-4 items-center"
              data-cy="tracker-cancel-btn"
            >
              <Text className="text-text-secondary dark:text-text-secondary-dark font-medium">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={startTrip}
              className="flex-1 rounded-2xl bg-amber py-4 items-center"
              data-cy="tracker-start-btn"
            >
              <Text className="text-white font-medium">Start Trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-canvas-light dark:bg-canvas-dark">
      {/* Back */}
      <View className="px-5 pt-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-1">
          <ChevronLeft size={18} color="#8b7cf6" strokeWidth={2} />
          <Text className="text-accent-violet text-sm font-medium">Back</Text>
        </TouchableOpacity>
      </View>

      {/* Tracker hero */}
      <View className="mx-5 mt-3 rounded-[24px] overflow-hidden shadow-[0_4px_30px_rgba(139,124,246,0.15)]" style={{ height: SCREEN_H * 0.38 }}>
        <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />
        <View className="absolute top-4 left-5 z-30">
          <View className="bg-card-light/85 dark:bg-card-dark/85 rounded-xl border border-border-light/40 dark:border-border-dark/40 px-3 py-2 backdrop-blur-md">
            <Text className="text-text-primary dark:text-text-primary-dark text-sm font-light tracking-tight">Tracker</Text>
            <Text className="text-text-secondary dark:text-text-secondary-dark text-[9px] mt-0.5 font-medium tracking-wide">{tracking ? 'LIVE' : 'PAUSED'}</Text>
          </View>
        </View>
        <View className="flex-1 px-7 pt-16 pb-6 justify-between">
          <View>
            <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.3em] mb-3">Distance Ridden</Text>
            <Text className="text-text-primary dark:text-text-primary-dark text-[52px] font-extralight tracking-tighter leading-none tabular-nums">{distance.toFixed(1)}</Text>
            <Text className="text-text-secondary dark:text-text-secondary-dark text-sm font-light mt-1">km</Text>
          </View>
          <View className="flex-row gap-4">
            <View>
              <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.2em]">Time</Text>
              <Text className="text-text-primary dark:text-text-primary-dark text-xl font-extralight mt-1">{formatDuration(elapsedMs)}</Text>
            </View>
            <View>
              <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.2em]">Status</Text>
              <Text className={`text-sm font-medium mt-1 ${tracking ? 'text-amber' : 'text-text-muted'}`}>{tracking ? 'Tracking' : 'Paused'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Station banner */}
      {stationNearby && (
        <View className="mx-5 -mt-2 mb-3 z-10">
          <View className={`rounded-2xl px-4 py-3 border backdrop-blur-md ${notified ? 'bg-amber/10 border-amber/40' : 'bg-card-light/90 dark:bg-card-dark/90 border-border-light/30 dark:border-border-dark/30'}`}>
            <View className="flex-row items-center gap-2">
              <Fuel size={14} color={notified ? '#f59e0b' : '#10b981'} strokeWidth={2} />
              <Text className={`text-sm font-medium ${notified ? 'text-amber' : 'text-text-primary dark:text-text-primary-dark'}`}>
                {notified ? 'Log your fuel?' : `At ${stationName || 'fuel station'}`}
              </Text>
              {notified && <Text className="text-[9px] font-bold tracking-widest text-amber ml-auto">NOTIFY SENT</Text>}
            </View>
            <Text className="text-text-secondary dark:text-text-secondary-dark text-[11px] mt-1">{stationTime}s at station · {Math.max(0, 120 - stationTime)}s to notify</Text>
          </View>
        </View>
      )}

      {/* Toggle */}
      <View className="mx-5 mb-4">
        <TouchableOpacity activeOpacity={0.85} onPress={toggleTracking} data-cy="tracker-toggle-btn" className="rounded-2xl overflow-hidden">
          <LinearGradient
            colors={tracking ? ['#f59e0b', '#f97316'] : ['#10b981', '#059669']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            className="px-6 py-3 flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-3">
              <Navigation size={18} color="#fff" strokeWidth={2} />
              <Text className="text-white text-base font-medium">{tracking ? 'Tracking' : 'Resume Tracking'}</Text>
            </View>
            <Text className="text-white text-xs font-bold tracking-[0.2em]">{tracking ? 'ON' : 'OFF'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5" style={{ zIndex: 5 }}>
        <View className="flex-row gap-3 mb-6">
          {[
            { label: 'Avg Speed', value: avgSpeed.toFixed(1), unit: 'km/h', icon: Gauge, accent: '#8b7cf6' },
            { label: 'Trip Time', value: formatDuration(elapsedMs), unit: '', icon: Timer, accent: '#f59e0b' },
            { label: 'Current Loc', value: currentLoc ? `${currentLoc.latitude.toFixed(4)},${currentLoc.longitude.toFixed(4)}` : '--', unit: 'lat/long', icon: MapPin, accent: '#10b981' },
          ].map(s => (
            <View key={s.label} className="flex-1 bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark p-4">
              <View className="flex-row items-center gap-1.5 mb-2">
                <s.icon size={11} color={s.accent} strokeWidth={2} />
                <Text className="text-text-secondary dark:text-text-secondary-dark text-[9px] font-semibold uppercase tracking-[0.2em]">{s.label}</Text>
              </View>
              <Text className="text-text-primary dark:text-text-primary-dark text-xl font-extralight tracking-tighter">{s.value}</Text>
              <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] mt-0.5">{s.unit}</Text>
            </View>
          ))}
        </View>

        {/* How it works */}
        <View className="mb-6">
          <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.3em] mb-3">How it works</Text>
          <View className="bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark p-4">
            {[
              { step: '1', text: 'App tracks your GPS location continuously' },
              { step: '2', text: 'Distance accumulates automatically (km ridden)' },
              { step: '3', text: 'Stops at fuel station for 2 min → detects via Overpass API' },
              { step: '4', text: 'Push notification asks to log fuel + pre-fills odometer' },
            ].map((item) => (
              <View key={item.step} className="flex-row gap-3 py-2 border-b border-border-light/30 dark:border-border-dark/30 last:border-0">
                <View className="w-6 h-6 rounded-full bg-violet/15 items-center justify-center shrink-0"><Text className="text-violet text-[10px] font-bold">{item.step}</Text></View>
                <Text className="text-text-primary dark:text-text-primary-dark text-sm font-light">{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="h-28" />
      </ScrollView>
    </SafeAreaView>
  );
}
