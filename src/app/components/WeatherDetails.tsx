import { CloudRain, Droplets, Eye, Gauge, Sun, Wind } from 'lucide-react';
import { motion } from 'motion/react';

interface WeatherDetailsProps {
  humidity: number;
  windSpeed: number;
  pressure: number;
  uvIndex: number;
  visibility: number;
  precipitation: number;
}

export function WeatherDetails({
  humidity,
  windSpeed,
  pressure,
  uvIndex,
  visibility,
  precipitation,
}: WeatherDetailsProps) {
  const details = [
    { icon: Droplets, label: 'Humidity', value: `${humidity}%`, color: 'text-blue-300' },
    { icon: Wind, label: 'Wind Speed', value: `${windSpeed} km/h`, color: 'text-cyan-300' },
    { icon: Gauge, label: 'Pressure', value: `${pressure} mb`, color: 'text-purple-300' },
    { icon: Sun, label: 'UV Index', value: uvIndex.toString(), color: 'text-yellow-300' },
    { icon: Eye, label: 'Visibility', value: `${visibility} km`, color: 'text-indigo-300' },
    { icon: CloudRain, label: 'Precipitation', value: `${precipitation} mm`, color: 'text-blue-400' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {details.map((detail, index) => (
        <motion.div
          key={detail.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          className="group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300" />
          <div className="weather-card relative bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-xl">
            <detail.icon className={`${detail.color} mb-2`} size={18} />
            <div className="text-white/50 text-xs mb-0.5">{detail.label}</div>
            <div className="text-white text-lg font-light">{detail.value}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
