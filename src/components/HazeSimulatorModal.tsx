import React, { useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HazeSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSimulating: boolean;
  simulatedPsi: number;
  onApplySimulation: (psi: number | null) => void;
}

export const HazeSimulatorModal: React.FC<HazeSimulatorModalProps> = ({
  isOpen,
  onClose,
  isSimulating,
  simulatedPsi,
  onApplySimulation,
}) => {
  const { t } = useApp();
  const [tempPsi, setTempPsi] = useState<number>(simulatedPsi || 75);

  if (!isOpen) return null;

  const presets = [
    { label: `${t('statusGood')} (35)`, psi: 35, desc: 'Normal sunny day in Singapore, clear skies' },
    { label: `${t('statusModerate')} (75)`, psi: 75, desc: 'Acceptable air quality, typical baseline' },
    { label: `${t('statusUnhealthy')} (145)`, psi: 145, desc: 'Visible haze, outdoor exertion restricted' },
    { label: `${t('statusVeryUnhealthy')} (240)`, psi: 240, desc: 'Dense smoke, N95 masks strongly advised' },
    { label: `${t('statusHazardous')} (340)`, psi: 340, desc: 'Emergency level, remain indoors with AC' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">PSI Scenario Simulator</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Test app behavior across official NEA air quality bands</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-5">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Simulated 24-hr PSI Value</span>
              <span className="font-mono font-black text-2xl text-slate-900 dark:text-white tabular-nums">
                {tempPsi}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="400"
              value={tempPsi}
              onChange={(e) => setTempPsi(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Quick Scenarios:
            </span>
            <div className="space-y-1.5">
              {presets.map((preset) => (
                <button
                  key={preset.psi}
                  type="button"
                  onClick={() => setTempPsi(preset.psi)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    tempPsi === preset.psi
                      ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-400 dark:border-sky-600'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {preset.label}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {preset.desc}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white shrink-0 ml-2">
                    {preset.psi}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onApplySimulation(null);
              onClose();
            }}
            disabled={!isSimulating}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Live</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onApplySimulation(tempPsi);
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              Apply Simulation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
