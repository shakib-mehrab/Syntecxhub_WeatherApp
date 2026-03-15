import { Sunrise, Sunset } from 'lucide-react';
import { motion } from 'motion/react';

function formatSunTime(iso: string): string {
  if (!iso) return '--:--';
  const date = new Date(iso);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

interface SunriseSunsetProps {
  sunrise: string;
  sunset: string;
}

export function SunriseSunset({ sunrise, sunset }: SunriseSunsetProps) {
  const sunriseTime = formatSunTime(sunrise);
  const sunsetTime = formatSunTime(sunset);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-5 flex flex-col gap-4 md:w-[200px] shrink-0"
    >
      <h3 className="text-white/80 text-sm font-semibold">Sun</h3>

      {/* Sunrise */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/20">
          <Sunrise size={20} className="text-amber-400" />
        </div>
        <div>
          <div className="text-white/50 text-xs">Sunrise</div>
          <div className="text-white text-sm font-semibold">{sunriseTime}</div>
        </div>
      </div>

      {/* Arc separator */}
      <div className="relative h-px mx-2">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 via-white/20 to-indigo-400/30" />
      </div>

      {/* Sunset */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-400/20">
          <Sunset size={20} className="text-indigo-400" />
        </div>
        <div>
          <div className="text-white/50 text-xs">Sunset</div>
          <div className="text-white text-sm font-semibold">{sunsetTime}</div>
        </div>
      </div>
    </motion.div>
  );
}
