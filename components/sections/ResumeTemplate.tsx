"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  Github,
  Linkedin,
  Mail,
  Globe,
  ArrowRight,
} from "lucide-react";

// 이력서 레이아웃 템플릿 — 공개용(/resume)과 회사 맞춤 제출용이 공유한다.
// 맞춤 제출용을 만들 때: 이 컴포넌트에 회사 전용 ResumeData를 넣고 showWebCta={false}로 렌더링한다.
// (새 회사 전용 페이지를 만들 때는 sitemap.ts에 올리지 말고, robots: { index: false }를 지정할 것.)

export interface ResumeExperience {
  company: string;
  role: string;
  period: string;
  items: string[];
}

export interface ResumeData {
  back: string;
  pdf: string;
  name: string;
  headline: string;
  summaryLabel: string;
  summary: string;
  expLabel: string;
  experience: ResumeExperience[];
  projLabel: string;
  projects: string[];
  principlesLabel: string;
  principles: string[];
  eduLabel: string;
  education: string[];
  footer: string;
}

export const CONTACT = {
  email: "hosugator@gmail.com",
  github: "github.com/hosugator",
  githubUrl: "https://github.com/hosugator",
  linkedin: "linkedin.com/in/seungwanhong",
  linkedinUrl: "https://linkedin.com/in/seungwanhong",
  web: "hosugator.com",
  // 표시는 web("hosugator.com"), 링크는 추적 경로로 보낸다 — 같은 도메인 안의
  // 경로 차이라 라벨과 어긋나지 않는다. /r/base 요청이 S3 액세스 로그에 남아
  // "이력서 링크가 열렸나"의 유일한 증거가 된다. trailingSlash 라 끝 슬래시 필수.
  webUrl: "https://hosugator.com/r/base/",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400 mb-2">
      {children}
    </h2>
  );
}

export default function ResumeTemplate({
  data: r,
  showWebCta = true,
  backHref = "/",
}: {
  data: ResumeData;
  showWebCta?: boolean;
  backHref?: string;
}) {
  return (
    <div className="relative w-full md:max-w-2xl md:mx-auto px-5 md:px-8 pb-20 print:pb-0 print:pt-6 text-neutral-900">
      {/* 상단 바 (인쇄/PDF 시 숨김) */}
      <div className="flex items-center justify-between pt-4 pb-10 print:hidden">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-accent transition-colors"
        >
          <ArrowLeft size={14} /> {r.back}
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3.5 py-1.5 text-xs font-bold text-neutral-500 hover:text-accent hover:border-accent transition-colors"
        >
          <Printer size={13} /> {r.pdf}
        </button>
      </div>

      {/* 헤더 */}
      <header className="mb-3">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-[1.15] pb-0.5">
          {r.name}
        </h1>
        <p className="mt-2 text-[13px] md:text-sm font-medium text-accent">
          {r.headline}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-neutral-500">
          <a
            href={`mailto:${CONTACT.email}`}
            className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
          >
            <Mail size={12} /> {CONTACT.email}
          </a>
          <a
            href={CONTACT.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
          >
            <Github size={12} /> {CONTACT.github}
          </a>
          <a
            href={CONTACT.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
          >
            <Linkedin size={12} /> {CONTACT.linkedin}
          </a>
        </div>
      </header>

      <div className="h-px bg-neutral-200 mb-3" />

      {/* 소개 */}
      <section className="mb-3">
        <SectionLabel>{r.summaryLabel}</SectionLabel>
        <p className="text-[12.5px] leading-snug font-normal text-neutral-600">
          {r.summary}
        </p>
      </section>

      {/* 경력 */}
      <section className="mb-3">
        <SectionLabel>{r.expLabel}</SectionLabel>
        <div className="space-y-3">
          {r.experience.map((exp) => (
            <div key={exp.company} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 mb-2">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-[15px] font-black tracking-tight">
                    {exp.company}
                  </span>
                  <span className="text-[12px] font-medium text-neutral-500">
                    {exp.role}
                  </span>
                </div>
                <span className="font-mono text-[10.5px] text-neutral-400">
                  {exp.period}
                </span>
              </div>
              <ul className="space-y-1">
                {exp.items.map((it, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-[11.5px] leading-snug font-normal text-neutral-600 break-inside-avoid"
                  >
                    <span className="mt-[7px] shrink-0 w-1 h-1 rounded-full bg-accent/70" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 대표 프로젝트 */}
      <section className="mb-3 break-inside-avoid">
        <SectionLabel>{r.projLabel}</SectionLabel>
        <ul className="space-y-1">
          {r.projects.map((p, i) => (
            <li
              key={i}
              className="flex gap-2 text-[11.5px] leading-snug font-normal text-neutral-600"
            >
              <span className="mt-[7px] shrink-0 w-1 h-1 rounded-full bg-neutral-300" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 일하는 방식 (인사이트 축약) */}
      <section className="mb-3 break-inside-avoid">
        <SectionLabel>{r.principlesLabel}</SectionLabel>
        <ul className="space-y-1">
          {r.principles.map((q, i) => (
            <li
              key={i}
              className="flex gap-2 text-[12px] leading-snug font-bold text-neutral-800"
            >
              <span className="shrink-0 text-accent">“</span>
              <span>{q}”</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 학력 · 자격 */}
      <section className="mb-3 break-inside-avoid">
        <SectionLabel>{r.eduLabel}</SectionLabel>
        <ul className="space-y-1">
          {r.education.map((e, i) => (
            <li
              key={i}
              className="text-[11.5px] leading-snug font-normal text-neutral-600"
            >
              {e}
            </li>
          ))}
        </ul>
      </section>

      {/* 하단 웹 유도 (공개용 전용 — 회사 제출용은 showWebCta=false로 생략) */}
      {showWebCta && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-1 border-t-2 border-accent/20 break-inside-avoid">
          <span className="text-[11.5px] font-normal text-neutral-500">
            {r.footer}
          </span>
          <a
            href={CONTACT.webUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-black text-white shadow-lg shadow-accent/20 hover:bg-accent/90 hover:gap-2 transition-all"
          >
            <Globe size={13} /> {CONTACT.web} <ArrowRight size={14} />
          </a>
        </div>
      )}
    </div>
  );
}
