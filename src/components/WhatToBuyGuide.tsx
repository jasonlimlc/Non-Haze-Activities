import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Phone,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Search,
  Navigation,
  Copy,
  Check,
  Building2,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { MEDICAL_SUPPLIES, IMAGES } from '../data/hazeData';
import { RetailPharmacy } from '../data/retailPharmacies';

export const WhatToBuyGuide: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Backend Retail Pharmacy Locator State
  const [pharmacies, setPharmacies] = useState<RetailPharmacy[]>([]);
  const [isLoadingPharmacies, setIsLoadingPharmacies] = useState<boolean>(true);
  const [pharmacySearch, setPharmacySearch] = useState<string>('');
  const [selectedChain, setSelectedChain] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [totalPharmacies, setTotalPharmacies] = useState<number>(0);

  const fetchPharmacies = async (opts?: {
    search?: string;
    chain?: string;
    region?: string;
    coords?: { lat: number; lng: number } | null;
  }) => {
    setIsLoadingPharmacies(true);
    try {
      const params = new URLSearchParams();
      const s = opts?.search !== undefined ? opts.search : pharmacySearch;
      const c = opts?.chain !== undefined ? opts.chain : selectedChain;
      const r = opts?.region !== undefined ? opts.region : selectedRegion;
      const pos = opts?.coords !== undefined ? opts.coords : userCoords;

      if (s.trim()) params.set('search', s.trim());
      if (c && c !== 'all') params.set('chain', c);
      if (r && r !== 'all') params.set('region', r);
      if (pos) {
        params.set('lat', String(pos.lat));
        params.set('lng', String(pos.lng));
      }
      params.set('limit', '100');

      const res = await fetch(`/api/pharmacies?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPharmacies(data.pharmacies || []);
        setTotalPharmacies(data.total || data.pharmacies?.length || 0);
      }
    } catch (err) {
      console.warn('Error fetching pharmacies from backend:', err);
    } finally {
      setIsLoadingPharmacies(false);
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPharmacies();
  };

  const handleUseGeolocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        fetchPharmacies({ coords });
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 7000 }
    );
  };

  const handleCopyAddress = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = [
    'All',
    'Respiratory Protection',
    'Eye Care',
    'Throat & Nasal',
    'Medication & Devices',
  ];

  const filteredSupplies = MEDICAL_SUPPLIES.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  return (
    <div className="space-y-8">
      {/* Visual Billboard with 3M Aura N95 Studio Feature */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-900">Value Proposition 2</span>
              <span aria-hidden="true">·</span>
              <span>Essential Tourist Haze Kit</span>
              <span aria-hidden="true">·</span>
              <span>Singapore Price Benchmarks</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              What to Buy in Singapore & Where to Find Genuine Stock
            </h1>

            <p className="text-slate-600 text-sm leading-relaxed">
              Don’t fall for overpriced or ineffective masks. Understand why certified N95 respirators are necessary for fine PM2.5 smoke, discover doctor-recommended eye and nasal essentials, and locate official 24-hour Singapore pharmacies.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-900">Price Regulated:</span>
              <span className="text-slate-600">Standard SGD retail pricing enforced across all national chains</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner group">
            <img
              src={IMAGES.n95Studio}
              alt="Certified 3M Aura N95 Respirator"
              referrerPolicy="no-referrer"
              className="w-full h-64 object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-[11px] flex items-center justify-between">
              <span className="font-semibold">3M Aura 9320A+ / 9205+</span>
              <span className="text-emerald-400 font-bold">NIOSH Certified N95</span>
            </div>
          </div>
        </div>
      </section>

      {/* Visual N95 vs Surgical Comparison Card Deck */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
            Critical Tourist Truth
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Why Ordinary Surgical Masks Fail Against Haze
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            The #1 mistake tourists make is wearing standard blue surgical masks. Here is why Singapore health authorities advise against them:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* N95 Respirator Card */}
          <div className="p-6 rounded-3xl border-2 border-emerald-300 bg-emerald-50/40 relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Certified N95 Respirator</span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-600 text-white">
                MOH RECOMMENDED
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Engineered with electrostatically charged microfibers that capture $\ge$95% of fine airborne smoke particles (0.1–0.3 µm). Forms an airtight custom seal against your face.
            </p>

            <div className="pt-2 border-t border-emerald-200/80 grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="font-bold text-slate-900 block">Facial Seal:</span>
                <span className="text-slate-600">Airtight fit over bridge & chin</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Standard Price:</span>
                <span className="text-emerald-800 font-semibold">S$2.50 – S$3.50 per pc</span>
              </div>
            </div>
          </div>

          {/* Standard Surgical Mask Card */}
          <div className="p-6 rounded-3xl border-2 border-rose-300 bg-rose-50/40 relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-900 font-extrabold text-base">
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>Standard Surgical / Paper Mask</span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-600 text-white">
                INSUFFICIENT
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Designed only to block large liquid droplets from coughing. PM2.5 smoke particles easily pass right through the loose edges around your cheeks and large filter pores.
            </p>

            <div className="pt-2 border-t border-rose-200/80 grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="font-bold text-slate-900 block">Edge Leakage:</span>
                <span className="text-rose-700 font-semibold">Over 60% unfiltered air bypass</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Haze Rating:</span>
                <span className="text-slate-600">False sense of security</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Visual Fit Guide */}
        <div className="mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-bold text-slate-900 block mb-3">
            Quick 4-Step N95 Seal Check (Test Before Leaving Hotel):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs text-slate-600">
            <div className="p-3 bg-white rounded-xl border border-slate-200/70">
              <span className="font-bold text-slate-900 block mb-1">1. Cup In Hand</span>
              <span>Position the mask securely over your nose bridge and chin.</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200/70">
              <span className="font-bold text-slate-900 block mb-1">2. Dual Straps</span>
              <span>Pull upper strap to crown of head, lower strap below ears.</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200/70">
              <span className="font-bold text-slate-900 block mb-1">3. Nose Strip</span>
              <span>Mould the flexible metal strip with both index fingers.</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200/70">
              <span className="font-bold text-slate-900 block mb-1">4. Inhale Check</span>
              <span>Breathe sharply in: mask should pull slightly in without air leaks.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog Cards */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Recommended Singapore Tourist Haze Kit
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Available over-the-counter across all authorized retail pharmacies
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSupplies.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                    {item.category}
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-xs">
                    {item.singaporePriceSgd}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base mb-2 leading-snug">
                  {item.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {item.whyNeeded}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <div>
                    <span className="font-bold text-slate-800">Top Brands: </span>
                    {item.recommendedBrands.join(', ')}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Advice: </span>
                    {item.usageAdvice}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Stock: <strong className="text-emerald-700">{item.stockAvailability}</strong></span>
                <span>{item.retailers[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Official HSA Retail Pharmacy Locator (data.gov.sg dataset d_bb92615f43de22933e4479558b1f6c36) */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>HSA Licensed Pharmacies</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400 font-mono">Dataset d_bb92615f43de22933e4479558b1f6c36</span>
              <span aria-hidden="true">·</span>
              <span>249 Locations Islandwide</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Singapore Retail Pharmacy Locator
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Live directory of Health Sciences Authority (HSA) registered retail pharmacies. Filter by your current district, search by shopping mall or postal code, or sort by closest walking distance to purchase genuine N95 masks and medical eye wash.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center">
            <button
              type="button"
              onClick={handleUseGeolocation}
              disabled={isLocating}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                userCoords
                  ? 'bg-sky-50 text-sky-700 border-sky-300 shadow-xs'
                  : 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : userCoords ? 'Near Me (GPS Active)' : 'Find Closest to Me'}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search mall, road, postal code (e.g. Bugis, Takashimaya, 188021)..."
              value={pharmacySearch}
              onChange={(e) => {
                setPharmacySearch(e.target.value);
                fetchPharmacies({ search: e.target.value });
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50/50"
            />
          </div>

          {/* Chain Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedChain}
              onChange={(e) => {
                setSelectedChain(e.target.value);
                fetchPharmacies({ chain: e.target.value });
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="all">All Chains (249)</option>
              <option value="guardian">Guardian (73)</option>
              <option value="watson">Watsons (33)</option>
              <option value="unity">Unity Pharmacy (50)</option>
              <option value="hospital">Hospital & Medical (25)</option>
              <option value="independent">Independent / Other</option>
            </select>
          </div>

          {/* Region Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                fetchPharmacies({ region: e.target.value });
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="all">All Singapore Regions</option>
              <option value="central">Central Region</option>
              <option value="south">South Region / Sentosa</option>
              <option value="east">East Region / Changi</option>
              <option value="north">North Region</option>
              <option value="west">West Region</option>
            </select>
          </div>
        </div>

        {/* Results Metadata Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong className="text-slate-900">{pharmacies.length}</strong> of{' '}
            <strong className="text-slate-900">{totalPharmacies}</strong> registered pharmacies
            {userCoords && ' · Sorted by nearest distance'}
          </span>
          {(pharmacySearch || selectedChain !== 'all' || selectedRegion !== 'all' || userCoords) && (
            <button
              onClick={() => {
                setPharmacySearch('');
                setSelectedChain('all');
                setSelectedRegion('all');
                setUserCoords(null);
                fetchPharmacies({ search: '', chain: 'all', region: 'all', coords: null });
              }}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Pharmacy Outlet Cards Grid */}
        {isLoadingPharmacies ? (
          <div className="py-16 text-center text-slate-400">
            <Sparkles className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
            <p className="text-xs font-medium">Querying Singapore HSA retail pharmacy registry...</p>
          </div>
        ) : pharmacies.length === 0 ? (
          <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200/80">
            <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No pharmacies found</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search term or selecting "All Singapore Regions".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[640px] overflow-y-auto pr-1">
            {pharmacies.map((pharmacy) => {
              const chainBadgeColor =
                pharmacy.chain === 'Guardian'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : pharmacy.chain === 'Watsons'
                  ? 'bg-sky-100 text-sky-900 border-sky-300'
                  : pharmacy.chain === 'Unity'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-purple-100 text-purple-900 border-purple-300';

              return (
                <div
                  key={pharmacy.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${chainBadgeColor}`}
                      >
                        {pharmacy.chain}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {pharmacy.distanceKm !== undefined && (
                          <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                            📍 {pharmacy.distanceKm} km
                          </span>
                        )}
                        <span className="text-[10px] font-semibold uppercase text-slate-400">
                          {pharmacy.region}
                        </span>
                      </div>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                      {pharmacy.name}
                    </h4>

                    <div className="flex items-start gap-2 text-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed line-clamp-2">{pharmacy.address}</span>
                    </div>

                    {pharmacy.postal && (
                      <div className="text-[11px] font-mono text-slate-400 pl-5">
                        Postal Code: {pharmacy.postal}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyAddress(pharmacy.id, pharmacy.address)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                      title="Copy Address"
                    >
                      {copiedId === pharmacy.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        pharmacy.name + ' ' + pharmacy.address
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-slate-900 hover:text-sky-600 text-[11px] transition-colors"
                    >
                      <span>Directions</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
