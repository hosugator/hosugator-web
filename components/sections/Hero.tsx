// components/sections/Hero.tsx
import { heroData } from '@/data/heroData';

export default function Hero() {
  const { topLabel, mainTitle, description, stats } = heroData;

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center">
      <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#13ecda] mb-6">
        {topLabel}
      </h2>
      
      <h1 className="text-7xl md:text-[120px] font-black leading-[0.85] tracking-tighter text-slate-900 mb-12">
        {mainTitle.line1}<br />
        {mainTitle.line2}<br />
        <span className="text-[#13ecda] italic">{mainTitle.highlight}</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-10 border-t border-slate-100">
        <div className="md:col-span-9 max-w-4xl text-2xl font-extralight leading-relaxed text-slate-400">
          <p>
            {description.prefix}
            <span className="text-slate-900 font-medium italic mx-1">{description.role}</span>
            {description.suffix}
          </p>
          <p className="mt-2">
            <span className="text-slate-900 font-semibold">
              {description.target}</span>
            {description.end}
          </p>
        </div>

        {stats && (
          <div className="md:col-span-3 flex flex-col gap-10">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-5xl font-black text-slate-900 leading-none">{stat.value}</div>
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}