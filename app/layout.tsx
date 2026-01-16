// app/layout.tsx
"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import Sidebar from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-white text-slate-900 antialiased">
        <div className="flex">
          <Sidebar />
          
          {/* 여기가 핵심입니다. 
            사이드바(w-16)를 고려하여 전체 섹션이 시작될 공통 여백을 여기서 결정합니다.
            나중에 전체 여백을 바꾸고 싶다면 여기만 수정하면 됩니다.
          */}
          <main className="flex-1 w-full ml-16 md:ml-32 pr-8 md:pr-12"> 
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}