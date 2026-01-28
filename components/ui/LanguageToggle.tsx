// components/ui/LanguageToggle.tsx
"use client";
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  isExpanded?: boolean;
}

export default function LanguageToggle({ isExpanded = true }: LanguageToggleProps) {
  const { locale, setLocale } = useLanguage();

  const toggleLanguage = () => {
    setLocale(locale === 'ko' ? 'en' : 'ko');
  };

  if (!isExpanded) {
    // 사이드바가 최소화되어 있을 때: 아이콘만 표시
    return (
      <button
        onClick={toggleLanguage}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors duration-200 text-slate-700 hover:text-slate-900 ml-1"
        aria-label={`Switch to ${locale === 'ko' ? 'English' : '한국어'}`}
        title={locale === 'ko' ? 'Switch to English' : 'Switch to Korean'}
      >
        <Globe size={16} />
      </button>
    );
  }

  // 사이드바가 확장되어 있을 때: 전체 버튼 표시
  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors duration-200 text-sm font-medium text-slate-700 hover:text-slate-900 w-full justify-center"
      aria-label={`Switch to ${locale === 'ko' ? 'English' : '한국어'}`}
    >
      <Globe size={16} />
      <span className="animate-in fade-in slide-in-from-left-2 duration-300">
        {locale === 'ko' ? 'EN' : '한국어'}
      </span>
    </button>
  );
}