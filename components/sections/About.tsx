// components/sections/About.tsx — HERO (정체성 + 라이브 데모 진입점)
"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";

// 히어로 데모 목록 — 이름 + 한 줄 요약.
// 요약은 "무엇을 보게 되는가"를 쓴다. 기술 스택 나열이 아니라 화면에서 벌어지는 일이어야
// 방문자가 자기 관심사와 맞는지 판단할 수 있다.
//
// *별표*로 감싼 구간은 강조된다(emphasize 참고). 스캔하는 방문자의 눈에 걸릴 키워드만
// 표시한다 — 전부 강조하면 강조가 아니다.
const DEMOS = [
  {
    slug: "v1-aoi",
    name: "V1-AOI",
    primary: true, // 도메인 지식 없이도 즉시 읽히는 출력 → 첫 클릭 유도
    summary:
      "렌즈 표면 이물을 *히트맵*으로 짚어냅니다. 불량 이미지를 학습하지 않은 *비지도 이상탐지*.",
    summaryEn:
      "Pinpoints surface contamination as a *heatmap* — *unsupervised*, never trained on a defect image.",
  },
  {
    slug: "alignai",
    name: "AlignAI",
    primary: false,
    summary:
      "정렬선 간격을 측정해 *합격 판정*까지. *LLM 에이전트*가 도구를 골라 결과를 설명합니다.",
    summaryEn:
      "Measures line spacing and *judges it* — an *LLM agent* picks its own tools to explain the result.",
  },
] as const;

/**
 * *별표*로 감싼 구간을 강조해 렌더한다.
 *
 * WHY 문자열 마커인가: 세그먼트 배열로 쪼개면 데이터가 읽기 어려워지고(한/영 × 데모 수),
 *   키워드 목록으로 치환하면 의도치 않은 위치까지 매칭될 수 있다. 마커는 원문 그대로
 *   읽히면서 강조 위치가 명시적이다.
 * WHY accent가 아닌가: 버튼이 이미 accent다. 캡션까지 accent로 강조하면 시선이 경쟁한다.
 *   같은 회색 계열에서 명도·굵기만 올려 스캔 시 걸리게 한다.
 */
function emphasize(text: string) {
  return text.split("*").map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-medium text-neutral-700">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

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
          /projects/alignai 페이지뷰와 구분해서, "히어로에서 실제로 눌렀는지"를 볼 수 있게 한다.
          data-goatcounter-title을 명시하는 이유: 안 주면 GoatCounter가 버튼의 innerHTML을
          title로 대신 써서 아이콘(ArrowRight SVG) 마크업까지 그대로 새 들어간다. */}
      <div className="mt-10">
        {/* "Live Demos"가 아니라 "Demos" — 셋 다 실제 추론이 돌지만 성격이 다르다.
            cureat·align-ai는 임의 입력을 받고, V1-AOI는 고정 샘플만 받는다(PatchCore의
            memory bank가 특정 공정 분포라 임의 이미지는 무의미해서다). "Live"가 후자를
            과장하므로 공통분모인 "Demos"로 둔다. 데모별로 라벨을 다르게 두면 버튼을 못
            찾으므로(Projects.tsx의 DEMO_SLUGS 주석과 동일한 판단) 문구는 통일한다. */}
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400">
          {locale === "en" ? "Demos" : "데모"}
        </div>
        {/* 버튼 + 캡션 구조.
            WHY 목록 행이 아닌가: 얇은 구분선 행은 정지 상태에서 본문 텍스트처럼 읽혀
              클릭 가능해 보이지 않는다. hover 색을 넣어도 마우스를 올린 사람에게만 작동한다.
              버튼은 정지 상태에서 이미 "누를 수 있는 것"으로 읽힌다.
            WHY 캡션을 아래 두는가: 알약 안에는 한 줄 요약이 들어갈 폭이 없다. 버튼 아래
              캡션으로 빼면 둘 다 얻는다. 데모가 2개뿐이라 세로로 쌓아도 길지 않다.
            primary(채운 accent)는 하나만 둔다 — 둘 이상이면 첫 클릭 유도가 흐려진다. */}
        <div className="space-y-3">
          {DEMOS.map((d) => (
            // 데모 하나 = 한 행. 버튼은 고정 폭, 요약이 남은 폭을 채운다.
            // 모바일에서는 나란히 둘 폭이 없어 세로로 떨어뜨린다.
            <div
              key={d.slug}
              className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
            >
              <Link
                href={`/projects/${d.slug}?demo=1`}
                data-goatcounter-click={`hero-demo/${d.slug}`}
                data-goatcounter-title={`${d.name} (hero)`}
                className={`group inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                  d.primary
                    ? "bg-accent text-white hover:bg-accent/90"
                    : "border border-neutral-200 text-neutral-700 hover:border-accent hover:text-accent"
                }`}
              >
                {d.name}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <p className="text-[13px] font-light leading-snug text-neutral-500">
                {emphasize(locale === "en" ? d.summaryEn : d.summary)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
