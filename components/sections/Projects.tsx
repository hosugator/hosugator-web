'use client';

import { projectsDataEn } from '@/data/projectsData.en'; // 영어 데이터 추가
import { useLanguage } from '@/contexts/LanguageContext'; // 추가
import { useState, useEffect } from 'react';
import { ArrowRight, ArrowUpRight, PlayCircle } from 'lucide-react';
import { projectsData } from '@/data/projectsData';
import CureatDemoModal from '@/components/demo/CureatDemoModal';
import ProjectVideoModal from '@/components/demo/ProjectVideoModal';
import { useSearchParams, useRouter } from 'next/navigation'; // Next.js 파라미터 훅 추가

// 대표작(Selected Work) — 프로젝트명(콜론 앞) 기준, 배열 순서대로 노출
const FEATURED = ['AlignAI', 'Dotodo', 'Cureat'];
const shortNameOf = (title: string) => title.split(':')[0].trim();

export default function Projects() {
  const { locale } = useLanguage(); // 현재 설정된 언어(ko/en) 가져오기
  const [mounted, setMounted] = useState(false); // 마운트 상태 추가
  useEffect(() => {
    setMounted(true);
  }, []);
  const router = useRouter(); // router 선언

  const currentData = locale === 'en' ? projectsDataEn : projectsData;
  const clearParams = () => {
    router.replace('/#projects', { scroll: false });
  };
  const searchParams = useSearchParams();
  const [isCureatModalOpen, setIsCureatModalOpen] = useState(false);
  const [videoModal, setVideoModal] = useState({
    isOpen: false,
    src: '',
    title: '',
    type: 'video' as 'video' | 'image'
  });

  // URL 파라미터 기반 데모 딥링크 (?demo=cureat)
  useEffect(() => {
    if (searchParams.get('demo') === 'cureat') {
      setIsCureatModalOpen(true);
    }
  }, [searchParams]);

  // 미디어는 동영상만 (이미지는 목데이터라 제거)
  const openMedia = (project: { video?: string; title: string }) => {
    if (!project.video) return;
    setVideoModal({ isOpen: true, src: project.video, title: project.title, type: 'video' });
  };

  if (!mounted) return <section id="projects" className="py-24"></section>;

  type Project = typeof currentData.items[number];
  const featured = FEATURED
    .map((name) => currentData.items.find((p) => shortNameOf(p.title) === name))
    .filter((p): p is Project => Boolean(p));
  const rest = currentData.items.filter((p) => !FEATURED.includes(shortNameOf(p.title)));

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

      {/* Selected Work — 대표작 (리치) */}
      <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-400 mb-6">
        Selected Work
      </div>
      <div className="border-t border-neutral-200 mb-16">
        {featured.map((project, index) => {
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
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-black px-2 py-0.5 bg-neutral-50 text-neutral-400 rounded border border-neutral-100 tracking-wider uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
                <h4 className="text-lg md:text-xl font-black text-neutral-900 leading-snug">{project.title}</h4>
                <p className="text-neutral-500 text-sm leading-relaxed font-light mt-2 max-w-xl">
                  {project.desc}
                </p>

                <div className="flex items-center gap-5 mt-auto pt-5 text-xs">
                  <a href={relatedHref} className="font-bold flex items-center gap-1.5 text-neutral-400 hover:text-accent transition-colors">
                    {locale === 'en' ? 'Related Notes' : '관련 노트'} <ArrowRight size={13} />
                  </a>
                  {isCureat && (
                    <button
                      onClick={() => setIsCureatModalOpen(true)}
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

      {/* More Projects — 나머지 한 줄 인덱스 */}
      <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-400 mb-4">
        More Projects
      </div>
      <div className="border-t border-neutral-200">
        {rest.map((project, j) => {
          const n = String(featured.length + j + 1).padStart(2, '0');
          const highlight = project.desc.split('.')[0];
          const hasMedia = !!project.video;
          const relatedHref = `/blog?project=${encodeURIComponent(shortNameOf(project.title))}`;
          return (
            <div key={j} className="group flex items-center justify-between gap-4 py-4 border-b border-neutral-200">
              {/* 프로젝트명 클릭 → 관련 노트 */}
              <button onClick={() => router.push(relatedHref)} className="flex items-baseline gap-4 min-w-0 text-left">
                <span className="text-[11px] font-mono text-neutral-300 shrink-0">{n}</span>
                <span className="font-black text-neutral-900 shrink-0 group-hover:text-accent transition-colors">{shortNameOf(project.title)}</span>
                <span className="text-sm text-neutral-400 font-light truncate hidden sm:block">{highlight}</span>
              </button>
              {hasMedia && (
                <button onClick={() => openMedia(project)} aria-label="Play demo" className="shrink-0 text-neutral-400 hover:text-accent transition-colors">
                  <PlayCircle size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <a
        href="/portfolio"
        className="group mt-8 inline-flex items-center gap-2 text-sm font-black text-neutral-900 hover:text-accent transition-colors"
      >
        {locale === 'en' ? 'View all projects' : '전체 프로젝트 보기'}
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </a>

      <CureatDemoModal isOpen={isCureatModalOpen} onClose={() => { setIsCureatModalOpen(false); clearParams(); }} />
      <ProjectVideoModal
        isOpen={videoModal.isOpen}
        onClose={() => { setVideoModal({ ...videoModal, isOpen: false }); clearParams(); }}
        mediaSrc={videoModal.src}
        title={videoModal.title}
        type={videoModal.type}
      />
    </section>
  );
}
