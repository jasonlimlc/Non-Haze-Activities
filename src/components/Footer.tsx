import React from 'react';
import { MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppTab } from './Navbar';
import { GuideSubSection } from './HazeGuideHub';

interface FooterProps {
  onSelectTab: (tab: AppTab) => void;
  onSelectGuideSection?: (sub: GuideSubSection) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onSelectGuideSection }) => {
  const { t } = useApp();

  const handleOpenGuide = (section: GuideSubSection) => {
    onSelectTab('guide');
    if (onSelectGuideSection) {
      onSelectGuideSection(section);
    }
  };

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-16 text-xs text-slate-500 dark:text-slate-400 transition-colors pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
          {/* Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                <MapPin className="w-4 h-4 stroke-[2.2] fill-white/20" />
              </div>
              <span>{t('brand')}</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
              {t('footerDesc')}
            </p>
          </div>

          {/* Quick Tourist Links */}
          <div className="space-y-2">
            <span className="font-bold text-slate-900 dark:text-white block text-xs">
              Essential Tools
            </span>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button
                  onClick={() => onSelectTab('live')}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {t('tabLive')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('itinerary')}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {t('tabItinerary')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenGuide('education')}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {t('tabEducation')} (Science & Facts)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenGuide('supplies')}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {t('tabSupplies')} (Masks & Pharmacy)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenGuide('health')}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {t('tabHealth')} (Clinics & Emergency)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('talk')}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {t('tabTalk')} (Disqus Community)
                </button>
              </li>
            </ul>
          </div>

          {/* Singapore Emergency Hotlines */}
          <div className="space-y-2">
            <span className="font-bold text-slate-900 dark:text-white block text-xs">
              Singapore Emergency Hotlines
            </span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span>{t('emergencyAmbulance')}:</span>
                <a href="tel:995" className="font-bold text-rose-600 dark:text-rose-400 hover:underline">
                  995
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span>{t('nonEmergencyAmbulance')}:</span>
                <a href="tel:1777" className="font-semibold text-slate-900 dark:text-slate-200 hover:underline">
                  1777
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span>Police:</span>
                <a href="tel:999" className="font-semibold text-slate-900 dark:text-slate-200 hover:underline">
                  999
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span>NEA Haze Hotline:</span>
                <a href="tel:18002255632" className="text-slate-700 dark:text-slate-300 hover:underline">
                  1800-CALL-NEA
                </a>
              </div>
            </div>
          </div>

          {/* Official Partners & Data Sources */}
          <div className="space-y-2">
            <span className="font-bold text-slate-900 dark:text-white block text-xs">
              Official Open Data
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Real-time environmental sensor data from Singapore NEA via data.gov.sg API. Geospatial address routing powered by Singapore OneMap API.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-slate-400 dark:text-slate-500">
          <div>{t('copyright')}</div>
          <div>{t('emergencyNotice')}</div>
        </div>
      </div>
    </footer>
  );
};
