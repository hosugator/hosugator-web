// app/robots.ts → 빌드 시 /robots.txt 생성
import type { MetadataRoute } from "next";

const SITE_URL = "https://hosugator.com";

// output: export(정적 내보내기)에서 metadata route는 정적 생성으로 고정해야 한다.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
