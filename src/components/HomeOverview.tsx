import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Search,
  Navigation,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Stethoscope,
  BookOpen,
  Sparkles,
  PhoneCall,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { RegionalPsiData, SingaporeRegion } from '../types/haze';
import { IMAGES, ITINERARY_SUBSTITUTIONS } from '../data/hazeData';
import { SingaporeRegionalMap } from './SingaporeRegionalMap';
import { resolveSingaporeLocation, resolveCoordinatesToRegion, LocationMatchResult } from '../utils/locationResolver';

interface HomeOverviewProps {
  currentRegionData: RegionalPsiData;
  allRegionsData: Record<SingaporeRegion, RegionalPsiData>;
  selectedRegion: SingaporeRegion;
  onSelectRegion: (region: SingaporeRegion) => void;
  onNavigateToTab: (tab: 'live' | 'itinerary' | 'supplies' | 'health' | 'education' | 'talk') => void;
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
  const [searchInput, setSearchInput] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchInput.trim()) return;

    const matched = resolveSingaporeLocation(searchInput);
    onSetUserLocation(matched);
    onSelectRegion(matched.region);
  };

  const handleSelectPreset = (presetName: string) => {
    setSearchInput(presetName);
    const matched = resolveSingaporeLocation(presetName);
    onSetUserLocation(matched);
    onSelectRegion(matched.region);
  };

  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
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
          note: 'Located via browser GPS',
        };
        onSetUserLocation(matched);
        onSelectRegion(region);
        setSearchInput('My Current Location');
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        // Fallback to central
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
    <div className="space-y-10">
      {/* 1. Hero Search & Location Intelligence Header */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-950 text-white shadow-xl">
        <div className="absolute inset-0">
          <img
            src={IMAGES.skyline}
            alt="Singapore Marina Bay Skyline"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/40" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-slate-200 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Captain Haze · Official Tourist Haze Companion</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
            Explore Singapore Confidently, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-white to-amber-200">
              Whatever the Air Quality.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-8">
            Key in your hotel or destination to find your exact NEA haze zone, receive real-time PSI alerts, and instantly substitute outdoor walking with world-class air-conditioned sanctuaries.
          </p>

          {/* Location Search Bar (Requirement 2: Key in specific locations) */}
          <div className="bg-white/10 backdrop-blur-md p-2 sm:p-3 rounded-2xl border border-white/20 shadow-lg max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  type="text"
                  placeholder="Enter your hotel, landmark (e.g. Marina Bay Sands, Sentosa, 018956)..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl bg-slate-900/80 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleUseGeolocation}
                  disabled={isLocating}
                  className="px-3.5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition-all shrink-0"
                  title="Detect GPS Location"
                >
                  <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">GPS</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-white text-slate-950 text-xs sm:text-sm font-bold hover:bg-slate-100 transition-all shadow-md shrink-0"
                >
                  Find My Zone
                </button>
              </div>
            </form>

            {/* Quick Popular Presets */}
            <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] text-slate-300 font-medium mr-1">Popular spots:</span>
              {quickPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleSelectPreset(preset.label)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors border border-white/10"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location Match Confirmation Box */}
          {userLocation && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-white/20 backdrop-blur-md max-w-2xl flex items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0 border border-sky-400/30">
                  <MapPin className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Location Matched:</span>
                    <strong className="text-white text-sm">{userLocation.matchedName}</strong>
                  </div>
                  <div className="text-xs text-sky-300 font-semibold mt-0.5">
                    Assigned to {userLocation.region.toUpperCase()} Zone · 24-hr PSI: {allRegionsData[userLocation.region]?.psi24Hourly ?? '--'} ({allRegionsData[userLocation.region]?.status ?? 'Mod'})
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigateToTab('live')}
                className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white font-semibold transition-colors shrink-0"
              >
                View Full Reading
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 2. Visual Regional Map & Air Status Dashboard (Requirement 3: Accurate Map) */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              <span>National Environment Agency Feed</span>
              <span aria-hidden="true">·</span>
              <span>data.gov.sg Real-Time</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Singapore Live Air Quality by Geographic Sector
            </h2>
          </div>

          <button
            onClick={() => onNavigateToTab('live')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-slate-700 transition-colors"
          >
            <span>Open Advanced Live Monitor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* High-Accuracy SVG Regional Map Component */}
        <SingaporeRegionalMap
          selectedRegion={selectedRegion}
          allRegionsData={allRegionsData}
          onSelectRegion={onSelectRegion}
          userLocationName={userLocation?.matchedName}
          userCoordinates={userLocation?.coordinates}
        />
      </section>

      {/* 3. Four Core Highlight Pillars (Highlighting Each Tab) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Itinerary Substitution Highlight */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6 group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                <span>Pillar 1 · Holiday Contingency</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-400">100% Sheltered</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Swap Outdoor Plans for Filtered Indoor Sanctuaries
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              If haze spikes outside, switch to Singapore’s world-class cooled biodomes and subterranean trails with underground MRT connectivity.
            </p>

            {/* Quick Mini Cards */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video relative">
                <img
                  src={IMAGES.cloudForest}
                  alt="Cloud Forest Dome"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                  <span className="text-[10px] font-bold text-white leading-tight">Cloud Forest</span>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video relative">
                <img
                  src={IMAGES.jewel}
                  alt="Jewel Changi"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                  <span className="text-[10px] font-bold text-white leading-tight">Jewel Changi</span>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video relative">
                <img
                  src={IMAGES.aquarium}
                  alt="SEA Aquarium"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                  <span className="text-[10px] font-bold text-white leading-tight">S.E.A. Aquarium</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('itinerary')}
            className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Explore All 7 Indoor Substitutions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pillar 2: What to Buy & Pharmacy Highlight */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4" />
                <span>Pillar 2 · Essential Haze Kit</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-400">Official Stockists</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Certified N95 Respirators & 24/7 Pharmacies
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Learn why ordinary blue surgical masks fail against fine PM2.5 smoke and locate 24-hour pharmacies (Guardian Changi Airport & Mustafa Centre).
            </p>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
              <span className="font-bold block">Tourist Protection Checklist:</span>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                <span className="bg-white px-2 py-0.5 rounded border border-amber-200">
                  3M Aura N95 Mask
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-amber-200">
                  Preservative-Free Tears
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-amber-200">
                  Sterile Saline Spray
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('supplies')}
            className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>View Mask Buying Guide & Outlets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pillar 3: Medical & SOS Help Highlight */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4" />
                <span>Pillar 3 · Health & Clinics</span>
              </span>
              <span className="text-[11px] font-bold text-rose-600">SCDF Emergency 995</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Symptom Triage & 24-Hour Emergency Hospitals
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Instant clinical self-check for dry coughing, eye stinging, or breathlessness. Direct links to SGH, KKH pediatric emergency, and hotel room telemedicine.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="tel:995"
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs text-center flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                <span>Ambulance 995</span>
              </a>
              <a
                href="tel:1777"
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs text-center"
              >
                Non-Emergency 1777
              </a>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('health')}
            className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Open Medical Directory & Triage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pillar 4: Science & Haze 101 Highlight */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Pillar 4 · What is Haze?</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-400">NEA Standards</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Understanding the Southeast Asian Smoke Haze
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Learn about regional peatland fires, seasonal monsoon wind patterns (June–October), and the difference between 24-hr PSI and 1-hr PM2.5.
            </p>

            <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 text-xs text-sky-950">
              <span className="font-bold block mb-1">Key Rule of Thumb:</span>
              <p className="text-[11px] leading-relaxed">
                Check the <strong>1-hour PM2.5</strong> reading before heading out to Marina Bay. It represents immediate air quality right this hour.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('education')}
            className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Read Complete Educational Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Community & Forum Callout Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
            <span>Disqus Community Forum</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            Have Questions or Travel Tips? Talk to Us!
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Join our open discussion board powered by Disqus. Ask for live air quality feedback, suggest new indoor sanctuaries, or share where to grab masks in Singapore.
          </p>
        </div>

        <button
          onClick={() => onNavigateToTab('talk')}
          className="shrink-0 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <span>Open "Talk to Us" Forum</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
