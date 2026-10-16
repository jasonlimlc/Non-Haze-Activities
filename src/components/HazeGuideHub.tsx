import React, { useState, useEffect } from 'react';
import { BookOpen, ShoppingBag, Stethoscope, Sparkles } from 'lucide-react';
import { HazeEducationGuide } from './HazeEducationGuide';
import { WhatToBuyGuide } from './WhatToBuyGuide';
import { SymptomAndHelpCenter } from './SymptomAndHelpCenter';
import { useApp } from '../context/AppContext';

export type GuideSubSection = 'education' | 'supplies' | 'health';

interface HazeGuideHubProps {
  initialSection?: GuideSubSection;
}

export const HazeGuideHub: React.FC<HazeGuideHubProps> = ({ initialSection = 'education' }) => {
  const { t } = useApp();
  const [activeSection, setActiveSection] = useState<GuideSubSection>(initialSection);

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  return (
    <div className="space-y-6">
      {/* Top Unified Hub Navigation Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('tabEducation')} & {t('tabSupplies')} & {t('tabHealth')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {activeSection === 'education' && t('educationTitle')}
              {activeSection === 'supplies' && t('suppliesTitle')}
              {activeSection === 'health' && t('healthTitle')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              {activeSection === 'education' && t('educationDesc')}
              {activeSection === 'supplies' && t('suppliesDesc')}
              {activeSection === 'health' && t('healthDesc')}
            </p>
          </div>

          {/* Sub-section Switcher Pills */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 self-start md:self-center overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveSection('education')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
                activeSection === 'education'
                  ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-sky-500" />
              <span>{t('tabEducation')}</span>
            </button>

            <button
              onClick={() => setActiveSection('supplies')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
                activeSection === 'supplies'
                  ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
              <span>{t('tabSupplies')}</span>
            </button>

            <button
              onClick={() => setActiveSection('health')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
                activeSection === 'health'
                  ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-rose-500" />
              <span>{t('tabHealth')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render the Active Sub-section */}
      {activeSection === 'education' && <HazeEducationGuide />}
      {activeSection === 'supplies' && <WhatToBuyGuide />}
      {activeSection === 'health' && <SymptomAndHelpCenter />}
    </div>
  );
};
