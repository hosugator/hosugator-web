// components/sections/Insights.tsx — 엔지니어링 원칙 아카이브
// WHY 최하단 배치: 프로젝트(증거)보다 늦게 스캔되어야 하는 콘텐츠 — 원칙은 추상적이라
// "이미 프로젝트로 설득된 소수"가 깊이를 확인하는 심층 검증용 섹션이다.
// 인트로(About)에 두면 시선이 아래(Projects)로 못 가는 마찰이 생겨서 여기로 옮겼다.
"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useSectionView } from "@/hooks/useSectionView";

export default function Insights() {
  const { t } = useTranslation();
  const [openInsight, setOpenInsight] = useState<number | null>(null);
  const sectionRef = useSectionView("insights");

  return (
    <section
      id="insights"
      ref={sectionRef}
      className="border-t border-neutral-100 py-24 text-neutral-900"
    >
      <div className="mb-14">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-900 mb-4">
          {t.insights.topLabel}
        </h2>
        <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] text-neutral-900 whitespace-pre-line">
          {t.insights.title}
        </h3>
      </div>

      <div className="border-y border-neutral-200 divide-y divide-neutral-200">
        {t.insights.items.map((item, i) => {
          const open = openInsight === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setOpenInsight(open ? null : i)}
              aria-expanded={open}
              className="w-full text-left py-3.5 group"
            >
              <div className="flex items-baseline gap-3">
                <span className="shrink-0 text-[11px] font-mono font-bold text-neutral-300">
                  {item.number}
                </span>
                <p className="min-w-0 flex-1 text-[15px] md:text-base font-semibold text-neutral-900 leading-snug">
                  &ldquo;{item.principle}&rdquo;
                </p>
                <span
                  className={`shrink-0 text-neutral-300 group-hover:text-neutral-500 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
                  aria-hidden
                >
                  <Plus size={15} />
                </span>
              </div>
              {/* 펼침: 맥락 + 프로젝트 태그 */}
              <div
                className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <div className="pl-7 pt-3">
                    <p className="text-sm md:text-[15px] font-light leading-relaxed text-neutral-500">
                      {item.desc}
                    </p>
                    <span className="inline-block mt-3 text-[11px] font-bold text-neutral-400 tracking-wide">
                      {item.project}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
