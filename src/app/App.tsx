import { type MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { WeatherDetails } from './components/WeatherDetails';
import { WeatherSceneEffects } from './components/WeatherSceneEffects';
import { WeatherLoadingState, WeatherError, WeatherEmptyState } from './components/WeatherStates';
import { WeatherType, getWeatherIntensity, normalizeWeatherType } from './weather-utils';
import { geocodeCity, reverseGeocode } from './api/geocode';
import { fetchForecast, fetchAirQuality } from './api/openmeteo';
import { WeatherData, mapApiToWeatherData } from './api/mapper';
import { WeatherHeroCard, RecentCity } from './components/WeatherHeroCard';
import { WeeklyForecastCards } from './components/WeeklyForecastCards';
import { WeatherForecastChart } from './components/WeatherForecastChart';
import { SunriseSunset } from './components/SunriseSunset';
import { AirQuality } from './components/AirQuality';
import { RainChances } from './components/RainChances';

const backgroundGradients: Record<WeatherType, string> = {
  sunny: 'bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500',
  cloudy: 'bg-gradient-to-br from-slate-400 via-sky-300 to-blue-300',
  rainy: 'bg-gradient-to-br from-slate-700 via-blue-600 to-indigo-700',
  night: 'bg-gradient-to-br from-indigo-950 via-slate-900 to-zinc-950',
  thunderstorm: 'bg-gradient-to-br from-slate-800 via-indigo-800 to-slate-900',
  snowy: 'bg-gradient-to-br from-sky-100 via-slate-200 to-blue-300',
};

const atmospherePalette: Record<WeatherType, { glow: string; accent: string }> = {
  sunny: { glow: '255, 210, 94', accent: '255, 158, 49' },
  cloudy: { glow: '186, 212, 231', accent: '139, 172, 197' },
  rainy: { glow: '116, 160, 224', accent: '72, 122, 210' },
  night: { glow: '118, 130, 255', accent: '79, 95, 212' },
  thunderstorm: { glow: '154, 166, 255', accent: '111, 124, 223' },
  snowy: { glow: '230, 245, 255', accent: '154, 189, 224' },
};

export default function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true); // true while we wait for GPS on mount
  const [error, setError] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const appRef = useRef<HTMLDivElement>(null);
  const lastCityRef = useRef<string>('');
  const [recentCities, setRecentCities] = useState<RecentCity[]>([]);

  function addToRecent(prev: RecentCity[], entry: RecentCity): RecentCity[] {
    const filtered = prev.filter((c) => c.label !== entry.label);
    return [entry, ...filtered].slice(0, 3);
  }

  const loadWeather = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);
    lastCityRef.current = city;
    try {
      const geo = await geocodeCity(city);
      const [api, aq] = await Promise.all([
        fetchForecast(geo.latitude, geo.longitude),
        fetchAirQuality(geo.latitude, geo.longitude),
      ]);
      const data = mapApiToWeatherData(geo, api, aq);
      setWeather(data);
      setRecentCities((prev) =>
        addToRecent(prev, {
          label: geo.name,
          location: data.location,
          temperature: data.temperature,
          weatherType: data.weatherType,
          latitude: geo.latitude,
          longitude: geo.longitude,
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to fetch weather data.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadWeatherByCoords = useCallback(
    async (latitude: number, longitude: number) => {
      setLoading(true);
      setError(null);
      lastCityRef.current = `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
      try {
        const [geo, api, aq] = await Promise.all([
          reverseGeocode(latitude, longitude),
          fetchForecast(latitude, longitude),
          fetchAirQuality(latitude, longitude),
        ]);
        const data = mapApiToWeatherData(geo, api, aq);
        setWeather(data);
        setRecentCities((prev) =>
          addToRecent(prev, {
            label: data.location.split(',')[0],
            location: data.location,
            temperature: data.temperature,
            weatherType: data.weatherType,
            latitude,
            longitude,
          })
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to fetch weather data.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // On mount: request GPS, show empty state if denied (no city hardcoded)
  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        loadWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        // Permission denied or position unavailable — show empty/search state
        setLoading(false);
      },
      { timeout: 8000, maximumAge: 300_000 }
    );
  }, [loadWeatherByCoords]);

  const handleSearch = (city: string) => loadWeather(city);
  const handleCitySelect = (city: RecentCity) =>
    loadWeatherByCoords(city.latitude, city.longitude);

  const handleRetry = () => {
    const val = lastCityRef.current;
    if (!val) { handleGpsRequest(); return; }
    const coords = val.split(',');
    if (coords.length === 2 && !isNaN(Number(coords[0]))) {
      loadWeatherByCoords(Number(coords[0]), Number(coords[1]));
    } else {
      loadWeather(val);
    }
  };

  const handleGpsRequest = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        loadWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setGpsLoading(false);
        const messages: Record<number, string> = {
          1: 'Location access was denied. Please allow location in your browser settings.',
          2: 'Your location could not be determined.',
          3: 'Location request timed out.',
        };
        setError(messages[err.code] ?? 'Unable to get your location.');
      },
      { timeout: 10000, maximumAge: 60_000 }
    );
  }, [loadWeatherByCoords]);

  const visualWeatherType: WeatherType = weather
    ? normalizeWeatherType(weather.weatherType, weather.temperature, weather.condition)
    : 'cloudy';

  const effectIntensity = weather
    ? getWeatherIntensity({
        weatherType: visualWeatherType,
        temperature: weather.temperature,
        humidity: weather.humidity,
        windSpeed: weather.windSpeed,
        uvIndex: weather.uvIndex,
        condition: weather.condition,
      })
    : 0.4;

  useEffect(() => {
    const node = appRef.current;
    if (!node) {
      return;
    }
    node.style.setProperty('--weather-intensity', effectIntensity.toFixed(2));
    node.style.setProperty('--weather-glow-rgb', atmospherePalette[visualWeatherType].glow);
    node.style.setProperty('--weather-accent-rgb', atmospherePalette[visualWeatherType].accent);
  }, [effectIntensity, visualWeatherType]);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const node = appRef.current;
    if (!node) {
      return;
    }

    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    node.style.setProperty('--pointer-x', `${(x * 100).toFixed(2)}%`);
    node.style.setProperty('--pointer-y', `${(y * 100).toFixed(2)}%`);
    node.style.setProperty('--tilt-x', `${((x - 0.5) * 2).toFixed(3)}`);
    node.style.setProperty('--tilt-y', `${((y - 0.5) * 2).toFixed(3)}`);
  };

  const resetMousePosition = () => {
    const node = appRef.current;
    if (!node) {
      return;
    }

    node.style.setProperty('--pointer-x', '50%');
    node.style.setProperty('--pointer-y', '35%');
    node.style.setProperty('--tilt-x', '0');
    node.style.setProperty('--tilt-y', '0');
  };

  return (
    <div
      ref={appRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMousePosition}
      className={`interactive-weather-root relative h-screen overflow-hidden ${backgroundGradients[visualWeatherType]} transition-all duration-1000`}
    >
      <WeatherSceneEffects weatherType={visualWeatherType} intensity={effectIntensity} />

      <div className="relative h-full backdrop-blur-[2px] overflow-hidden">
        <div className="h-full p-3 xl:p-4 max-w-[1500px] mx-auto flex flex-col overflow-hidden">

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-2"
              >
                <WeatherError message={error} onRetry={handleRetry} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <WeatherLoadingState />
              </motion.div>
            ) : !weather ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <WeatherEmptyState onGpsRequest={handleGpsRequest} gpsLoading={gpsLoading} />
              </motion.div>
            ) : (
              <motion.div
                key={weather.location}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45 }}
                className="flex flex-col xl:flex-row gap-3 items-start flex-1 min-h-0"
              >
                {/* ── LEFT COLUMN ── */}
                <div className="w-full xl:w-[320px] 2xl:w-[350px] shrink-0 flex flex-col gap-3">
                  <WeatherHeroCard
                    location={weather.location}
                    temperature={weather.temperature}
                    condition={weather.condition}
                    weatherType={visualWeatherType}
                    humidity={weather.humidity}
                    windSpeed={weather.windSpeed}
                    uvIndex={weather.uvIndex}
                    precipitation={weather.precipitation}
                    onSearch={handleSearch}
                    onGpsRequest={handleGpsRequest}
                    loading={loading}
                    gpsLoading={gpsLoading}
                    recentCities={recentCities}
                    onCitySelect={handleCitySelect}
                  />
                  <WeatherDetails
                    humidity={weather.humidity}
                    windSpeed={weather.windSpeed}
                    pressure={weather.pressure}
                    uvIndex={weather.uvIndex}
                    visibility={weather.visibility}
                    precipitation={weather.precipitation}
                  />
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="flex-1 min-w-0 flex flex-col gap-3 h-full">
                  {/* Row 1: Weekly mini-cards */}
                  <WeeklyForecastCards weeklyData={weather.weeklyData} />

                  {/* Row 2: Forecast chart + Sunrise/Sunset */}
                  <div className="flex flex-col md:flex-row gap-3">
                    <WeatherForecastChart weeklyData={weather.weeklyData} />
                    <SunriseSunset sunrise={weather.sunrise} sunset={weather.sunset} />
                  </div>

                  {/* Row 3: Air Quality + Rain Chances */}
                  <div className="flex flex-col md:flex-row gap-3">
                    <AirQuality data={weather.airQuality} />
                    <RainChances weeklyData={weather.weeklyData} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-white/30 text-[11px] text-center py-1 mt-1 shrink-0">
            Powered by <span className="text-white/50">Open-Meteo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
