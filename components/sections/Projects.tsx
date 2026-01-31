'use client';

import { useRef, useState, useEffect } from 'react';
import { FileText, ArrowRight, PlayCircle, ImageIcon } from 'lucide-react';
import { projectsData } from '@/data/projectsData';
import CureatDemoModal from '@/components/demo/CureatDemoModal';
import ProjectVideoModal from '@/components/demo/ProjectVideoModal';

export default function Projects() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [isCureatModalOpen, setIsCureatModalOpen] = useState(false);
  // 모달 상태에 type 추가
  const [videoModal, setVideoModal] = useState({ 
    isOpen: false, 
    src: '', 
    title: '', 
    type: 'video' as 'video' | 'image' 
  });

  // 자동 스크롤 로직
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;

    const autoScroll = () => {
      if (!isPaused && !isDrag) {
        scrollContainer.scrollLeft += 0.5;
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, isDrag]);

  const onDragStart = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDrag(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onDragEnd = () => setIsDrag(false);

  const onDragMove = (e: React.MouseEvent) => {
    if (!isDrag || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const displayItems = [...projectsData.items, ...projectsData.items];

  return (
    <section id="projects" className="py-32 border-t border-slate-100 overflow-hidden text-slate-900 bg-white">
      <div className="container mx-auto px-6 mb-16 text-left">
        <h2 className="text-[14px] font-bold tracking-[0.5em] uppercase text-[#13ecda] mb-4">
          {projectsData.topLabel}
        </h2>
        <div className="flex justify-between items-end">
          <h3 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 whitespace-pre-line leading-none">
            {projectsData.title}
          </h3>
          <div className="hidden md:flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-widest pb-2">
            Drag to explore <ArrowRight size={14} />
          </div>
        </div>
      </div>

      <div className="max-w-full relative">
        <div
          ref={scrollRef}
          onMouseDown={onDragStart}
          onMouseMove={onDragMove}
          onMouseUp={onDragEnd}
          onMouseLeave={() => { onDragEnd(); setIsPaused(false); }}
          onMouseEnter={() => setIsPaused(true)}
          className="flex gap-8 overflow-x-auto pb-12 scrollbar-hide select-none cursor-grab active:cursor-grabbing px-6 md:px-[calc((100vw-1280px)/2+1.5rem)]"
        >
          {displayItems.map((project, index) => {
            // Hosugator 프로젝트 여부 확인
            const isArchitectureImg = project.title.toLowerCase().includes("hosugator");

            return (
              <div key={index} className="w-[320px] md:w-[450px] flex flex-col shrink-0 snap-start">
                <div
                  className="w-full aspect-[16/10] rounded-lg bg-white overflow-hidden border border-slate-100 relative group/media cursor-pointer"
                  onClick={() => setVideoModal({ 
                    isOpen: true, 
                    src: isArchitectureImg ? project.image : project.video, 
                    title: project.title,
                    type: isArchitectureImg ? 'image' : 'video'
                  })}
                >
                  {!isArchitectureImg && project.video ? (
                    <>
                      <video
                        src={project.video}
                        poster={project.image}
                        muted loop playsInline
                        className="w-full h-full object-contain transition-transform duration-500 group-hover/media:scale-105"
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                      />
                      <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30">
                          <PlayCircle className="text-white" size={32} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30">
                          <ImageIcon className="text-white" size={32} />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-8 flex flex-col flex-1 text-left">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-black px-2 py-1 bg-slate-50 text-slate-400 rounded border border-slate-100 tracking-wider uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-xl font-black text-slate-900">{project.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-light mt-2 line-clamp-3">
                    {project.desc}
                  </p>

                  <div className="flex items-center gap-6 mt-auto pt-8">
                    <a href={project.pdfLink} target="_blank" rel="noopener noreferrer" className="text-sm font-bold flex items-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors">
                      <FileText size={16} /> Case Study
                    </a>
                    {project.title.toLowerCase().includes("cureat") && (
                      <button
                        onClick={() => setIsCureatModalOpen(true)}
                        className="group flex items-center gap-2 text-sm font-black text-rose-500 hover:text-rose-600 transition-colors"
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
      </div>

      <CureatDemoModal isOpen={isCureatModalOpen} onClose={() => setIsCureatModalOpen(false)} />
      <ProjectVideoModal
        isOpen={videoModal.isOpen}
        onClose={() => setVideoModal({ ...videoModal, isOpen: false })}
        mediaSrc={videoModal.src}
        title={videoModal.title}
        type={videoModal.type}
      />
    </section>
  );
}