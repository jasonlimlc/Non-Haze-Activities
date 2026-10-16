import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Sparkles } from 'lucide-react';
import { RegionalPsiData, SingaporeRegion } from '../types/haze';
import { IMAGES } from '../data/hazeData';
import {
  resolveSingaporeLocationWithOneMap,
  searchOneMapApi,
  resolveCoordinatesToRegion,
  LocationMatchResult,
  OneMapSearchResultItem,
} from '../utils/locationResolver';
import { useApp } from '../context/AppContext';

interface HomeOverviewProps {
  currentRegionData: RegionalPsiData;
  allRegionsData: Record<SingaporeRegion, RegionalPsiData>;
  selectedRegion: SingaporeRegion;
  onSelectRegion: (region: SingaporeRegion) => void;
  onNavigateToTab: (tab: 'live' | 'itinerary' | 'guide') => void;
  userLocation: LocationMatchResult | null;
  onSetUserLocation: (loc: LocationMatchResult | null) => void;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  currentRegionData,
  allRegionsData,
  selectedRegion,
  onSelectRegion,
  onNavigateToTab,
  userLocation,
  onSetUserLocation,
}) => {
  const { t, isMobile } = useApp();
  const [searchInput, setSearchInput] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isSearchingOneMap, setIsSearchingOneMap] = useState<boolean>(false);
  const [oneMapSuggestions, setOneMapSuggestions] = useState<OneMapSearchResultItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // Debounced OneMap auto-suggestions as user types
  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed.length < 3) {
      setOneMapSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const results = await searchOneMapApi(trimmed);
        setOneMapSuggestions(results.slice(0, 5));
      } catch {
        setOneMapSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchInput.trim()) return;

    setShowSuggestions(false);
    setIsSearchingOneMap(true);
    try {
      const matched = await resolveSingaporeLocationWithOneMap(searchInput);
      onSetUserLocation(matched);
      onSelectRegion(matched.region);
    } finally {
      setIsSearchingOneMap(false);
    }
  };

  const handleSelectOneMapResult = (item: OneMapSearchResultItem) => {
    const lat = parseFloat(item.LATITUDE);
    const lng = parseFloat(item.LONGITUDE);
    const region = !isNaN(lat) && !isNaN(lng) ? resolveCoordinatesToRegion(lat, lng) : 'central';

    const title =
      item.BUILDING && item.BUILDING !== 'NIL'
        ? item.BUILDING
        : item.ROAD_NAME && item.ROAD_NAME !== 'NIL'
        ? `${item.BLK_NO && item.BLK_NO !== 'NIL' ? item.BLK_NO + ' ' : ''}${item.ROAD_NAME}`
        : item.SEARCHVAL || item.ADDRESS;

    const matched: LocationMatchResult = {
      query: item.SEARCHVAL,
      matchedName: title,
      region,
      regionDisplayName: `${region.toUpperCase()} Singapore`,
      coordinates: !isNaN(lat) && !isNaN(lng) ? { lat, lng } : undefined,
      postal: item.POSTAL && item.POSTAL !== 'NIL' ? item.POSTAL : undefined,
      fullAddress: item.ADDRESS,
      note: `${t('verifiedVia')} · Coordinates ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    };

    setSearchInput(title);
    setShowSuggestions(false);
    onSetUserLocation(matched);
    onSelectRegion(region);
  };

  const handleSelectPreset = async (presetName: string) => {
    setSearchInput(presetName);
    setShowSuggestions(false);
    const matched = await resolveSingaporeLocationWithOneMap(presetName);
    onSetUserLocation(matched);
    onSelectRegion(matched.region);
  };

  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      handleSelectPreset('Marina Bay Sands');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        const region = resolveCoordinatesToRegion(latitude, longitude);
        const matched: LocationMatchResult = {
          query: 'My Current Location',
          matchedName: 'GPS Detected Location',
          region,
          regionDisplayName: `${region.toUpperCase()} Singapore`,
          coordinates: { lat: latitude, lng: longitude },
          note: `GPS Verified · Coordinates ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        };
        onSetUserLocation(matched);
        onSelectRegion(region);
        setSearchInput('My Current Location');
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        handleSelectPreset('Marina Bay Sands');
      },
      { timeout: 7000 }
    );
  };

  const quickPresets = [
    { label: 'Marina Bay Sands', sub: 'Central' },
    { label: 'Sentosa / Universal Studios', sub: 'South' },
    { label: 'Orchard Road', sub: 'Central' },
    { label: 'Changi Airport / Jewel', sub: 'East' },
    { label: 'Singapore Zoo / Mandai', sub: 'North' },
    { label: 'Science Centre / Jurong', sub: 'West' },
  ];

  return (
    <div className="w-full">
      {/* Lightened Main Card Container (Refined lighter tone instead of pitch black) */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-600/40 dark:border-slate-700/60 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-700 dark:from-slate-800 dark:via-slate-850 dark:to-slate-800 text-white shadow-xl transition-colors">
        {/* Soft Background Image Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={IMAGES.skyline}
            alt="Singapore Marina Bay Skyline"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-800/90 via-slate-800/65 to-slate-700/40 dark:from-slate-900/90 dark:via-slate-900/65 dark:to-slate-800/40" />
        </div>

        <div className="relative z-10 p-5 sm:p-10 lg:p-12 max-w-4xl">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 dark:bg-white/10 backdrop-blur-md border border-white/25 text-xs text-slate-100 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t('officialBadge')}</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3 sm:mb-4 leading-tight">
            {t('heroTitle1')} <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-white to-amber-200">
              {t('heroTitle2')}
            </span>
          </h1>

          {/* Description */}
          <p className="text-slate-200 text-xs sm:text-base leading-relaxed max-w-2xl mb-6 sm:mb-8 font-normal">
            {t('heroDesc')}
          </p>

          {/* Location Search Bar with OneMap SG Live Search */}
          <div className="relative bg-slate-700/65 dark:bg-slate-800/75 backdrop-blur-md p-2 sm:p-3 rounded-2xl border border-white/20 shadow-lg max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl bg-slate-800/80 dark:bg-slate-900/80 border border-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleUseGeolocation}
                  disabled={isLocating}
                  className="px-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition-all shrink-0 active:scale-95"
                  title="Detect GPS Location"
                >
                  <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? t('locatingGps') : t('gpsBtn')}</span>
                </button>

                <button
                  type="submit"
                  disabled={isSearchingOneMap}
                  className="px-5 py-2.5 sm:py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs sm:text-sm font-bold transition-all shadow-md shrink-0 flex items-center gap-1.5 active:scale-95"
                >
                  {isSearchingOneMap && <Sparkles className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSearchingOneMap ? t('searching') : t('findZoneBtn')}</span>
                </button>
              </div>
            </form>

            {/* OneMap SG Live Suggestions Dropdown */}
            {showSuggestions && oneMapSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-slate-800/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-600 rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="px-3.5 py-2 text-[11px] font-semibold text-slate-300 border-b border-slate-700 flex items-center justify-between">
                  <span>{t('oneMapLiveSuggestions')}</span>
                  <span className="text-[10px] text-sky-300 font-semibold">{t('officialGovData')}</span>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-700/60">
                  {oneMapSuggestions.map((item, idx) => (
                    <button
                      key={`${item.SEARCHVAL}-${idx}`}
                      type="button"
                      onClick={() => handleSelectOneMapResult(item)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-700/80 transition-colors flex items-start gap-2.5 group"
                    >
                      <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {item.BUILDING && item.BUILDING !== 'NIL' ? item.BUILDING : item.SEARCHVAL}
                        </div>
                        <div className="text-[11px] text-slate-300 truncate mt-0.5">
                          {item.ADDRESS}
                        </div>
                      </div>
                      {item.POSTAL && item.POSTAL !== 'NIL' && (
                        <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-200 border border-sky-400/30">
                          S({item.POSTAL})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Popular Presets */}
            <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] text-slate-200 font-medium mr-1">{t('popularSpots')}</span>
              {quickPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleSelectPreset(preset.label)}
                  className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-medium transition-colors border border-white/15"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location Match Confirmation Box (Lightened container tone) */}
          {userLocation && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-700/80 dark:bg-slate-800/85 border border-white/20 backdrop-blur-md max-w-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in shadow-xl">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/25 text-sky-200 flex items-center justify-center shrink-0 border border-sky-400/30 mt-0.5 sm:mt-0">
                  <MapPin className="w-5 h-5 text-sky-300" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-white text-sm uppercase tracking-wide">
                      {userLocation.matchedName}
                    </strong>
                    {userLocation.postal && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/25 text-sky-200 border border-sky-400/30">
                        Postal {userLocation.postal}
                      </span>
                    )}
                  </div>
                  {userLocation.fullAddress && (
                    <div className="text-xs text-slate-200 truncate max-w-md mt-0.5">
                      {userLocation.fullAddress}
                    </div>
                  )}
                  <div className="text-xs text-sky-200 font-semibold mt-1">
                    {t('mappedTo')} {userLocation.region.toUpperCase()} {t('zone')} · {t('hr24Psi')}:{' '}
                    {allRegionsData[userLocation.region]?.psi24Hourly ?? '--'} (
                    {allRegionsData[userLocation.region]?.status ?? 'Mod'})
                  </div>
                  {userLocation.note && (
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      {userLocation.note}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => onNavigateToTab('live')}
                className="self-start sm:self-center px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-xs text-white font-bold transition-all shrink-0 border border-white/20"
              >
                {t('viewFullReading')}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
