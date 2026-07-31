// components/sections/About.tsx — HERO (정체성 + 라이브 데모 진입점)
"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";

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
        <div className="flex flex-wrap gap-3">
          {/* V1-AOI가 primary다 (2026-07-31 승격).
              WHY: 이물 히트맵은 도메인 지식 없이도 "빨간 게 불량"으로 즉시 읽히는 출력이라
                비전문가에게 설명 비용이 가장 낮다. AlignAI는 "이 선이 기준선입니다"라는 설명이
                한 번 필요한데, AOI는 빨간 얼룩 하나로 끝난다.
              승격 조건이었던 "컨테이너에서 실제 추론"이 충족됐다 — arm64 ONNX 이미지가
                노드에 배포되어 요청마다 onnxruntime이 돌고, 응답 지연(약 1.8초)을 UI에 노출한다.
              채운 버튼은 하나만 둔다 — 둘 이상이면 주 CTA가 흐려진다. */}
          <Link
            href="/projects/v1-aoi?demo=1"
            data-goatcounter-click="hero-demo/v1-aoi"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent/90"
          >
            V1-AOI
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          {/* AlignAI는 V1-AOI 바로 뒤 — 둘 다 같은 공정(DTK 렌즈) 산업 AI라 인접해 있으면
              "한 현장에서 표면 검사와 비전 정렬을 각각 끌고 갔다"로 읽힌다. */}
          <Link
            href="/projects/alignai?demo=1"
            data-goatcounter-click="hero-demo/alignai"
            className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-bold text-neutral-700 transition-colors hover:border-accent hover:text-accent"
          >
            AlignAI
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/projects/cureat?demo=1"
            data-goatcounter-click="hero-demo/cureat"
            className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-bold text-neutral-700 transition-colors hover:border-accent hover:text-accent"
          >
            Cureat
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
