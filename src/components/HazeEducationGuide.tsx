import React from 'react';
import {
  Wind,
  CloudFog,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { HAZE_EDUCATIONAL_GUIDE } from '../data/hazeData';
import { useApp } from '../context/AppContext';

export const HazeEducationGuide: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="space-y-8">
      {/* Educational Header */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white transition-colors">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold text-slate-900 dark:text-white">{t('tabEducation')}</span>
            <span aria-hidden="true">·</span>
            <span>{t('whatIsPsi')}</span>
            <span aria-hidden="true">·</span>
            <span>NEA haze.gov.sg Standards</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            {t('educationTitle')}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {t('educationDesc')}
          </p>
        </div>
      </section>

      {/* Origin & Science Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Origin & Peatland Fires */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 text-slate-900 dark:text-white transition-colors">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
            <CloudFog className="w-5 h-5 text-sky-500 shrink-0" />
            <span>Where Does the Smoke Come From?</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {HAZE_EDUCATIONAL_GUIDE.whatIsIt}
          </p>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <span className="font-semibold text-slate-900 dark:text-white block mb-1">
              Why Does it Smell Like Campfire?
            </span>
            {HAZE_EDUCATIONAL_GUIDE.whySmell}
          </div>
        </div>

        {/* Monsoon Wind Patterns */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 text-slate-900 dark:text-white transition-colors">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
            <Wind className="w-5 h-5 text-sky-500 shrink-0" />
            <span>Seasonal Wind & Monsoon Cycles</span>
          </div>
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 space-y-1">
              <span className="font-semibold text-slate-900 dark:text-white block">
                Southwest Monsoon Season (June – October)
              </span>
              <p>
                The primary haze risk window. Dry conditions in Sumatra and Kalimantan combine with south-westerly winds blowing smoke north-east across Singapore and the Malacca Strait.
              </p>
            </div>
            <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 space-y-1">
              <span className="font-semibold text-slate-900 dark:text-white block">
                Northeast Monsoon & Inter-Monsoon (November – May)
              </span>
              <p>
                Singapore enjoys frequent heavy tropical rainstorms and northerly marine breezes that wash out airborne particles, yielding crystal clear blue skies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Decoding the Metrics: 24-hr PSI vs 1-hr PM2.5 */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white transition-colors">
        <div className="max-w-2xl mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('whatIsPsi')}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Singapore reports two distinct numbers. Knowing the difference helps you plan your day with confidence:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Overall Daily Indicator
              </span>
              <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">0 – 500+ scale</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">24-Hour PSI (Pollutant Standards Index)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {HAZE_EDUCATIONAL_GUIDE.psiVsPm25.psi}
            </p>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="font-medium text-slate-700 dark:text-slate-200">Best used for: </span>
              Understanding overall cumulative daily exposure and determining whether schools or outdoor events need adjustment.
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Instant Tourist Compass
              </span>
              <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">µg/m³ concentration</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">1-Hour PM2.5 (Immediate Particles)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {HAZE_EDUCATIONAL_GUIDE.psiVsPm25.pm25}
            </p>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="font-medium text-slate-700 dark:text-slate-200">Best used for: </span>
              Deciding whether to take a walk around Marina Bay right this hour, or immediately head inside Jewel Changi or the National Gallery.
            </div>
          </div>
        </div>
      </section>

      {/* Why Singapore is Still a Fantastic Holiday Destination During Haze */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white transition-colors">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Singapore Infrastructure Advantage</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          Why Singapore is the World’s Best City to Experience Haze
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          Singapore’s urban planning was designed with extensive climate shelter. Even during peak haze episodes, you can travel seamlessly and enjoy world-class experiences without breathing smoke:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block">1. 100% Air-Conditioned MRT Network</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Singapore’s Mass Rapid Transit (MRT) system connects hotels, shopping paradises, and tourist hubs through sealed, cooled subterranean tunnels.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block">2. HEPA-Filtered Megadomes</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Icons like Jewel Changi and the Gardens by the Bay Cloud Forest are enclosed bio-domes with continuous particulate air filtration systems.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block">3. Strict Anti-Profiteering Laws</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Singapore authorities closely monitor pharmacy prices. N95 masks, saline drops, and lozenges maintain stable regulated retail pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Official Government Links & Credits */}
      <section className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
            Official Singapore Government Resources
          </span>
          <span>
            haze.gov.sg (National Environment Agency) · Ministry of Health (moh.gov.sg) · VisitSingapore.com (STB)
          </span>
        </div>
        <a
          href="https://www.haze.gov.sg"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0"
        >
          <span>Visit haze.gov.sg</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </section>
    </div>
  );
};
