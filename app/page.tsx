// app/page.tsx

import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Insights from '@/components/sections/Insights';
import Projects from '@/components/sections/Projects';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import { Suspense } from 'react';

export default function Home() {
  return (
    <>
      <About />
      <Experience />
      <Insights />
      <Suspense fallback={<div className="py-20 text-center">Loading Projects...</div>}>
        <Projects />
      </Suspense>
      <Contact />
      <Footer />
    </>
  );
}