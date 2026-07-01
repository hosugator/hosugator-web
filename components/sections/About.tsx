// components/sections/About.tsx
"use client";
import { useTranslation } from '@/hooks/useTranslation';
import Image from 'next/image';

export default function About() {
  const { t } = useTranslation();

  return (
    <section
      id="about"
      className="relative bg-white text-neutral-900 min-h-screen flex flex-col justify-center py-20"
    >
      {/* 상단 마스트헤드 */}
      <div className="flex items-center justify-between border-b border-neutral-900 pb-4 mb-14 text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-400">
        <span className="text-neutral-900">{t.about.topLabel}</span>
        <span className="hidden sm:inline">( 2026 )</span>
        <span className="text-neutral-900">Seungwan Hong</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* 왼쪽: 디스플레이 타이틀 + 지표 + 서술 */}
        <div className="lg:col-span-7 space-y-12">
          <h3 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-neutral-900">
            {t.about.title.main}<br />
            <span>{t.about.title.highlight}</span>
          </h3>

          {/* 정량 지표 */}
          <div className="flex flex-wrap gap-x-16 gap-y-6 border-t border-neutral-900 pt-6">
            {t.about.stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-5xl md:text-6xl font-black tracking-tight text-neutral-900 leading-none">{stat.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mt-3">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* 서술 (2단 매거진) */}
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5 text-[15px] font-light leading-relaxed text-neutral-500 max-w-3xl">
            {t.about.content.map((item, i) => (
              <p key={i}>{item.text}</p>
            ))}
          </div>
        </div>

        {/* 오른쪽: 그레이스케일 인물 사진 + Fig. 캡션 */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 group">
            <Image
              src="/images/my-profile.jpg"
              alt="Seungwan Hong"
              fill
              className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
              priority
            />
          </div>
          <div className="flex items-center justify-between mt-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
            <span>AI Engineer</span>
            <span>Fig. 01</span>
          </div>
        </div>
      </div>
    </section>
  );
}
