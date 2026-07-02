// app/resume/page.tsx  (Server Component — 페이지별 metadata 부착 지점)
import type { Metadata } from 'next';
import ResumeView from '@/components/sections/ResumeView';

export const metadata: Metadata = {
  title: 'Resume',
  description: '홍승완 — 비즈니스 문제를 코드로 해결하는 AI 엔지니어. 경력·프로젝트·인사이트 요약.',
  alternates: { canonical: '/resume' },
};

export default function ResumePage() {
  return <ResumeView />;
}
