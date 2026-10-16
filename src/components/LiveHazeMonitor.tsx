import React, { useState } from 'react';
import {
  RefreshCw,
  MapPin,
  Shield,
  Activity,
  Search,
  Bell,
} from 'lucide-react';
import { RegionalPsiData, SingaporeRegion } from '../types/haze';
import { PSI_ADVISORY_BANDS, IMAGES } from '../data/hazeData';
import { SingaporeRegionalMap } from './SingaporeRegionalMap';
import {
  resolveSingaporeLocationWithOneMap,
  LocationMatchResult,
} from '../utils/locationResolver';
import { useApp } from '../context/AppContext';

interface LiveHazeMonitorProps {
  currentRegionData: RegionalPsiData;
  allRegionsData: Record<SingaporeRegion, RegionalPsiData>;
  selectedRegion: SingaporeRegion;
  onSelectRegion: (region: SingaporeRegion) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onNavigateToItinerary: () => void;
  onNavigateToSupplies: () => void;
  onNavigateToEducation: () => void;
  alertThresholdEnabled: boolean;
  onToggleAlertThreshold: () => void;
  userLocation?: LocationMatchResult | null;
  onSetUserLocation?: (loc: LocationMatchResult | null) => void;
}

export const LiveHazeMonitor: React.FC<LiveHazeMonitorProps> = ({
  currentRegionData,
  allRegionsData,
  selectedRegion,
  onSelectRegion,
  onRefresh,
  isRefreshing,
  onNavigateToItinerary,
  onNavigateToSupplies,
  onNavigateToEducation,
  alertThresholdEnabled,
  onToggleAlertThreshold,
  userLocation,
  onSetUserLocation,
}) => {
  const { t } = useApp();
  const [localSearch, setLocalSearch] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localSearch.trim()) return;
    setIsSearching(true);
    try {
      const match = await resolveSingaporeLocationWithOneMap(localSearch);
      if (onSetUserLocation) onSetUserLocation(match);
      onSelectRegion(match.region);
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusColor = (status: RegionalPsiData['status']) => {
    switch (status) {
      case 'Good':
        return {
          badge: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          ring: '#10b981',
          bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
          textColor: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'Moderate':
        return {
          badge: 'text-sky-700 bg-sky-50 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800',
          ring: '#0ea5e9',
          bgGradient: 'from-sky-500/10 via-sky-500/5 to-transparent',
          textColor: 'text-sky-600 dark:text-sky-400',
        };
      case 'Unhealthy':
        return {
          badge: 'text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          ring: '#f59e0b',
          bgGradient: 'from-amber-500/15 via-amber-500/5 to-transparent',
          textColor: 'text-amber-600 dark:text-amber-400',
        };
      case 'Very Unhealthy':
        return {
          badge: 'text-orange-700 bg-orange-50 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800',
          ring: '#f97316',
          bgGradient: 'from-orange-500/20 via-orange-500/5 to-transparent',
          textColor: 'text-orange-600 dark:text-orange-400',
        };
      case 'Hazardous':
      default:
        return {
          badge: 'text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          ring: '#ef4444',
          bgGradient: 'from-rose-500/20 via-rose-500/5 to-transparent',
          textColor: 'text-rose-600 dark:text-rose-400',
        };
    }
  };

  const statusStyle = getStatusColor(currentRegionData.status);

  // SVG Gauge calculations
  const maxPsiScale = 300;
  const currentRatio = Math.min(Math.max(currentRegionData.psi24Hourly / maxPsiScale, 0), 1);
  const strokeDashoffset = 440 - currentRatio * 440;

  return (
    <div className="space-y-6">
      {/* Lightened Visual Hero Billboard */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-600/40 dark:border-slate-700/60 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-700 dark:from-slate-800 dark:via-slate-850 dark:to-slate-800 text-white shadow-xl transition-colors">
        <div className="absolute inset-0">
          <img
            src={IMAGES.skyline}
            alt="Singapore Marina Bay Skyline"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800/95 via-slate-800/75 to-transparent dark:from-slate-900/95 dark:via-slate-900/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-850 via-transparent to-black/20" />
        </div>

        <div className="relative z-10 p-5 sm:p-10 lg:p-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 dark:bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white mb-3 sm:mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t('neaLiveFeed')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3 sm:mb-4 leading-tight">
            {t('liveTitle')}
          </h1>

          <p className="text-slate-200 text-xs sm:text-base leading-relaxed max-w-xl mb-6">
            {t('liveDesc')}
          </p>

          {/* Quick Location Search Bar within Live Monitor */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-800/80 dark:bg-slate-900/80 border border-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs sm:text-sm transition-colors shadow-sm shrink-0 active:scale-95"
            >
              {isSearching ? t('searching') : t('matchZone')}
            </button>
          </form>

          {userLocation && (
            <div className="mt-3 text-xs text-slate-200 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>
                {t('currentMatchedSpot')}{' '}
                <strong className="text-white">{userLocation.matchedName}</strong> (
                {userLocation.region.toUpperCase()})
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Main Dual Console: Circular Gauge & Accurate SVG Regional Map */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Circular Atmospheric Gauge (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden transition-colors">
          <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full bg-gradient-to-br ${statusStyle.bgGradient} blur-2xl pointer-events-none`} />

          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {currentRegionData.displayName}
                </span>
              </div>
              <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyle.badge}`}>
                {currentRegionData.status}
              </div>
            </div>

            <div className="py-6 flex flex-col items-center justify-center">
              <div className="relative w-52 h-52 sm:w-56 sm:h-56 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#e2e8f0"
                    strokeWidth="12"
                    fill="transparent"
                    className="dark:stroke-slate-800"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke={statusStyle.ring}
                    strokeWidth="12"
                    strokeDasharray="440"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-400 font-semibold">
                    {t('hr24Psi')}
                  </span>
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight tabular-nums my-0.5">
                    {currentRegionData.psi24Hourly}
                  </span>
                  <span className={`text-xs font-bold ${statusStyle.textColor}`}>
                    {currentRegionData.status}
                  </span>
                </div>
              </div>

              {/* 1-Hour PM2.5 Strip */}
              <div className="w-full mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-sky-500 text-white flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4 text-sky-400 dark:text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {t('hr1Pm25')}: {currentRegionData.pm25OneHourly} µg/m³
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Immediate outdoor particulate exposure
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-400 font-mono">Live</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{currentRegionData.updateTime}</span>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1 font-bold text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? t('refreshing') : t('refresh')}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Geographic SVG Regional Map (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('interactiveMapTitle')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select any of the 5 official NEA sectors to inspect local readings
                </p>
              </div>

              <button
                onClick={onToggleAlertThreshold}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  alertThresholdEnabled
                    ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{alertThresholdEnabled ? `${t('autoAlerts')}: ${t('on')}` : `${t('autoAlerts')}: ${t('off')}`}</span>
              </button>
            </div>

            {/* Embedded SVG Map Component */}
            <SingaporeRegionalMap
              selectedRegion={selectedRegion}
              allRegionsData={allRegionsData}
              onSelectRegion={onSelectRegion}
              userLocationName={userLocation?.matchedName}
              userCoordinates={userLocation?.coordinates}
            />
          </div>

          {/* Quick Zone Selector Strip */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {(['national', 'central', 'south', 'east', 'west', 'north'] as SingaporeRegion[]).map((rKey) => {
              const data = allRegionsData[rKey];
              const isSelected = selectedRegion === rKey;
              return (
                <button
                  key={rKey}
                  onClick={() => onSelectRegion(rKey)}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-sky-600 text-white border-slate-900 dark:border-sky-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span className="block text-[11px] font-bold capitalize truncate">
                    {rKey}
                  </span>
                  <span className="font-mono text-xs font-semibold tabular-nums block mt-0.5">
                    PSI {data?.psi24Hourly ?? '--'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advisory Rules Table: Clean Visual Cards */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>Singapore MOH & NEA Official Protocol</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('regionalBreakdown')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('recommendedAction')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {PSI_ADVISORY_BANDS.map((band) => (
            <div
              key={band.range}
              className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/80 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                    {band.range}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${band.badgeColor}`}>
                    {band.status}
                  </span>
                </div>
                <div className={`h-1.5 w-full rounded-full ${band.barColor} mb-2.5`} />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug mb-1">
                  {band.summary}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {band.generalTourists}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">Sensitive Groups:</span>
                <span>{band.vulnerableTourists}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
