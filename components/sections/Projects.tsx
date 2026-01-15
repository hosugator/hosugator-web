'use client'; // 이 줄을 반드시 추가해야 합니다.

import { ExternalLink, ArrowRight, PlayCircle, FileText } from 'lucide-react';

// 1. 미디어 전담 컴포넌트 분리 (추상화)
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
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"                    
        />
      ) : (
        <div className="absolute inset-0 bg-slate-200" />
      )}
    </div>
  );
};

export default function Projects() {
  const projects = [
    {
      title: "Cureat: AI 미식 추천 시스템",
      tags: ["#AI", "#FastAPI", "#VectorDB"],
      desc: "Okt/ko-BERT를 활용한 자연어 분석으로 사용자 의도를 파악하고, Vector DB 기반 코사인 유사도 검색을 통해 응답 지연을 60% 단축한 개인화 추천 시스템입니다.",
      pdfLink: "/projects/project_cureat.pdf", // 첨부하신 PDF 연결
      demoLink: "#", // 추후 구현할 데모 링크
      video: "/projects/cureat_demo.mov",
      image: "/projects/cureat_thumb.png" 
    },
    {
      title: "NeuralDocs: Enterprise RAG",
      tags: ["#LLM", "#PYTHON", "#RAG"],
      desc: "10,000개 이상의 기술 문서를 처리하는 고성능 시맨틱 검색 및 인용 기반 답변 시스템입니다.",
      pdfLink: "#",
      demoLink: "#"
    }
  ];

  return (
    <section id="projects" className="py-32 px-12 md:px-24 border-t border-slate-100">
      <div className="max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
          <div>
            <h2 className="text-[11px] font-bold tracking-[0.5em] uppercase text-primary mb-4">Featured Projects</h2>
            <h3 className="text-4xl font-black tracking-tighter text-slate-900">Technical <br /> Implementations.</h3>
          </div>
          <button className="text-primary font-bold text-sm flex items-center gap-2 hover:translate-x-1 transition-all">
            View Archive <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project, index) => (
                      <div key={index} className="custom-border p-8 rounded-xl flex flex-col gap-8 hover:shadow-2xl hover:shadow-primary/5 transition-all group bg-white">
                        
                        {/* 2. 분리한 컴포넌트 호출 (코드 간결화) */}
                        <ProjectMedia 
                          video={project.video} 
                          image={project.image} 
                          title={project.title} 
                        />

              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-black px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20 tracking-wider uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
                <h4 className="text-2xl font-black tracking-tight text-slate-900">{project.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-light">
                  {project.desc}
                </p>
                
                {/* 버튼 그룹: PDF와 데모를 명확히 분리 */}
                <div className="flex items-center gap-4 mt-2">
                  <a 
                    href={project.pdfLink} 
                    target="_blank"
                    className="text-sm font-bold flex items-center gap-1.5 text-slate-900 hover:text-primary transition-colors"
                  >
                    <FileText size={16} /> Case Study
                  </a>
                  {project.demoLink && (
                    <a 
                      href={project.demoLink}
                      className="text-sm font-bold flex items-center gap-1.5 text-primary/60 hover:text-primary transition-colors"
                    >
                      <PlayCircle size={16} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}