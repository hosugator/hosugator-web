// components/sections/Experience.tsx
import { resumeData } from '@/data/resume';

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-12 md:px-24 border-t border-slate-100">
      <div className="max-w-4xl">
        <div className="mb-20">
          {/* 흑백 탈출: primary 컬러 적용 */}
          <h2 className="text-[11px] font-bold tracking-[0.5em] uppercase text-primary mb-4">
            Experience
          </h2>
          <h3 className="text-4xl font-black tracking-tighter text-slate-900">
            Professional <br /> Journey.
          </h3>
        </div>

        <div className="space-y-24 relative">
          {/* 가이드 라인에 아주 연한 primary 색상 부여 가능 */}
          <div className="absolute left-0 top-2 bottom-0 w-[1px] bg-slate-100 md:-left-12" />

          {resumeData.experience.map((exp, index) => (
            <div key={index} className="group relative">
              {/* 호버 시 점의 색상이 primary로 변하도록 설정 */}
              <div className="hidden md:block absolute -left-[51.5px] top-2 size-2 rounded-full bg-slate-200 group-hover:bg-primary transition-colors border-4 border-white ring-1 ring-slate-100" />
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
                <div className="md:col-span-3">
                  <span className="text-xs font-mono font-medium text-slate-400 tracking-wider">
                    {exp.period}
                  </span>
                </div>

                <div className="md:col-span-9">
                  {/* 제목 호버 시 primary 컬러 적용 */}
                  <h4 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                    {exp.company}
                  </h4>
                  <p className="text-sm font-bold text-slate-500 mb-6 tracking-wide uppercase">
                    {exp.role}
                  </p>
                  <p className="text-lg font-extralight leading-relaxed text-slate-600 max-w-2xl">
                    {exp.description}
                  </p>
                  
                  {/* 태그에 배경색 포인트 추가 */}
                  <div className="flex gap-2 mt-8">
                    <span className="px-3 py-1 text-[10px] font-bold bg-primary/10 text-primary rounded-full transition-all">
                      Architecture
                    </span>
                    <span className="px-3 py-1 text-[10px] font-bold bg-primary/10 text-primary rounded-full transition-all">
                      Optimization
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}