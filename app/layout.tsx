// app/layout.tsx
"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import Sidebar from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="overflow-x-hidden">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${inter.className} bg-white text-slate-900 antialiased overflow-x-hidden touch-pan-y`}>
        <div className="flex flex-col md:flex-row min-h-screen w-full overflow-x-hidden">
          <Sidebar />
          
          <main className="flex-1 md:ml-40 min-w-0 bg-white">
            {/* 승완님의 scale 설정을 유지하면서 내부 콘텐츠만 축소 */}
            <div className="w-full md:w-full scale-[0.8] md:scale-100 origin-top w-[125%] md:w-full px-4 md:px-12 py-6 md:py-12 overflow-x-hidden">
              {children}
            </div>
          </main>
        </div>
        {/* Portal용 루트: 반드시 여기에 있어야 scale의 영향을 받지 않습니다 */}
        <div id="modal-root" />
      </body>
    </html>
  );
}