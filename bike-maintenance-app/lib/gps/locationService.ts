import * as Location from 'expo-location';

export interface GpsCoords {
  latitude: number;
  longitude: number;
}

/** Request foreground location permission. Returns true if granted. */
export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

/** Get current location (foreground). Throws on failure or denied. */
export async function getCurrentLocation(): Promise<GpsCoords> {
  const granted = await requestLocationPermission();
  if (!granted) throw new Error('Location permission denied');

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
}

/**
 * Calculate distance in km between two coordinates using Haversine formula.
 */
export function haversineDistance(from: GpsCoords, to: GpsCoords): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const lat1 = toRad(from.latitude);
  const lat2 = toRad(to.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// ── Overpass API — Fuel Stations ─────────────────────────────────────────────

export interface FuelStation {
  id: string;
  name: string;
  brand?: string;
  address?: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
}

interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

/** Fetch real fuel stations near a coordinate using OpenStreetMap Overpass API.
 *  Returns up to `limit` stations within `radiusKm`, sorted by distance.
 */
export async function fetchNearbyStations(
  coords: GpsCoords,
  radiusKm = 5,
  limit = 20
): Promise<FuelStation[]> {
  const overpassUrl = 'https://overpass-api.de/api/interpreter';
  const radiusM = Math.round(radiusKm * 1000);

  // Overpass QL: nodes tagged amenity=fuel within radius of lat,lon
  const query = `
    [out:json][timeout:25];
    node["amenity"="fuel"](around:${radiusM},${coords.latitude},${coords.longitude});
    out body;
  `.trim();

  let response: Response;
  try {
    response = await fetch(overpassUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
    });
  } catch {
    throw new Error('Network error — check your connection.');
  }

  if (!response.ok) {
    throw new Error(`Overpass API error ${response.status}`);
  }

  const json = await response.json() as { elements: OverpassElement[] };
  const result: FuelStation[] = [];
  for (const el of json.elements) {
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (!lat || !lon) continue;

    const tags = el.tags ?? {};
    const name = tags.name ?? tags.brand ?? tags.operator ?? 'Fuel Station';
    const brand = tags.brand ?? tags.operator;

    result.push({
      id: String(el.id),
      name,
      brand,
      address: [tags['addr:street'], tags['addr:housenumber'], tags['addr:city']]
        .filter(Boolean)
        .join(' '),
      latitude: lat,
      longitude: lon,
      distanceKm: haversineDistance(coords, { latitude: lat, longitude: lon }),
    });
  }

  return result
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

/** Get the latest odometer reading from stored data.
 *  Priority: last FuelLog → last ServiceLog → last Vehicle current_odometer.
 *  Returns null if no data available.
 */
export function getLatestOdometer(vehicles: { current_odometer?: number | null }[], logs: { odometer: number }[]): number | null {
  if (logs.length > 0) {
    return Math.max(...logs.map((l) => l.odometer));
  }
  if (vehicles.length > 0) {
    return Math.max(
      ...vehicles.map((v) => v.current_odometer ?? 0).filter(Boolean)
    );
  }
  return null;
}
