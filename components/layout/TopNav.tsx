// components/layout/TopNav.tsx
"use client";
import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import LanguageToggle from "@/components/ui/LanguageToggle";

export default function TopNav() {
  return (
    <header className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] w-[calc(100%-1.5rem)] max-w-3xl">
      <div className="flex items-center justify-between gap-4 rounded-full border border-neutral-200 bg-white/80 backdrop-blur-md px-5 py-2.5 shadow-sm shadow-neutral-200/50">
        <Link href="/" className="text-lg font-black tracking-tighter shrink-0">
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

          {/* Blog — 강조 액센트 필 + 글로우로 유입 유도 */}
          <Link
            href="/blog"
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
