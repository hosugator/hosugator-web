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
import { CONTACT } from "./ResumeTemplate";

// 자기소개서 레이아웃 템플릿 — 회사 맞춤 제출용.
//
// WHY ResumeTemplate 을 재사용하지 않고 따로 두나
//   ResumeData 는 경력·프로젝트·원칙처럼 「목록」을 전제한 스키마다. 자기소개서는
//   이어지는 산문이라 같은 스키마에 억지로 넣으면 항목마다 빈 배열을 채우게 된다.
//   대신 헤더·구분선·SectionLabel·하단 CTA 는 여기서 같은 클래스를 써서 두 문서가
//   나란히 놓였을 때 한 벌로 보이게 한다. CONTACT 는 ResumeTemplate 에서 가져와
//   연락처가 두 곳으로 갈라지지 않게 한다.
//
// WHY 본문이 leading-relaxed 인가
//   이력서는 스캔하는 문서라 leading-snug 로 밀도를 올리지만, 자기소개서는 처음부터
//   끝까지 읽는 문서다. 같은 행간을 쓰면 문단이 벽처럼 보인다.

export interface CoverLetterData {
  back: string;
  pdf: string;
  name: string;
  headline: string;
  /** 수신처 라벨과 값 — "지원 부문" / "달파(DALPHA) · AI Engineer" */
  toLabel: string;
  to: string;
  bodyLabel: string;
  /** 문단 배열. 빈 문자열은 넣지 않는다 — 간격은 space-y 가 만든다 */
  paragraphs: string[];
  /** 본문에서 끌어올려 강조할 문장. 없으면 생략된다 */
  pullQuote?: string;
  footer: string;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400 mb-2">
      {children}
    </h2>
  );
}

export default function CoverLetterTemplate({
  data: c,
  backHref = "/",
  webUrl = CONTACT.webUrl,
}: {
  data: CoverLetterData;
  backHref?: string;
  webUrl?: string;
}) {
  return (
    <div className="relative w-full md:max-w-2xl md:mx-auto px-5 md:px-8 pb-20 print:pb-0 print:pt-6 text-neutral-900">
      {/* 상단 바 (인쇄/PDF 시 숨김) */}
      <div className="flex items-center justify-between pt-4 pb-10 print:hidden">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-accent transition-colors"
        >
          <ArrowLeft size={14} /> {c.back}
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3.5 py-1.5 text-xs font-bold text-neutral-500 hover:text-accent hover:border-accent transition-colors"
        >
          <Printer size={13} /> {c.pdf}
        </button>
      </div>

      {/* 헤더 — 이력서와 같은 구성이라 두 문서를 이어 보면 같은 사람의 문서로 읽힌다 */}
      <header className="mb-3">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-[1.15] pb-0.5">
          {c.name}
        </h1>
        <p className="mt-2 text-[13px] md:text-sm font-medium text-accent">
          {c.headline}
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

      {/* 지원 부문 */}
      <section className="mb-3">
        <SectionLabel>{c.toLabel}</SectionLabel>
        <p className="text-[12.5px] leading-snug font-bold text-neutral-800">
          {c.to}
        </p>
      </section>

      {/* 끌어올린 문장 — 이력서의 「일하는 방식」과 같은 인용 표기를 쓴다 */}
      {c.pullQuote && (
        <section className="mb-3 break-inside-avoid">
          <p className="flex gap-2 text-[12px] leading-snug font-bold text-neutral-800">
            <span className="shrink-0 text-accent">“</span>
            <span>{c.pullQuote}”</span>
          </p>
        </section>
      )}

      {/* 본문 */}
      <section className="mb-3">
        <SectionLabel>{c.bodyLabel}</SectionLabel>
        <div className="space-y-2.5">
          {c.paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-[12.5px] leading-relaxed font-normal text-neutral-600 break-inside-avoid"
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* 하단 웹 유도 — 이력서와 같은 추적 경로를 쓴다 */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-1 border-t-2 border-accent/20 break-inside-avoid">
        <span className="text-[11.5px] font-normal text-neutral-500">
          {c.footer}
        </span>
        <a
          href={webUrl}
          target="_blank"
          rel="noopener noreferrer"
          // print:shadow-none — 그림자가 PDF 에 옅은 파란 사각형으로 찍힌다(이력서와 동일)
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-black text-white shadow-lg shadow-accent/20 print:shadow-none hover:bg-accent/90 hover:gap-2 transition-all"
        >
          <Globe size={13} /> {CONTACT.web} <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}
