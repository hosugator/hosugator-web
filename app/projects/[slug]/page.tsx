// app/projects/[slug]/page.tsx — 프로젝트별 상세 (정적 프리렌더)
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { projectsData } from '@/data/projectsData';
import { slugify, shortNameOf } from '@/lib/projects';
import ProjectDetail from '@/components/sections/ProjectDetail';
import { noteCountFor } from '@/lib/noteCounts';

export const dynamicParams = false;

export function generateStaticParams() {
  return projectsData.items.map((p) => ({ slug: slugify(p.title) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projectsData.items.find((x) => slugify(x.title) === slug);
  const name = p ? shortNameOf(p.title) : 'Project';
  return {
    title: name,
    description: p?.desc?.slice(0, 150),
    alternates: { canonical: `/projects/${slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // 관련 노트 수는 fs를 읽어야 하므로 서버(여기)에서 세어 prop으로 넘긴다.
  // ProjectDetail은 클라이언트 컴포넌트라 직접 셀 수 없다.
  const noteCount = noteCountFor(slug);
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <ProjectDetail slug={slug} noteCount={noteCount} />
    </Suspense>
  );
}
