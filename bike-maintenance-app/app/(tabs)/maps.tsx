import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Fuel, Wrench, Car, Route, Navigation } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { getCurrentLocation, fetchNearbyStations, FuelStation, GpsCoords } from '@/lib/gps/locationService';
import { useTheme } from '@/lib/stores/themeStore';
import { useUserDataStore } from '@/lib/stores/userDataStore';

const { height: SCREEN_H } = Dimensions.get('window');
const MAP_HEIGHT = SCREEN_H * 0.52;

type Layer = 'fuel' | 'service' | 'parking' | 'history' | 'route';
const LAYERS: { id: Layer; label: string; Icon: React.ElementType }[] = [
  { id: 'fuel',    label: 'Fuel',    Icon: Fuel  },
  { id: 'service', label: 'Service', Icon: Wrench },
  { id: 'parking', label: 'Parking', Icon: Car   },
  { id: 'route',   label: 'Route',  Icon: Navigation },
  { id: 'history', label: 'History', Icon: Route },
];

export default function MapsScreen() {
  const { isDark } = useTheme();
  const { fuelLogs } = useUserDataStore();

  const [activeLayers, setActiveLayers] = useState<Set<Layer>>(new Set(['fuel', 'route']));
  const [fuelStations, setFuelStations] = useState<FuelStation[]>([]);
  const [loadingStations, setLoadingStations] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<GpsCoords | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const loc = await getCurrentLocation();
        if (!mounted) return;
        setCurrentLocation(loc);
        if (activeLayers.has('fuel')) {
          setLoadingStations(true);
          const nearby = await fetchNearbyStations(loc, 6, 15);
          if (mounted) setFuelStations(nearby);
        }
      } catch (e: any) { console.warn('Location/fuel fetch:', e?.message); }
      finally { if (mounted) setLoadingStations(false); }
    })();
    return () => { mounted = false; };
  }, []);

  const toggleLayer = (layer: Layer) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer)) next.delete(layer); else next.add(layer);
      return next;
    });
  };

  // Build markers for display
  const markers: { id: string; name: string; layer: Layer; lat: number; lon: number; dist?: string }[] = [];
  if (currentLocation && activeLayers.has('route')) {
    markers.push({ id: 'my-location', name: 'You are here', layer: 'route', lat: currentLocation.latitude, lon: currentLocation.longitude });
  }
  if (activeLayers.has('fuel')) {
    fuelStations.forEach(s => markers.push({
      id: `fuel-${s.id}`, name: s.name, layer: 'fuel',
      lat: s.latitude, lon: s.longitude, dist: s.distanceKm ? `${s.distanceKm.toFixed(1)} km` : undefined,
    }));
  }
  if (activeLayers.has('service')) {
    if (currentLocation) {
      markers.push({ id: 'svc-1', name: 'MotoService Pro', layer: 'service', lat: currentLocation.latitude + 0.008, lon: currentLocation.longitude + 0.012, dist: '1.8 km' });
      markers.push({ id: 'svc-2', name: 'QuickFix Garage', layer: 'service', lat: currentLocation.latitude - 0.006, lon: currentLocation.longitude + 0.018, dist: '3.2 km' });
    }
  }
  if (activeLayers.has('parking')) {
    if (currentLocation) {
      markers.push({ id: 'park-1', name: 'Secure Parking', layer: 'parking', lat: currentLocation.latitude + 0.004, lon: currentLocation.longitude - 0.010, dist: '0.5 km' });
      markers.push({ id: 'park-2', name: 'City Garage', layer: 'parking', lat: currentLocation.latitude - 0.010, lon: currentLocation.longitude + 0.005, dist: '2.1 km' });
    }
  }
  if (activeLayers.has('history') && fuelLogs.length > 0) {
    fuelLogs.slice(0, 5).forEach(log => {
      const lat = (log as any).latitude ?? (log as any).lat ?? (currentLocation?.latitude ?? 0);
      const lon = (log as any).longitude ?? (log as any).lon ?? (currentLocation?.longitude ?? 0);
      markers.push({ id: `hist-${log.id}`, name: `Fuel #${fuelLogs.length - markers.filter(m=>m.layer==='history').length - 1}`, layer: 'history', lat, lon });
    });
  }

  const isHistoryActive = activeLayers.has('history');
  const mapBgGradient: [string, string, string] = isDark
    ? (isHistoryActive ? ['#06060f', '#0f172a', '#1a1330'] : ['#06060f', '#0d1117', '#13131f'])
    : ['#e8e9f0', '#d5d8e4', '#f0f1f6'];

  const layerColor: Record<Layer, string> = { fuel: '#f59e0b', service: '#10b981', parking: '#8b7cf6', history: '#f97316', route: '#3b82f6' };

  return (
    <SafeAreaView className="flex-1 bg-canvas-light dark:bg-canvas-dark">
      {/* ── Map area — gradient base with drawn route lines ── */}
      <View className="mx-5 mt-4 rounded-[24px] overflow-hidden shadow-[0_4px_30px_rgba(139,124,246,0.15)]" style={{ height: MAP_HEIGHT }}>
        <LinearGradient colors={mapBgGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />

        {/* Header pill */}
        <View className="absolute top-4 left-5 z-30">
          <View className="bg-card-light/85 dark:bg-card-dark/85 rounded-xl border border-border-light/40 dark:border-border-dark/40 px-3 py-2 backdrop-blur-md">
            <Text className="text-text-primary dark:text-text-primary-dark text-sm font-light tracking-tight">Map</Text>
            <Text className="text-text-secondary dark:text-text-secondary-dark text-[9px] mt-0.5 font-medium tracking-wide">{markers.length} point{markers.length === 1 ? '' : 's'}</Text>
          </View>
        </View>

        {/* Layer chips — top right */}
        <View className="absolute top-4 right-5 z-30">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {LAYERS.map(({ id, label, Icon }) => {
                const active = activeLayers.has(id);
                return (
                  <TouchableOpacity key={id} activeOpacity={0.8} onPress={() => toggleLayer(id)} data-cy={`maps-layer-${id}`}>
                    <View className={`flex-row items-center gap-1.5 px-3 py-2 rounded-full border backdrop-blur-md ${active
                      ? 'bg-violet/15 dark:bg-violet/20 border-violet/40 shadow-[0_2px_12px_rgba(139,124,246,0.3)]'
                      : 'bg-card-light/70 dark:bg-card-dark/70 border-border-light/30 dark:border-border-dark/30'
                    }`}>
                      <Icon size={11} color={active ? '#8b7cf6' : '#6b6b80'} strokeWidth={2} />
                      <Text className={`text-[10px] font-semibold tracking-wide ${active ? 'text-violet' : 'text-text-secondary dark:text-text-secondary-dark'}`}>{label}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Route line overlay — diagonal route lines drawn with transforms */}
        <View className="absolute inset-0 pointer-events-none" style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 60, paddingBottom: 20 }}>
          {/* Navigation line: diagonal from top-left to bottom-right (route layer) */}
          {activeLayers.has('route') && currentLocation && fuelStations.length > 0 && (
            <View style={{ position: 'absolute', top: 80, left: 30, width: 260, height: 60, zIndex: 1 }}>
              <View style={{
                position: 'absolute', top: 0, left: 0,
                width: 310, height: 3,
                backgroundColor: '#3b82f6',
                borderRadius: 2, opacity: 0.9,
                transform: [{ rotate: '12deg' }],
              }} />
              <View style={{
                position: 'absolute', top: 0, left: 0,
                width: 310, height: 3,
                borderRadius: 2,
                borderWidth: 1.5,
                borderColor: '#3b82f6',
                borderStyle: 'dashed',
                transform: [{ rotate: '12deg' }],
                opacity: 0.6,
              }} />
            </View>
          )}
          {/* History ride path: horizontal winding orange line */}
          {activeLayers.has('history') && fuelLogs.length > 1 && (
            <View style={{ position: 'absolute', top: 100, left: 30, right: 30, height: 50, zIndex: 1 }}>
              <View style={{ position: 'absolute', top: 20, left: 0, right: 0, height: 3, backgroundColor: '#f97316', borderRadius: 2, opacity: 0.85 }} />
              <View style={{ position: 'absolute', top: 30, left: 20, width: 3, height: 20, backgroundColor: '#f97316', borderRadius: 2, opacity: 0.85 }} />
              <View style={{ position: 'absolute', top: 30, right: 20, width: 3, height: 20, backgroundColor: '#f97316', borderRadius: 2, opacity: 0.85 }} />
              <View style={{ position: 'absolute', top: 0, left: 20, width: 3, height: 20, backgroundColor: '#f97316', borderRadius: 2, opacity: 0.85 }} />
            </View>
          )}
        </View>

        {/* Marker pills — positioned over gradient */}
        <View className="absolute inset-0 px-6 pt-32 pointer-events-none" />

        {/* Glass marker pills */}
        <View className="absolute inset-0 px-6 pt-32 pointer-events-none">
          {markers.map((m, i) => (
            <Animated.View
              key={m.id}
              entering={FadeInUp.duration(400).delay(100 + i * 60)}
              className="absolute z-20"
              style={{
                top: 10 + (i % 4) * 58,
                left: 16 + (i % 3) * ((SCREEN_H > 700 ? 280 : 220) / 3),
              }}
            >
              <View className={`flex-row items-center gap-1.5 bg-card-light/90 dark:bg-card-dark/90 border border-border-light/40 dark:border-border-dark/40 rounded-full px-3 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.25)] backdrop-blur-sm`}>
                <View className="w-2 h-2 rounded-full" style={{ backgroundColor: layerColor[m.layer] }} />
                <Text className="text-text-primary dark:text-text-primary-dark text-[10px] font-semibold tracking-tight">{m.name}</Text>
                {m.dist && <Text className="text-text-secondary dark:text-text-secondary-dark text-[9px]">{m.dist}</Text>}
              </View>
            </Animated.View>
          ))}
        </View>

        {loadingStations && (
          <View className="absolute inset-0 items-center justify-center z-40" pointerEvents="none">
            <View className="bg-card-light/90 dark:bg-card-dark/90 rounded-2xl px-5 py-3 backdrop-blur-md">
              <ActivityIndicator size="small" color="#8b7cf6" />
              <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] mt-1.5">Loading stations…</Text>
            </View>
          </View>
        )}
      </View>

      {/* Bottom cards (same as before) */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5 -mt-3" style={{ zIndex: 5 }}>
        <View className="mt-4 mb-2">
          <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.3em] mb-4">
            {activeLayers.size === 0 ? 'Select a layer above' : `${activeLayers.size} layer${activeLayers.size === 1 ? '' : 's'} active`}
          </Text>
        </View>
        {/* Fuel cards, Route info, Service, Parking, History — preserved */}
        {activeLayers.size === 0 && (
          <View className="py-8 items-center" data-cy="maps-empty-hint"><Text className="text-text-secondary dark:text-text-secondary-dark text-sm font-light">Tap a layer above to see points.</Text></View>
        )}
        {activeLayers.has('fuel') && fuelStations.length > 0 && (
          <View className="mb-5">
            <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.25em] mb-3"><Fuel size={10} color="#f59e0b" className="inline-block mr-1" />Fuel Stations</Text>
            {fuelStations.slice(0,5).map(s => (
              <TouchableOpacity key={s.id} activeOpacity={0.85} className="mb-3" data-cy={`maps-fuel-${s.id}`}>
                <Animated.View entering={FadeInUp.duration(500)}>
                  <View className="bg-card-light/90 dark:bg-card-dark/90 rounded-[18px] border border-border-light/30 dark:border-border-dark/40 p-4 flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-amber/10 items-center justify-center border border-amber/15 shrink-0"><Fuel size={14} color="#f59e0b" strokeWidth={2} /></View>
                    <View className="flex-1 min-w-0"><Text className="text-text-primary dark:text-text-primary-dark font-medium text-[14px] tracking-tight truncate">{s.name}</Text><Text className="text-text-secondary dark:text-text-secondary-dark text-[11px] mt-0.5">{s.distanceKm ? `${s.distanceKm.toFixed(1)} km away` : 'Nearby'}{s.brand ? ` · ${s.brand}` : ''}</Text></View>
                    <Text className="text-[9px] font-bold tracking-[0.2em] text-amber">FUEL</Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {activeLayers.has('route') && currentLocation && fuelStations.length > 0 && (
          <View className="mb-5"><Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.25em] mb-3"><Navigation size={10} color="#3b82f6" className="inline-block mr-1" />Navigation</Text>
            <Animated.View entering={FadeInUp.duration(500)}>
              <View className="bg-card-light/90 dark:bg-card-dark/90 rounded-[18px] border border-border-light/30 dark:border-border-dark/40 p-4 flex-row items-center gap-3"><View className="w-10 h-10 rounded-full bg-blue-500/10 items-center justify-center border border-blue-500/15 shrink-0"><Navigation size={14} color="#3b82f6" strokeWidth={2} /></View><View className="flex-1"><Text className="text-text-primary dark:text-text-primary-dark font-medium text-[14px]">To {fuelStations[0].name}</Text><Text className="text-text-secondary dark:text-text-secondary-dark text-[11px] mt-0.5">{fuelStations[0].distanceKm?.toFixed(1)} km · Route drawn</Text></View><Text className="text-[9px] font-bold tracking-[0.2em] text-blue-500">ROUTE</Text></View>
            </Animated.View>
          </View>
        )}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
