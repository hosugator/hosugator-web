// app/page.tsx

import { getGraphData } from '@/lib/getNodes';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About'; // 추가
import Experience from '@/components/sections/Experience';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import Knowledges from '@/components/sections/Knowledges';
import { Suspense } from 'react';


export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      {/* <Skills /> */}
      {/* 2. Projects 컴포넌트를 Suspense로 감싸기 */}
      <Suspense fallback={<div className="py-20 text-center">Loading Projects...</div>}>
        <Projects />
      </Suspense>
      <Knowledges initialData={getGraphData()} />
      <Contact />
      <Footer />
    </>
  );
}