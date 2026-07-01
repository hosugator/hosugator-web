// components/layout/TopNav.tsx
"use client";
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import LanguageToggle from '@/components/ui/LanguageToggle';

const items = ['About', 'Experience', 'Projects', 'Insights', 'Contact'];

export default function TopNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] w-[calc(100%-1.5rem)] max-w-3xl">
      <div className="flex items-center justify-between gap-4 rounded-full border border-neutral-200 bg-white/80 backdrop-blur-md px-5 py-2.5 shadow-sm shadow-neutral-200/50">
        <Link href="/" className="text-lg font-black tracking-tighter shrink-0">
          HOSUGATOR<span className="text-accent">.</span>
        </Link>

        {/* 데스크톱 링크 */}
        <nav className="hidden md:flex items-center gap-6 text-[13px] font-semibold text-neutral-500">
          {items.map((i) => (
            <Link key={i} href={`/#${i.toLowerCase()}`} className="hover:text-accent transition-colors">
              {i}
            </Link>
          ))}
          <Link href="/blog" className="hover:text-accent transition-colors">Blog</Link>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <LanguageToggle />
          <button
            className="md:hidden p-1 text-neutral-600"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 */}
      {open && (
        <div className="md:hidden mt-2 rounded-2xl border border-neutral-200 bg-white shadow-lg p-3 space-y-1">
          {[...items, 'Blog'].map((i) => (
            <Link
              key={i}
              href={i === 'Blog' ? '/blog' : `/#${i.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="block py-2 px-2 font-semibold text-neutral-700 hover:text-accent transition-colors"
            >
              {i}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
