import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Fuel, Wrench, Car, Route, MapPin } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { getCurrentLocation, fetchNearbyStations, FuelStation } from '@/lib/gps/locationService';
import { useTheme } from '@/lib/stores/themeStore';
import { useUserDataStore } from '@/lib/stores/userDataStore';

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('window');
const MAP_HEIGHT = SCREEN_H * 0.52;

type Layer = 'fuel' | 'service' | 'parking' | 'history';
const LAYERS: { id: Layer; label: string; Icon: React.ElementType }[] = [
  { id: 'fuel',     label: 'Fuel',     Icon: Fuel  },
  { id: 'service',  label: 'Service',  Icon: Wrench },
  { id: 'parking', label: 'Parking',  Icon: Car   },
  { id: 'history', label: 'History',  Icon: Route },
];

export default function MapsScreen() {
  const { isDark } = useTheme();
  const { fuelLogs } = useUserDataStore();
  const [activeLayers, setActiveLayers] = useState<Set<Layer>>(new Set(['fuel']));
  const [fuelStations, setFuelStations] = useState<FuelStation[]>([]);
  const [loadingStations, setLoadingStations] = useState(false);

  // Fetch fuel stations when layer is active
  useEffect(() => {
    if (!activeLayers.has('fuel')) return;
    let mounted = true;
    (async () => {
      try {
        setLoadingStations(true);
        const coords = await getCurrentLocation();
        const nearby = await fetchNearbyStations(coords, 8, 15);
        if (mounted) setFuelStations(nearby);
      } catch (e: any) {
        if (mounted) console.warn('Fuel stations failed:', e?.message);
      } finally {
        if (mounted) setLoadingStations(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const toggleLayer = (layer: Layer) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return next;
    });
  };

  const isHistoryActive = activeLayers.has('history');
  const mapBgGradient: [string, string, string] = isDark
    ? (isHistoryActive ? ['#06060f', '#0f172a', '#1a1330'] : ['#06060f', '#0d1117', '#13131f'])
    : ['#e8e9f0', '#d5d8e4', '#f0f1f6'];

  const markers: { id: string; name: string; layer: Layer; dist?: string }[] = [];

  if (activeLayers.has('fuel')) {
    fuelStations.forEach((s) => {
      markers.push({ id: `fuel-${s.id}`, name: s.name, layer: 'fuel', dist: s.distanceKm ? `${s.distanceKm.toFixed(1)} km` : undefined });
    });
  }
  if (activeLayers.has('history')) {
    fuelLogs.slice(0, 5).forEach((log, i) => {
      markers.push({ id: `hist-${log.id}`, name: `Fuel #${fuelLogs.length - i}`, layer: 'history' });
    });
  }
  if (activeLayers.has('service')) {
    markers.push({ id: 'svc-demo-1', name: 'MotoService Pro', layer: 'service', dist: '1.8 km' });
    markers.push({ id: 'svc-demo-2', name: 'QuickFix Garage', layer: 'service', dist: '3.2 km' });
  }
  if (activeLayers.has('parking')) {
    markers.push({ id: 'park-demo-1', name: 'Secure Parking', layer: 'parking', dist: '0.5 km' });
    markers.push({ id: 'park-demo-2', name: 'City Garage', layer: 'parking', dist: '2.1 km' });
  }

  const layerColor: Record<Layer, string> = {
    fuel:    '#f59e0b',
    service: '#10b981',
    parking: '#8b7cf6',
    history: '#f97316',
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas-light dark:bg-canvas-dark">
      {/* ── Map area ── */}
      <View className="mx-5 mt-4 rounded-[24px] overflow-hidden shadow-[0_4px_30px_rgba(139,124,246,0.15)]" style={{ height: MAP_HEIGHT }}>
        <LinearGradient colors={mapBgGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />

        {/* Small header pill — top left */}
        <View className="absolute top-4 left-5 z-30">
          <View className="bg-card-light/85 dark:bg-card-dark/85 rounded-xl border border-border-light/40 dark:border-border-dark/40 px-3 py-2 backdrop-blur-md">
            <Text className="text-text-primary dark:text-text-primary-dark text-sm font-light tracking-tight">Map</Text>
            <Text className="text-text-secondary dark:text-text-secondary-dark text-[9px] mt-0.5 font-medium tracking-wide">{markers.length} point{markers.length === 1 ? '' : 's'}</Text>
          </View>
        </View>

        {/* Layer toggle chips — top right */}
        <View className="absolute top-4 right-5 z-30">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {LAYERS.map(({ id, label, Icon }) => {
                const active = activeLayers.has(id);
                return (
                  <TouchableOpacity
                    key={id}
                    activeOpacity={0.8}
                    onPress={() => toggleLayer(id)}
                    data-cy={`maps-layer-${id}`}
                  >
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

        {/* Marker pins on map */}
        <View className="absolute inset-0 px-6 pt-32 pointer-events-none">
          {markers.map((m, i) => (
            <Animated.View
              key={m.id}
              entering={FadeInUp.duration(400).delay(100 + i * 60)}
              className="absolute z-20"
              style={{
                top: 10 + (i % 4) * 58,
                left: 16 + (i % 3) * ((SCREEN_W - 72) / 3),
              }}
            >
              <View className={`flex-row items-center gap-1.5 bg-card-light/90 dark:bg-card-dark/90 border border-border-light/40 dark:border-border-dark/40 rounded-full px-3 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.25)] backdrop-blur-sm`}>
                <MapPin size={11} color={layerColor[m.layer]} strokeWidth={2.5} />
                <Text className="text-text-primary dark:text-text-primary-dark text-[10px] font-semibold tracking-tight">{m.name}</Text>
                {m.dist && <Text className="text-text-secondary dark:text-text-secondary-dark text-[9px]">{m.dist}</Text>}
              </View>
            </Animated.View>
          ))}
          {loadingStations && (
            <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
              <View className="bg-card-light/90 dark:bg-card-dark/90 rounded-2xl px-5 py-3 backdrop-blur-md">
                <ActivityIndicator size="small" color="#8b7cf6" />
                <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] mt-1.5">Loading stations…</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* ── Bottom detail cards ── */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5 -mt-3" style={{ zIndex: 5 }}>
        <View className="mt-4 mb-2">
          <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.3em] mb-4">
            {activeLayers.size === 0 ? 'Select a layer above' : `${activeLayers.size} ${activeLayers.size === 1 ? 'layer' : 'layers'} active`}
          </Text>
        </View>

        {activeLayers.size === 0 && (
          <View className="py-8 items-center" data-cy="maps-empty-hint">
            <Text className="text-text-secondary dark:text-text-secondary-dark text-sm font-light">Tap a layer above to see points on the map.</Text>
          </View>
        )}

        {/* Fuel stations */}
        {activeLayers.has('fuel') && fuelStations.length > 0 && (
          <View className="mb-5">
            <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.25em] mb-3">
              <Fuel size={10} color="#f59e0b" className="inline-block mr-1" />Fuel Stations
            </Text>
            {fuelStations.slice(0, 5).map((s) => (
              <TouchableOpacity key={s.id} activeOpacity={0.85} className="mb-3" data-cy={`maps-fuel-${s.id}`}>
                <Animated.View entering={FadeInUp.duration(500)}>
                  <View className="bg-card-light/90 dark:bg-card-dark/90 rounded-[18px] border border-border-light/30 dark:border-border-dark/40 p-4 flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-amber/10 items-center justify-center border border-amber/15 shrink-0">
                      <Fuel size={14} color="#f59e0b" strokeWidth={2} />
                    </View>
                    <View className="flex-1 min-w-0">
                      <Text className="text-text-primary dark:text-text-primary-dark font-medium text-[14px] tracking-tight truncate">{s.name}</Text>
                      <Text className="text-text-secondary dark:text-text-secondary-dark text-[11px] mt-0.5">
                        {s.distanceKm ? `${s.distanceKm.toFixed(1)} km away` : 'Nearby'}
                        {s.brand ? ` · ${s.brand}` : ''}
                      </Text>
                    </View>
                    <Text className="text-[9px] font-bold tracking-[0.2em] text-amber">FUEL</Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Service centers */}
        {activeLayers.has('service') && (
          <View className="mb-5">
            <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.25em] mb-3">
              <Wrench size={10} color="#10b981" className="inline-block mr-1" />Service Centers
            </Text>
            {[
              { id: 'svc-demo-1', name: 'MotoService Pro', dist: '1.8 km', type: 'Full service' },
              { id: 'svc-demo-2', name: 'QuickFix Garage', dist: '3.2 km', type: 'Repairs & tires' },
            ].map((s) => (
              <TouchableOpacity key={s.id} activeOpacity={0.85} className="mb-3" data-cy={`maps-svc-${s.id}`}>
                <Animated.View entering={FadeInUp.duration(500)}>
                  <View className="bg-card-light/90 dark:bg-card-dark/90 rounded-[18px] border border-border-light/30 dark:border-border-dark/40 p-4 flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-emerald/10 items-center justify-center border border-emerald/15 shrink-0">
                      <Wrench size={14} color="#10b981" strokeWidth={2} />
                    </View>
                    <View className="flex-1 min-w-0">
                      <Text className="text-text-primary dark:text-text-primary-dark font-medium text-[14px] tracking-tight truncate">{s.name}</Text>
                      <Text className="text-text-secondary dark:text-text-secondary-dark text-[11px] mt-0.5">{s.dist} · {s.type}</Text>
                    </View>
                    <Text className="text-[9px] font-bold tracking-[0.2em] text-emerald">SVC</Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Parking */}
        {activeLayers.has('parking') && (
          <View className="mb-5">
            <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.25em] mb-3">
              <Car size={10} color="#8b7cf6" className="inline-block mr-1" />Parking
            </Text>
            {[
              { id: 'park-demo-1', name: 'Secure Parking', dist: '0.5 km', type: 'Covered' },
              { id: 'park-demo-2', name: 'City Garage', dist: '2.1 km', type: 'Open' },
            ].map((s) => (
              <TouchableOpacity key={s.id} activeOpacity={0.85} className="mb-3" data-cy={`maps-park-${s.id}`}>
                <Animated.View entering={FadeInUp.duration(500)}>
                  <View className="bg-card-light/90 dark:bg-card-dark/90 rounded-[18px] border border-border-light/30 dark:border-border-dark/40 p-4 flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-violet/10 items-center justify-center border border-violet/15 shrink-0">
                      <Car size={14} color="#8b7cf6" strokeWidth={2} />
                    </View>
                    <View className="flex-1 min-w-0">
                      <Text className="text-text-primary dark:text-text-primary-dark font-medium text-[14px] tracking-tight truncate">{s.name}</Text>
                      <Text className="text-text-secondary dark:text-text-secondary-dark text-[11px] mt-0.5">{s.dist} · {s.type}</Text>
                    </View>
                    <Text className="text-[9px] font-bold tracking-[0.2em] text-violet">PRK</Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* History */}
        {activeLayers.has('history') && fuelLogs.length > 0 && (
          <View className="mb-6">
            <Text className="text-text-secondary dark:text-text-secondary-dark text-[10px] font-semibold uppercase tracking-[0.25em] mb-3">
              <Route size={10} color="#f97316" className="inline-block mr-1" />Ride History
            </Text>
            {fuelLogs.slice(0, 5).map((log, i) => (
              <TouchableOpacity key={log.id} activeOpacity={0.85} className="mb-3" data-cy={`maps-hist-${log.id}`}>
                <Animated.View entering={FadeInUp.duration(500)}>
                  <View className="bg-card-light/90 dark:bg-card-dark/90 rounded-[18px] border border-border-light/30 dark:border-border-dark/40 p-4 flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-orange/10 items-center justify-center border border-orange/15 shrink-0">
                      <Route size={14} color="#f97316" strokeWidth={2} />
                    </View>
                    <View className="flex-1 min-w-0">
                      <Text className="text-text-primary dark:text-text-primary-dark font-medium text-[14px] tracking-tight">Fuel #{fuelLogs.length - i}</Text>
                      <Text className="text-text-secondary dark:text-text-secondary-dark text-[11px] mt-0.5">
                        {log.odometer.toLocaleString()} km · {log.liters} L
                      </Text>
                    </View>
                    <Text className="text-[9px] font-bold tracking-[0.2em] text-orange">HIST</Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeLayers.has('history') && fuelLogs.length === 0 && (
          <View className="py-6 items-center mb-4">
            <Text className="text-text-secondary dark:text-text-secondary-dark text-xs">No ride history yet. Log fuel to see your routes.</Text>
          </View>
        )}

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
