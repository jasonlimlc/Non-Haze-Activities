import React, { useState } from 'react';
import { AlertTriangle, Compass, ShoppingBag, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

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
  const { t } = useApp();
  const [dismissed, setDismissed] = useState(false);

  // Only show when PSI exceeds 100 (Unhealthy or higher)
  if (psi <= 100 || dismissed) return null;

  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2.5 sm:py-3 border-b border-amber-600 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-slate-950 text-white flex items-center justify-center shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div>
            <span className="font-bold">
              {t('alertActive')} (PSI {psi} · {status}):{' '}
            </span>
            <span className="hidden md:inline font-medium">
              {t('alertSub')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onNavigateToItinerary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 text-white font-medium hover:bg-slate-800 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{t('swapPlan')}</span>
          </button>
          <button
            onClick={onNavigateToSupplies}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-slate-950 font-medium border border-amber-600 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t('locateMasks')}</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-900 hover:text-black ml-1"
            title="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
