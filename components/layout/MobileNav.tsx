// components/layout/MobileNav.tsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import LanguageToggle from '@/components/ui/LanguageToggle';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = ['About', 'Experience', 'Projects', 'Knowledges', 'Contact'];

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-[200] bg-white border-b border-slate-100">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-black tracking-tighter">
          HOSUGATOR.
        </Link>
        
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg">
          <nav className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block text-lg font-bold text-slate-900 hover:text-[#13ecda] transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}