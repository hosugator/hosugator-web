// app/sitemap.ts → 빌드 시 /sitemap.xml 생성
import type { MetadataRoute } from "next";

const SITE_URL = "https://hosugator.com";

// output: export(정적 내보내기)에서 metadata route는 정적 생성으로 고정해야 한다.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // 블로그 노트는 현재 쿼리파라미터(/blog?project=)로만 접근하는 단일 라우트라
  // 개별 URL이 없다. 노트가 별도 라우트를 갖게 되면 여기서 확장한다.
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/portfolio`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/resume`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
