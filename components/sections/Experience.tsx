// components/sections/Experience.tsx
"use client";
import { useTranslation } from '@/hooks/useTranslation';

export default function Experience() {
  const { t } = useTranslation();

  return (
    <section id="experience" className="border-t border-neutral-100 py-24">
      <div className="mb-14">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-900 mb-4">
          {t.experience.topLabel}
        </h2>
        <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] text-neutral-900 whitespace-pre-line">
          {t.experience.title}
        </h3>
      </div>

      {/* 연속 단일 컬럼 타임라인 */}
      <div className="border-t border-neutral-200">
        {t.experience.items.map((exp, index) => (
          <div key={index} className="py-10 border-b border-neutral-200">
            <div className="text-xs font-mono font-medium text-neutral-400 tracking-wider mb-3">
              {exp.period}
            </div>
            <h4 className="text-2xl md:text-3xl font-black text-neutral-900">{exp.company}</h4>
            <p className="text-[11px] font-bold text-neutral-500 mt-1 mb-4 uppercase tracking-widest">
              {exp.role}
            </p>
            <p className="text-[15px] md:text-base font-light leading-relaxed text-neutral-600">
              {exp.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-5">
              {exp.tags.map(tag => (
                <span key={tag} className="text-[9px] font-black px-2 py-0.5 bg-neutral-50 text-neutral-400 rounded border border-neutral-100 tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
