// app/sitemap.ts → 빌드 시 /sitemap.xml 생성
import type { MetadataRoute } from "next";
import { projectSlugs } from "@/lib/projects";

const SITE_URL = "https://hosugator.com";

// output: export(정적 내보내기)에서 metadata route는 정적 생성으로 고정해야 한다.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectPages: MetadataRoute.Sitemap = projectSlugs().map((slug) => ({
    url: `${SITE_URL}/projects/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/resume`, changeFrequency: "monthly", priority: 0.7 },
    ...projectPages,
  ];
}
