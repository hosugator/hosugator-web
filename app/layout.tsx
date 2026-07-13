// app/layout.tsx  (Server Component — metadata/viewport export 가능)
// "use client"를 제거해도 안전한 이유: 이 파일은 훅을 직접 호출하지 않는다.
// next/font는 서버 컴포넌트에서 동작하고, 클라이언트 경계는 각자 "use client"를
// 가진 LanguageProvider·TopNav에서 유지된다.
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Space_Grotesk, Noto_Sans_KR } from "next/font/google";
import TopNav from "@/components/layout/TopNav";
import { LanguageProvider } from "@/contexts/LanguageContext";

const SITE_URL = "https://hosugator.com";
const SITE_DESC =
  "비즈니스 문제를 코드로 직접 해결하는 AI 엔지니어 홍승완. Industrial AI·LLM Agent·Cloud-Native 프로젝트와 지식 로그.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "홍승완 · AI Engineer",
    template: "%s · Hosugator",
  },
  description: SITE_DESC,
  keywords: ["AI Engineer", "홍승완", "Hosugator", "Industrial AI", "LLM Agent", "MLOps", "Cloud-Native"],
  authors: [{ name: "홍승완 (Seungwan Hong)" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Hosugator",
    title: "홍승완 · AI Engineer",
    description: SITE_DESC,
    locale: "ko_KR",
    images: [{ url: "/images/my-profile.jpg", width: 1200, height: 630, alt: "홍승완 · AI Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "홍승완 · AI Engineer",
    description: SITE_DESC,
    images: ["/images/my-profile.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// 모노 에디토리얼 그로테스크 — 라틴(Space Grotesk) + 국문(Noto Sans KR) 자체 호스팅
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const notoSansKr = Noto_Sans_KR({
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
  display: "swap",
  preload: false,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${spaceGrotesk.variable} ${notoSansKr.variable} overflow-x-hidden`}>
      <body className={`bg-white text-neutral-900 antialiased overflow-x-hidden touch-pan-y`}>
        {/* GoatCounter — 쿠키 없는 경량 방문자 분석 (hosugator.goatcounter.com) */}
        <Script
          data-goatcounter="https://hosugator.goatcounter.com/count"
          src="//gc.zgo.at/count.js"
          strategy="afterInteractive"
        />
        <LanguageProvider>
          <TopNav />
          <main className="relative min-h-screen w-full overflow-x-hidden pt-28 md:pt-32 print:pt-0">
            {/* 은은한 그라디언트 글로우 (daypunk 무드) — 인쇄/PDF에는 배경 얼룩으로 찍히므로 숨김 */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_55%_at_50%_0%,rgba(53,97,142,0.10),transparent_70%)] print:hidden"
            />
            {/* 폭은 각 페이지가 제어 (홈=중앙 컬럼 / 블로그=풀너비) */}
            {children}
          </main>
          {/* Portal용 루트: 반드시 여기에 있어야 scale의 영향을 받지 않습니다 */}
          <div id="modal-root" />
        </LanguageProvider>
      </body>
    </html>
  );
}