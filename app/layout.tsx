// app/layout.tsx
"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import Sidebar from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-white text-slate-900 antialiased overflow-x-hidden">
        <div className="flex min-h-screen">
          {/* 사이드바 고정 영역 */}
          <div className="fixed inset-y-0 left-0 z-50">
            <Sidebar />
          </div>
          
          {/* 메인 콘텐츠 영역: 
             1. ml-16 md:ml-40을 통해 사이드바 공간을 완전히 확보
             2. relative를 주어 자식 요소(그래프)의 크기 계산 기준점을 고정
          */}
          <main className="relative flex-1 ml-16 md:ml-40 min-w-0 bg-white">
            <div className="w-full px-8 md:px-12 py-12">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}