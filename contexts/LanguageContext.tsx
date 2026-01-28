// contexts/LanguageContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, defaultLocale } from '@/lib/i18n';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    // 브라우저 언어 감지 또는 로컬 스토리지에서 언어 설정 불러오기
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && ['ko', 'en'].includes(savedLocale)) {
      setLocale(savedLocale);
    } else {
      // 브라우저 언어 감지
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'ko') {
        setLocale('ko');
      } else {
        setLocale('en');
      }
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}