// components/sections/About.tsx
import { aboutData } from '@/data/aboutData';
import Image from 'next/image';

export default function About() {
  return (
    <section id="about" className="min-h-screen flex flex-col justify-center border-t border-slate-100 py-24">
      {/* Layout에서 ml을 잡았으므로 추가 마진 없이 바로 시작 */}
      <h2 className="text-[14px] font-bold tracking-[0.5em] uppercase text-[#13ecda] mb-8">
        {aboutData.topLabel}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* 왼쪽: 텍스트 및 강조 영역 */}
        <div className="lg:col-span-7 space-y-8">
          <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-tight">
            {aboutData.title.main} <br />
            <span className="text-[#13ecda]">{aboutData.title.highlight}</span>
          </h3>
          
          <div className="space-y-6 text-xl font-extralight leading-relaxed text-slate-400">
            {aboutData.content.map((item, i) => (
              <p key={i}>
                {item.text}
              </p>
            ))}
          </div>
        </div>

        {/* 오른쪽: 이미지 카드 */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-xs font-mono uppercase tracking-widest">
              <Image 
                src="/images/my-profile.jpg" 
                alt="Seung Wan Profile"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority // Hero 섹션과 가까우므로 우선순위 로딩
              />            
            </div>
            <div className="absolute inset-4 border border-[#13ecda]/20 rounded-xl pointer-events-none group-hover:inset-2 transition-all duration-500" />
          </div>
        </div>
      </div>
    </section>
  );
}