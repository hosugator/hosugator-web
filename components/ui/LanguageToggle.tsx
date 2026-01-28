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

  // 공통 스타일: 배경 제거, 호버 시 텍스트 색상 변경 및 아주 연한 배경
  const commonButtonStyles = "flex items-center transition-all duration-300 text-slate-500 hover:text-[#13ecda] hover:bg-slate-50/50 rounded-lg";

  if (!isExpanded) {
    // 사이드바가 최소화되어 있을 때
    return (
      <button
        onClick={toggleLanguage}
        className={`${commonButtonStyles} w-10 h-10 justify-center`}
        aria-label={`Switch to ${locale === 'ko' ? 'English' : '한국어'}`}
        title={locale === 'ko' ? 'Switch to English' : 'Switch to Korean'}
      >
        <Globe size={18} />
      </button>
    );
  }

  // 사이드바가 확장되어 있을 때
  return (
    <button
      onClick={toggleLanguage}
      className={`${commonButtonStyles} px-3 py-2 w-full justify-start gap-3`}
      aria-label={`Switch to ${locale === 'ko' ? 'English' : '한국어'}`}
    >
      <Globe size={18} className="flex-shrink-0" />
      {/* 텍스트 깨짐 방지: whitespace-nowrap 추가 */}
      <span className="text-sm font-semibold whitespace-nowrap overflow-hidden animate-in fade-in slide-in-from-left-2 duration-500">
        {locale === 'ko' ? 'English' : '한국어'}
      </span>
    </button>
  );
}