// app/page.tsx

import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Insights from '@/components/sections/Insights';
import Projects from '@/components/sections/Projects';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import ScrollFocus from '@/components/ui/ScrollFocus';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="relative w-full md:max-w-4xl md:mx-auto px-5 md:px-8 pb-20">
      <ScrollFocus><About /></ScrollFocus>
      <ScrollFocus><Experience /></ScrollFocus>
      <ScrollFocus><Insights /></ScrollFocus>
      <Suspense fallback={<div className="py-20 text-center">Loading Projects...</div>}>
        <ScrollFocus><Projects /></ScrollFocus>
      </Suspense>
      <ScrollFocus><Contact /></ScrollFocus>
      <Footer />
    </div>
  );
}