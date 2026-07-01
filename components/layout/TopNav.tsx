// components/layout/TopNav.tsx
"use client";
import Link from 'next/link';
import LanguageToggle from '@/components/ui/LanguageToggle';

export default function TopNav() {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] w-[calc(100%-1.5rem)] max-w-3xl">
      <div className="flex items-center justify-between gap-4 rounded-full border border-neutral-200 bg-white/80 backdrop-blur-md px-5 py-2.5 shadow-sm shadow-neutral-200/50">
        <Link href="/" className="text-lg font-black tracking-tighter shrink-0">
          HOSUGATOR<span className="text-accent">.</span>
        </Link>

        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/blog"
            className="text-[13px] font-semibold text-neutral-500 hover:text-accent transition-colors"
          >
            Blog
          </Link>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
