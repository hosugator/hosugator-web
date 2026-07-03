// components/layout/TopNav.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Github, Linkedin, FileDown } from "lucide-react";
import LanguageToggle from "@/components/ui/LanguageToggle";

export default function TopNav() {
  const pathname = usePathname();
  // 노트 포커스 리딩 모드에선 플로팅 바를 숨긴다 (Knowledges에서 hg:note 디스패치)
  const [noteOpen, setNoteOpen] = useState(false);
  useEffect(() => {
    const h = (e: Event) =>
      setNoteOpen(!!(e as CustomEvent).detail?.open);
    window.addEventListener("hg:note", h);
    return () => window.removeEventListener("hg:note", h);
  }, []);
  // 같은 페이지면 최상단으로 스크롤, 다른 페이지면 Link가 이동(도착 시 top)
  const toTopIfSame = (isCurrent: boolean) => (e: React.MouseEvent) => {
    if (isCurrent) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (noteOpen) return null;

  return (
    <header className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] w-[calc(100%-1.5rem)] max-w-3xl print:hidden">
      <div className="flex items-center justify-between gap-4 rounded-full border border-neutral-200 bg-white/80 backdrop-blur-md px-5 py-2.5 shadow-sm shadow-neutral-200/50">
        <Link href="/" onClick={toTopIfSame(pathname === "/")} className="text-lg font-black tracking-tighter shrink-0">
          HOSUGATOR<span className="text-accent">.</span>
        </Link>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://github.com/hosugator"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <Github size={17} />
          </a>
          <a
            href="https://linkedin.com/in/seungwanhong"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <Linkedin size={17} />
          </a>

          <span className="w-px h-4 bg-neutral-200" />

          {/* Resume — 클릭 시 PDF 새 탭으로 바로 열림 (보조 CTA, 아웃라인) */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download resume PDF"
            className="inline-flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-1 text-xs font-bold text-neutral-500 hover:text-accent hover:border-accent transition-colors"
          >
            <FileDown size={13} />
            <span className="hidden sm:inline">Resume</span>
          </a>

          {/* Blog — 강조 액센트 필 + 글로우로 유입 유도 */}
          <Link
            href="/blog"
            onClick={(e) => {
              if (pathname?.startsWith("/blog")) {
                e.preventDefault();
                window.dispatchEvent(new Event("hg:blog-home")); // 노트 닫고 블로그 루트로
              }
            }}
            className="relative flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1 text-xs font-bold text-white shadow-[0_0_12px_rgba(53,97,142,0.45)] hover:shadow-[0_0_20px_rgba(53,97,142,0.7)] transition-shadow"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-pulse" />
            Blog
          </Link>

          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
