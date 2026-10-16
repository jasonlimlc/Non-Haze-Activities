import React, { useState } from 'react';
import {
  AlertTriangle,
  PhoneCall,
  Phone,
  CheckCircle2,
  MapPin,
  ExternalLink,
  Clock,
  Shield,
  Activity,
  UserCheck,
} from 'lucide-react';
import {
  SYMPTOM_TRIAGE_DATA,
  AGE_GROUP_GUIDELINES,
  HEALTHCARE_FACILITIES,
} from '../data/hazeData';
import { useApp } from '../context/AppContext';

export const SymptomAndHelpCenter: React.FC = () => {
  const { t } = useApp();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedCohortIndex, setSelectedCohortIndex] = useState<number>(0);
  const [facilityFilter, setFacilityFilter] = useState<string>('All');

  const symptomChecklist = [
    { id: 'itchy-eyes', label: 'Itchy, stinging or watery eyes', zone: 'Eyes / Face', severity: 'mild' },
    { id: 'throat-tickle', label: 'Scratchy dry throat & tickle cough', zone: 'Throat', severity: 'mild' },
    { id: 'runny-nose', label: 'Clear runny nose or sneezing', zone: 'Nasal', severity: 'mild' },
    { id: 'mild-headache', label: 'Slight headache after walking in haze', zone: 'Head', severity: 'mild' },
    { id: 'persistent-cough', label: 'Persistent dry coughing bouts', zone: 'Throat', severity: 'moderate' },
    { id: 'wheezing', label: 'Audible wheezing or whistling breath', zone: 'Chest', severity: 'moderate' },
    { id: 'chest-tightness', label: 'Chest tightness when walking', zone: 'Chest', severity: 'moderate' },
    { id: 'skin-rash', label: 'Skin irritation or eczema flare-up', zone: 'Skin', severity: 'moderate' },
    { id: 'acute-breathlessness', label: 'Severe shortness of breath at rest', zone: 'Emergency', severity: 'severe' },
    { id: 'cannot-speak', label: 'Unable to speak in full sentences', zone: 'Emergency', severity: 'severe' },
    { id: 'chest-pain', label: 'Crushing chest pressure or pain', zone: 'Emergency', severity: 'severe' },
    { id: 'blue-lips', label: 'Bluish or pale lips / fingernails', zone: 'Emergency', severity: 'severe' },
  ];

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const getTriageLevel = () => {
    if (selectedSymptoms.some((s) => ['acute-breathlessness', 'cannot-speak', 'chest-pain', 'blue-lips'].includes(s))) {
      return SYMPTOM_TRIAGE_DATA[2]; // Severe
    }
    if (selectedSymptoms.some((s) => ['persistent-cough', 'wheezing', 'chest-tightness', 'skin-rash'].includes(s))) {
      return SYMPTOM_TRIAGE_DATA[1]; // Moderate
    }
    if (selectedSymptoms.length > 0) {
      return SYMPTOM_TRIAGE_DATA[0]; // Mild
    }
    return null;
  };

  const activeTriage = getTriageLevel();

  const filteredFacilities = HEALTHCARE_FACILITIES.filter((f) => {
    if (facilityFilter === 'All') return true;
    if (facilityFilter === 'Emergency') return f.type.includes('Emergency');
    if (facilityFilter === 'Children') return f.type.includes('Children');
    if (facilityFilter === '24h GP') return f.type.includes('GP');
    if (facilityFilter === 'Telehealth') return f.type.includes('Telemedicine');
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Visual SCDF Emergency Header Banner */}
      <section className="bg-rose-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden border border-rose-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-900/60 border border-rose-700/60 text-xs text-rose-200">
              <AlertTriangle className="w-4 h-4 text-rose-300" />
              <span>Singapore Emergency Medical Directive</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Tourist Health Emergency & Medical Assistance
            </h1>

            <p className="text-rose-200 text-xs sm:text-sm leading-relaxed">
              If you or a travel companion experience severe asthma exacerbation, crushing chest pain, or acute shortness of breath during haze, dial 995 immediately. Singapore Civil Defence Force (SCDF) paramedics respond 24/7 islandwide.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <a
              href="tel:995"
              className="p-5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-center shadow-md flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <PhoneCall className="w-6 h-6 animate-pulse" />
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider block opacity-90">
                  Life Threatening Emergency
                </span>
                <span className="text-2xl font-mono leading-none">Dial 995</span>
              </div>
            </a>

            <a
              href="tel:1777"
              className="px-4 py-3 rounded-2xl bg-rose-900/80 hover:bg-rose-900 text-rose-100 text-xs font-bold border border-rose-800 text-center flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Non-Emergency Ambulance: 1777</span>
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Symptom Self-Check Console */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white transition-colors">
        <div className="max-w-2xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <Activity className="w-4 h-4 text-sky-500" />
            <span>Interactive Triage Algorithm</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {t('symptomCheckerTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Select any discomfort you or your family members are currently experiencing. We will evaluate severity against Singapore Ministry of Health guidelines.
          </p>
        </div>

        {/* Symptoms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {symptomChecklist.map((symptom) => {
            const isChecked = selectedSymptoms.includes(symptom.id);
            return (
              <button
                key={symptom.id}
                onClick={() => toggleSymptom(symptom.id)}
                className={`p-4 rounded-2xl border text-left text-xs transition-all flex items-start gap-3 ${
                  isChecked
                    ? symptom.severity === 'severe'
                      ? 'border-rose-600 bg-rose-50/80 dark:bg-rose-950/50 font-bold text-rose-950 dark:text-rose-200 shadow-sm ring-1 ring-rose-600'
                      : symptom.severity === 'moderate'
                      ? 'border-amber-600 bg-amber-50/80 dark:bg-amber-950/50 font-semibold text-amber-950 dark:text-amber-200 shadow-sm ring-1 ring-amber-600'
                      : 'border-slate-900 dark:border-sky-500 bg-slate-900 dark:bg-sky-600 text-white font-semibold shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center shrink-0 border ${
                    isChecked
                      ? 'bg-white border-white text-slate-950'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                  }`}
                >
                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <span className="block">{symptom.label}</span>
                  <span
                    className={`text-[10px] block mt-0.5 opacity-75 font-medium ${
                      isChecked ? 'text-inherit' : 'text-slate-400'
                    }`}
                  >
                    {symptom.zone}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Triage Output Banner */}
        {activeTriage ? (
          <div
            className={`p-6 rounded-3xl border-2 space-y-4 animate-fade-in ${
              activeTriage.level === 'Severe'
                ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 text-rose-950 dark:text-rose-200'
                : activeTriage.level === 'Moderate'
                ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 text-amber-950 dark:text-amber-200'
                : 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block opacity-75">
                  Triage Recommendation
                </span>
                <h3 className="text-xl font-black">
                  {activeTriage.level} Health Concern: {activeTriage.recommendedAction}
                </h3>
              </div>
              <span
                className={`px-3.5 py-1 rounded-full text-xs font-bold self-start sm:self-center text-white ${
                  activeTriage.level === 'Severe'
                    ? 'bg-rose-600'
                    : activeTriage.level === 'Moderate'
                    ? 'bg-amber-600'
                    : 'bg-emerald-600'
                }`}
              >
                {activeTriage.urgency}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-3 pt-3 border-t border-current/15">
              <div>
                <span className="font-bold block mb-1.5">Recommended Relief Steps:</span>
                <ul className="space-y-1 list-disc pl-4 opacity-90">
                  {activeTriage.homeCare.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-bold block mb-1.5">When to Seek Medical Care:</span>
                <p className="opacity-90 leading-relaxed mb-3">{activeTriage.whenToSeekDoctor}</p>
                {activeTriage.level === 'Severe' && (
                  <a
                    href="tel:995"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Dial Emergency 995</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-center text-xs text-slate-500 dark:text-slate-400">
            Tap symptoms above to generate immediate tourist medical guidance.
          </div>
        )}
      </section>

      {/* High-Risk Tourist Cohort Guidelines */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white transition-colors">
        <div className="max-w-2xl mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <UserCheck className="w-4 h-4 text-sky-500" />
            <span>Singapore Health Authority Protocols</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Vulnerable Traveler Cohort Advisories
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Airborne particulate matter affects demographic cohorts differently. Select a group to view specific PSI thresholds and physician advice:
          </p>
        </div>

        {/* Cohort Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
          {AGE_GROUP_GUIDELINES.map((cohort, index) => (
            <button
              key={cohort.group}
              onClick={() => setSelectedCohortIndex(index)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCohortIndex === index
                  ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cohort.group}
            </button>
          ))}
        </div>

        {(() => {
          const currentCohort = AGE_GROUP_GUIDELINES[selectedCohortIndex];
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/30 text-xs space-y-2">
                  <span className="font-extrabold text-emerald-900 dark:text-emerald-300 block">PSI 0 – 100 (Normal)</span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{currentCohort.psiUnder100}</p>
                </div>
                <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/30 text-xs space-y-2">
                  <span className="font-extrabold text-amber-900 dark:text-amber-300 block">PSI 101 – 200 (Unhealthy)</span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{currentCohort.psi101To200}</p>
                </div>
                <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/30 text-xs space-y-2">
                  <span className="font-extrabold text-rose-900 dark:text-rose-300 block">PSI 201+ (Hazardous)</span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{currentCohort.psi201Plus}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-900 dark:text-white block mb-2">
                  Key Precautions for {currentCohort.group}:
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-300">
                  {currentCohort.keyPrecautions.map((prec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{prec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })()}
      </section>

      {/* Hospital & Telemedicine Directory */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('nearestClinics')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              English-speaking doctors, direct billing for international travel insurance, and hotel room delivery
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['All', 'Emergency', 'Children', '24h GP', 'Telehealth'].map((f) => (
              <button
                key={f}
                onClick={() => setFacilityFilter(f)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                  facilityFilter === f
                    ? 'bg-slate-900 dark:bg-sky-600 text-white'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFacilities.map((fac) => (
            <div
              key={fac.id}
              className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                  <span className="font-bold text-slate-900 dark:text-white text-xs">{fac.type}</span>
                  <span>{fac.area}</span>
                </div>

                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg mb-1 leading-snug">
                  {fac.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{fac.address}</p>

                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Wait Time:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{fac.estimatedWaitTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Languages:</span>
                    <span>{fac.languages.join(', ')}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-700">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Insurance: </span>
                    {fac.insuranceAccepted}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3 text-xs">
                <a
                  href={`tel:${fac.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-sky-600 text-white font-bold hover:bg-slate-800 dark:hover:bg-sky-500 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {fac.phone}</span>
                </a>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    fac.googleMapsQuery
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{t('directions')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
