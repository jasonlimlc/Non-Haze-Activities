import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Train,
  Bookmark,
  MapPin,
  Clock,
  Search,
  ExternalLink,
  ShieldCheck,
  X,
  Sparkles,
  Ticket,
} from 'lucide-react';
import { ITINERARY_SUBSTITUTIONS } from '../data/hazeData';
import { ItinerarySubstitution } from '../types/haze';

export const ItinerarySubstitutionEngine: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalItem, setActiveModalItem] = useState<ItinerarySubstitution | null>(null);
  const [savedPlanIds, setSavedPlanIds] = useState<string[]>([
    'gardens-outdoors-to-domes',
    'marina-barrage-to-jewel',
  ]);

  const categories = [
    'All',
    'Botanical Dome',
    'Museum & Culture',
    'Mega Entertainment',
    'Shopping & Dining',
    'Family & Kids',
  ];

  const filteredItems = ITINERARY_SUBSTITUTIONS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.alternativeCategory === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.outdoorAttraction.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.indoorAlternative.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nearestMrt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const toggleSavePlan = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedPlanIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      {/* Visual Header */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-900">Value Proposition 3</span>
              <span aria-hidden="true">·</span>
              <span>Smart Itinerary Substitution</span>
              <span aria-hidden="true">·</span>
              <span>100% Air-Conditioned</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
              Swap Outdoor Heat for World-Class Indoor Wonders
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              Don’t let smoke haze ruin your vacation. Singapore’s world-renowned indoor bio-domes, underground shopping corridors, and museum complexes feature hospital-grade HEPA filtration and cool 23°C climates.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-slate-900 text-white text-center shadow-md">
              <span className="text-2xl font-black font-mono tabular-nums block">
                {savedPlanIds.length}
              </span>
              <span className="text-[11px] text-slate-300">Saved in Day Pass</span>
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search outdoor attraction or indoor sanctuary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Substitution Gallery Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isSaved = savedPlanIds.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => setActiveModalItem(item)}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Visual Card Image Banner with Badges */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.indoorAlternative}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => toggleSavePlan(item.id, e)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-900/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-slate-900 transition-colors shadow-md z-10"
                    title={isSaved ? 'Remove from plan' : 'Save to plan'}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : 'text-white'}`}
                    />
                  </button>

                  {/* Air Quality Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold tracking-wide shadow-sm flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{item.indoorAirQuality}</span>
                  </div>

                  {/* Overlay Title */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="text-[11px] text-slate-300 mb-0.5">
                      {item.alternativeCategory} · {item.admission}
                    </div>
                    <h3 className="font-extrabold text-lg text-white leading-snug drop-shadow-sm">
                      {item.indoorAlternative}
                    </h3>
                  </div>
                </div>

                {/* Card Body: The Outdoor Swap Pill */}
                <div className="p-5 space-y-3">
                  <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs">
                    <span className="text-[10px] uppercase font-bold text-rose-700 block mb-0.5">
                      Avoid Outdoor Exposure:
                    </span>
                    <span className="line-through text-slate-500 block text-[11px]">
                      {item.outdoorAttraction}
                    </span>
                    <span className="text-slate-700 font-medium block text-xs mt-1">
                      {item.highlight}
                    </span>
                  </div>

                  {/* MRT Linkway */}
                  <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                    <Train className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{item.nearestMrt}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.suggestedDuration}</span>
                </span>
                <span className="font-bold text-slate-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View Route</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Interactive Detail Modal for Selected Attraction */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200">
            {/* Modal Image Header */}
            <div className="relative h-64 w-full bg-slate-100">
              <img
                src={activeModalItem.imageUrl}
                alt={activeModalItem.indoorAlternative}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <div className="flex items-center gap-2 text-xs text-slate-300 mb-1">
                  <span className="font-bold">{activeModalItem.alternativeCategory}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeModalItem.admission} Admission</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeModalItem.indoorAirQuality}</span>
                </div>
                <h2 className="text-2xl font-black text-white">
                  {activeModalItem.indoorAlternative}
                </h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Highlight */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-1">Why Tourists Love This:</span>
                {activeModalItem.highlight}
              </div>

              {/* MRT Sheltered Directions */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Subterranean Sheltered Route
                </span>
                <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-3 text-xs">
                  <Train className="w-5 h-5 text-slate-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">
                      {activeModalItem.nearestMrt}
                    </span>
                    <span className="text-slate-500 block mt-0.5">
                      {activeModalItem.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Haze Survival Tips */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Comfort & Transit Tips
                </span>
                <ul className="space-y-2 text-xs text-slate-600">
                  {activeModalItem.practicalTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer Buttons */}
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => toggleSavePlan(activeModalItem.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  savedPlanIds.includes(activeModalItem.id)
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>
                  {savedPlanIds.includes(activeModalItem.id)
                    ? 'Saved in Day Plan'
                    : 'Add to My Day Plan'}
                </span>
              </button>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  activeModalItem.indoorAlternative + ' Singapore'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
              >
                <MapPin className="w-4 h-4" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
