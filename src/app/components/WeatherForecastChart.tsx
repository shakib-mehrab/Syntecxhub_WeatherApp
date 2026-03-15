import { motion } from 'motion/react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface DayData {
  day: string;
  high: number;
  low: number;
}

interface WeatherForecastChartProps {
  weeklyData: DayData[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-black/70 backdrop-blur-md rounded-xl border border-white/20 px-3 py-2 text-xs text-white">
      <div className="font-semibold mb-1">{label}</div>
      <div className="flex gap-3">
        <span className="text-blue-300">H: {payload[0]?.value}°C</span>
        <span className="text-white/50">L: {payload[1]?.value}°C</span>
      </div>
    </div>
  );
}

function CustomDot(props: any) {
  const { cx, cy, value } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="#60a5fa" stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
      <text
        x={cx}
        y={cy - 12}
        textAnchor="middle"
        fill="rgba(255,255,255,0.75)"
        fontSize={10}
      >
        {value}°
      </text>
    </g>
  );
}

export function WeatherForecastChart({ weeklyData }: WeatherForecastChartProps) {
  const data = weeklyData.map((d) => ({
    day: d.day.slice(0, 3),
    high: d.high,
    low: d.low,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex-1 min-w-0 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-5"
    >
      <h3 className="text-white/80 text-sm font-semibold mb-4">Weather Forecast</h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 24, right: 16, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="high"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 7, fill: '#93c5fd', stroke: 'rgba(255,255,255,0.5)', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="low"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
