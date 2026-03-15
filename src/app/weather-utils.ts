export type WeatherType =
  | 'sunny'
  | 'cloudy'
  | 'rainy'
  | 'night'
  | 'thunderstorm'
  | 'snowy';

interface WeatherSignalInput {
  weatherType: WeatherType;
  temperature: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  condition: string;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function normalizeWeatherType(
  weatherType: WeatherType,
  temperature: number,
  condition: string
): WeatherType {
  const normalizedCondition = condition.toLowerCase();
  const shouldSnow =
    normalizedCondition.includes('snow') ||
    (temperature <= 2 && (weatherType === 'rainy' || weatherType === 'cloudy'));

  if (shouldSnow) {
    return 'snowy';
  }

  return weatherType;
}

export function getWeatherIntensity(input: WeatherSignalInput): number {
  const normalizedType = normalizeWeatherType(input.weatherType, input.temperature, input.condition);
  const heatFactor = clamp((input.temperature - 12) / 26);
  const coldFactor = clamp((8 - input.temperature) / 18);
  const humidityFactor = clamp(input.humidity / 100);
  const windFactor = clamp(input.windSpeed / 40);
  const uvFactor = clamp(input.uvIndex / 11);

  const map: Record<WeatherType, number> = {
    sunny: 0.35 + heatFactor * 0.35 + uvFactor * 0.3,
    cloudy: 0.25 + humidityFactor * 0.25 + windFactor * 0.2,
    rainy: 0.35 + humidityFactor * 0.35 + windFactor * 0.3,
    night: 0.2 + windFactor * 0.15,
    thunderstorm: 0.5 + humidityFactor * 0.2 + windFactor * 0.3,
    snowy: 0.3 + coldFactor * 0.4 + humidityFactor * 0.3,
  };

  return clamp(map[normalizedType], 0.2, 1);
}