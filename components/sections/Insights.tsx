"use client";
import { useTranslation } from '@/hooks/useTranslation';

export default function Insights() {
  const { t } = useTranslation();

  return (
    <section id="insights" className="min-h-screen flex flex-col justify-center border-t border-neutral-100 py-24">
      <div className="mb-14">
        <h2 className="text-[14px] font-bold tracking-[0.5em] uppercase text-neutral-900 mb-4">
          {t.insights.topLabel}
        </h2>
        <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-neutral-900 whitespace-pre-line leading-none">
          {t.insights.title}
        </h3>
      </div>

      {/* 단일 컬럼 원칙 리스트 */}
      <div>
        {t.insights.items.map((item, index) => (
          <div key={index} className="py-8 border-t border-neutral-200 max-w-2xl">
            <div className="text-xs font-mono font-bold text-neutral-400 mb-3 tracking-widest">
              {item.number} — {item.title}
            </div>
            <p className="text-lg md:text-xl font-semibold text-neutral-900 leading-relaxed italic">
              &ldquo;{item.principle}&rdquo;
            </p>
            <p className="text-sm md:text-[15px] font-light text-neutral-500 leading-relaxed mt-3">
              {item.desc}
            </p>
            <span className="inline-block mt-4 px-3 py-1 text-[11px] font-bold bg-neutral-100 text-neutral-500 rounded-full tracking-wide">
              {item.project}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
