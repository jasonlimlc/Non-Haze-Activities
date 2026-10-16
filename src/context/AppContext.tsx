import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, TRANSLATIONS, LanguageOption } from '../data/translations';

export type ThemeMode = 'auto' | 'light' | 'dark';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface AppContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  availableLanguages: LanguageOption[];
  t: (key: string, fallback?: string) => string;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  effectiveTheme: 'light' | 'dark';
  deviceType: DeviceType;
  isMobile: boolean;
  windowWidth: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function getSystemTimeTheme(): 'light' | 'dark' {
  const currentHour = new Date().getHours();
  // Daytime: 7:00 AM (07) to 6:59 PM (18) => light
  // Nighttime: 7:00 PM (19) to 6:59 AM (06) => dark
  return currentHour >= 7 && currentHour < 19 ? 'light' : 'dark';
}

function detectDevice(): { deviceType: DeviceType; isMobile: boolean } {
  if (typeof window === 'undefined') {
    return { deviceType: 'desktop', isMobile: false };
  }
  const ua = navigator.userAgent.toLowerCase();
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const width = window.innerWidth;

  const isMobileUA = /mobile|iphone|ipod|android.*mobile|blackberry|iemobile|opera mini/i.test(ua);
  const isTabletUA = /ipad|android(?!.*mobile)|tablet/i.test(ua);

  if (isMobileUA || (isTouch && width < 768)) {
    return { deviceType: 'mobile', isMobile: true };
  }
  if (isTabletUA || (isTouch && width >= 768 && width <= 1024)) {
    return { deviceType: 'tablet', isMobile: false };
  }
  return { deviceType: 'desktop', isMobile: false };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language State
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('sg_itinerary_lang') || localStorage.getItem('captain_haze_lang');
      if (saved && ['en', 'zh', 'ja', 'ko', 'th', 'vi'].includes(saved)) {
        return saved as SupportedLanguage;
      }
      // Auto-detect browser language if match
      const browserLang = navigator.language.slice(0, 2).toLowerCase();
      if (['en', 'zh', 'ja', 'ko', 'th', 'vi'].includes(browserLang)) {
        return browserLang as SupportedLanguage;
      }
    } catch {
      // fallback
    }
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('sg_itinerary_lang', lang);
    } catch {
      // ignore
    }
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS['en'];
    if (langDict && langDict[key]) return langDict[key];
    const enDict = TRANSLATIONS['en'];
    if (enDict && enDict[key]) return enDict[key];
    return fallback || key;
  };

  // 2. Theme State with auto system time detection
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('sg_itinerary_theme') || localStorage.getItem('captain_haze_theme');
      if (saved && ['auto', 'light', 'dark'].includes(saved)) {
        return saved as ThemeMode;
      }
    } catch {
      // fallback
    }
    return 'auto'; // Default to auto system time
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() => {
    return getSystemTimeTheme();
  });

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem('sg_itinerary_theme', mode);
    } catch {
      // ignore
    }
  };

  // Keep theme in sync with system time when in 'auto' mode
  useEffect(() => {
    const evaluateTheme = () => {
      let resolved: 'light' | 'dark' = 'light';
      if (themeMode === 'auto') {
        resolved = getSystemTimeTheme();
      } else {
        resolved = themeMode;
      }
      setEffectiveTheme(resolved);

      // Apply or remove .dark class on <html> and <body>
      if (resolved === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    };

    evaluateTheme();
    // Check every minute for system hour transitions
    const timer = setInterval(evaluateTheme, 60000);
    return () => clearInterval(timer);
  }, [themeMode]);

  // 3. Device detection and dynamic scaling
  const [deviceInfo, setDeviceInfo] = useState(detectDevice);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setDeviceInfo(detectDevice());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        availableLanguages: SUPPORTED_LANGUAGES,
        t,
        themeMode,
        setThemeMode,
        effectiveTheme,
        deviceType: deviceInfo.deviceType,
        isMobile: deviceInfo.isMobile,
        windowWidth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
