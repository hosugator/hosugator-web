import Link from 'next/link';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

// components/layout/Sidebar.tsx
export default function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // hidden md:flex: 모바일에서는 숨기고 데스크탑에서만 노출
      className={`fixed left-0 top-0 h-screen z-[100] transition-all duration-300 ease-in-out border-r border-slate-100 bg-white hidden md:flex flex-col ${isHovered ? "w-64 shadow-2xl" : "w-16"
        }`}
    >
      <div className="p-4 h-full flex flex-col justify-between">
        <div className="overflow-hidden">
          <Link href="/" className="text-2xl font-black tracking-tighter block mb-16 ml-1">
            {isHovered ? "HOSUGATOR." : "H."}
          </Link>
          <nav className="flex flex-col gap-10 text-sm font-bold tracking-[0.2em] uppercase">
            {['About', 'Experience', 'Projects', 'Knowledges', 'Contact'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#13ecda] transition-colors text-slate-900 flex items-center gap-6 ml-1">
                <span className="min-w-[12px] text-center">{item[0]}</span>
                {isHovered && <span className="animate-in fade-in slide-in-from-left-2 duration-300">{item}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}