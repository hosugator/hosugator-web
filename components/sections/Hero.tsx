// components/sections/Hero.tsx
export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-12 md:px-24">
      <div className="max-w-4xl">
        <h2 className="text-[11px] font-bold tracking-[0.5em] uppercase text-[#13ecda] mb-6">
          PM Mindset, AI Engineering
        </h2>
        <h1 className="text-7xl md:text-8xl font-black leading-[0.85] tracking-tighter text-slate-900 mb-12">
          Designing <br />
          Business <br />
          <span className="text-primary italic">Ripples.</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-16 pt-16 border-t border-slate-100">
          <p className="md:col-span-8 text-2xl font-extralight leading-relaxed text-slate-500">
            2년차 글로벌 <span className="text-slate-900 font-medium italic">EPC PM</span> 출신으로서, 
            실용주의적인 관점으로 비즈니스 가치를 설계하는 
            <span className="text-slate-900 font-semibold"> 클라우드 기술 지원 엔지니어</span>입니다.
          </p>
          
          <div className="md:col-span-4 flex flex-col gap-6">
            <div>
              <div className="text-3xl font-black text-slate-900">60%</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Latency</div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900">30%</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">OpEx Saving</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}