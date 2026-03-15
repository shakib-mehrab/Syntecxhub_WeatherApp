import { motion } from 'motion/react';
import { WeatherIcon } from './WeatherIcon';
import { WeatherType } from '../weather-utils';

interface HourlyData {
  hour: string;
  temperature: number;
  weatherType: WeatherType;
}

interface HourlyForecastProps {
  hourlyData: HourlyData[];
}

export function HourlyForecast({ hourlyData }: HourlyForecastProps) {
  return (
    <div>
      <h3 className="text-white text-xl mb-6">Hourly Forecast</h3>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl blur-xl" />
        <div className="weather-panel relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {hourlyData.map((hour, index) => (
              <motion.div
                key={hour.hour}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ y: -4 }}
                className="weather-card flex-shrink-0 flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-white/10 transition-all duration-300 min-w-[80px]"
              >
                <div className="text-white/60 text-sm">{hour.hour}</div>
                <WeatherIcon weatherType={hour.weatherType} size={32} />
                <div className="text-white text-lg">{hour.temperature}°</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
