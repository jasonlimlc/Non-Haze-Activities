import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  ShieldAlert,
  Compass,
  BookOpen,
  Sun,
  Moon,
  Clock,
  Globe,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SupportedLanguage } from '../data/translations';

export type AppTab = 'overview' | 'live' | 'itinerary' | 'guide';

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
    isMobile,
  } = useApp();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
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

  const handleCycleTheme = () => {
    if (themeMode === 'auto') {
      setThemeMode('light');
    } else if (themeMode === 'light') {
      setThemeMode('dark');
    } else {
      setThemeMode('auto');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-3">
          {/* Zone 1: Brand wordmark */}
          <button
            onClick={() => onSelectTab('overview')}
            className="flex items-center gap-2.5 text-left text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-sky-500 text-white flex items-center justify-center font-black text-sm shadow-sm">
              CH
            </div>
            <div className="flex flex-col">
              <span className="leading-tight font-extrabold">{t('brand')}</span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
                {t('brandSub')}
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation links (Desktop & Tablet) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => onSelectTab('overview')}
              className={`whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'overview'
                  ? 'text-slate-950 dark:text-white font-bold underline underline-offset-8 decoration-2 decoration-slate-900 dark:decoration-sky-400'
                  : 'hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {t('tabOverview')}
            </button>
            <button
              onClick={() => onSelectTab('live')}
              className={`whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'live'
                  ? 'text-slate-950 dark:text-white font-bold underline underline-offset-8 decoration-2 decoration-slate-900 dark:decoration-sky-400'
                  : 'hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {t('tabLive')}
            </button>
            <button
              onClick={() => onSelectTab('itinerary')}
              className={`whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'itinerary'
                  ? 'text-slate-950 dark:text-white font-bold underline underline-offset-8 decoration-2 decoration-slate-900 dark:decoration-sky-400'
                  : 'hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {t('tabItinerary')}
            </button>
            <button
              onClick={() => onSelectTab('guide')}
              className={`whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'guide'
                  ? 'text-slate-950 dark:text-white font-bold underline underline-offset-8 decoration-2 decoration-slate-900 dark:decoration-sky-400'
                  : 'hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <span>{t('tabEducation')}</span>
              <span className="ml-1 text-[11px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-normal">
                {t('tabSupplies')} + {t('tabHealth')}
              </span>
            </button>
          </nav>

          {/* Zone 3: Controls (Language Selector, Theme Toggle, PSI Simulator) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Language Selector Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Change Language"
                aria-label="Select Language"
              >
                <span className="text-sm">{currentLangObj.flag}</span>
                <span className="hidden sm:inline">{currentLangObj.nativeLabel}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-fade-in divide-y divide-slate-100 dark:divide-slate-700/60">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                    {t('language', 'Language')}
                  </div>
                  <div className="py-1">
                    {availableLanguages.map((opt) => (
                      <button
                        key={opt.code}
                        onClick={() => {
                          setLanguage(opt.code as SupportedLanguage);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                          language === opt.code
                            ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-bold'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{opt.flag}</span>
                          <span>{opt.nativeLabel}</span>
                        </div>
                        {language === opt.code && (
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Theme Toggle (with System Time Auto-Detect) */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title={`Theme: ${themeMode} (${effectiveTheme})`}
                aria-label="Select Theme Mode"
              >
                {themeMode === 'auto' ? (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden sm:inline">{effectiveTheme === 'dark' ? 'Auto (Night)' : 'Auto (Day)'}</span>
                  </>
                ) : themeMode === 'light' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden sm:inline">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-sky-400" />
                    <span className="hidden sm:inline">Dark</span>
                  </>
                )}
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {themeMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-fade-in">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                    {t('theme', 'Theme')}
                  </div>
                  <button
                    onClick={() => {
                      setThemeMode('auto');
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                      themeMode === 'auto'
                        ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <div>
                        <div>{t('themeAuto')}</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {effectiveTheme === 'light' ? t('timeDay') : t('timeNight')}
                        </div>
                      </div>
                    </div>
                    {themeMode === 'auto' && <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />}
                  </button>

                  <button
                    onClick={() => {
                      setThemeMode('light');
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                      themeMode === 'light'
                        ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>{t('themeLight')}</span>
                    </div>
                    {themeMode === 'light' && <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />}
                  </button>

                  <button
                    onClick={() => {
                      setThemeMode('dark');
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                      themeMode === 'dark'
                        ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Moon className="w-3.5 h-3.5 text-sky-400" />
                      <span>{t('themeDark')}</span>
                    </div>
                    {themeMode === 'dark' && <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />}
                  </button>
                </div>
              )}
            </div>

            {/* PSI Simulator Modal Trigger */}
            <button
              onClick={onOpenSimulator}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 border ${
                isSimulating
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {isSimulating ? `${t('simulatorActive')} (PSI ${simulatedPsi})` : t('psiSimulator')}
            </button>
          </div>
        </div>
      </header>

      {/* Fixed Bottom Dock Navigation for Mobile Devices */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex items-center justify-around shadow-2xl safe-area-pb">
        <button
          onClick={() => onSelectTab('overview')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'overview'
              ? 'text-sky-600 dark:text-sky-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[11px]">{t('tabOverview')}</span>
        </button>

        <button
          onClick={() => onSelectTab('live')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
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
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
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
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'guide'
              ? 'text-sky-600 dark:text-sky-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[11px]">{t('tabEducation')}</span>
        </button>
      </div>
    </>
  );
};
