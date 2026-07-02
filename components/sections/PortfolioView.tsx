'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, ArrowRight, PlayCircle, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { projectsData } from '@/data/projectsData';
import { projectsDataEn } from '@/data/projectsData.en';
import CureatDemoModal from '@/components/demo/CureatDemoModal';
import ProjectVideoModal from '@/components/demo/ProjectVideoModal';
import Footer from '@/components/layout/Footer';

const shortNameOf = (title: string) => title.split(':')[0].trim();

const T = {
  ko: { back: '홈으로', pdf: 'PDF 다운로드', notes: '관련 노트', label: 'Portfolio', title: '전체\n프로젝트.' },
  en: { back: 'Home', pdf: 'Download PDF', notes: 'Related Notes', label: 'Portfolio', title: 'All\nProjects.' },
} as const;

export default function PortfolioView() {
  const { locale } = useLanguage();
  const router = useRouter();
  const data = locale === 'en' ? projectsDataEn : projectsData;
  const t = locale === 'en' ? T.en : T.ko;

  const [isCureatOpen, setIsCureatOpen] = useState(false);
  const [videoModal, setVideoModal] = useState({ isOpen: false, src: '', title: '' });

  const openMedia = (project: { video?: string; title: string }) => {
    if (!project.video) return;
    setVideoModal({ isOpen: true, src: project.video, title: project.title });
  };

  return (
    <div className="relative w-full md:max-w-4xl md:mx-auto px-5 md:px-8 pb-20">
      {/* 상단 바 */}
      <div className="flex items-center justify-between pt-4 pb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-accent transition-colors"
        >
          <ArrowLeft size={14} /> {t.back}
        </Link>
        <a
          href="/portfolio.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3.5 py-1.5 text-xs font-bold text-neutral-500 hover:text-accent hover:border-accent transition-colors"
        >
          <Download size={13} /> {t.pdf}
        </a>
      </div>

      {/* 헤더 */}
      <header className="mb-14">
        <h1 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-400 mb-4">{t.label}</h1>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] text-neutral-900 whitespace-pre-line">
          {t.title}
        </h2>
      </header>

      {/* 전체 프로젝트 — 리치 블록 */}
      <div className="border-t border-neutral-200">
        {data.items.map((project, index) => {
          const isCureat = shortNameOf(project.title).toLowerCase() === 'cureat';
          const hasMedia = !!project.video;
          const relatedHref = `/blog?project=${encodeURIComponent(shortNameOf(project.title))}`;

          return (
            <div key={index} className="flex flex-col sm:flex-row gap-6 py-8 border-b border-neutral-200">
              {/* 커버: 클릭 → 관련 노트 / 미디어 있으면 재생 버튼 */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => router.push(relatedHref)}
                className="group relative sm:w-56 shrink-0 aspect-[16/10] rounded-xl bg-neutral-900 text-white overflow-hidden text-left p-4 flex flex-col justify-between hover:bg-neutral-800 transition-colors"
              >
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span>{project.tags[0]?.replace('#', '')}</span>
                </div>
                <div className="flex items-end justify-between gap-2">
                  <span className="text-lg font-black leading-tight">{shortNameOf(project.title)}</span>
                  {hasMedia ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); openMedia(project); }}
                      aria-label="Play demo"
                      className="shrink-0 grid place-items-center w-9 h-9 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm hover:bg-white/25 transition-colors"
                    >
                      <PlayCircle size={18} />
                    </button>
                  ) : (
                    <ArrowUpRight size={18} className="text-white/40 shrink-0" />
                  )}
                </div>
              </div>

              {/* 콘텐츠 */}
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[9px] font-black px-2 py-0.5 bg-neutral-50 text-neutral-400 rounded border border-neutral-100 tracking-wider uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg md:text-xl font-black text-neutral-900 leading-snug">{project.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed font-light mt-2 max-w-xl">{project.desc}</p>

                <div className="flex items-center gap-5 mt-auto pt-5 text-xs">
                  <a href={relatedHref} className="font-bold flex items-center gap-1.5 text-neutral-400 hover:text-accent transition-colors">
                    {t.notes} <ArrowRight size={13} />
                  </a>
                  {isCureat && (
                    <button
                      onClick={() => setIsCureatOpen(true)}
                      className="group flex items-center gap-2 font-black text-accent hover:text-accent/80 transition-colors"
                    >
                      LIVE DEMO
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <CureatDemoModal isOpen={isCureatOpen} onClose={() => setIsCureatOpen(false)} />
      <ProjectVideoModal
        isOpen={videoModal.isOpen}
        onClose={() => setVideoModal({ ...videoModal, isOpen: false })}
        mediaSrc={videoModal.src}
        title={videoModal.title}
        type="video"
      />

      <Footer />
    </div>
  );
}
