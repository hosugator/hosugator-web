// components/sections/About.tsx
"use client";
import { useTranslation } from '@/hooks/useTranslation';
import Image from 'next/image';

export default function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="min-h-screen flex flex-col justify-center py-24">
      {/* 상단 마스트헤드 */}
      <div className="flex items-center justify-between border-b border-neutral-900 pb-4 mb-12 text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-400">
        <span className="text-neutral-900">{t.about.topLabel}</span>
        <span className="hidden sm:inline">( 2026 )</span>
        <span className="text-neutral-900">Seungwan Hong</span>
      </div>

      {/* 아이덴티티 행: 작은 원형 아바타 + 이름/직무 */}
      <div className="flex items-center gap-4 mb-10">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-neutral-100 shrink-0 ring-1 ring-neutral-200">
          <Image
            src="/images/my-profile.jpg"
            alt="Seungwan Hong"
            fill
            className="object-cover grayscale"
            priority
          />
        </div>
        <div>
          <div className="text-base font-bold text-neutral-900 leading-tight">Seungwan Hong</div>
          <div className="text-sm text-neutral-500">AI Engineer</div>
        </div>
      </div>

      {/* 디스플레이 타이틀 */}
      <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] text-neutral-900 mb-10">
        {t.about.title.main}<br />
        <span>{t.about.title.highlight}</span>
      </h3>

      {/* 정량 지표 */}
      <div className="flex flex-wrap gap-x-16 gap-y-6 border-y border-neutral-900 py-6 mb-10">
        {t.about.stats.map((stat) => (
          <div key={stat.label}>
            <div className="text-4xl md:text-5xl font-black tracking-tight text-neutral-900 leading-none">{stat.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mt-3">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 서술 (단일 컬럼, 내용 집중) */}
      <div className="space-y-5 text-[15px] md:text-base font-light leading-relaxed text-neutral-600">
        {t.about.content.map((item, i) => (
          <p key={i}>{item.text}</p>
        ))}
      </div>
    </section>
  );
}
