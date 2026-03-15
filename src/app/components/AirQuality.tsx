import { Wind } from 'lucide-react';
import { motion } from 'motion/react';

interface AirQualityData {
  aqi: number;
  label: string;
  color: string;
  pm10: number;
  pm2_5: number;
  o3: number;
  so2: number;
  co: number;
  no2: number;
}

interface AirQualityProps {
  data?: AirQualityData;
}

const CIRCUMFERENCE = 2 * Math.PI * 52; // r=52

function AqiGauge({ aqi, color, label }: { aqi: number; color: string; label: string }) {
  const progress = Math.min(aqi / 100, 1);
  const filled = progress * CIRCUMFERENCE;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="130" height="130" viewBox="0 0 130 130">
        {/* Background ring */}
        <circle
          cx="65"
          cy="65"
          r="52"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="10"
        />
        {/* Progress arc */}
        <motion.circle
          cx="65"
          cy="65"
          r="52"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
          transform="rotate(-90 65 65)"
          initial={{ strokeDasharray: `0 ${CIRCUMFERENCE}` }}
          animate={{ strokeDasharray: `${filled} ${CIRCUMFERENCE}` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-white text-2xl font-bold leading-none">{aqi}</span>
        <span className="text-white/50 text-xs mt-1">{label}</span>
      </div>
    </div>
  );
}

export function AirQuality({ data }: AirQualityProps) {
  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex-1 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-5 flex flex-col items-center justify-center gap-2 min-h-[180px]"
      >
        <Wind size={28} className="text-white/20" />
        <p className="text-white/30 text-sm">Air quality unavailable</p>
      </motion.div>
    );
  }

  const pollutants = [
    { label: 'PM10', value: data.pm10, unit: 'µg/m³' },
    { label: 'O₃', value: data.o3, unit: 'µg/m³' },
    { label: 'SO₂', value: data.so2, unit: 'µg/m³' },
    { label: 'PM2.5', value: data.pm2_5, unit: 'µg/m³' },
    { label: 'CO', value: data.co, unit: 'µg/m³' },
    { label: 'NO₂', value: data.no2, unit: 'µg/m³' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex-1 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-5"
    >
      <h3 className="text-white/80 text-sm font-semibold mb-4">Air Quality</h3>
      <div className="flex items-center gap-4">
        <AqiGauge aqi={data.aqi} color={data.color} label={data.label} />
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 flex-1">
          {pollutants.map((p) => (
            <div key={p.label} className="flex flex-col">
              <span className="text-white/40 text-xs">{p.label}</span>
              <span className="text-white text-sm font-semibold">
                {p.value}
                <span className="text-white/30 text-xs ml-1">{p.unit}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
