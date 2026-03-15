import { motion } from 'motion/react';
import { AlertTriangle, Loader2, LocateFixed, MapPin, RefreshCw } from 'lucide-react';

// ---------------------------------------------------------------------------
// Skeleton pulse block
// ---------------------------------------------------------------------------

export function SkeletonBlock({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl bg-white/10 animate-pulse ${className}`}
    />
  );
}

// ---------------------------------------------------------------------------
// Full-page loading state
// ---------------------------------------------------------------------------

export function WeatherLoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full flex-1 min-h-0"
    >
      <div className="w-full h-full flex flex-col xl:flex-row gap-3 items-start">
        {/* Left column skeleton */}
        <div className="w-full xl:w-[320px] 2xl:w-[350px] shrink-0 flex flex-col gap-3">
          <div className="rounded-3xl border border-white/15 bg-white/8 backdrop-blur-xl p-3.5 flex flex-col gap-2.5">
            <SkeletonBlock className="h-10 rounded-xl" />
            <div className="flex items-center justify-between">
              <SkeletonBlock className="h-4 w-32 rounded-full" />
              <SkeletonBlock className="h-3 w-8 rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <SkeletonBlock className="h-14 w-28 rounded-xl" />
                <SkeletonBlock className="h-3 w-24 rounded-full" />
              </div>
              <SkeletonBlock className="h-16 w-16 rounded-full" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonBlock key={`city-${i}`} className="h-8 w-20 rounded-lg" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonBlock key={`detail-${i}`} className="h-20 rounded-2xl" />
            ))}
          </div>
        </div>

        {/* Right column skeleton */}
        <div className="flex-1 min-w-0 flex flex-col gap-3 h-full">
          <div className="rounded-2xl border border-white/15 bg-white/8 backdrop-blur-xl p-2.5">
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 7 }).map((_, i) => (
                <SkeletonBlock key={`week-${i}`} className="h-24 rounded-lg" />
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <SkeletonBlock className="h-40 flex-1 rounded-2xl" />
            <SkeletonBlock className="h-40 md:w-[200px] rounded-2xl" />
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <SkeletonBlock className="h-44 flex-1 rounded-2xl" />
            <SkeletonBlock className="h-44 flex-1 rounded-2xl" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Empty / permission-prompt state
// ---------------------------------------------------------------------------

interface WeatherEmptyStateProps {
  onGpsRequest?: () => void;
  gpsLoading?: boolean;
}

export function WeatherEmptyState({ onGpsRequest, gpsLoading }: WeatherEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="w-full flex flex-col items-center gap-6 py-8"
    >
      <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl px-8 py-12 flex flex-col items-center gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 border border-white/20">
          <MapPin className="text-white/70" size={36} />
        </div>

        <div>
          <h2 className="text-white text-2xl font-light mb-2">Where are you?</h2>
          <p className="text-white/55 text-sm leading-relaxed max-w-xs">
            Allow location access to see live weather for your current position,
            or search for any city above.
          </p>
        </div>

        {onGpsRequest && (
          <button
            onClick={onGpsRequest}
            disabled={gpsLoading}
            className="flex items-center gap-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 hover:border-white/35 px-6 py-3 text-white text-sm transition-all duration-200 disabled:opacity-50"
          >
            {gpsLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <LocateFixed size={16} />
            )}
            Use my current location
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Error banner
// ---------------------------------------------------------------------------

interface WeatherErrorProps {
  message: string;
  onRetry?: () => void;
}

export function WeatherError({ message, onRetry }: WeatherErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="w-full max-w-xl rounded-2xl border border-red-400/30 bg-red-500/15 backdrop-blur-xl px-6 py-5 flex items-start gap-4 text-white/90"
    >
      <AlertTriangle className="mt-0.5 shrink-0 text-red-300" size={20} />
      <div className="flex-1 text-sm leading-relaxed">{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="shrink-0 flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors"
        >
          <RefreshCw size={14} />
          Retry
        </button>
      )}
    </motion.div>
  );
}
