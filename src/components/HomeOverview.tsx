import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Sparkles,
  Info,
  Compass,
  ShoppingBag,
  Shield,
  ArrowRight,
  X,
  ExternalLink,
  Activity,
  Wind,
} from 'lucide-react';
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
  const { t } = useApp();
  const [searchInput, setSearchInput] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isSearchingOneMap, setIsSearchingOneMap] = useState<boolean>(false);
  const [oneMapSuggestions, setOneMapSuggestions] = useState<OneMapSearchResultItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // Pop-up modal states for exploring more details
  const [activeModal, setActiveModal] = useState<
    'zone' | 'airQuality' | 'itinerary' | 'essentials' | null
  >(null);

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
    }, 250);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Robust Find My Zone action with immediate visual feedback
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const queryToUse = searchInput.trim() || userLocation?.matchedName || 'Marina Bay Sands';

    setShowSuggestions(false);
    setIsSearchingOneMap(true);
    try {
      const matched = await resolveSingaporeLocationWithOneMap(queryToUse);
      onSetUserLocation(matched);
      onSelectRegion(matched.region);
      setSearchInput(matched.matchedName);
      // Immediately open the Zone Detail Pop-up so the user has unmistakable confirmation
      setActiveModal('zone');
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
    setActiveModal('zone');
  };

  const handleSelectPreset = async (presetName: string) => {
    setSearchInput(presetName);
    setShowSuggestions(false);
    setIsSearchingOneMap(true);
    try {
      const matched = await resolveSingaporeLocationWithOneMap(presetName);
      onSetUserLocation(matched);
      onSelectRegion(matched.region);
      setActiveModal('zone');
    } finally {
      setIsSearchingOneMap(false);
    }
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
        setActiveModal('zone');
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation fallback:', err);
        handleSelectPreset('Marina Bay Sands');
      },
      { timeout: 7000 }
    );
  };

  const [showMoreSpots, setShowMoreSpots] = useState<boolean>(false);

  const primarySpots = [
    'Marina Bay Sands',
    'Sentosa Island',
    'Orchard Road',
  ];

  const extendedSpots = [
    'Changi Airport / Jewel',
    'Singapore Zoo',
    'Jurong East',
    'Bugis & Kampong Glam',
    'Chinatown',
    'Little India',
  ];

  const activeZoneData = userLocation ? allRegionsData[userLocation.region] || currentRegionData : currentRegionData;

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* 1. Restored Grey Color for Main Card */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-600/40 dark:border-slate-700/60 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-700 dark:from-slate-800 dark:via-slate-850 dark:to-slate-800 text-white shadow-xl p-5 sm:p-10 transition-colors">
        {/* Subtle Ambient Background Texture */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={IMAGES.skyline}
            alt="Singapore Marina Bay Skyline"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-800/90 via-slate-800/65 to-slate-700/40 dark:from-slate-900/90 dark:via-slate-900/65 dark:to-slate-800/40" />
        </div>

        <div className="relative z-10 max-w-3xl">
          {/* Subtle Top Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 dark:bg-white/10 backdrop-blur-md border border-white/25 text-xs font-semibold text-slate-100 mb-3 sm:mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t('officialBadge')}</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 sm:mb-3 leading-tight">
            {t('heroTitle1')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-white to-amber-200">
              {t('heroTitle2')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-7 font-normal">
            {t('heroDesc')}
          </p>

          {/* Location Search Bar with OneMap SG Live Search */}
          <div className="relative bg-slate-700/65 dark:bg-slate-800/75 backdrop-blur-md border border-white/20 p-2 sm:p-2.5 rounded-2xl shadow-lg">
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

            {/* Live Suggestions Dropdown */}
            {showSuggestions && oneMapSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden z-50">
                <div className="px-3.5 py-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span>{t('oneMapLiveSuggestions')}</span>
                  <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">{t('officialGovData')}</span>
                </div>
                <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60">
                  {oneMapSuggestions.map((item, idx) => (
                    <button
                      key={`${item.SEARCHVAL}-${idx}`}
                      type="button"
                      onClick={() => handleSelectOneMapResult(item)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/70 transition-colors flex items-start gap-2.5"
                    >
                      <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.BUILDING && item.BUILDING !== 'NIL' ? item.BUILDING : item.SEARCHVAL}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {item.ADDRESS}
                        </div>
                      </div>
                      {item.POSTAL && item.POSTAL !== 'NIL' && (
                        <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          S({item.POSTAL})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Popular Presets (Reduced to 3 with More button) */}
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mr-1">{t('popularSpots')}</span>
              {primarySpots.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-[11px] font-medium transition-colors border border-slate-200 dark:border-slate-600 shadow-2xs"
                >
                  {preset}
                </button>
              ))}

              {/* Button to see more spots */}
              <button
                type="button"
                onClick={() => setShowMoreSpots(!showMoreSpots)}
                className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-700 dark:text-sky-300 text-[11px] font-semibold transition-colors border border-sky-200 dark:border-sky-800"
              >
                {showMoreSpots ? '− Less' : '+ More Spots'}
              </button>

              {/* Extended spots shown when expanded */}
              {showMoreSpots && (
                <div className="w-full flex flex-wrap items-center gap-1.5 pt-1.5 animate-fade-in">
                  {extendedSpots.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-[11px] font-medium transition-colors border border-slate-200 dark:border-slate-600 shadow-2xs"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Simplified Location Match Result Card with Details Pop-up */}
          {userLocation && (
            <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-sky-50/70 dark:bg-slate-800/80 border border-sky-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 dark:text-white text-xs sm:text-sm">
                      {userLocation.matchedName}
                    </strong>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300">
                      {userLocation.region.toUpperCase()} ZONE
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    24-hr PSI: <span className="font-bold text-slate-900 dark:text-white">{activeZoneData?.psi24Hourly ?? '--'}</span> ({activeZoneData?.status ?? 'Mod'})
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal('zone')}
                className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-xs text-sky-700 dark:text-sky-300 font-bold transition-all shrink-0 border border-sky-200 dark:border-slate-600 flex items-center gap-1 shadow-2xs"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 2. Simplified Feature Cards with Pop-up Exploration */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Air Quality Snapshot */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              Live Air Quality Status
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Real-time NEA air quality data across Singapore’s 5 geographic sectors.
            </p>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs flex items-center justify-between">
              <span className="font-medium text-slate-600 dark:text-slate-300">National PSI:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {allRegionsData['national']?.psi24Hourly ?? currentRegionData.psi24Hourly} · {currentRegionData.status}
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('airQuality')}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Explore Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Indoor Sanctuaries */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              Indoor Sanctuary Itinerary
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Instantly substitute outdoor walks for filtered, air-conditioned wonder-domes and museums.
            </p>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs flex items-center justify-between">
              <span className="font-medium text-slate-600 dark:text-slate-300">Sanctuaries Curated:</span>
              <span className="font-bold text-sky-600 dark:text-sky-400">12+ Top Spots</span>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('itinerary')}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Explore Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Protection Essentials */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              Haze Supplies & Clinics
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Genuine NIOSH N95 masks, sterile eye drops, and 24/7 tourist clinic assistance.
            </p>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs flex items-center justify-between">
              <span className="font-medium text-slate-600 dark:text-slate-300">Emergency 24/7:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">Dial 995</span>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('essentials')}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Explore Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 3. Detailed Pop-Up Modals (Triggered when user clicks details) */}
      {/* Pop-up: Matched Zone Details */}
      {activeModal === 'zone' && userLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white transition-colors">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {userLocation.matchedName}
                  </h3>
                  <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
                    {userLocation.region.toUpperCase()} Singapore Sector
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">24-Hour PSI Reading:</span>
                  <span className="font-mono font-black text-lg text-slate-900 dark:text-white">
                    {activeZoneData?.psi24Hourly ?? '--'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">1-Hour PM2.5 Exposure:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {activeZoneData?.pm25OneHourly ?? '--'} µg/m³
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">NEA Advisory Status:</span>
                  <span className="px-2 py-0.5 rounded-full font-bold bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300">
                    {activeZoneData?.status ?? 'Moderate'}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  Tourist Guidance for this Zone:
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeZoneData?.description || 'Normal sightseeing activities can be continued. If air quality degrades, switch to nearby indoor sanctuaries.'}
                </p>
              </div>

              {userLocation.fullAddress && (
                <div className="text-slate-500 dark:text-slate-400">
                  <span className="font-semibold block">Address / Landmark:</span>
                  <span>{userLocation.fullAddress}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  onNavigateToTab('live');
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View on Live Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  onNavigateToTab('itinerary');
                }}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
              >
                Swap Itinerary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up: Air Quality Detail Modal */}
      {activeModal === 'airQuality' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white transition-colors">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold">Islandwide Air Quality Breakdown</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 max-h-72 overflow-y-auto">
              {(['central', 'south', 'north', 'east', 'west'] as SingaporeRegion[]).map((r) => {
                const regData = allRegionsData[r];
                return (
                  <div
                    key={r}
                    onClick={() => {
                      onSelectRegion(r);
                      setActiveModal(null);
                      onNavigateToTab('live');
                    }}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:border-sky-400 transition-colors"
                  >
                    <div>
                      <span className="font-bold text-xs uppercase block">{r} Sector</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        1-hr PM2.5: {regData?.pm25OneHourly ?? '--'} µg/m³
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-black text-sm block">
                        PSI {regData?.psi24Hourly ?? '--'}
                      </span>
                      <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400">
                        {regData?.status ?? 'Mod'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                setActiveModal(null);
                onNavigateToTab('live');
              }}
              className="w-full mt-3 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors"
            >
              Open Full Interactive Map
            </button>
          </div>
        </div>
      )}

      {/* Pop-up: Itinerary Highlights Modal */}
      {activeModal === 'itinerary' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white transition-colors">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-sky-500" />
                <h3 className="text-base font-bold">Indoor Sanctuary Highlights</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <strong className="block text-slate-900 dark:text-white">Cloud Forest & Flower Dome</strong>
                <span className="text-slate-500 dark:text-slate-400">23°C climate-controlled mountain biodomes at Gardens by the Bay.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <strong className="block text-slate-900 dark:text-white">Jewel Changi Rain Vortex</strong>
                <span className="text-slate-500 dark:text-slate-400">Enclosed world-tallest indoor waterfall and canopy park.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <strong className="block text-slate-900 dark:text-white">S.E.A. Aquarium Sentosa</strong>
                <span className="text-slate-500 dark:text-slate-400">Undersea habitat with filtered AC and 100,000+ marine animals.</span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveModal(null);
                onNavigateToTab('itinerary');
              }}
              className="w-full mt-3 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors"
            >
              Explore All 12+ Sanctuaries
            </button>
          </div>
        </div>
      )}

      {/* Pop-up: Essentials & Clinics Modal */}
      {activeModal === 'essentials' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white transition-colors">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold">Haze Supplies & Emergency</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
                <div>
                  <strong className="block text-rose-800 dark:text-rose-300">Singapore Emergency Hotline</strong>
                  <span className="text-slate-600 dark:text-slate-300">Ambulance & Civil Defence (Severe distress)</span>
                </div>
                <a href="tel:995" className="px-3 py-1 bg-rose-600 text-white font-bold rounded-lg text-sm">
                  995
                </a>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <strong className="block text-slate-900 dark:text-white">NIOSH N95 Respirators</strong>
                <span className="text-slate-500 dark:text-slate-400">Available at Watsons, Guardian, and Unity across all malls.</span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveModal(null);
                onNavigateToTab('guide');
              }}
              className="w-full mt-3 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors"
            >
              Open Pharmacy & Clinic Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
