// components/sections/About.tsx — HERO (정체성 + 라이브 데모 진입점)
"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";

// 히어로 데모 목록 — 이름 + 한 줄 요약.
// 요약은 "무엇을 보게 되는가"를 쓴다. 기술 스택 나열이 아니라 화면에서 벌어지는 일이어야
// 방문자가 자기 관심사와 맞는지 판단할 수 있다.
const DEMOS = [
  {
    slug: "v1-aoi",
    name: "V1-AOI",
    primary: true, // 도메인 지식 없이도 즉시 읽히는 출력 → 첫 클릭 유도
    summary: "렌즈 표면 이물을 히트맵으로 짚어냅니다. 불량 이미지를 학습하지 않은 비지도 탐지.",
    summaryEn:
      "Pinpoints surface contamination as a heatmap — unsupervised, never trained on a defect image.",
  },
  {
    slug: "alignai",
    name: "AlignAI",
    primary: false,
    summary: "정렬선 간격을 측정하고 합격 판정까지. LLM 에이전트가 도구를 골라 결과를 설명합니다.",
    summaryEn:
      "Measures alignment-line spacing and judges it — an LLM agent picks its own tools to explain the result.",
  },
] as const;

export default function About() {
  const { t, locale } = useTranslation();

  return (
    <section
      id="about"
      className="py-24"
    >
      {/* 상단 마스트헤드 */}
      <div className="flex items-center justify-between border-b border-neutral-900 pb-4 mb-12 text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-400">
        <span className="text-neutral-900">IDENTITY</span>
        <span className="hidden sm:inline">( 2026 )</span>
        <span className="text-neutral-900">Seungwan Hong</span>
      </div>

      {/* 아이덴티티 행: 작은 원형 아바타 + 이름/직무 */}
      <div className="flex items-center gap-4 mb-10">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-neutral-100 shrink-0 ring-1 ring-neutral-200">
          <Image
            src="/images/my-profile.jpg"
            alt="Seungwan Hong"
            fill
            className="object-cover grayscale"
            priority
          />
        </div>
        <div>
          <div className="text-base font-bold text-neutral-900 leading-tight">
            Seungwan Hong
          </div>
          <div className="text-sm text-neutral-500">AI Engineer</div>
        </div>
      </div>

      {/* 디스플레이 타이틀 */}
      <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] text-neutral-900 mb-10">
        {t.about.title.main}
        <br />
        <span>{t.about.title.highlight}</span>
      </h3>

      {/* 서술 (단일 컬럼, 내용 집중) */}
      <div className="space-y-5 text-[15px] md:text-base font-light leading-relaxed text-neutral-600">
        {t.about.content.map((item, i) => (
          <p key={i}>{item.text}</p>
        ))}
      </div>

      {/* 라이브 데모 진입점 — 숫자·서술보다 "실제로 작동하는 걸 만져보는" 경험이 가장
          설득력 있는 증거라서, 클릭 한 번으로(스크롤 없이) 접근 가능해야 한다. 새 인프라 없이
          기존 데모 모달들을 ?demo=1 딥링크로 재사용 — 이미 검증된 경로라 추가 리스크가 없다.
          data-goatcounter-click로 클릭 자체를 별도 이벤트로 계측 — 방문 후 도착하는
          /projects/alignai 페이지뷰와 구분해서, "히어로에서 실제로 눌렀는지"를 볼 수 있게 한다. */}
      <div className="mt-10">
        {/* "Live Demos"가 아니라 "Demos" — 셋 다 실제 추론이 돌지만 성격이 다르다.
            cureat·align-ai는 임의 입력을 받고, V1-AOI는 고정 샘플만 받는다(PatchCore의
            memory bank가 특정 공정 분포라 임의 이미지는 무의미해서다). "Live"가 후자를
            과장하므로 공통분모인 "Demos"로 둔다. 데모별로 라벨을 다르게 두면 버튼을 못
            찾으므로(Projects.tsx의 DEMO_SLUGS 주석과 동일한 판단) 문구는 통일한다. */}
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400">
          {locale === "en" ? "Demos" : "데모"}
        </div>
        {/* 알약 버튼 대신 목록 행으로 둔다.
            WHY: 방문자가 데모를 다 눌러보지 않는다. 이름만 있으면 무엇을 보게 될지 알 수
              없어 관심사와 무관한 것을 열거나 아예 안 누른다. 한 줄 요약이 있으면 자기
              관심에 맞는 것을 고를 수 있다. 알약 버튼에는 그 요약이 들어갈 폭이 없다. */}
        <ul className="divide-y divide-neutral-100 border-y border-neutral-100">
          {DEMOS.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/projects/${d.slug}?demo=1`}
                data-goatcounter-click={`hero-demo/${d.slug}`}
                className="group flex items-baseline gap-3 py-3 sm:gap-4"
              >
                <span
                  className={`shrink-0 text-sm font-black transition-colors ${
                    d.primary
                      ? "text-accent"
                      : "text-neutral-900 group-hover:text-accent"
                  }`}
                >
                  {d.name}
                </span>
                <span className="flex-1 text-[13px] font-light leading-snug text-neutral-500">
                  {locale === "en" ? d.summaryEn : d.summary}
                </span>
                <ArrowRight
                  size={14}
                  className="shrink-0 translate-y-0.5 text-neutral-300 transition-all group-hover:translate-x-1 group-hover:text-accent"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
