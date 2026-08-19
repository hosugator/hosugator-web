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
      // /r/{slug} 는 이력서에만 적는 추적용 경로다. 검색에 잡히면 크롤러 요청이
      // S3 액세스 로그에 섞여 "사람이 열었다"는 신호를 오염시킨다.
      // 페이지의 noindex 와 이중으로 막는다 — robots.txt 는 크롤링을,
      // noindex 는 색인을 막아 역할이 다르다.
      disallow: "/r/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
