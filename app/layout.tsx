// app/layout.tsx
"use client";
import "./globals.css";
import { Space_Grotesk, Noto_Sans_KR, Gaegu } from "next/font/google";
import TopNav from "@/components/layout/TopNav";
import { LanguageProvider } from "@/contexts/LanguageContext";

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
// 손글씨(필기) — 노트 문서 뷰 전용
const gaegu = Gaegu({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-gaegu",
  display: "swap",
  preload: false,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${spaceGrotesk.variable} ${notoSansKr.variable} ${gaegu.variable} overflow-x-hidden`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`bg-white text-neutral-900 antialiased overflow-x-hidden touch-pan-y`}>
        <LanguageProvider>
          <TopNav />
          <main className="relative min-h-screen w-full overflow-x-hidden pt-28 md:pt-32">
            {/* 은은한 그라디언트 글로우 (daypunk 무드) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_55%_at_50%_0%,rgba(53,97,142,0.10),transparent_70%)]"
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