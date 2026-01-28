// components/sections/Contact.tsx
"use client";
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Contact() {
  const { t } = useTranslation();
  
  return (
    <section id="contact" className="py-40 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-10">
        <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] text-slate-900">
          {t.contact.title.main} <span className="text-[#13ecda] italic">{t.contact.title.highlight}</span>
        </h2>
        
        <p className="text-xl text-slate-500 max-w-xl leading-relaxed font-light">
          {t.contact.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 mt-6">
          <a 
            href={`mailto:${t.contact.email}`} 
            className="bg-slate-900 text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-[#13ecda] hover:text-slate-900 transition-all shadow-xl shadow-slate-200 flex items-center gap-2"
          >
            Get In Touch <ArrowUpRight size={20} />
          </a>
          
          <div className="flex items-center gap-4">
            {t.contact.socials.map((social) => (
              <a 
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-full border border-slate-100 hover:border-[#13ecda] text-slate-400 hover:text-[#13ecda] transition-all"
              >
                {social.icon === 'github' ? <Github size={24} /> : <Linkedin size={24} />}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}