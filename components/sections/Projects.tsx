'use client';

import { projectsData } from '@/data/projectsData';
import { projectsDataEn } from '@/data/projectsData.en';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { shortNameOf, slugify } from '@/lib/projects';

// 진행 중(현재) 프로젝트 — 최상단 고정 노출 (배열 순서대로)
const CURRENT = ['Edge AI LMR', 'AlignAI', 'go2fit', 'Hosugator'];
// 프로젝트 연도 (정렬·표시용). 필요 시 여기만 수정.
const YEAR: Record<string, string> = {
  'AlignAI': '2026', 'Edge AI LMR': '2026', 'ERP Backup': '2026', 'Hosugator': '2026',
  'go2fit': '2026',
  'Dotodo': '2025', 'Sodamdiary': '2025', 'Pictag': '2025', 'Cureat': '2025',
  'Dorosee': '2025', 'KDLC': '2025',
};

export default function Projects() {
  const { locale } = useLanguage();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const router = useRouter();
  const searchParams = useSearchParams();

  // 기존 딥링크(?demo=cureat) 보존 → 해당 프로젝트 상세로 이동
  useEffect(() => {
    if (searchParams.get('demo') === 'cureat') router.push('/projects/cureat');
  }, [searchParams, router]);

  const currentData = locale === 'en' ? projectsDataEn : projectsData;

  if (!mounted) return <section id="projects" className="py-24"></section>;

  // 진행 중 프로젝트를 최상단에, 나머지는 시간순(최신 우선)
  const items = [...currentData.items].sort((a, b) => {
    const an = shortNameOf(a.title), bn = shortNameOf(b.title);
    const ai = CURRENT.indexOf(an), bi = CURRENT.indexOf(bn);
    if (ai !== -1 || bi !== -1) {
      if (ai !== -1 && bi !== -1) return ai - bi;
      return ai !== -1 ? -1 : 1;
    }
    return (YEAR[bn] || '').localeCompare(YEAR[an] || '');
  });

  return (
    <section id="projects" className="border-t border-neutral-100 py-24 text-neutral-900">
      <div className="mb-14">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-900 mb-4">
          {currentData.topLabel}
        </h2>
        <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] text-neutral-900 whitespace-pre-line">
          {currentData.title}
        </h3>
      </div>

      {/* 시간순 리스트 — 행 클릭 시 프로젝트 상세로 이동 */}
      <div className="border-t border-neutral-200">
        {items.map((project) => {
          const name = shortNameOf(project.title);
          const year = YEAR[name] || '';
          const isCurrent = CURRENT.includes(name);
          return (
            <a
              key={project.title}
              href={`/projects/${slugify(project.title)}`}
              className="group flex items-center gap-4 sm:gap-6 py-4 border-b border-neutral-200"
            >
              <span className="font-mono text-xs text-neutral-300 w-10 shrink-0">{year}</span>
              <span className="flex items-center gap-2 shrink-0">
                {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-accent" title="In progress" aria-hidden />}
                <span className="font-black text-neutral-900 group-hover:text-accent transition-colors">{name}</span>
              </span>
              <span className="flex-1 min-w-0 text-sm font-light text-neutral-400 truncate hidden sm:block">{project.desc}</span>
              <ArrowRight
                size={16}
                className="ml-auto shrink-0 text-neutral-300 group-hover:text-accent group-hover:translate-x-1 transition-all"
                aria-hidden
              />
            </a>
          );
        })}
      </div>
    </section>
  );
}
