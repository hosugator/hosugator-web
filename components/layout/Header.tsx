// components/layout/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-black tracking-tighter">
          HOSUGATOR<span className="text-primary">.</span>
        </Link>
        
      </div>
    </header>
  );
}