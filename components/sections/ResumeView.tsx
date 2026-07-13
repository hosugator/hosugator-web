"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import ResumeTemplate, { type ResumeData } from "./ResumeTemplate";

// 공개용(hosugator.com) 이력서 — 퍼널 CTA 포함, 1~2p A4.
// 프로젝트별 아키텍처·구현 상세·엔지니어링 노트 전문은 웹으로 유도한다.
// /resume.pdf 생성 소스. (재생성: npm run dev 후 `npm run resume:pdf`)
// 회사 맞춤 제출용을 만들 때는 이 파일을 복제하지 말고 ResumeTemplate을 재사용할 것 — 참고: ResumeTemplate.tsx 상단 주석.
const RESUME: Record<"ko" | "en", ResumeData> = {
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
        company: "go2fit",
        role: "개인 프로젝트 · Backend & DB",
        period: "2025.10 ~ 현재",
        items: [
          "피트니스 소셜 앱 백엔드: User·Exercise·Community 3축 PostgreSQL 스키마 설계, 5계층 FK 체인·JWT 4중 보안, MediaPipe 포즈 추정 운동 분석기 구현.",
          "Google Play 비공개 테스트 트랙에 안드로이드 테스터 12명을 모집해 테스트 진행 중.",
        ],
      },
      {
        company: "Intel AI for Future Workforce",
        role: "AI Full-Stack 교육생 (한국표준협회 KDT)",
        period: "2025.04 ~ 2025.10",
        items: [
          "1,000시간+ AI 풀사이클 실전 과정. YOLOv8+LLM 응급대응 플랫폼(Dorosee, 2025 UWC 해커톤 대상), LangChain RAG 추천 서비스(Dotodo), VLM 시각보조 서비스(Sodam Diary) 등 6개+ End-to-End AI 서비스 PoC 수행.",
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
    projLabel: "대표 프로젝트",
    projects: [
      "Dotodo — 음성 RAG 추천 에이전트. LLM-as-a-Judge 자율 평가로 API 비용 60% 절감.",
      "Sodam Diary — VLM 기반 시각장애인 사진 해설. 운영비 30%↓·응답 30초→20초, 2025 한국장애인해커톤 본선.",
      "Pic-Tag — GPU 없는 엣지 CCTV AI. OpenVINO INT8·4-Thread 실시간 추론.",
      "Dorosee — 멀티모달 응급 탐지 UGV (2025 UWC 해커톤 대상).",
    ],
    principlesLabel: "일하는 방식",
    principles: [
      "3회 이상 반복되는 병목은 반드시 자동화한다.",
      "데이터의 골든 키를 먼저 정의하면 나머지는 따라온다.",
      "모델의 좋고 나쁨은 평가 설계가 결정한다.",
      "루프를 누가 제어하는가가 LLM 호출과 에이전트를 가른다.",
    ],
    eduLabel: "학력 · 자격",
    education: [
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
        company: "go2fit",
        role: "Personal project · Backend & DB",
        period: "Oct 2025 – Present",
        items: [
          "Fitness social app backend: designed a User/Exercise/Community PostgreSQL schema (5-tier FK chain, 4-layer JWT security) and MediaPipe pose-estimation workout analyzers.",
          "Running a closed beta on Google Play with 12 Android testers recruited.",
        ],
      },
      {
        company: "Intel AI for Future Workforce",
        role: "AI Full-Stack Trainee (Korea Standards Association KDT)",
        period: "Apr 2025 – Oct 2025",
        items: [
          "1,000+ hrs hands-on full-lifecycle AI program. Shipped 6+ end-to-end AI service PoCs: a YOLOv8+LLM emergency-response platform (Dorosee, 2025 UWC hackathon grand prize), a LangChain RAG recommendation service (Dotodo), and a VLM visual-assist service (Sodam Diary).",
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
    projLabel: "Selected projects",
    projects: [
      "Dotodo — voice RAG recommendation agent; LLM-as-a-Judge cut API cost 60%.",
      "Sodam Diary — VLM-based photo narration for the visually impaired; cost -30%, latency 30s→20s, 2025 Korea Disability Hackathon finalist.",
      "Pic-Tag — GPU-less edge CCTV AI; OpenVINO INT8, 4-thread real-time inference.",
      "Dorosee — multimodal emergency-detection UGV (2025 UWC hackathon grand prize).",
    ],
    principlesLabel: "How I work",
    principles: [
      "Any bottleneck that repeats 3+ times must be automated.",
      "Define the data’s golden key first; the rest follows.",
      "Evaluation design decides whether a model is good.",
      "Who controls the loop separates an LLM call from an agent.",
    ],
    eduLabel: "Education · Certifications",
    education: [
      "B.S. Environmental Engineering, Kyung Hee University · Engineer certifications · OPIc IH",
    ],
    footer:
      "Full per-project architecture, implementation, and engineering notes",
  },
};

export default function ResumeView() {
  const { locale } = useLanguage();
  const r = locale === "en" ? RESUME.en : RESUME.ko;

  return <ResumeTemplate data={r} />;
}
