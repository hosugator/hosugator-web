"use client";
import { useTranslation } from '@/hooks/useTranslation';

export default function Insights() {
  const { t } = useTranslation();

  return (
    <section id="insights" className="min-h-screen flex flex-col justify-center border-t border-slate-100 py-24">
      <div className="max-w-5xl">
        <div className="mb-20">
          <h2 className="text-[14px] font-bold tracking-[0.5em] uppercase text-primary mb-4">
            {t.insights.topLabel}
          </h2>
          <h3 className="text-6xl font-black tracking-tighter text-slate-900 whitespace-pre-line">
            {t.insights.title}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.insights.items.map((item, index) => (
            <div
              key={index}
              className={`group relative border border-slate-100 rounded-2xl p-8 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 ${
                index >= 3 ? 'md:col-span-1' : ''
              } ${t.insights.items.length === 5 && index === 3 ? 'md:col-start-1' : ''}`}
            >
              <div className="text-xs font-mono font-bold text-slate-300 mb-6 group-hover:text-primary transition-colors">
                {item.number}
              </div>

              <h4 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors">
                {item.title}
              </h4>

              <p className="text-sm font-semibold text-slate-700 leading-relaxed mb-4 italic">
                &ldquo;{item.principle}&rdquo;
              </p>

              <p className="text-sm font-light text-slate-500 leading-relaxed mb-6">
                {item.desc}
              </p>

              <span className="inline-block px-3 py-1 text-xs font-bold bg-primary/10 text-primary rounded-full">
                {item.project}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
