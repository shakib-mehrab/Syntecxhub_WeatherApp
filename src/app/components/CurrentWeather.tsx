import { MapPin, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { WeatherIcon } from './WeatherIcon';
import { WeatherType } from '../weather-utils';

interface CurrentWeatherProps {
  location: string;
  temperature: number;
  condition: string;
  weatherType: WeatherType;
  date: string;
  time: string;
}

export function CurrentWeather({
  location,
  temperature,
  condition,
  weatherType,
  date,
  time
}: CurrentWeatherProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -4 }}
      className="weather-panel weather-hero text-center w-full max-w-3xl rounded-3xl border border-white/20 bg-white/8 backdrop-blur-xl px-6 py-8 md:px-10"
    >
      <div className="mb-6 flex items-center justify-center gap-2 text-white/90">
        <MapPin size={18} />
        <span className="text-lg">{location}</span>
      </div>

      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <WeatherIcon weatherType={weatherType} size={120} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-4"
      >
        <div className="text-8xl font-extralight text-white mb-2">
          {temperature}°
        </div>
        <div className="text-2xl text-white/80">{condition}</div>
      </motion.div>

      <div className="flex items-center justify-center gap-2 text-white/60">
        <Calendar size={16} />
        <span>{date} • {time}</span>
      </div>
    </motion.div>
  );
}
