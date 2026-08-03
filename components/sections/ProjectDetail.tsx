"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, PlayCircle, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getProject,
  shortNameOf,
  NOTE_PROJECT,
  PROJECT_FLOWS,
  getMermaid,
  flowToMermaid,
} from "@/lib/projects";
import { projectDetails } from "@/data/projectDetails";
import { projectDetailsEn } from "@/data/projectDetails.en";
import Mermaid from "@/components/ui/Mermaid";
import AlignAiDemoModal from "@/components/demo/AlignAiDemoModal";
import AoiDemoModal from "@/components/demo/AoiDemoModal";

export default function ProjectDetail({
  slug,
  noteCount = 0,
}: {
  slug: string;
  /** 관련 노트 수 — 서버에서 세어 넘어온다(lib/noteCounts). 0이면 링크를 숨긴다. */
  noteCount?: number;
}) {
  const { locale } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  // ?demo=1로 진입했는지 기억한다. 모달을 닫을 때 쿼리를 지우므로 searchParams를 계속
  // 읽으면 값이 사라져, 돌아가기 링크의 목적지를 판단할 수 없다.
  const [arrivedViaDemo, setArrivedViaDemo] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 히어로·목록의 데모 버튼(?demo=1)으로 진입 시 자동 오픈.
  // 정적 export라 쿼리는 클라이언트에서만 알 수 있어 effect로 읽는다.
  useEffect(() => {
    if (searchParams.get("demo")) {
      setDemoOpen(true);
      setArrivedViaDemo(true);
    }
  }, [searchParams]);

  // 모달을 닫으면 URL에서 ?demo=1을 지운다.
  // WHY: 남겨두면 새로고침 시 모달이 다시 열리고, 뒤로/앞으로 이동에서 "모달은 닫혔는데
  //   URL은 열림"인 상태가 된다. replace라 히스토리가 늘지 않으므로 뒤로가기 한 번이
  //   정확히 이전 페이지(히어로)로 간다. scroll:false — 닫았을 때 페이지가 위로 튀지 않게.
  const closeDemo = () => {
    setDemoOpen(false);
    if (searchParams.get("demo")) router.replace(pathname, { scroll: false });
  };

  // 인라인 데모 재생: 클릭 전엔 정지 포스터, 클릭 시 사운드+컨트롤로 처음부터 재생
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
    home: locale === "en" ? "Back to home" : "홈으로 돌아가기",
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
  // Cureat 데모는 비활성화 상태다 (2026-08-03).
  // WHY: 백엔드가 스텁 응답을 반환하고 있다 — answer가 "Search: '<쿼리>'" 그대로 나오고
  //   filtered_ad_count가 0이다. 즉 카드가 내세우는 "광고성 콘텐츠 20%+ 제거"와
  //   "AI 큐레이션"이 데모에서 작동하지 않는 것을 보여주게 된다.
  //   게다가 자연어 문장 질의는 0건을 반환한다("강남역 근처 맛집 추천해줘" → 검색 결과 없음).
  //   데모의 목적이 주장의 증거인데 지금은 반증이 되므로, 없는 것보다 나쁘다.
  // 재활성화 조건: LLM 큐레이션 레이어와 Ko-BERT 광고 필터가 실제 응답을 만들 때.
  //   컴포넌트(CureatDemoModal)는 남겨뒀으므로 여기 isCureat을 hasDemo에 다시 넣고
  //   Projects.tsx의 DEMO_SLUGS, About.tsx의 히어로 링크를 되살리면 된다.
  const isAlign = slug === "alignai";
  const isAoi = slug === "v1-aoi";
  const hasDemo = isAlign || isAoi;
  const hasVideo = !!project.video;
  // 데모 영상마다 원본 비율이 제각각(세로/정사각/4:3 등)이라, object-fit 계산 없이
  // 실제 영상과 동일한 프레임을 정지 이미지로 미리 보여준다 (재생 전 크롭 방지).
  const videoPoster = project.video.replace(/\.(mp4|mov)$/i, "_poster.jpg");
  // 링크 목적지는 볼트의 실제 project 태그를 쓴다 — shortNameOf(name)는 카드 제목 기준이라
  // 볼트 태그와 어긋난다(AlignAI vs "Align AI"). NOTE_PROJECT 주석 참고.
  const relatedHref = `/blog?project=${encodeURIComponent(NOTE_PROJECT[slug] ?? name)}`;

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 md:pt-28 pb-32 text-neutral-900">
      {/* 돌아가기 — 진입 경로에 따라 목적지가 갈린다.
          데모 링크(?demo=1)로 들어왔으면 히어로로 돌려보낸다. /#projects는 프로젝트 목록
          중간이라 온 곳이 아니다.
          아웃라인을 둬서 정지 상태에서도 컨트롤로 읽히게 했다 — 기존 회색 작은 글씨는
          데모를 닫은 뒤 눈에 걸리지 않아 뒤로가기 버튼밖에 남지 않았다. */}
      <Link
        href={arrivedViaDemo ? "/" : "/#projects"}
        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-bold text-neutral-600 transition-colors hover:border-accent hover:text-accent mb-12"
      >
        <ArrowLeft size={16} /> {arrivedViaDemo ? t.home : t.back}
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
            poster={videoPoster}
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-contain"
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
      <div className="flex flex-wrap items-center gap-3 mb-10">
        {hasDemo && (
          <button
            onClick={() => setDemoOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-accent text-white px-5 py-2.5 text-sm font-bold hover:bg-accent/90 transition-colors"
          >
            {/* 라벨 통일 — Projects.tsx의 DEMO_SLUGS 주석 참고.
                "라이브 추론이냐"는 모달 본문에서 밝히고, 버튼은 찾기 쉽게 한 문구로 둔다. */}
            DEMO <ArrowRight size={16} />
          </button>
        )}
      </div>

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
        {/* 관련 노트 — 건수가 있을 때만 노출한다.
            WHY 숨기나: 눌러서 "검색 결과가 없습니다"를 보는 것보다 링크가 없는 게 낫다.
              (Pictag·Dorosee·KDLC는 볼트에 노트가 없다)
            WHY 건수를 보여주나: "관련 노트"만으로는 눌러볼 이유가 약하지만 "관련 노트 143개"는
              축적 자체가 증거라 클릭 동기가 된다. 아웃라인을 둬 정지 상태에서도 컨트롤로 읽히게 했다. */}
        {noteCount > 0 && (
          <a
            href={relatedHref}
            className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 font-bold text-neutral-600 transition-colors hover:border-accent hover:text-accent"
          >
            {t.notes}
            <span className="font-mono text-xs text-neutral-400 transition-colors group-hover:text-accent">
              {noteCount}
            </span>
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </a>
        )}
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

      {isAlign && (
        <AlignAiDemoModal isOpen={demoOpen} onClose={closeDemo} />
      )}
      {isAoi && (
        <AoiDemoModal isOpen={demoOpen} onClose={closeDemo} />
      )}
    </div>
  );
}
