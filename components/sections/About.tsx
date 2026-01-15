// components/sections/About.tsx
export default function About() {
  return (
    <section id="about" className="py-24 px-12 md:px-24 border-b border-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* 텍스트 영역 */}
        <div className="lg:col-span-7">
          <h2 className="text-[11px] font-bold tracking-[0.5em] uppercase text-primary mb-8">
            About Me
          </h2>
          <div className="space-y-6 text-lg font-light leading-relaxed text-slate-600">
            <p>
              단순한 엔지니어를 넘어, <span className="text-slate-900 font-medium">비즈니스의 맥락을 이해하는 문제 해결사</span>가 되고자 합니다. 
              글로벌 EPC 프로젝트 현장에서 수만 개의 부품과 수십 명의 이해관계를 조율하던 경험은 
              이제 복잡한 클라우드 인프라와 AI 파이프라인을 설계하는 밑거름이 되었습니다.
            </p>
            <p>
              기술은 그 자체로 의미를 갖기보다 비즈니스 임팩트를 만들어낼 때 가치가 증명된다고 믿습니다. 
              지연 시간을 줄이고 비용을 절감하는 모든 과정은 결국 고객의 성공으로 이어져야 합니다.
            </p>
          </div>
        </div>

        {/* 사진 영역: 자리 마련 */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 group">
            {/* 실제 이미지가 들어갈 곳 (src에 경로 입력) */}
            <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-xs font-mono uppercase tracking-widest">
              [ Your Photo Here ]
            </div>
            {/* 테두리 포인트 효과 */}
            <div className="absolute inset-4 border border-primary/20 rounded-xl pointer-events-none group-hover:inset-2 transition-all duration-500" />
          </div>
        </div>
      </div>
    </section>
  );
}