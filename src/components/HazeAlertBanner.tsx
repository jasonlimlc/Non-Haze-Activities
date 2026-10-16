import React from 'react';
import { AlertTriangle, Compass, ShoppingBag, X } from 'lucide-react';

interface HazeAlertBannerProps {
  psi: number;
  status: string;
  onNavigateToItinerary: () => void;
  onNavigateToSupplies: () => void;
}

export const HazeAlertBanner: React.FC<HazeAlertBannerProps> = ({
  psi,
  status,
  onNavigateToItinerary,
  onNavigateToSupplies,
}) => {
  const [dismissed, setDismissed] = React.useState(false);

  // Only show when PSI exceeds 100 (Unhealthy or higher)
  if (psi <= 100 || dismissed) return null;

  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-3 border-b border-amber-600 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-slate-950 text-white flex items-center justify-center shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div>
            <span className="font-bold">Air Advisory Notice (PSI {psi} - {status}): </span>
            <span className="hidden md:inline">
              Smoke particulate levels are elevated. Reduce prolonged outdoor walking.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onNavigateToItinerary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 text-white font-medium hover:bg-slate-800 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Switch to Indoor Plan</span>
          </button>
          <button
            onClick={onNavigateToSupplies}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-slate-950 font-medium border border-amber-600 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Find N95 Masks</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-800 hover:text-slate-950 ml-1"
            title="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
