"use client";
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// 섹션이 뷰포트 상·하단으로 이탈할 때 blur + fade로 아웃포커싱 (현재 섹션만 또렷)
export default function ScrollFocus({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // 0=하단 진입, 0.5=중앙, 1=상단 이탈
  const opacity = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [0.25, 1, 1, 0.25]);
  const filter = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], ['blur(5px)', 'blur(0px)', 'blur(0px)', 'blur(5px)']);

  return (
    <motion.div ref={ref} style={{ opacity, filter, willChange: 'opacity, filter' }}>
      {children}
    </motion.div>
  );
}
