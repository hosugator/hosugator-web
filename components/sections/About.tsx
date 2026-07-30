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
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400">
          {locale === "en" ? "Live Demos" : "라이브 데모"}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/projects/alignai?demo=1"
            data-goatcounter-click="hero-demo/alignai"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent/90"
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
