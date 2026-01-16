// components/sections/Experience.tsx
import { experienceData } from '@/data/experienceData';

export default function Experience() {
  return (
    <section id="experience" className="min-h-screen flex flex-col justify-center border-t border-slate-100 py-24">
      <div className="max-w-5xl">
        <div className="mb-20">
          <h2 className="text-[14x] font-bold tracking-[0.5em] uppercase text-[#13ecda] mb-4">
            {experienceData.topLabel}
          </h2>
          <h3 className="text-6xl font-black tracking-tighter text-slate-900 whitespace-pre-line">
            {experienceData.title}
          </h3>
        </div>

        <div className="space-y-24 relative">
          <div className="absolute left-0 top-2 bottom-0 w-[1px] bg-slate-100 md:-left-12" />

          {experienceData.items.map((exp, index) => (
            <div key={index} className="group relative">
              <div className="hidden md:block absolute -left-[51.5px] top-2 size-2 rounded-full bg-slate-200 group-hover:bg-[#13ecda] transition-colors border-4 border-white ring-1 ring-slate-100" />
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-3 text-xs font-mono font-medium text-slate-400 tracking-wider">
                  {exp.period}
                </div>
                <div className="md:col-span-9">
                  <h4 className="text-3xl font-bold text-slate-900 mb-2 group-hover:text-[#13ecda] transition-colors">
                    {exp.company}
                  </h4>
                  <p className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-widest">
                    {exp.role}
                  </p>
                  <p className="text-xl font-extralight leading-relaxed text-slate-500 max-w-3xl">
                    {exp.description}
                  </p>
                  <div className="flex gap-2 mt-8">
                    {exp.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 text-[14px] font-bold bg-[#13ecda]/10 text-[#13ecda] rounded-full">
                        {tag}
                      </span>
                    ))}
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