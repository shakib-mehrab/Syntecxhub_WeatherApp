import { motion } from 'motion/react';
import { WeatherIcon } from './WeatherIcon';
import { WeatherType } from '../weather-utils';

interface DailyData {
  day: string;
  weatherType: WeatherType;
  high: number;
  low: number;
}

interface WeeklyForecastProps {
  weeklyData: DailyData[];
}

export function WeeklyForecast({ weeklyData }: WeeklyForecastProps) {
  return (
    <div>
      <h3 className="text-white text-xl mb-6">7-Day Forecast</h3>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl blur-xl" />
        <div className="weather-panel relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="space-y-3">
            {weeklyData.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ x: 4 }}
                className="weather-card flex items-center justify-between p-4 rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-white min-w-[100px]">{day.day}</div>
                <div className="flex items-center gap-6 flex-1 justify-center">
                  <WeatherIcon weatherType={day.weatherType} size={28} />
                </div>
                <div className="flex items-center gap-4 min-w-[100px] justify-end">
                  <span className="text-white">{day.high}°</span>
                  <span className="text-white/50">{day.low}°</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
