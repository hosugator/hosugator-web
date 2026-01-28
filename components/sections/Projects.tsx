'use client';

import { useRef, useState } from 'react';
import { PlayCircle, FileText, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface ProjectMediaProps {
  video?: string;
  image?: string;
  title: string;
}

const ProjectMedia = ({ video, image, title }: ProjectMediaProps) => {
  return (
    <div className="w-full aspect-[16/10] rounded-lg bg-white overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 relative border border-slate-100">
      {video ? (
        <video
          src={video}
          poster={image}
          muted
          loop
          playsInline
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
        />
      ) : image ? (
        <img src={image} alt={title} className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" />
      ) : (
        <div className="absolute inset-0 bg-slate-200" />
      )}
    </div>
  );
};

export default function Projects() {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onDragStart = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDrag(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onDragEnd = () => {
    setIsDrag(false);
  };

  const onDragMove = (e: React.MouseEvent) => {
    if (!isDrag || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.2; 
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section id="projects" className="py-32 border-t border-slate-100 overflow-hidden">
      {/* 제목 부분의 컨테이너 */}
      <div className="container mx-auto px-6 mb-16">
        <div className="flex justify-between items-end gap-4">
          <div className="max-w-2xl">
            <h2 className="text-[14px] font-bold tracking-[0.5em] uppercase text-[#13ecda] mb-4">
              {t.projects.topLabel}
            </h2>
            <h3 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 whitespace-pre-line leading-none">
              {t.projects.title}
            </h3>
          </div>
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
          onMouseLeave={onDragEnd}
          // 수정: px-6으로 고정하여 좌측 정렬을 제목과 맞춤
          className="flex gap-6 overflow-x-auto pb-12 scrollbar-hide select-none cursor-grab active:cursor-grabbing px-6 md:px-[calc((100vw-1280px)/2+1.5rem)] lg:px-[calc((100vw-1280px)/2+1.5rem)]"
          style={{ scrollSnapType: isDrag ? 'none' : 'x mandatory' }}
        >
          {t.projects.items.map((project, index) => (
            <div 
              key={index} 
              // 한 화면에 약 2.5개가 보이도록 설정
              className="w-[85vw] md:w-[calc((100vw-120px)/2.5)] min-w-[320px] max-w-[420px] p-7 rounded-xl flex flex-col gap-6 hover:shadow-2xl hover:shadow-[#13ecda]/5 transition-all group bg-white border border-slate-50 shrink-0 snap-start"
            >
              <ProjectMedia video={project.video} image={project.image} title={project.title} />

              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-black px-2 py-1 bg-[#13ecda]/10 text-[#13ecda] rounded border border-[#13ecda]/20 tracking-wider uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
                <h4 className="text-xl font-black tracking-tight text-slate-900 line-clamp-1">{project.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-light h-16 line-clamp-3">{project.desc}</p>
                
                <div className="flex items-center gap-4 mt-2">
                  <a href={project.pdfLink} target="_blank" className="text-sm font-bold flex items-center gap-1.5 text-slate-900 hover:text-[#13ecda] transition-colors">
                    <FileText size={16} /> Case Study
                  </a>
                  {project.demoLink !== "#" && (
                    <a href={project.demoLink} className="text-sm font-bold flex items-center gap-1.5 text-[#13ecda]/60 hover:text-[#13ecda] transition-colors">
                      <PlayCircle size={16} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="min-w-[100px] shrink-0" />
        </div>
      </div>
    </section>
  );
}