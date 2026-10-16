import React, { useState } from 'react';
import {
  Wind,
  Compass,
  Flame,
  Satellite,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  TrendingDown,
  Navigation,
  Sparkles,
  ShieldCheck,
  RotateCw,
} from 'lucide-react';
import { MONSOON_DATA, ATTRACTION_OUTLOOKS } from '../data/hazeData';
import { AttractionOutlook } from '../types/haze';

interface MonsoonHotspotTrackerProps {
  onSelectIndoorAlternative?: (swapId?: string) => void;
  onNavigateToItinerary?: () => void;
}

export const MonsoonHotspotTracker: React.FC<MonsoonHotspotTrackerProps> = ({
  onSelectIndoorAlternative,
  onNavigateToItinerary,
}) => {
  const [selectedSeasonSim, setSelectedSeasonSim] = useState<'actual' | 'northeast'>('actual');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const isSimulatedClear = selectedSeasonSim === 'northeast';

  const effectiveMonsoon = isSimulatedClear
    ? {
        ...MONSOON_DATA,
        currentSeason: 'Northeast Monsoon Season (Clean Air Window)',
        period: 'December to March (Clear Skies & Clean Maritime Winds)',
        riskLevel: 'Low' as const,
        windDirectionDegree: 45,
        windDirectionText: 'North-Northeast (NNE)',
        windSpeedKmh: 24,
        plumeRiskSummary:
          'Prevailing winds blow from the South China Sea, bringing clean maritime air. Peat fire clusters in the region are subdued by monsoon rains. Risk of transboundary smoke is minimal.',
        hotspotsSumatra: 4,
        hotspotsKalimantan: 2,
        hotspotsMalaysia: 1,
        asmcAlertLevel: 'Level 1 (Normal)' as const,
        outlookNext24h: 'Clear blue skies with fresh maritime airflow. 24-hr PSI expected in Good band (0–50).',
        outlookNext48h: 'Favorable winds continuing. Perfect conditions for outdoor theme parks and zoo visits.',
      }
    : MONSOON_DATA;

  const getStatusBadge = (status: AttractionOutlook['todayStatus']) => {
    switch (status) {
      case 'Proceed':
        return {
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'Good to Proceed',
        };
      case 'Caution':
        return {
          badge: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          label: 'Caution / Shorten Stay',
        };
      case 'Reschedule to Indoor':
        return {
          badge: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
          label: 'Reschedule to Indoor',
        };
    }
  };

  const categories = ['All', 'Theme Park', 'Zoo & Wildlife', 'Park & Garden', 'Water & Beach', 'Sightseeing Walking'];

  const filteredAttractions = ATTRACTION_OUTLOOKS.filter(
    (att) => selectedFilter === 'All' || att.type === selectedFilter
  );

  return (
    <div className="space-y-8">
      {/* Top Billboard */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 shadow-lg">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs text-indigo-300 font-medium">
            <Satellite className="w-3.5 h-3.5" />
            <span>ASEAN Specialised Meteorological Centre (ASMC) Hotspot & Wind Radar</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Transboundary Monsoon Wind & Regional Fire Tracker
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Understand why haze happens in Singapore. Real-time satellite tracking of fire hotspots across Sumatra and Kalimantan, combined with prevailing monsoon wind vectors, tells you whether outdoor trips should proceed or be moved indoors.
          </p>

          {/* Interactive Season Simulation Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Monsoon Simulation:</span>
            <div className="inline-flex p-1 bg-white/10 rounded-xl border border-white/15">
              <button
                onClick={() => setSelectedSeasonSim('actual')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedSeasonSim === 'actual'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Southwest Monsoon (Haze Risk Season)
              </button>
              <button
                onClick={() => setSelectedSeasonSim('northeast')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedSeasonSim === 'northeast'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Northeast Monsoon (Clear Maritime Skies)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid: Wind Compass & Hotspot Counter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Interactive Wind Compass */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Prevailing Wind Vector</h3>
                  <p className="text-xs text-slate-500">Surface Wind & Airflow</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                {effectiveMonsoon.windSpeedKmh} km/h
              </span>
            </div>

            {/* Circular Compass Visual */}
            <div className="flex flex-col items-center justify-center my-6">
              <div className="relative w-44 h-44 rounded-full border-4 border-slate-100 bg-gradient-to-b from-slate-50 to-white flex items-center justify-center shadow-inner">
                {/* Cardinal markers */}
                <span className="absolute top-2 text-[10px] font-extrabold text-slate-400">N</span>
                <span className="absolute bottom-2 text-[10px] font-extrabold text-slate-400">S</span>
                <span className="absolute left-2 text-[10px] font-extrabold text-slate-400">W</span>
                <span className="absolute right-2 text-[10px] font-extrabold text-slate-400">E</span>

                {/* Inner Compass Ring */}
                <div className="w-28 h-28 rounded-full border border-dashed border-slate-200 flex items-center justify-center">
                  {/* Rotating Arrow Indicator */}
                  <div
                    className="transition-transform duration-700 ease-out flex items-center justify-center"
                    style={{
                      transform: `rotate(${effectiveMonsoon.windDirectionDegree}deg)`,
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[20px] border-b-sky-600" />
                      <div className="w-1.5 h-10 bg-sky-600 rounded-b-full" />
                    </div>
                  </div>
                </div>

                {/* Singapore Marker Pin in Center */}
                <div className="absolute w-4 h-4 rounded-full bg-slate-900 border-2 border-white shadow-sm flex items-center justify-center text-[8px] text-white font-bold" />
              </div>

              <div className="text-center mt-3 space-y-0.5">
                <span className="text-lg font-black text-slate-900">
                  {effectiveMonsoon.windDirectionText}
                </span>
                <p className="text-xs text-slate-500 font-mono">
                  Bearing: {effectiveMonsoon.windDirectionDegree}° | Speed: {effectiveMonsoon.windSpeedKmh} km/h
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-3 rounded-2xl text-xs font-medium border leading-relaxed ${
              effectiveMonsoon.riskLevel === 'Low'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            <span className="font-bold">Wind Impact on Singapore: </span>
            {effectiveMonsoon.riskLevel === 'Low'
              ? 'Winds are carrying clean oceanic air from the northeast. Zero transboundary smoke intrusion.'
              : 'Winds blow directly across Sumatra peatlands towards Singapore, carrying elevated smoke particles.'}
          </div>
        </div>

        {/* Card 2: ASMC Regional Hotspot Counts */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Satellite Hotspot Count</h3>
                  <p className="text-xs text-slate-500">NOAA-20 / VIIRS Sensor</p>
                </div>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  effectiveMonsoon.riskLevel === 'Low'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {effectiveMonsoon.asmcAlertLevel}
              </span>
            </div>

            {/* Hotspot Breakdown Stat Cards */}
            <div className="space-y-3 my-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Sumatra (Indonesia)</span>
                  <span className="text-[11px] text-slate-500">Riau, Jambi & South Sumatra peatlands</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-slate-900">
                    {effectiveMonsoon.hotspotsSumatra}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">hotspots</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Kalimantan (Borneo)</span>
                  <span className="text-[11px] text-slate-500">Central & West Kalimantan forest tracts</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-slate-900">
                    {effectiveMonsoon.hotspotsKalimantan}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">hotspots</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Peninsular Malaysia</span>
                  <span className="text-[11px] text-slate-500">Localized agricultural clearings</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-slate-900">
                    {effectiveMonsoon.hotspotsMalaysia}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">hotspots</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center font-mono pt-2 border-t border-slate-100">
            {effectiveMonsoon.satelliteUpdateDate}
          </p>
        </div>

        {/* Card 3: 24h & 48h Tourist Outlook Forecast */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Haze Outlook for Tourists</h3>
                <p className="text-xs text-slate-500">NEA Meteorological Service</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {/* Next 24h */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                    Next 24 Hours
                  </span>
                  <span className="text-[10px] font-semibold text-indigo-600">Morning & Afternoon</span>
                </div>
                <p className="text-xs text-indigo-950 leading-relaxed font-medium">
                  {effectiveMonsoon.outlookNext24h}
                </p>
              </div>

              {/* Next 48h */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Next 48 Hours
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">Weekend Outlook</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {effectiveMonsoon.outlookNext48h}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-900 block">Rainfall Cleansing Effect:</span>
            <span>
              Tropical afternoon convective thunderstorms frequently wash PM2.5 particulates out of Singapore’s air within 45 minutes.
            </span>
          </div>
        </div>
      </div>

      {/* 48-Hour Attraction Feasibility Matrix */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Tourist Attraction Feasibility Matrix</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Should You Visit Outdoor Attractions Today vs Tomorrow?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Real-time advice on whether to proceed with booked outdoor tickets or swap to air-conditioned indoor alternatives based on current wind vectors.
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedFilter === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAttractions.map((att) => {
            const todayBadge = isSimulatedClear
              ? {
                  badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                  dot: 'bg-emerald-500',
                  label: 'Clear Skies (Proceed)',
                }
              : getStatusBadge(att.todayStatus);

            const tomorrowBadge = isSimulatedClear
              ? {
                  badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                  dot: 'bg-emerald-500',
                  label: 'Clear Skies (Proceed)',
                }
              : getStatusBadge(att.tomorrowStatus);

            return (
              <div
                key={att.attractionName}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                      {att.zone}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">{att.type}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {att.attractionName}
                  </h3>

                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{att.outdoorExposureHours}</span>
                  </div>

                  {/* Status Pills: Today vs Tomorrow */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Today
                      </span>
                      <div
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${todayBadge.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${todayBadge.dot}`} />
                        <span className="truncate">{todayBadge.label}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Tomorrow
                      </span>
                      <div
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${tomorrowBadge.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${tomorrowBadge.dot}`} />
                        <span className="truncate">{tomorrowBadge.label}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{att.advisoryNote}</p>
                </div>

                {/* Bottom link to swap alternative */}
                {att.indoorSwapId && onNavigateToItinerary && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">Indoor Replacement:</span>
                    <button
                      onClick={onNavigateToItinerary}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                    >
                      <span>View Sheltered Swap</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
