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


export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Knowledges initialData={getGraphData()} />
      <Contact />
      <Footer />
    </>
  );
}