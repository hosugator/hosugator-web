// components/layout/Sidebar.tsx
import Link from 'next/link';
import { Menu, ChevronLeft, ChevronRight } from 'lucide-react'; // lucide-react 설치 필요

export default function Sidebar({ isCollapsed, setIsCollapsed }: any) {
  return (
    <aside className={`fixed left-0 top-0 h-screen border-r border-slate-100 bg-white z-50 transition-all duration-300 flex flex-col justify-between ${isCollapsed ? "w-20" : "w-64"}`}>
      <div className="p-6">
        {/* 접기/펴기 버튼 */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mb-12 p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        <div className="overflow-hidden whitespace-nowrap">
          <Link href="/" className="text-2xl font-black tracking-tighter block mb-16">
            {isCollapsed ? "H." : "HOSUGATOR."}
          </Link>
          
          <nav className="flex flex-col gap-8 text-sm font-bold tracking-widest uppercase">
            <Link href="#about" className="hover:text-primary transition-colors text-slate-900 flex items-center gap-4">
              <span className="min-w-[20px]">A</span> {!isCollapsed && "About"}
            </Link>
            <Link href="#experience" className="hover:text-primary transition-colors text-slate-400 flex items-center gap-4">
              <span className="min-w-[20px]">E</span> {!isCollapsed && "Experience"}
            </Link>
            <Link href="#skills" className="hover:text-primary transition-colors text-slate-400 flex items-center gap-4">
              <span className="min-w-[20px]">S</span> {!isCollapsed && "Skills"}
            </Link>

          </nav>
        </div>
      </div>
    </aside>
  );
}