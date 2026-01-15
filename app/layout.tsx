// app/layout.tsx
"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <html lang="ko">
      <body className={`${inter.className} bg-white text-slate-900 antialiased`}>
        <div className="flex">
          {/* 폴더블 사이드바 */}
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          
          {/* 본문 영역: 사이드바 상태에 따라 좌측 여백 조절 */}
          <main className={`flex-1 transition-all duration-300 ${isCollapsed ? "md:ml-20" : "md:ml-64"}`}> 
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}