/**
 * Open-Meteo Forecast + WMO weather-code helpers — free, no API key required.
 * Docs: https://open-meteo.com/en/docs
 */

// ---------------------------------------------------------------------------
// WMO Weather Interpretation Codes
// ---------------------------------------------------------------------------

export interface WmoDescription {
  label: string;
  weatherType: 'sunny' | 'cloudy' | 'rainy' | 'night' | 'thunderstorm' | 'snowy';
}

/** Maps WMO code → human label + weather-type used by the UI */
export function interpretWmoCode(code: number, isNight = false): WmoDescription {
  if (code === 0) {
    return { label: isNight ? 'Clear Night' : 'Clear Sky', weatherType: isNight ? 'night' : 'sunny' };
  }
  if (code <= 2) {
    return { label: isNight ? 'Partly Cloudy' : 'Partly Cloudy', weatherType: isNight ? 'night' : 'cloudy' };
  }
  if (code === 3) return { label: 'Overcast', weatherType: 'cloudy' };
  if (code <= 49) return { label: 'Foggy', weatherType: 'cloudy' };
  if (code <= 59) return { label: 'Drizzle', weatherType: 'rainy' };
  if (code <= 67) return { label: 'Rain', weatherType: 'rainy' };
  if (code <= 77) return { label: 'Snow', weatherType: 'snowy' };
  if (code <= 82) return { label: 'Rain Showers', weatherType: 'rainy' };
  if (code <= 86) return { label: 'Snow Showers', weatherType: 'snowy' };
  if (code <= 99) return { label: 'Thunderstorm', weatherType: 'thunderstorm' };
  return { label: 'Unknown', weatherType: 'cloudy' };
}

// ---------------------------------------------------------------------------
// Raw API types
// ---------------------------------------------------------------------------

export interface CurrentWeatherRaw {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  wind_speed_10m: number;
  surface_pressure: number;
  weather_code: number;
  is_day: number;
  uv_index: number;
  visibility: number;
}

export interface HourlyRaw {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  wind_speed_10m: number[];
  weather_code: number[];
  is_day: number[];
}

export interface DailyRaw {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  precipitation_probability_max: number[];
  precipitation_sum: number[];
}

export interface ForecastApiResponse {
  current: CurrentWeatherRaw;
  hourly: HourlyRaw;
  daily: DailyRaw;
}

// ---------------------------------------------------------------------------
// Fetch
// ---------------------------------------------------------------------------

export async function fetchForecast(
  latitude: number,
  longitude: number
): Promise<ForecastApiResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toFixed(4),
    longitude: longitude.toFixed(4),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'wind_speed_10m',
      'surface_pressure',
      'weather_code',
      'is_day',
      'uv_index',
      'visibility',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'wind_speed_10m',
      'weather_code',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'precipitation_probability_max',
      'precipitation_sum',
    ].join(','),
    timezone: 'auto',
    forecast_days: '8',
  });

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params}`
  );

  if (!res.ok) {
    throw new Error(`Weather API request failed: ${res.status}`);
  }

  return res.json() as Promise<ForecastApiResponse>;
}

// ---------------------------------------------------------------------------
// Air Quality
// ---------------------------------------------------------------------------

export interface AirQualityRaw {
  current: {
    time: string;
    pm10: number;
    pm2_5: number;
    carbon_monoxide: number;
    nitrogen_dioxide: number;
    sulphur_dioxide: number;
    ozone: number;
    european_aqi: number;
  };
}

export async function fetchAirQuality(
  latitude: number,
  longitude: number
): Promise<AirQualityRaw | null> {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toFixed(4),
      longitude: longitude.toFixed(4),
      current: [
        'pm10',
        'pm2_5',
        'carbon_monoxide',
        'nitrogen_dioxide',
        'sulphur_dioxide',
        'ozone',
        'european_aqi',
      ].join(','),
    });
    const res = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?${params}`
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
