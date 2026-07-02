// app/portfolio/page.tsx  (Server Component — 페이지별 metadata)
import type { Metadata } from 'next';
import PortfolioView from '@/components/sections/PortfolioView';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: '홍승완의 전체 프로젝트 — Industrial AI·LLM Agent·Cloud-Native·Full-Stack 구현 사례와 데모.',
  alternates: { canonical: '/portfolio' },
};

export default function PortfolioPage() {
  return <PortfolioView />;
}
