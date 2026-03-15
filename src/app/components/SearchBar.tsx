import { Loader2, LocateFixed, Search } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onGpsRequest?: () => void;
  loading?: boolean;
  gpsLoading?: boolean;
}

export function SearchBar({
  onSearch,
  onGpsRequest,
  loading = false,
  gpsLoading = false,
}: SearchBarProps) {
  const [city, setCity] = useState('');
  const busy = loading || gpsLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim() && !busy) {
      onSearch(city.trim());
      setCity('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
        <div className="weather-panel relative flex items-center bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
          {loading ? (
            <Loader2 className="ml-5 text-white/70 animate-spin" size={20} />
          ) : (
            <Search className="ml-5 text-white/70" size={20} />
          )}
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search any city worldwide..."
            disabled={busy}
            className="flex-1 bg-transparent px-4 py-4 text-white placeholder:text-white/50 focus:outline-none disabled:opacity-60"
          />
          {onGpsRequest && (
            <button
              type="button"
              onClick={onGpsRequest}
              disabled={busy}
              title="Use my current location"
              className="mr-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/70 transition-all duration-200 hover:bg-white/20 hover:text-white disabled:opacity-40"
            >
              {gpsLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <LocateFixed size={16} />
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
