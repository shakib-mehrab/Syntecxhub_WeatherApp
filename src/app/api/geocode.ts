/** Open-Meteo Geocoding API — free, no key required */

export interface GeoLocation {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

interface GeocodeResult {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

/** BigDataCloud reverse geocode — free, no key required */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<GeoLocation> {
  const params = new URLSearchParams({
    latitude: latitude.toFixed(5),
    longitude: longitude.toFixed(5),
    localityLanguage: 'en',
  });

  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?${params}`
  );

  if (!res.ok) {
    throw new Error(`Reverse geocoding failed: ${res.status}`);
  }

  const data = await res.json();

  const name: string =
    data.city ||
    data.locality ||
    data.principalSubdivision ||
    data.countryName ||
    'Unknown location';

  return {
    name,
    country: data.countryName ?? '',
    admin1: data.principalSubdivision,
    latitude,
    longitude,
  };
}

export async function geocodeCity(city: string): Promise<GeoLocation> {
  const params = new URLSearchParams({
    name: city,
    count: '1',
    language: 'en',
    format: 'json',
  });

  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params}`
  );

  if (!res.ok) {
    throw new Error(`Geocoding request failed: ${res.status}`);
  }

  const data = await res.json();
  const results: GeocodeResult[] = data.results ?? [];

  if (!results.length) {
    throw new Error(`City not found: "${city}"`);
  }

  const r = results[0];
  return {
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
  };
}
