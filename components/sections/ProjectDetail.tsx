"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, PlayCircle, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getProject,
  shortNameOf,
  PROJECT_FLOWS,
  getMermaid,
  flowToMermaid,
} from "@/lib/projects";
import { projectDetails } from "@/data/projectDetails";
import { projectDetailsEn } from "@/data/projectDetails.en";
import Mermaid from "@/components/ui/Mermaid";
import CureatDemoModal from "@/components/demo/CureatDemoModal";
import AlignAiDemoModal from "@/components/demo/AlignAiDemoModal";

export default function ProjectDetail({ slug }: { slug: string }) {
  const { locale } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const searchParams = useSearchParams();
  // 목록의 "Live demo" 버튼(?demo=1)으로 진입 시 자동 오픈
  useEffect(() => {
    if (searchParams.get("demo")) setDemoOpen(true);
  }, [searchParams]);

  // 인라인 데모 재생: 클릭 전엔 muted 루프 프리뷰, 클릭 시 사운드+컨트롤로 처음부터 재생
  const startVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.controls = true;
    v.loop = false;
    v.currentTime = 0;
    v.play();
    setPlaying(true);
  };

  const project = getProject(slug, locale);
  const t = {
    back: locale === "en" ? "All projects" : "전체 프로젝트",
    overview: locale === "en" ? "Overview" : "개요",
    context: locale === "en" ? "Context" : "맥락",
    decision: locale === "en" ? "Key Decision" : "핵심 의사결정",
    impl: locale === "en" ? "Implementation" : "구현",
    arch: locale === "en" ? "Architecture" : "아키텍처",
    results: locale === "en" ? "Results & Retrospective" : "성과 & 회고",
    stack: locale === "en" ? "Stack" : "기술 스택",
    notes: locale === "en" ? "Related notes" : "관련 노트",
    pdf: locale === "en" ? "Case study (PDF)" : "케이스 스터디 (PDF)",
  };

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-32">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-accent transition-colors"
        >
          <ArrowLeft size={18} /> {t.back}
        </Link>
        <p className="mt-10 text-neutral-500">Project not found.</p>
      </div>
    );
  }

  const name = shortNameOf(project.title);
  const flows = PROJECT_FLOWS[slug] || [];
  const mermaids = getMermaid(slug, locale);
  // 리치 상세 — 로케일별 콘텐츠 (국문/영문)
  const detail = (locale === "en" ? projectDetailsEn : projectDetails)[slug];
  const isCureat = name.toLowerCase() === "cureat";
  const isAlign = slug === "alignai";
  const hasVideo = !!project.video;
  const relatedHref = `/blog?project=${encodeURIComponent(name)}`;

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 md:pt-28 pb-32 text-neutral-900">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors mb-12"
      >
        <ArrowLeft size={18} /> {t.back}
      </Link>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-[9px] font-black px-2 py-0.5 bg-neutral-50 text-neutral-400 rounded border border-neutral-100 tracking-wider uppercase"
          >
            {tag}
          </span>
        ))}
      </div>

      <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] mb-8">
        {project.title}
      </h1>

      {/* 데모 (인라인 재생) */}
      {hasVideo && (
        <div className="group relative w-full aspect-video rounded-2xl overflow-hidden bg-neutral-900 mb-10">
          <video
            ref={videoRef}
            src={project.video}
            muted
            loop
            autoPlay
            playsInline
            className={`absolute inset-0 w-full h-full transition-opacity ${
              playing ? "object-contain opacity-100" : "object-cover opacity-70 group-hover:opacity-90"
            }`}
          />
          {!playing && (
            <button
              onClick={startVideo}
              aria-label="Play demo"
              className="absolute inset-0 z-10 grid place-items-center bg-black/10 hover:bg-black/0 transition-colors"
            >
              <span className="grid place-items-center w-14 h-14 rounded-full bg-white/20 border border-white/40 backdrop-blur-sm text-white group-hover:scale-105 transition-transform">
                <PlayCircle size={26} />
              </span>
            </button>
          )}
        </div>
      )}
      {(isCureat || isAlign) && (
        <button
          onClick={() => setDemoOpen(true)}
          className="inline-flex items-center gap-2 mb-10 rounded-full bg-accent text-white px-5 py-2.5 text-sm font-bold hover:bg-accent/90 transition-colors"
        >
          LIVE DEMO <ArrowRight size={16} />
        </button>
      )}

      {/* 개요 */}
      <section className="mb-12">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-3">
          {t.overview}
        </div>
        <p className="text-base md:text-lg font-light leading-relaxed text-neutral-600">
          {project.desc}
        </p>
      </section>

      {/* 아키텍처 다이어그램 (Mermaid) */}
      {(mermaids || flows.length > 0) && (
        <section className="mb-12">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-5">
            {t.arch}
          </div>
          <div className="space-y-6">
            {mermaids
              ? mermaids.map((m, i) => (
                  <Mermaid key={i} chart={m} />
                ))
              : flows.map((f, i) => (
                  <div key={i}>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                      {f.label}
                    </div>
                    <Mermaid chart={flowToMermaid(f)} />
                  </div>
                ))}
          </div>
        </section>
      )}

      {/* 맥락 */}
      {detail?.context && (
        <section className="mb-12">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-3">
            {t.context}
          </div>
          <p className="text-[15px] md:text-base font-light leading-relaxed text-neutral-600">
            {detail.context}
          </p>
        </section>
      )}

      {/* 핵심 의사결정 */}
      {detail?.decision && (
        <section className="mb-12">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-3">
            {t.decision}
          </div>
          <p className="text-[15px] md:text-base font-light leading-relaxed text-neutral-600">
            {detail.decision}
          </p>
        </section>
      )}

      {/* 구현 */}
      {detail?.implementation && detail.implementation.length > 0 && (
        <section className="mb-12">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-5">
            {t.impl}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {detail.implementation.map((c, i) => (
              <div key={i} className="rounded-xl border border-neutral-200 p-5">
                <h3 className="text-sm font-black text-neutral-900 mb-2">
                  {c.title}
                </h3>
                <p className="text-[13px] md:text-sm font-light leading-relaxed text-neutral-500">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 성과 & 회고 */}
      {detail?.results && (
        <section className="mb-12">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-3">
            {t.results}
          </div>
          <p className="text-[15px] md:text-base font-light leading-relaxed text-neutral-600">
            {detail.results}
          </p>
        </section>
      )}

      {/* 기술 스택 */}
      {detail?.stack && detail.stack.length > 0 && (
        <section className="mb-12">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-3">
            {t.stack}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {detail.stack.map((s) => (
              <span
                key={s}
                className="text-[11px] font-bold px-2.5 py-1 bg-neutral-50 text-neutral-600 rounded-md border border-neutral-100"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 액션 */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-neutral-200 text-sm">
        <a
          href={relatedHref}
          className="font-bold flex items-center gap-1.5 text-neutral-500 hover:text-accent transition-colors"
        >
          {t.notes} <ArrowRight size={14} />
        </a>
        {!detail && project.pdfLink && project.pdfLink !== "#" && (
          <a
            href={project.pdfLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold flex items-center gap-1.5 text-neutral-500 hover:text-accent transition-colors"
          >
            <FileText size={14} /> {t.pdf}
          </a>
        )}
      </div>

      {isCureat && (
        <CureatDemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
      )}
      {isAlign && (
        <AlignAiDemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
      )}
    </div>
  );
}
