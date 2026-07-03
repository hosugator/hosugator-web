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
import { useLanguage } from "@/contexts/LanguageContext";

// Resume — 1~2p A4. 경력·기술·프로젝트·학력의 구조화 요약 + '일하는 방식(인사이트)'.
// 프로젝트별 아키텍처·구현 상세·엔지니어링 노트 전문은 웹으로 유도한다.
// /resume.pdf 생성 소스. (재생성: npm run dev 후 `npm run resume:pdf`)
const CONTACT = {
  email: "hosugator@gmail.com",
  github: "github.com/hosugator",
  githubUrl: "https://github.com/hosugator",
  linkedin: "linkedin.com/in/seungwanhong",
  linkedinUrl: "https://linkedin.com/in/seungwanhong",
  web: "hosugator.com",
  webUrl: "https://hosugator.com",
};

const RESUME = {
  ko: {
    back: "홈으로",
    pdf: "PDF로 저장",
    name: "홍승완",
    headline: "AI Engineer · 비즈니스 문제를 코드로 해결",
    summaryLabel: "소개",
    summary:
      "'왜'라는 질문에서 출발해 기획·데이터·ML·인프라·백엔드·UI까지 다루는 풀스택 AI 엔지니어입니다. 글로벌 EPC PM 경험으로 3국 이해관계자의 추상적 요구를 기술 명세로 번역했고, 지금 프로젝트의 병목이 어디에 있는지 짚어내는 감각을 강점으로 합니다.",
    expLabel: "경력",
    experience: [
      {
        company: "DTK",
        role: "AI Engineer",
        period: "2026.03 ~ 현재",
        items: [
          "AlignAI — 규칙 기반 OpenCV의 환경 민감도를 U-Net(EfficientNet-B0) 세그멘테이션으로 전환(탐지율 100%·CPU ~330ms). 학습→ONNX→GHCR→Argo CD 롤링 배포 ML CI/CD와 k3s 엣지 배포 인프라를 단독 설계·구축.",
          "Edge AI LMR — 10ms 고주파 PLC 데이터를 무손실 처리하는 Field→Edge→Cloud 4계층 이상탐지 시스템 설계, Anomalib 기반 AUROC 99.99% 확보.",
          "ERP 자동화 — 입사 1주 차, 공식 API 없는 레거시 ERP의 수만 건 결재 문서 수작업을 Playwright 자율 파이프라인으로 100% 정합성 무인화.",
          'LLM 멀티모달 에이전트(진행 중) — Tool use·RAG·ReAct 루프를 직접 구현하며 현장 "왜 이상인가" 응답 에이전트를 프로토타이핑.',
        ],
      },
      {
        company: "Zeeco Asia",
        role: "Project Manager",
        period: "2024.02 ~ 2025.04",
        items: [
          "수십억 규모 글로벌 EPC 연소 설비 프로젝트를 시운전까지 총괄. 미·인·한 3국 이해관계자 기술 충돌을 조율하고 Q/C/D·선제 리스크 관리로 목표 마진율을 4% 초과 달성.",
        ],
      },
    ],
    skillsLabel: "핵심 기술",
    skills: [
      {
        g: "AI/ML",
        v: "PyTorch · Computer Vision(U-Net·YOLO) · LLM/RAG · Anomaly Detection · OpenVINO/ONNX",
      },
      { g: "Backend", v: "Python · FastAPI · PostgreSQL · Docker" },
      {
        g: "Infra/MLOps",
        v: "k3s · GitHub Actions · Argo CD(GitOps) · AWS · IAM OIDC",
      },
    ],
    projLabel: "대표 프로젝트",
    projects: [
      "Dotodo — 음성 RAG 추천 에이전트. LLM-as-a-Judge 자율 평가로 API 비용 60% 절감.",
      "go2fit — 피트니스 앱 백엔드·DB 설계(5계층 FK 체인·JWT 4중 보안), 배포 진행 중.",
      "Pic-Tag — GPU 없는 엣지 CCTV AI. OpenVINO INT8·4-Thread 실시간 추론.",
      "Dorosee — 멀티모달 응급 탐지 UGV (2025 UWC 해커톤 대상).",
    ],
    projMore: "전체 11개 프로젝트의 아키텍처·구현 상세는 웹에서 →",
    principlesLabel: "일하는 방식",
    principles: [
      "3회 이상 반복되는 병목은 반드시 자동화한다.",
      "데이터의 골든 키를 먼저 정의하면 나머지는 따라온다.",
      "모델의 좋고 나쁨은 평가 설계가 결정한다.",
      "루프를 누가 제어하는가가 LLM 호출과 에이전트를 가른다.",
    ],
    eduLabel: "학력 · 자격",
    education: [
      "Intel AI for Future Workforce — 1,000시간+ AI 풀라이프사이클 실전 과정 이수",
      "경희대학교 환경공학 학사 · 정보처리기사(필기) · 대기환경기사 · OPIc IH",
    ],
    footer: "프로젝트별 아키텍처·구현 상세와 엔지니어링 노트 전문",
  },
  en: {
    back: "Home",
    pdf: "Save as PDF",
    name: "Seungwan Hong",
    headline: "AI Engineer · Turning business problems into code",
    summaryLabel: "Summary",
    summary:
      "A full-stack AI engineer who starts from “why” and works across planning, data, ML, infrastructure, backend, and UI. As a global EPC project manager I translated stakeholders’ abstract needs into technical specs, and my strength is sensing where a project’s real bottleneck lies.",
    expLabel: "Experience",
    experience: [
      {
        company: "DTK",
        role: "AI Engineer",
        period: "Mar 2026 – Present",
        items: [
          "AlignAI — replaced environment-sensitive rule-based OpenCV with U-Net (EfficientNet-B0) segmentation (100% detection, ~330ms CPU); single-handedly built a train→ONNX→GHCR→Argo CD rolling-deploy ML CI/CD and k3s edge infra.",
          "Edge AI LMR — designed a Field→Edge→Cloud 4-tier anomaly-detection system with lossless 10ms PLC handling; AUROC 99.99% via Anomalib.",
          "ERP automation — in week one, converted manual backup of tens of thousands of legacy-ERP docs into a Playwright autonomous pipeline with zero integrity loss, without an API.",
          "LLM multimodal agent (ongoing) — hand-implemented tool use, RAG, and a ReAct loop to prototype an on-site “why the anomaly” agent.",
        ],
      },
      {
        company: "Zeeco Asia",
        role: "Project Manager",
        period: "Feb 2024 – Apr 2025",
        items: [
          "Led a multi-million-dollar global EPC combustion project through commissioning. Reconciled technical conflicts among US/India/Korea stakeholders and beat the target margin by 4% via Q/C/D and proactive risk management.",
        ],
      },
    ],
    skillsLabel: "Core skills",
    skills: [
      {
        g: "AI/ML",
        v: "PyTorch · Computer Vision (U-Net, YOLO) · LLM/RAG · Anomaly Detection · OpenVINO/ONNX",
      },
      { g: "Backend", v: "Python · FastAPI · PostgreSQL · Docker" },
      {
        g: "Infra/MLOps",
        v: "k3s · GitHub Actions · Argo CD (GitOps) · AWS · IAM OIDC",
      },
    ],
    projLabel: "Selected projects",
    projects: [
      "Dotodo — voice RAG recommendation agent; LLM-as-a-Judge cut API cost 60%.",
      "go2fit — fitness app backend & DB (5-tier FK chain, 4-layer JWT security); shipping.",
      "Pic-Tag — GPU-less edge CCTV AI; OpenVINO INT8, 4-thread real-time inference.",
      "Dorosee — multimodal emergency-detection UGV (2025 UWC hackathon grand prize).",
    ],
    projMore: "Architecture & implementation for all 11 projects on the web →",
    principlesLabel: "How I work",
    principles: [
      "Any bottleneck that repeats 3+ times must be automated.",
      "Define the data’s golden key first; the rest follows.",
      "Evaluation design decides whether a model is good.",
      "Who controls the loop separates an LLM call from an agent.",
    ],
    eduLabel: "Education · Certifications",
    education: [
      "Intel AI for Future Workforce — 1,000+ hrs, hands-on full-lifecycle AI program",
      "B.S. Environmental Engineering, Kyung Hee University · Engineer certifications · OPIc IH",
    ],
    footer:
      "Full per-project architecture, implementation, and engineering notes",
  },
} as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400 mb-2">
      {children}
    </h2>
  );
}

export default function ResumeView() {
  const { locale } = useLanguage();
  const r = locale === "en" ? RESUME.en : RESUME.ko;

  return (
    <div className="relative w-full md:max-w-2xl md:mx-auto px-5 md:px-8 pb-20 print:pb-0 text-neutral-900">
      {/* 상단 바 (인쇄/PDF 시 숨김) */}
      <div className="flex items-center justify-between pt-4 pb-10 print:hidden">
        <Link
          href="/"
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
      <header className="mb-4">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-[0.95]">
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
          <a
            href={CONTACT.webUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-neutral-700 hover:text-accent transition-colors"
          >
            <Globe size={12} /> {CONTACT.web}
          </a>
        </div>
      </header>

      <div className="h-px bg-neutral-200 mb-4" />

      {/* 소개 */}
      <section className="mb-4">
        <SectionLabel>{r.summaryLabel}</SectionLabel>
        <p className="text-[12.5px] leading-snug font-light text-neutral-600">
          {r.summary}
        </p>
      </section>

      {/* 경력 */}
      <section className="mb-4">
        <SectionLabel>{r.expLabel}</SectionLabel>
        <div className="space-y-4">
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
                    className="flex gap-2 text-[11.5px] leading-snug font-light text-neutral-600"
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

      {/* 핵심 기술 */}
      <section className="mb-4 break-inside-avoid">
        <SectionLabel>{r.skillsLabel}</SectionLabel>
        <div className="space-y-1.5">
          {r.skills.map((s) => (
            <div key={s.g} className="flex gap-3 text-[11.5px]">
              <span className="shrink-0 w-[74px] font-black text-neutral-900">
                {s.g}
              </span>
              <span className="font-light text-neutral-600">{s.v}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 대표 프로젝트 */}
      <section className="mb-4 break-inside-avoid">
        <SectionLabel>{r.projLabel}</SectionLabel>
        <ul className="space-y-1">
          {r.projects.map((p, i) => (
            <li
              key={i}
              className="flex gap-2 text-[11.5px] leading-snug font-light text-neutral-600"
            >
              <span className="mt-[7px] shrink-0 w-1 h-1 rounded-full bg-neutral-300" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <a
          href={CONTACT.webUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2.5 text-[11px] font-bold text-accent hover:gap-1.5 transition-all"
        >
          {r.projMore}
        </a>
      </section>

      {/* 일하는 방식 (인사이트 축약) */}
      <section className="mb-4 break-inside-avoid">
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
      <section className="mb-4 break-inside-avoid">
        <SectionLabel>{r.eduLabel}</SectionLabel>
        <ul className="space-y-1">
          {r.education.map((e, i) => (
            <li
              key={i}
              className="text-[11.5px] leading-snug font-light text-neutral-600"
            >
              {e}
            </li>
          ))}
        </ul>
      </section>

      {/* 하단 웹 유도 */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-4 border-t border-neutral-200 text-[11.5px] break-inside-avoid">
        <span className="font-light text-neutral-500">{r.footer}</span>
        <a
          href={CONTACT.webUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-black text-accent hover:gap-1.5 transition-all"
        >
          <Globe size={12} /> {CONTACT.web} <ArrowRight size={13} />
        </a>
      </div>
    </div>
  );
}
