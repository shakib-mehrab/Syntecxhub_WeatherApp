/**
 * Transforms raw Open-Meteo API responses into the WeatherData shape used by the UI.
 */

import { WeatherType } from '../weather-utils';
import { ForecastApiResponse, interpretWmoCode } from './openmeteo';
import { ForecastApiResponse, interpretWmoCode, AirQualityRaw } from './openmeteo';
import { GeoLocation } from './geocode';

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  weatherType: WeatherType;
  humidity: number;
  windSpeed: number;
  pressure: number;
  uvIndex: number;
  visibility: number;
  feelsLike: number;
  sunrise: string;
  sunset: string;
  precipitation: number;
  hourlyData: Array<{
    hour: string;
    temperature: number;
    weatherType: WeatherType;
  }>;
  weeklyData: Array<{
    day: string;
    weatherType: WeatherType;
    high: number;
    low: number;
    precipitationProbability: number;
  }>;
  airQuality?: {
    aqi: number;
    label: string;
    color: string;
    pm10: number;
    pm2_5: number;
    o3: number;
    so2: number;
    co: number;
    no2: number;
  };
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_NAMES_LONG = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

function formatHour(isoTime: string): string {
  const date = new Date(isoTime);
  const h = date.getHours();
  if (h === 0) return '12 AM';
  if (h < 12) return `${h} AM`;
  if (h === 12) return '12 PM';
  return `${h - 12} PM`;
}

export function mapApiToWeatherData(
  geo: GeoLocation,
  api: ForecastApiResponse,
  aq?: AirQualityRaw | null
): WeatherData {
  const { current, hourly, daily } = api;

  const isNight = current.is_day === 0;
  const currentDesc = interpretWmoCode(current.weather_code, isNight);

  const locationLabel = [
    geo.name,
    geo.admin1 ?? geo.country,
  ]
    .filter(Boolean)
    .join(', ');

  // Find the hourly index closest to right now for the next 24 hours
  const nowIso = current.time;
  const nowIndex = hourly.time.findIndex((t) => t >= nowIso);
  const startIndex = nowIndex >= 0 ? nowIndex : 0;
  const hourlySlice = hourly.time
    .slice(startIndex, startIndex + 24)
    .map((t, i) => {
      const idx = startIndex + i;
      const code = hourly.weather_code[idx] ?? 0;
      const night = (hourly.is_day?.[idx] ?? 1) === 0;
      const desc = interpretWmoCode(code, night);
      return {
        hour: formatHour(t),
        temperature: Math.round(hourly.temperature_2m[idx] ?? 0),
        weatherType: desc.weatherType,
      };
    });

  // Skip today (index 0) so weekly shows days ahead; use up to 7 days
  const weeklySlice = daily.time.slice(1, 8).map((t, i) => {
    const idx = i + 1;
    const code = daily.weather_code[idx] ?? 0;
    const desc = interpretWmoCode(code, false);
    const dayName = DAY_NAMES_LONG[new Date(t).getDay()] ?? DAY_NAMES[new Date(t).getDay()];
    return {
      day: dayName,
      weatherType: desc.weatherType,
      high: Math.round(daily.temperature_2m_max[idx] ?? 0),
      low: Math.round(daily.temperature_2m_min[idx] ?? 0),
      precipitationProbability: Math.round(daily.precipitation_probability_max?.[idx] ?? 0),
    };
  });

  function aqiLabel(aqi: number): string {
    if (aqi <= 20) return 'Excellent';
    if (aqi <= 40) return 'Good';
    if (aqi <= 60) return 'Moderate';
    if (aqi <= 80) return 'Poor';
    if (aqi <= 100) return 'Very Poor';
    return 'Hazardous';
  }

  function aqiColor(aqi: number): string {
    if (aqi <= 20) return '#22c55e';
    if (aqi <= 40) return '#84cc16';
    if (aqi <= 60) return '#facc15';
    if (aqi <= 80) return '#fb923c';
    if (aqi <= 100) return '#ef4444';
    return '#a855f7';
  }

  const airQuality = aq
    ? {
        aqi: Math.round(aq.current.european_aqi ?? 0),
        label: aqiLabel(aq.current.european_aqi ?? 0),
        color: aqiColor(aq.current.european_aqi ?? 0),
        pm10: Math.round(aq.current.pm10 ?? 0),
        pm2_5: Number((aq.current.pm2_5 ?? 0).toFixed(1)),
        o3: Math.round(aq.current.ozone ?? 0),
        so2: Math.round(aq.current.sulphur_dioxide ?? 0),
        co: Math.round(aq.current.carbon_monoxide ?? 0),
        no2: Math.round(aq.current.nitrogen_dioxide ?? 0),
      }
    : undefined;

  return {
    location: locationLabel,
    temperature: Math.round(current.temperature_2m),
    condition: currentDesc.label,
    weatherType: currentDesc.weatherType,
    humidity: Math.round(current.relative_humidity_2m),
    windSpeed: Math.round(current.wind_speed_10m),
    pressure: Math.round(current.surface_pressure),
    uvIndex: Math.round(current.uv_index),
    visibility: Math.round((current.visibility ?? 10000) / 1000),
    feelsLike: Math.round(current.apparent_temperature),
    sunrise: daily.sunrise?.[0] ?? '',
    sunset: daily.sunset?.[0] ?? '',
    precipitation: Number((daily.precipitation_sum?.[0] ?? 0).toFixed(2)),
    hourlyData: hourlySlice,
    weeklyData: weeklySlice,
    airQuality,
  };
}
