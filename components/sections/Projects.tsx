'use client';

import { projectsDataEn } from '@/data/projectsData.en'; // 영어 데이터 추가
import { useLanguage } from '@/contexts/LanguageContext'; // 추가
import { useState, useEffect } from 'react';
import { FileText, ArrowRight, ArrowUpRight } from 'lucide-react';
import { projectsData } from '@/data/projectsData';
import CureatDemoModal from '@/components/demo/CureatDemoModal';
import ProjectVideoModal from '@/components/demo/ProjectVideoModal';
import { useSearchParams, useRouter } from 'next/navigation'; // Next.js 파라미터 훅 추가

export default function Projects() {
  const { locale } = useLanguage(); // 현재 설정된 언어(ko/en) 가져오기
  const [mounted, setMounted] = useState(false); // 마운트 상태 추가
  useEffect(() => {
    setMounted(true);
  }, []);
  const router = useRouter(); // router 선언

  // 언어에 맞는 데이터 선택
  const currentData = locale === 'en' ? projectsDataEn : projectsData;
  const clearParams = () => {
    // 모달을 닫을 때 URL의 파라미터를 제거하여 재진입 방지
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

  // URL 파라미터 기반 모달 딥링크 (?demo=cureat, ?view=architecture)
  useEffect(() => {
    const demoTarget = searchParams.get('demo');
    const viewTarget = searchParams.get('view');

    if (demoTarget === 'cureat') {
      setIsCureatModalOpen(true);
    }

    if (viewTarget === 'architecture') {
      setVideoModal({
        isOpen: true,
        src: "/projects/hosugator_thumb_latest.png",
        title: "Hosugator: Cloud-Native Architecture",
        type: 'image'
      });
    }
  }, [searchParams]);

  // 커버 클릭 시 실제 미디어(비디오/이미지)를 모달로 열기
  const openMedia = (project: { video?: string; image: string; title: string }) => {
    const hasVideo = !!project.video;
    setVideoModal({
      isOpen: true,
      src: hasVideo ? project.video! : project.image,
      title: project.title,
      type: hasVideo ? 'video' : 'image',
    });
  };

  const displayItems = currentData.items;

  if (!mounted) return <section id="projects" className="py-32"></section>;

  return (
    <section id="projects" className="py-24 border-t border-neutral-100 text-neutral-900">
      <div className="mb-14">
        <h2 className="text-[14px] font-bold tracking-[0.5em] uppercase text-neutral-900 mb-4">
          {currentData.topLabel}
        </h2>
        <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-neutral-900 whitespace-pre-line leading-none">
          {currentData.title}
        </h3>
      </div>

      {/* 단일 컬럼 프로젝트 리스트 */}
      <div className="border-t border-neutral-200">
        {displayItems.map((project, index) => {
          const shortName = project.title.split(':')[0];
          const isCureat = project.title.toLowerCase().includes('cureat');

          return (
            <div key={index} className="flex flex-col sm:flex-row gap-6 py-8 border-b border-neutral-200">
              {/* 타이포그래픽 커버 (클릭 → 미디어 모달) */}
              <button
                onClick={() => openMedia(project)}
                className="group relative sm:w-56 shrink-0 aspect-[16/10] rounded-xl bg-neutral-900 text-white overflow-hidden text-left p-4 flex flex-col justify-between hover:bg-neutral-800 transition-colors"
              >
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span>{project.tags[0]?.replace('#', '')}</span>
                </div>
                <div className="flex items-end justify-between gap-2">
                  <span className="text-lg font-black leading-tight">{shortName}</span>
                  <ArrowUpRight size={18} className="text-white/40 group-hover:text-white transition-colors shrink-0" />
                </div>
              </button>

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
                  <a href={project.pdfLink} target="_blank" rel="noopener noreferrer" className="font-bold flex items-center gap-1.5 text-neutral-400 hover:text-accent transition-colors">
                    <FileText size={14} /> Case Study
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
