import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-40 px-12 md:px-24 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-10">
        <h2 className="text-5xl md:text-7xl font-black tracking-tight max-w-3xl leading-[1.05] text-slate-900">
          Interested in working <span className="text-primary italic">together?</span>
        </h2>
        
        <p className="text-xl text-slate-500 max-w-xl leading-relaxed font-light">
          비즈니스 가치와 기술적 구현 사이의 가교 역할을 할 수 있는 기회를 찾고 있습니다. 
          함께 혁신을 만들어갈 팀을 기다립니다.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 mt-6">
          <a 
            href="mailto:hosugator@google.com" 
            className="bg-slate-900 text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-primary hover:text-slate-900 transition-all shadow-xl shadow-slate-200 flex items-center gap-2"
          >
            Get In Touch <ArrowUpRight size={20} />
          </a>
          
          <div className="flex items-center gap-4">
            <a href="#" className="p-4 rounded-full border border-slate-100 hover:border-primary text-slate-400 hover:text-primary transition-all">
              <Github size={24} />
            </a>
            <a href="#" className="p-4 rounded-full border border-slate-100 hover:border-primary text-slate-400 hover:text-primary transition-all">
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}