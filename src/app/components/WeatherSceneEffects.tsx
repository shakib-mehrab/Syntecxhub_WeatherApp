import { motion } from 'motion/react';
import { WeatherType } from '../weather-utils';

interface WeatherSceneEffectsProps {
  weatherType: WeatherType;
  intensity: number;
}

export function WeatherSceneEffects({ weatherType, intensity }: WeatherSceneEffectsProps) {
  const rainCount = Math.max(16, Math.floor(18 + intensity * 70));
  const snowCount = Math.max(14, Math.floor(12 + intensity * 55));
  const sparkCount = Math.max(6, Math.floor(8 + intensity * 16));
  const intensityClass = `weather-intensity-${Math.min(4, Math.max(1, Math.round(intensity * 4)))}`;

  const rainDrops = Array.from({ length: rainCount }, (_, index) => `rain-${index}`);
  const snowFlakes = Array.from({ length: snowCount }, (_, index) => `snow-${index}`);
  const sunlightSparks = Array.from({ length: sparkCount }, (_, index) => `spark-${index}`);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {(weatherType === 'sunny' || weatherType === 'cloudy') && (
        <div className="weather-sun-glow" aria-hidden="true" />
      )}

      {(weatherType === 'rainy' || weatherType === 'thunderstorm') && (
        <div className={`weather-rain-layer ${intensityClass}`}>
          {rainDrops.map((drop) => (
            <span key={drop} className="weather-rain-drop" />
          ))}
        </div>
      )}

      {weatherType === 'snowy' && (
        <div className={`weather-snow-layer ${intensityClass}`}>
          {snowFlakes.map((flake) => (
            <span key={flake} className="weather-snow-flake" />
          ))}
        </div>
      )}

      {weatherType === 'sunny' && (
        <div className={`weather-spark-layer ${intensityClass}`}>
          {sunlightSparks.map((spark) => (
            <span key={spark} className="weather-sun-spark" />
          ))}
        </div>
      )}

      {weatherType === 'thunderstorm' && (
        <motion.div
          className="weather-lightning-flash"
          animate={{ opacity: [0, 0, 0.7 * intensity, 0, 0.35 * intensity, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, repeatDelay: 1.4 }}
        />
      )}

      <div className="weather-vignette" aria-hidden="true" />
    </div>
  );
}