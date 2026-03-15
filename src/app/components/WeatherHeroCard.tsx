import { Loader2, LocateFixed, MapPin, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { WeatherType } from '../weather-utils';
import { WeatherIcon } from './WeatherIcon';

export interface RecentCity {
  label: string;
  location: string;
  temperature: number;
  weatherType: WeatherType;
  latitude: number;
  longitude: number;
}

interface MetricDot {
  value: number;
  max: number;
  label: string;
}

function dotColor(value: number, max: number): string {
  const r = value / max;
  if (r > 0.7) return '#f97316';
  if (r > 0.4) return '#3b82f6';
  return '#94a3b8';
}

interface WeatherHeroCardProps {
  location: string;
  temperature: number;
  condition: string;
  weatherType: WeatherType;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  precipitation: number;
  onSearch: (city: string) => void;
  onGpsRequest?: () => void;
  loading?: boolean;
  gpsLoading?: boolean;
  recentCities: RecentCity[];
  onCitySelect: (city: RecentCity) => void;
}

export function WeatherHeroCard({
  location,
  temperature,
  condition,
  weatherType,
  humidity,
  windSpeed,
  uvIndex,
  precipitation,
  onSearch,
  onGpsRequest,
  loading = false,
  gpsLoading = false,
  recentCities,
  onCitySelect,
}: WeatherHeroCardProps) {
  const [city, setCity] = useState('');
  const busy = loading || gpsLoading;
  const cityName = location.split(',')[0] ?? location;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim() && !busy) {
      onSearch(city.trim());
      setCity('');
    }
  };

  const metrics: MetricDot[] = [
    { value: humidity, max: 100, label: 'Humidity' },
    { value: windSpeed, max: 60, label: 'Wind' },
    { value: uvIndex, max: 11, label: 'UV Index' },
    { value: precipitation, max: 20, label: 'Rain' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl"
    >
      {/* Subtle top gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative p-3.5 flex flex-col gap-2.5">
        {/* Search bar */}
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 bg-white/10 rounded-xl border border-white/20 px-3 py-2 focus-within:border-white/40 transition-colors">
            {loading ? (
              <Loader2 size={17} className="text-white/60 animate-spin shrink-0" />
            ) : (
              <Search size={17} className="text-white/60 shrink-0" />
            )}
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search any city..."
              disabled={busy}
              className="flex-1 bg-transparent text-white placeholder:text-white/40 text-sm focus:outline-none disabled:opacity-60"
            />
            {onGpsRequest && (
              <button
                type="button"
                onClick={onGpsRequest}
                disabled={busy}
                title="Use my current location"
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all disabled:opacity-40"
              >
                {gpsLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <LocateFixed size={14} />
                )}
              </button>
            )}
          </div>
        </form>

        {/* Location row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white/70">
            <MapPin size={14} />
            <span className="text-xs font-medium truncate max-w-[165px]">{location}</span>
          </div>
          <span className="text-white/40 text-xs">Live</span>
        </div>

        {/* Icon + temp row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-white text-5xl font-thin tracking-tight leading-none">
              {temperature}°
            </span>
            <span className="text-white/60 text-xs mt-1">{condition}</span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Metric indicator dots */}
            <div className="flex flex-col items-center gap-1.5">
              {metrics.map((m) => (
                <motion.div
                  key={m.label}
                  title={`${m.label}: ${m.value}`}
                  whileHover={{ scale: 1.4 }}
                  className="w-2.5 h-2.5 rounded-full cursor-default"
                  style={{ background: dotColor(m.value, m.max) }}
                />
              ))}
            </div>

            <WeatherIcon weatherType={weatherType} size={58} />
          </div>
        </div>

        {/* Recent city tabs */}
        {recentCities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {recentCities.map((rc) => {
              const isActive = rc.label === cityName;
              return (
                <button
                  key={rc.label}
                  onClick={() => onCitySelect(rc)}
                  className={`flex flex-col items-start px-2.5 py-1.5 rounded-lg border text-[10px] transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/15 hover:text-white/80'
                  }`}
                >
                  <span className="font-medium">{rc.label}</span>
                  <span className="opacity-70">{rc.temperature}°C</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
