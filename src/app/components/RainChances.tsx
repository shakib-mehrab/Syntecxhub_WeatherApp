import { motion } from 'motion/react';

interface RainDay {
  day: string;
  precipitationProbability: number;
}

interface RainChancesProps {
  weeklyData: RainDay[];
}

export function RainChances({ weeklyData }: RainChancesProps) {
  const maxProb = Math.max(...weeklyData.map((d) => d.precipitationProbability), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="flex-1 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-5"
    >
      <h3 className="text-white/80 text-sm font-semibold mb-4">Chances of Rain</h3>
      <div className="flex flex-col gap-3">
        {weeklyData.map((d, i) => {
          const pct = d.precipitationProbability;
          const barWidth = maxProb > 0 ? (pct / maxProb) * 100 : 0;

          return (
            <div key={d.day} className="flex items-center gap-3">
              <span className="text-white/50 text-xs w-8 shrink-0">{d.day.slice(0, 3)}</span>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-300"
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.8, delay: i * 0.07, ease: 'easeOut' }}
                />
              </div>
              <span className="text-white/60 text-xs w-8 text-right shrink-0">{pct}%</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
