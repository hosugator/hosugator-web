'use client';

import Link from 'next/link';
import { ArrowLeft, Printer } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { resumeData } from '@/data/resumeData';
import { resumeDataEn } from '@/data/resumeData.en';
import Footer from '@/components/layout/Footer';

const T = {
  ko: {
    back: '홈으로',
    pdf: 'PDF로 저장',
    summary: '소개',
    experience: '경력',
    projects: '프로젝트',
    insights: '인사이트',
    education: '학력 · 자격',
  },
  en: {
    back: 'Home',
    pdf: 'Save as PDF',
    summary: 'Summary',
    experience: 'Experience',
    projects: 'Projects',
    insights: 'Insights',
    education: 'Education & Certifications',
  },
} as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-400 mb-6">
      {children}
    </h2>
  );
}

export default function ResumeView() {
  const { locale } = useLanguage();
  const data = locale === 'en' ? resumeDataEn : resumeData;
  const t = locale === 'en' ? T.en : T.ko;

  // 프로젝트를 카테고리별로 묶는다 (원본 순서 보존).
  const projectGroups = data.projects.reduce<Record<string, typeof data.projects>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div className="relative w-full md:max-w-4xl md:mx-auto px-5 md:px-8 pb-20">
      {/* 상단 바 (인쇄 시 숨김) */}
      <div className="flex items-center justify-between pt-4 pb-10 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-accent transition-colors"
        >
          <ArrowLeft size={14} /> {t.back}
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3.5 py-1.5 text-xs font-bold text-neutral-500 hover:text-accent hover:border-accent transition-colors"
        >
          <Printer size={13} /> {t.pdf}
        </button>
      </div>

      {/* 헤더 */}
      <header className="mb-16">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-neutral-900">
          {data.name}
        </h1>
        <p className="mt-4 text-base md:text-lg font-medium text-accent">{data.headline}</p>
      </header>

      {/* Summary */}
      <section className="mb-20">
        <SectionLabel>{t.summary}</SectionLabel>
        <div className="space-y-4 max-w-2xl">
          {data.summary.map((para, i) => (
            <p key={i} className="text-neutral-600 leading-relaxed font-light">
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="mb-20">
        <SectionLabel>{t.experience}</SectionLabel>
        <div className="space-y-12">
          {data.experience.map((exp) => (
            <div key={exp.company}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-neutral-200 pb-3 mb-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-xl font-black tracking-tight text-neutral-900">{exp.company}</span>
                  <span className="text-sm font-medium text-neutral-500">{exp.role}</span>
                </div>
                <span className="font-mono text-xs text-neutral-400">{exp.period}</span>
              </div>
              <div className="space-y-6">
                {exp.items.map((item) => (
                  <div key={item.title}>
                    <h3 className="font-bold text-neutral-900 leading-snug">{item.title}</h3>
                    <p className="mt-1.5 text-sm text-neutral-500 leading-relaxed font-light">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="mb-20">
        <SectionLabel>{t.projects}</SectionLabel>
        <div className="space-y-10">
          {Object.entries(projectGroups).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-black text-neutral-400 mb-4">{category}</h3>
              <div className="space-y-5 border-l border-neutral-200 pl-5">
                {items.map((p) => (
                  <div key={p.name}>
                    <h4 className="font-bold text-neutral-900 leading-snug">{p.name}</h4>
                    <p className="mt-1 text-sm text-neutral-500 leading-relaxed font-light">{p.body}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Insights */}
      <section className="mb-20">
        <SectionLabel>{t.insights}</SectionLabel>
        <div className="grid gap-6 sm:grid-cols-2">
          {data.insights.map((ins) => (
            <div key={ins.label} className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-2">{ins.label}</div>
              {ins.quote && (
                <p className="text-sm font-bold text-neutral-900 leading-snug mb-2">“{ins.quote}”</p>
              )}
              <p className="text-xs text-neutral-500 leading-relaxed font-light">{ins.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-8">
        <SectionLabel>{t.education}</SectionLabel>
        <ul className="space-y-2 max-w-2xl">
          {data.education.map((e, i) => (
            <li key={i} className="text-sm text-neutral-600 leading-relaxed font-light">• {e}</li>
          ))}
        </ul>
      </section>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
