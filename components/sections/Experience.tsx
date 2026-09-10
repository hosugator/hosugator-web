// components/sections/Experience.tsx
"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { slugify } from '@/lib/projects';

export default function Experience() {
  const { t, locale } = useTranslation();
  // 연결할 프로젝트가 없는 경력(Zeeco 등)만 토글로 상세를 펼친다.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="experience" className="border-t border-neutral-100 py-24">
      <div className="mb-14">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-900 mb-4">
          PATH
        </h2>
        <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] text-neutral-900 whitespace-pre-line">
          {t.experience.title}
        </h3>
      </div>

      {/* 연속 단일 컬럼 타임라인 — 1줄 요약 + (프로젝트 링크 | 상세 토글) */}
      <div className="border-t border-neutral-200">
        {t.experience.items.map((exp, index) => {
          const projects = (exp as { projects?: string[] }).projects;
          const highlights = (exp as { highlights?: string[] }).highlights;
          const open = openIndex === index;

          return (
            <div key={index} className="py-6 border-b border-neutral-200">
              {/* 압축된 메타 행 — 기간·회사·직무를 한 줄로 (행 높이 축소) */}
              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 mb-2">
                <span className="font-mono text-xs text-neutral-400 tracking-wider">
                  {exp.period}
                </span>
                <span className="text-neutral-300" aria-hidden>·</span>
                <h4 className="text-lg md:text-xl font-black text-neutral-900">{exp.company}</h4>
                <span className="text-neutral-300" aria-hidden>·</span>
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
                  {exp.role}
                </span>
              </div>
              <p className="text-[15px] md:text-base font-light leading-relaxed text-neutral-600">
                {exp.description}
              </p>

              {/* 개발 경력: 텍스트 재서술 대신 실제 프로젝트로 이동 — 증거(프로젝트)가 이미
                  Projects 섹션에 있으므로 여기서 highlights를 반복하지 않는다. */}
              {projects && projects.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {projects.map((name) => (
                    <Link
                      key={name}
                      href={`/projects/${slugify(name)}`}
                      className="group inline-flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-1 text-xs font-bold text-neutral-600 transition-colors hover:border-accent hover:text-accent"
                    >
                      {name}
                      <ArrowUpRight
                        size={12}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </Link>
                  ))}
                </div>
              )}

              {/* 연결할 프로젝트가 없는 경력만 상세 토글 (예: Zeeco Asia PM) */}
              {highlights && highlights.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : index)}
                    aria-expanded={open}
                    className="mt-4 flex items-center gap-1.5 text-xs font-bold text-neutral-400 transition-colors hover:text-neutral-700"
                  >
                    {open
                      ? locale === 'en' ? 'Hide details' : '접기'
                      : locale === 'en' ? 'Show details' : '자세히 보기'}
                    <Plus
                      size={13}
                      className={`transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] mt-3' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="overflow-hidden">
                      <ul className="space-y-2">
                        {highlights.map((h, i) => (
                          <li key={i} className="flex gap-2.5 text-[15px] md:text-base font-light leading-relaxed text-neutral-600">
                            <span className="mt-[9px] w-1 h-1 rounded-full bg-accent shrink-0" aria-hidden />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {/* 태그는 프로젝트 링크가 없는 경력에서만 보여준다 — 링크가 있는 경력(DTK·Intel)은
                  같은 태그가 연결된 프로젝트 카드에 이미 있어 중복이고, 칩+태그 2줄이 겹치면서
                  1줄짜리 본문 대비 시각적으로 무거워지는 비대칭을 만들었다. */}
              {(!projects || projects.length === 0) && (
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {exp.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-black px-2 py-0.5 bg-neutral-50 text-neutral-400 rounded border border-neutral-100 tracking-wider uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
