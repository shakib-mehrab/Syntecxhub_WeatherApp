import { motion } from 'motion/react';
import { WeatherType } from '../weather-utils';
import { WeatherIcon } from './WeatherIcon';

interface WeeklyDay {
  day: string;
  weatherType: WeatherType;
  high: number;
  low: number;
  precipitationProbability: number;
}

interface WeeklyForecastCardsProps {
  weeklyData: WeeklyDay[];
}

export function WeeklyForecastCards({ weeklyData }: WeeklyForecastCardsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-2.5"
    >
      <div className="grid grid-cols-7 gap-1.5">
        {weeklyData.map((day, i) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="flex flex-col items-center gap-1 px-1.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all duration-200 cursor-default min-w-0"
          >
            <span className="text-white/60 text-[10px] font-medium">
              {day.day.slice(0, 3)}
            </span>
            <WeatherIcon weatherType={day.weatherType} size={22} />
            <span className="text-white text-xs font-semibold">{day.high}°</span>
            <span className="text-white/40 text-[10px]">{day.low}°</span>
            {day.precipitationProbability > 0 && (
              <span className="text-blue-300 text-[10px]">{day.precipitationProbability}%</span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
