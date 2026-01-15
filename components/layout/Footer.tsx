export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-100 py-12 px-12 md:px-24 bg-white">
      <div className="max-w-4xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-primary font-black text-lg">H.</span>
          <p className="text-sm font-black tracking-tight text-slate-900">hosugator.com</p>
        </div>
        
        <p className="text-xs text-slate-400 font-medium">
          © 2026 Hosu. Designed for the AI-first era.
        </p>
        
        <div className="flex gap-8">
          <a href="#" className="text-xs font-bold hover:text-primary transition-colors tracking-widest uppercase text-slate-900">Privacy</a>
          <a href="#" className="text-xs font-bold hover:text-primary transition-colors tracking-widest uppercase text-slate-900">Resume</a>
        </div>
      </div>
    </footer>
  );
}