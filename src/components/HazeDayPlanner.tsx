import React, { useState } from 'react';
import {
  Baby,
  Landmark,
  UtensilsCrossed,
  BadgePercent,
  ShieldAlert,
  Clock,
  MapPin,
  Train,
  CheckCircle2,
  Copy,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Compass,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { TravelerProfileId, DayPlanSlot } from '../types/haze';
import { TRAVELER_PROFILES, ITINERARY_SUBSTITUTIONS } from '../data/hazeData';

interface HazeDayPlannerProps {
  currentPsi: number;
  psiStatus: string;
  onNavigateToSupplies?: () => void;
  onNavigateToSwap?: () => void;
}

export const HazeDayPlanner: React.FC<HazeDayPlannerProps> = ({
  currentPsi,
  psiStatus,
  onNavigateToSupplies,
  onNavigateToSwap,
}) => {
  const [selectedProfileId, setSelectedProfileId] = useState<TravelerProfileId>('family');
  const [pace, setPace] = useState<'halfDay' | 'fullDay'>('fullDay');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [swapModalSlotId, setSwapModalSlotId] = useState<string | null>(null);

  // Active Profile
  const activeProfile =
    TRAVELER_PROFILES.find((p) => p.id === selectedProfileId) || TRAVELER_PROFILES[0];

  // Base slots based on pace
  const baseSlots = activeProfile.paceOptions[pace];

  // State to hold any custom swapped slots
  const [customSlots, setCustomSlots] = useState<Record<string, DayPlanSlot>>({});

  const displaySlots = baseSlots.map((slot) => {
    return customSlots[slot.id] || slot;
  });

  const getProfileIcon = (id: TravelerProfileId) => {
    switch (id) {
      case 'family':
        return <Baby className="w-5 h-5" />;
      case 'culture':
        return <Landmark className="w-5 h-5" />;
      case 'foodie':
        return <UtensilsCrossed className="w-5 h-5" />;
      case 'budget':
        return <BadgePercent className="w-5 h-5" />;
      case 'sensitive':
        return <ShieldAlert className="w-5 h-5" />;
    }
  };

  const getAirQualityBadge = (rating: DayPlanSlot['airQualityRating']) => {
    switch (rating) {
      case 'HEPA Filtered':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'Fully Enclosed AC':
        return {
          bg: 'bg-sky-50 text-sky-800 border-sky-200',
          dot: 'bg-sky-500',
        };
      case 'Underground Sheltered':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          dot: 'bg-purple-500',
        };
    }
  };

  const handleCopyItinerary = () => {
    const lines = [
      `🇸🇬 CAPTAIN HAZE - CURATED DAY PLAN: ${activeProfile.name.toUpperCase()}`,
      `Air Quality: PSI ${currentPsi} (${psiStatus}) | Pace: ${pace === 'fullDay' ? 'Full Day' : 'Half Day'}`,
      `----------------------------------------------------`,
    ];

    displaySlots.forEach((slot, idx) => {
      lines.push(`\n[${idx + 1}] ${slot.timeSlot}: ${slot.title}`);
      lines.push(`📍 Location: ${slot.location}`);
      lines.push(`🚇 MRT: ${slot.nearestMrt}`);
      lines.push(`🛡️ Air Quality: ${slot.airQualityRating}`);
      lines.push(`💵 Cost: ${slot.estimatedCostSgd}`);
      lines.push(`🚶 Sheltered Link: ${slot.shelteredConnectionNote}`);
      lines.push(`💡 Tips: ${slot.tips.join('; ')}`);
    });

    lines.push(`\nGenerated via Captain Haze Singapore Tourist Assistant.`);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSwapSlot = (slotId: string, alternative: (typeof ITINERARY_SUBSTITUTIONS)[0]) => {
    const existingSlot = displaySlots.find((s) => s.id === slotId);
    if (!existingSlot) return;

    const newSlot: DayPlanSlot = {
      ...existingSlot,
      title: alternative.indoorAlternative,
      category: alternative.alternativeCategory,
      location: alternative.location,
      nearestMrt: alternative.nearestMrt,
      airQualityRating: alternative.indoorAirQuality,
      admission: alternative.admission,
      estimatedCostSgd: alternative.admission === 'Free' ? 'Free Admission' : 'Standard Ticket',
      description: alternative.highlight,
      shelteredConnectionNote: alternative.practicalTips[0] || 'Take sheltered MRT walkway.',
      imageUrl: alternative.imageUrl,
      tips: alternative.practicalTips,
    };

    setCustomSlots((prev) => ({
      ...prev,
      [slotId]: newSlot,
    }));
    setSwapModalSlotId(null);
  };

  const resetSwaps = () => {
    setCustomSlots({});
  };

  return (
    <div className="space-y-8 print:p-0 print:space-y-4">
      {/* Header Banner */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-10 shadow-lg print:border-none print:shadow-none print:bg-none print:text-black print:p-0">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs text-emerald-300 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Tourist Haze Day Planner</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Curated All-Sheltered Singapore Day Schedules
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Select your travel group profile below to instantly generate a seamless, chronologically optimized schedule. Every attraction, restaurant, and transit link is vetted for HEPA air filtration and enclosed MRT subterranean corridors.
          </p>

          {/* Current PSI Alert Context Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
              <span className="font-semibold">Live Singapore Air Index:</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-bold">
                PSI {currentPsi} ({psiStatus})
              </span>
            </div>

            {currentPsi > 100 && (
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-medium bg-amber-950/60 border border-amber-500/30 px-3 py-1.5 rounded-xl">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Elevated haze today: schedule locks strictly to 100% sheltered facilities.</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Profile Selector Cards */}
      <section className="space-y-4 print:hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Step 1: Choose Your Traveler Profile</span>
          </h2>
          <span className="text-xs text-slate-500">5 tailored itineraries</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {TRAVELER_PROFILES.map((profile) => {
            const isSelected = profile.id === selectedProfileId;
            return (
              <button
                key={profile.id}
                onClick={() => {
                  setSelectedProfileId(profile.id);
                  setCustomSlots({});
                }}
                className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md ring-2 ring-slate-900/10'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 text-slate-900'
                }`}
              >
                <div>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                      isSelected ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {getProfileIcon(profile.id)}
                  </div>
                  <h3 className="font-bold text-sm mb-1 leading-snug">{profile.name}</h3>
                  <p
                    className={`text-xs leading-relaxed line-clamp-2 ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {profile.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/20 flex items-center justify-between text-[11px] font-medium">
                  <span className={isSelected ? 'text-emerald-300' : 'text-slate-600'}>
                    {profile.id === 'sensitive' ? 'HEPA Priority' : 'Indoor Sheltered'}
                  </span>
                  <CheckCircle2
                    className={`w-4 h-4 transition-opacity ${
                      isSelected ? 'opacity-100 text-emerald-400' : 'opacity-0'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Pace and Controls Bar */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pace:</span>
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setPace('halfDay')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                pace === 'halfDay' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Half Day (Morning + Lunch)
            </button>
            <button
              onClick={() => setPace('fullDay')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                pace === 'fullDay' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Full Day (Morning to Night)
            </button>
          </div>

          {Object.keys(customSlots).length > 0 && (
            <button
              onClick={resetSwaps}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 ml-2 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Customized Slots</span>
            </button>
          )}
        </div>

        {/* Action Buttons: Copy & Print */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyItinerary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-200"
          >
            <Copy className="w-3.5 h-3.5 text-slate-600" />
            <span>{copiedNotification ? 'Copied to Clipboard!' : 'Copy Itinerary'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Save / Print Schedule</span>
          </button>
        </div>
      </section>

      {/* Active Profile Summary Header */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Schedule</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-700">{activeProfile.idealFor}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">{activeProfile.name}</h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">{activeProfile.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700">
            <span className="text-slate-400 mr-1.5">Total stops:</span>
            <span className="font-bold text-slate-900">{displaySlots.length} curated stops</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700">
            <span className="text-slate-400 mr-1.5">Outdoor walking:</span>
            <span className="font-bold text-emerald-600">0 minutes (100% sheltered)</span>
          </div>
        </div>
      </div>

      {/* Chronological Timeline Slots */}
      <div className="space-y-4">
        {displaySlots.map((slot, index) => {
          const airStyle = getAirQualityBadge(slot.airQualityRating);
          return (
            <article
              key={slot.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col md:flex-row gap-6 relative overflow-hidden"
            >
              {/* Order Indicator Ribbon */}
              <div className="absolute top-0 left-0 bg-slate-900 text-white font-mono text-[10px] font-bold px-3 py-1 rounded-br-xl">
                STOP {index + 1} • {slot.period.toUpperCase()}
              </div>

              {/* Slot Thumbnail or Category Badge (if image exists) */}
              {slot.imageUrl && (
                <div className="w-full md:w-56 h-40 md:h-auto rounded-xl overflow-hidden bg-slate-100 shrink-0 relative mt-4 md:mt-0">
                  <img
                    src={slot.imageUrl}
                    alt={slot.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:hidden" />
                </div>
              )}

              {/* Content Body */}
              <div className="flex-1 space-y-4 mt-2 md:mt-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{slot.timeSlot}</span>
                      </span>

                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-md border text-slate-700 bg-slate-50 border-slate-200">
                        <span>{slot.category}</span>
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-md border ${airStyle.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${airStyle.dot}`} />
                        <span>{slot.airQualityRating}</span>
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                      {slot.title}
                    </h3>
                  </div>

                  {/* Pricing / Admission */}
                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-slate-500 block">Est. Cost</span>
                    <span className="text-sm font-bold text-slate-900">{slot.estimatedCostSgd}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">{slot.description}</p>

                {/* Subterranean Sheltered Transit Guide Box */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-start gap-2 text-xs">
                    <Train className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">MRT Connection: </span>
                      <span className="text-slate-700">{slot.nearestMrt}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs">
                    <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">Sheltered Corridor: </span>
                      <span className="text-slate-700">{slot.shelteredConnectionNote}</span>
                    </div>
                  </div>
                </div>

                {/* Tips & Swap Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="space-y-1">
                    {slot.tips.map((tip, tipIdx) => (
                      <div key={tipIdx} className="flex items-start gap-1.5 text-xs text-slate-500">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>

                  {/* Swap Alternative Button */}
                  <div className="print:hidden shrink-0">
                    <button
                      onClick={() => setSwapModalSlotId(slot.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Swap Alternative</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Bottom Health & Supplies Checklist Callout */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 print:hidden">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Packing Checklist for Today’s Sheltered Schedule
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Even with 100% sheltered destinations, short 2-minute street crossings between taxi drop-offs and MRT exits still expose you to ambient air. Pack certified N95 masks and lubricating eye drops in your day bag.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onNavigateToSupplies && (
            <button
              onClick={onNavigateToSupplies}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
            >
              <span>View Pharmacy Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {onNavigateToSwap && (
            <button
              onClick={onNavigateToSwap}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Browse All 8 Indoor Spots</span>
            </button>
          )}
        </div>
      </section>

      {/* Swap Modal Drawer */}
      {swapModalSlotId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Swap with an Alternative Indoor Spot</h3>
                <p className="text-xs text-slate-500">
                  Select any sheltered venue below to replace this schedule slot.
                </p>
              </div>
              <button
                onClick={() => setSwapModalSlotId(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ITINERARY_SUBSTITUTIONS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSwapSlot(swapModalSlotId, item)}
                  className="text-left p-4 rounded-2xl border border-slate-200 hover:border-slate-900 hover:bg-slate-50/70 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                        {item.alternativeCategory}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {item.indoorAirQuality}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-slate-950 leading-snug">
                      {item.indoorAlternative}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.highlight}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">{item.admission}</span>
                    <span className="text-slate-900 font-bold group-hover:underline inline-flex items-center gap-1">
                      <span>Select</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
