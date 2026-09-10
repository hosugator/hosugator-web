// app/page.tsx

import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import Insights from '@/components/sections/Insights';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import ScrollFocus from '@/components/ui/ScrollFocus';
import { Suspense } from 'react';
import Knowledges from '@/components/sections/KnowledgesLazy';
import { getGraphData } from '@/lib/getNodes';

// 순서 근거: Hero(앵커+라이브 데모) → Experience(1줄 요약, 프로젝트로 링크)
// → Projects(전체 증거) → Insights(추상적 원칙, 심층 검증용) → Knowledges(블로그,
// 최심층 아카이브). Experience를 압축한 뒤라 Projects까지의 스크롤 거리가 짧아져,
// 자연스러운 서사 순서(배경 → 증거)로 되돌려도 "빨리 증거에 도달" 원칙이 유지된다.
export default function Home() {
  return (
    <div className="relative w-full md:max-w-4xl md:mx-auto px-5 md:px-8 pb-20">
      <ScrollFocus><About /></ScrollFocus>
      <ScrollFocus><Experience /></ScrollFocus>
      <Suspense fallback={<div className="py-20 text-center">Loading Projects...</div>}>
        <ScrollFocus><Projects /></ScrollFocus>
      </Suspense>
      <ScrollFocus><Insights /></ScrollFocus>
      <ScrollFocus><Knowledges initialData={getGraphData()} /></ScrollFocus>
      <ScrollFocus><Contact /></ScrollFocus>
      <Footer />
    </div>
  );
}
