import React from 'react';
import { X, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

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
  const [tempPsi, setTempPsi] = React.useState<number>(simulatedPsi || 75);

  if (!isOpen) return null;

  const presets = [
    { label: 'Good (Clear Skies)', psi: 35, desc: 'Normal sunny day in Singapore, minimal haze' },
    { label: 'Moderate (Typical)', psi: 75, desc: 'Acceptable air, slight horizon smoke' },
    { label: 'Unhealthy (MOH Alert)', psi: 145, desc: 'Burning smell, outdoor exertion restricted' },
    { label: 'Very Unhealthy (Dense Haze)', psi: 240, desc: 'Heavy smoke, N95 masks strongly advised' },
    { label: 'Hazardous (Emergency)', psi: 340, desc: 'Severe emergency, remain indoors with AC' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">PSI Scenario Simulator</h3>
            <p className="text-xs text-slate-500 mt-0.5">Test app behavior across official NEA air quality bands</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-5">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium text-slate-700">Simulated 24-hr PSI Value</span>
              <span className="font-mono font-bold text-lg text-slate-900 tabular-nums">
                {tempPsi}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="400"
              value={tempPsi}
              onChange={(e) => setTempPsi(Number(e.target.value))}
              className="w-full accent-slate-900 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
              <span>0 (Good)</span>
              <span>100 (Moderate)</span>
              <span>200 (Unhealthy)</span>
              <span>300 (Hazardous)</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Quick Test Presets
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.psi}
                  onClick={() => setTempPsi(preset.psi)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                    tempPsi === preset.psi
                      ? 'border-slate-900 bg-slate-50 font-medium'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-slate-900">{preset.label}</span>
                    <span className="font-mono text-slate-500 font-medium">{preset.psi}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{preset.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {tempPsi >= 101 ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Unhealthy Threshold Exceeded:</span> The app will trigger itinerary swap prompts, highlight N95 mask stockists, and show vulnerable health advisories.
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Acceptable Air Quality:</span> Outdoor walking and standard tourist itineraries are safe for general tourists.
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
          <button
            onClick={() => {
              onApplySimulation(null);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Live NEA</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onApplySimulation(tempPsi);
                onClose();
              }}
              className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
            >
              Apply PSI {tempPsi}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
