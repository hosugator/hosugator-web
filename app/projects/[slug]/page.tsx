// app/projects/[slug]/page.tsx — 프로젝트별 상세 (정적 프리렌더)
import type { Metadata } from 'next';
import { projectsData } from '@/data/projectsData';
import { slugify, shortNameOf } from '@/lib/projects';
import ProjectDetail from '@/components/sections/ProjectDetail';

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
  return <ProjectDetail slug={slug} />;
}
