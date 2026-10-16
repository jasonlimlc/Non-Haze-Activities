import React, { useState } from 'react';
import {
  Wind,
  RefreshCw,
  Compass,
  ShoppingBag,
  Bell,
  MapPin,
  Info,
  Shield,
  Activity,
  ArrowUpRight,
  Search,
  Navigation,
} from 'lucide-react';
import { RegionalPsiData, SingaporeRegion } from '../types/haze';
import { PSI_ADVISORY_BANDS, IMAGES } from '../data/hazeData';
import { SingaporeRegionalMap } from './SingaporeRegionalMap';
import { resolveSingaporeLocation, LocationMatchResult } from '../utils/locationResolver';
import { MonsoonHotspotTracker } from './MonsoonHotspotTracker';

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
  const [localSearch, setLocalSearch] = useState<string>('');
  const [liveView, setLiveView] = useState<'map' | 'monsoon'>('map');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localSearch.trim()) return;
    const match = resolveSingaporeLocation(localSearch);
    if (onSetUserLocation) onSetUserLocation(match);
    onSelectRegion(match.region);
  };

  const getStatusColor = (status: RegionalPsiData['status']) => {
    switch (status) {
      case 'Good':
        return {
          badge: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          ring: '#10b981',
          bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
          textColor: 'text-emerald-600',
        };
      case 'Moderate':
        return {
          badge: 'text-sky-700 bg-sky-50 border-sky-200',
          ring: '#0ea5e9',
          bgGradient: 'from-sky-500/10 via-sky-500/5 to-transparent',
          textColor: 'text-sky-600',
        };
      case 'Unhealthy':
        return {
          badge: 'text-amber-700 bg-amber-50 border-amber-200',
          ring: '#f59e0b',
          bgGradient: 'from-amber-500/15 via-amber-500/5 to-transparent',
          textColor: 'text-amber-600',
        };
      case 'Very Unhealthy':
        return {
          badge: 'text-orange-700 bg-orange-50 border-orange-200',
          ring: '#f97316',
          bgGradient: 'from-orange-500/20 via-orange-500/5 to-transparent',
          textColor: 'text-orange-600',
        };
      case 'Hazardous':
        return {
          badge: 'text-rose-700 bg-rose-50 border-rose-200',
          ring: '#e11d48',
          bgGradient: 'from-rose-500/25 via-rose-500/5 to-transparent',
          textColor: 'text-rose-600',
        };
    }
  };

  const statusStyle = getStatusColor(currentRegionData.status);

  // Calculate arc stroke offset for circular gauge
  const clampedPsi = Math.min(Math.max(currentRegionData.psi24Hourly, 0), 350);
  const strokeDashoffset = 440 - (440 * clampedPsi) / 350;

  return (
    <div className="space-y-8">
      {/* Visual Hero Billboard */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-950 text-white shadow-lg">
        <div className="absolute inset-0">
          <img
            src={IMAGES.skyline}
            alt="Singapore Marina Bay Skyline"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-45 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Singapore National Environment Agency Live Feed</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Live Singapore Haze Monitor & Geographic Map
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mb-6">
            Real-time environmental data for the 5 official sectors. Enter your current hotel or destination below to immediately reveal your local readings.
          </p>

          {/* Quick Location Search Bar within Live Monitor */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Enter hotel or attraction (e.g. Sentosa, Marina Bay Sands)..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-900/90 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors shadow-sm shrink-0"
            >
              Match Zone
            </button>
          </form>

          {userLocation && (
            <div className="mt-3 text-xs text-slate-300 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>Current matched spot: <strong className="text-white">{userLocation.matchedName}</strong> ({userLocation.region.toUpperCase()})</span>
            </div>
          )}
        </div>
      </section>

      {/* Sub-navigation Switcher: Sector Map vs Monsoon Hotspot Tracker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            onClick={() => setLiveView('map')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              liveView === 'map'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Singapore 5 Sectors & Sensors</span>
          </button>
          <button
            onClick={() => setLiveView('monsoon')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              liveView === 'monsoon'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wind className="w-4 h-4 text-sky-600" />
            <span>Monsoon Wind & Hotspot Radar</span>
            <span className="px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
              ASMC
            </span>
          </button>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="self-end sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Live Feed'}</span>
        </button>
      </div>

      {liveView === 'monsoon' ? (
        <MonsoonHotspotTracker onNavigateToItinerary={onNavigateToItinerary} />
      ) : (
        <>
          {/* Main Dual Console: Circular Gauge & Accurate SVG Regional Map */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Circular Atmospheric Gauge (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full bg-gradient-to-br ${statusStyle.bgGradient} blur-2xl pointer-events-none`} />

          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="font-bold text-sm text-slate-900">
                  {currentRegionData.displayName}
                </span>
              </div>
              <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyle.badge}`}>
                {currentRegionData.status}
              </div>
            </div>

            <div className="py-6 flex flex-col items-center justify-center">
              <div className="relative w-56 h-56 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#f1f5f9"
                    strokeWidth="12"
                    fill="transparent"
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
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    24-Hr PSI
                  </span>
                  <span className="text-5xl font-black text-slate-900 font-mono tracking-tight tabular-nums my-0.5">
                    {currentRegionData.psi24Hourly}
                  </span>
                  <span className={`text-xs font-bold ${statusStyle.textColor}`}>
                    {currentRegionData.status} Air
                  </span>
                </div>
              </div>

              {/* 1-Hour PM2.5 Strip */}
              <div className="w-full mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      1-Hour PM2.5: {currentRegionData.pm25OneHourly} µg/m³
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Immediate outdoor particle exposure
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Live</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{currentRegionData.updateTime}</span>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1 font-medium text-slate-900 hover:text-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: High-Accuracy Geographic SVG Regional Map (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Accurate Singapore Regional Map
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any of the 5 official NEA sectors to inspect local readings
                </p>
              </div>

              <button
                onClick={onToggleAlertThreshold}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  alertThresholdEnabled
                    ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{alertThresholdEnabled ? 'Alerts ON (>100)' : 'Enable Alert'}</span>
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
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4 pt-4 border-t border-slate-100">
            {(['national', 'central', 'south', 'east', 'west', 'north'] as SingaporeRegion[]).map((rKey) => {
              const data = allRegionsData[rKey];
              const isSelected = selectedRegion === rKey;
              return (
                <button
                  key={rKey}
                  onClick={() => onSelectRegion(rKey)}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-700'
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
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4 text-slate-600" />
            <span>Singapore MOH & NEA Official Protocol</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Air Quality Bands & Recommended Tourist Actions
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Guidelines mapping 24-hr PSI air quality ranges to safe sightseeing practices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {PSI_ADVISORY_BANDS.map((band) => (
            <div
              key={band.range}
              className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {band.range}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${band.badgeColor}`}>
                    {band.status}
                  </span>
                </div>
                <div className={`h-1.5 w-full rounded-full ${band.barColor} mb-2.5`} />
                <p className="text-xs font-medium text-slate-800 leading-snug mb-1">
                  {band.summary}
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {band.generalTourists}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 text-[10px] text-slate-600">
                <span className="font-semibold text-slate-800 block">Sensitive Groups:</span>
                <span>{band.vulnerableTourists}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
      )}
    </div>
  );
};
