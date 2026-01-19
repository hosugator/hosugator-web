// components/sections/Projects.tsx
'use client';

import { PlayCircle, FileText, ArrowRight } from 'lucide-react';
import { projectsData } from '@/data/projectsData';

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
  return (
    <section id="projects" className="py-32 border-t border-slate-100 overflow-hidden">
      <div className="max-w-full">
        <div className="flex justify-between items-end mb-16 gap-4 pr-12">
          <div>
            <h2 className="text-[14px] font-bold tracking-[0.5em] uppercase text-[#13ecda] mb-4">
              {projectsData.topLabel}
            </h2>
            <h3 className="text-6xl font-black tracking-tighter text-slate-900 whitespace-pre-line">
              {projectsData.title}
            </h3>
          </div>
          <div className="hidden md:flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-widest">
            Scroll to explore <ArrowRight size={14} />
          </div>
        </div>

        {/* 수평 스크롤 컨테이너 */}
        <div className="flex gap-8 overflow-x-auto pb-12 scrollbar-hide snap-x snap-mandatory">
          {projectsData.items.map((project, index) => (
            <div 
              key={index} 
              className="min-w-[85vw] md:min-w-[450px] p-8 rounded-xl flex flex-col gap-8 hover:shadow-2xl hover:shadow-[#13ecda]/5 transition-all group bg-white border border-slate-50 snap-start"
            >
              <ProjectMedia video={project.video} image={project.image} title={project.title} />

              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-black px-2 py-1 bg-[#13ecda]/10 text-[#13ecda] rounded border border-[#13ecda]/20 tracking-wider uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
                <h4 className="text-2xl font-black tracking-tight text-slate-900 line-clamp-1">{project.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-light h-20 line-clamp-3">{project.desc}</p>
                
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
          {/* 우측 여백 확보용 빈 공간 */}
          <div className="min-w-[100px] h-full" />
        </div>
      </div>
    </section>
  );
}