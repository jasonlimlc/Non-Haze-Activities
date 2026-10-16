import React from 'react';
import { ShieldCheck, Phone } from 'lucide-react';

export const Footer: React.FC<{
  onSelectTab: (tab: 'overview' | 'live' | 'itinerary' | 'supplies' | 'health' | 'education') => void;
}> = ({ onSelectTab }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-100">
          {/* Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
              <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                CH
              </div>
              <span>Captain Haze</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Independent tourist companion app built to navigate seasonal haze in Singapore. Grounded in official NEA PSI data feeds, Singapore Ministry of Health advisories, and curated indoor itinerary logic.
            </p>
          </div>

          {/* Quick Tourist Links */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-900 block text-xs">Essential Tools</span>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button
                  onClick={() => onSelectTab('overview')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('live')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Live Regional PSI & 1-hr PM2.5
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('itinerary')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Indoor Itinerary Substitution
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('supplies')}
                  className="hover:text-slate-900 transition-colors"
                >
                  What to Buy & N95 Fitting
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('health')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Symptom Triage & 24h Clinics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('education')}
                  className="hover:text-slate-900 transition-colors"
                >
                  What is Haze? (Origin & Winds)
                </button>
              </li>
            </ul>
          </div>

          {/* Singapore Emergency Hotlines */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-900 block text-xs">Singapore Emergency Hotlines</span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span>Emergency Ambulance (SCDF):</span>
                <a href="tel:995" className="font-bold text-rose-700 hover:underline">
                  995
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span>Non-Emergency Ambulance:</span>
                <a href="tel:1777" className="font-semibold text-slate-900 hover:underline">
                  1777
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span>Police:</span>
                <a href="tel:999" className="font-semibold text-slate-900 hover:underline">
                  999
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span>NEA Haze Hotline:</span>
                <a href="tel:18002255632" className="text-slate-700 hover:underline">
                  1800-CALL-NEA
                </a>
              </div>
            </div>
          </div>

          {/* Official Partners & Data Sources */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-900 block text-xs">Data Integration & Partners</span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Real-time environmental sensor data retrieved from National Environment Agency (NEA) via data.gov.sg open API. Health guidelines formulated in accordance with Singapore Ministry of Health (MOH) clinical protocols.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} Captain Haze. Designed for travelers in Singapore, Malaysia, and Southeast Asia.
          </div>
          <div className="flex items-center gap-4">
            <span>Always consult medical professionals for severe respiratory symptoms.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
