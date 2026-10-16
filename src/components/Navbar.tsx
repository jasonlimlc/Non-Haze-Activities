import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  ShieldAlert,
  Compass,
  BookOpen,
  Sun,
  Moon,
  Clock,
  ChevronDown,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SupportedLanguage } from '../data/translations';

export type AppTab = 'live' | 'itinerary' | 'guide' | 'talk';

interface NavbarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenSimulator: () => void;
  isSimulating: boolean;
  simulatedPsi: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenSimulator,
  isSimulating,
  simulatedPsi,
}) => {
  const {
    language,
    setLanguage,
    availableLanguages,
    t,
    themeMode,
    setThemeMode,
    effectiveTheme,
  } = useApp();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = availableLanguages.find((l) => l.code === language) || availableLanguages[0];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-2.5 sm:py-3">
          {/* Decluttered Brand Wordmark */}
          <button
            onClick={() => onSelectTab('live')}
            className="flex items-center gap-2 text-left text-base font-bold text-slate-900 dark:text-white shrink-0 hover:opacity-85 transition-opacity"
          >
            <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
              CH
            </div>
            <span className="font-extrabold tracking-tight">Captain Haze</span>
          </button>

          {/* Decluttered Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => onSelectTab('live')}
              className={`transition-colors py-1 ${
                activeTab === 'live'
                  ? 'text-sky-600 dark:text-sky-400 font-bold border-b-2 border-sky-600 dark:border-sky-400'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('tabLive')}
            </button>
            <button
              onClick={() => onSelectTab('itinerary')}
              className={`transition-colors py-1 ${
                activeTab === 'itinerary'
                  ? 'text-sky-600 dark:text-sky-400 font-bold border-b-2 border-sky-600 dark:border-sky-400'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('tabItinerary')}
            </button>
            <button
              onClick={() => onSelectTab('guide')}
              className={`transition-colors py-1 ${
                activeTab === 'guide'
                  ? 'text-sky-600 dark:text-sky-400 font-bold border-b-2 border-sky-600 dark:border-sky-400'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('tabEducation')}
            </button>
            <button
              onClick={() => onSelectTab('talk')}
              className={`transition-colors py-1 ${
                activeTab === 'talk'
                  ? 'text-sky-600 dark:text-sky-400 font-bold border-b-2 border-sky-600 dark:border-sky-400'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('tabTalk')}
            </button>
          </nav>

          {/* Decluttered Compact Action Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Minimal Language Selector */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Change language"
              >
                <span>{currentLangObj.flag}</span>
                <span className="hidden sm:inline font-mono uppercase text-[11px]">{currentLangObj.code}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50 animate-fade-in">
                  {availableLanguages.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => {
                        setLanguage(opt.code as SupportedLanguage);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                        language === opt.code
                          ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 font-bold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{opt.flag}</span>
                        <span>{opt.nativeLabel}</span>
                      </div>
                      {language === opt.code && <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Minimal Theme Switcher */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title={`Theme: ${themeMode} (${effectiveTheme})`}
              >
                {themeMode === 'auto' ? (
                  <Clock className="w-4 h-4 text-amber-500" />
                ) : themeMode === 'light' ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-sky-400" />
                )}
              </button>

              {themeMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50 animate-fade-in text-xs">
                  <button
                    onClick={() => {
                      setThemeMode('auto');
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center gap-2 ${
                      themeMode === 'auto' ? 'text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-950/40' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Auto ({effectiveTheme})</span>
                  </button>
                  <button
                    onClick={() => {
                      setThemeMode('light');
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center gap-2 ${
                      themeMode === 'light' ? 'text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-950/40' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light Mode</span>
                  </button>
                  <button
                    onClick={() => {
                      setThemeMode('dark');
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center gap-2 ${
                      themeMode === 'dark' ? 'text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-950/40' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-sky-400" />
                    <span>Dark Mode</span>
                  </button>
                </div>
              )}
            </div>

            {/* Minimalist Simulator Button */}
            <button
              onClick={onOpenSimulator}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
                isSimulating
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {isSimulating ? `PSI ${simulatedPsi}` : 'Simulator'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Dock Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl safe-area-pb">

        <button
          onClick={() => onSelectTab('live')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'live'
              ? 'text-sky-600 dark:text-sky-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span className="text-[11px]">{t('tabLive')}</span>
        </button>

        <button
          onClick={() => onSelectTab('itinerary')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'itinerary'
              ? 'text-sky-600 dark:text-sky-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="text-[11px]">{t('tabItinerary')}</span>
        </button>

        <button
          onClick={() => onSelectTab('guide')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'guide'
              ? 'text-sky-600 dark:text-sky-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[11px]">{t('tabEducation')}</span>
        </button>

        <button
          onClick={() => onSelectTab('talk')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'talk'
              ? 'text-sky-600 dark:text-sky-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-[11px]">{t('tabTalk')}</span>
        </button>
      </div>
    </>
  );
};
