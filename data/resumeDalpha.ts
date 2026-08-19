// data/resumeDalpha.ts — 달파(DALPHA) AI Engineer 제출용 이력서 데이터
//
// WHY 공개용(ResumeView)을 복제하지 않고 데이터만 따로 두나
//   레이아웃은 ResumeTemplate 이 이미 갖고 있다. 회사마다 다른 것은 「무엇을 위로
//   올리고 무엇을 자르나」뿐이라 데이터만 갈아끼우면 된다. 복제하면 레이아웃 수정이
//   회사 수만큼 반복된다.
//
// WHY 한국어만 두나
//   제출처가 국내 단일이고, 없는 언어를 만들어두면 갱신 대상만 늘어난다.
//   공개용(/resume)은 ko/en 둘 다 유지한다.
//
// 이 파일이 겨냥한 것 — 공고가 「이력서에 구체적으로 적어달라」고 지정한 4항목이다.
//   1) 요청받은 과제 대신 풀어야 할 문제를 다시 정의한 경험  → go2fit GF-152
//   2) 0→1 설계·구현 + 실사용 환경 운영하며 성능 개선        → AlignAI · Edge AI LMR
//   3) 만든 것을 다른 업무에 다시 쓰이게 해 반복 문제를 축소  → go2fit GF-151
//   4) 팀 작업이면 본인 역할과 직접 기여 구분                 → go2fit 3인 팀 역할 명시
// 항목을 지우거나 순서를 바꿀 때 이 대응이 깨지지 않는지 먼저 본다.

import type { ResumeData } from "@/components/sections/ResumeTemplate";

export const RESUME_DALPHA: ResumeData = {
  back: "홈으로",
  pdf: "PDF로 저장",
  name: "홍승완",
  headline: "AI Engineer · 현장의 문제를 다시 정의하고 시스템으로 끝냅니다",
  summaryLabel: "소개",
  summary:
    "요청받은 과제를 그대로 만들기 전에 데이터와 업무를 직접 확인해 풀어야 할 문제를 다시 정의합니다. 글로벌 EPC PM으로 3국 이해관계자의 추상적 요구를 기술 명세로 번역했고, 지금은 제조 현장에서 공식 API 없는 레거시와 폐쇄망 엣지처럼 제약이 큰 환경에 데이터·ML·인프라·백엔드를 끝까지 붙이고 있습니다.",
  expLabel: "경력",
  experience: [
    {
      company: "DTK",
      role: "AI Engineer",
      period: "2026.03 ~ 현재",
      items: [
        'LLM 멀티모달 에이전트(진행 중) — Tool use·RAG·ReAct 루프를 프레임워크로 감싸지 않고 직접 구현. 이상탐지가 답하는 "이상하다"에서 현장이 실제로 묻는 "왜 이상한가"로 넘어가는 것이 목표.',
        "ERP 자동화 — 입사 1주 차, 공식 API가 없는 레거시 ERP의 수만 건 결재 문서 수작업을 Playwright 자율 파이프라인으로 100% 정합성 무인화.",
        "AlignAI — 규칙 기반 OpenCV의 환경 민감도를 U-Net(EfficientNet-B0) 세그멘테이션으로 전환(탐지율 100%·CPU ~330ms). 학습→ONNX→GHCR→Argo CD 롤링 배포 ML CI/CD와 k3s 엣지 배포 인프라를 단독 설계·구축.",
        "Edge AI LMR — 10ms 고주파 PLC 데이터를 무손실 처리하는 Field→Edge→Cloud 4계층 이상탐지 설계. 이상 발생률이 1% 미만이라 accuracy가 무의미함을 확인하고 AUROC를 핵심 지표로 재정의, Anomalib 기반 99.99% 확보.",
      ],
    },
    {
      company: "go2fit",
      role: "3인 팀 · Backend & Infra 담당",
      period: "2025.10 ~ 현재",
      items: [
        "역할 — 초기에는 FE·BE·기획 구분 없이 기능 단위로, 현재는 Backend·Infra를 맡습니다. 3인 팀이라 겹치는 영역은 있습니다.",
        "요구 자체를 없앤 사례 — 티켓이 상세한 선정 기준까지 붙여 요구한 대표 결과 로직을 구현하지 않았습니다. 실측하니 해당 문제가 아직 0건이었고, 진입점이 세트 생성 여부를 가르게 하니 중복이 생기지 않아 요구가 불필요해졌습니다.",
        "반복 문제를 구조적으로 제거 — 고아 리소스를 보상 삭제·정리 Job(saga)으로 지우라는 요구를, 다른 경로에서 이미 검증된 「서버 내부 세션 find-or-create + 단일 트랜잭션」 패턴을 적용해 고아가 생기는 창 자체를 없애는 쪽으로 바꿨습니다.",
        "User·Exercise·Community 3축 PostgreSQL 스키마·JWT 4중 보안 설계. Google Play 비공개 테스트로 실사용자 12명 대상 운영 중.",
      ],
    },
    {
      company: "Zeeco Asia",
      role: "Project Manager",
      period: "2024.02 ~ 2025.04",
      items: [
        "수십억 규모 글로벌 EPC 연소 설비 프로젝트를 시운전까지 총괄. 고객사 현장에서 미·인·한 3국 이해관계자의 기술 충돌을 조율하고, Q/C/D·선제 리스크 관리로 목표 마진율을 4% 초과 달성.",
      ],
    },
  ],
  projLabel: "대표 프로젝트",
  projects: [
    "Dotodo — 음성 RAG 추천 에이전트. 무엇을 '좋은 응답'으로 볼지 직접 정의해 LLM-as-a-Judge 자율 평가 루프를 붙였고 API 비용 60% 절감.",
    // Pic-Tag·Dorosee(해커톤 데모)는 뺐다 — 지면이 1p 를 넘기는데, 달파의 엔터프라이즈
    // AX 문맥에서 가장 먼 항목이라 여기서 잘린다. 공개용(/resume)에는 그대로 있다.
    "Sodam Diary — VLM 기반 시각장애인 사진 해설. 운영비 30%↓·응답 30초→20초, 2025 한국장애인해커톤 본선.",
  ],
  principlesLabel: "일하는 방식",
  principles: [
    "티켓이 요구한 해법보다 그 전제가 참인지를 먼저 확인한다.",
    "3회 이상 반복되는 병목은 반드시 자동화한다.",
    "모델의 좋고 나쁨은 평가 설계가 결정한다.",
    "루프를 누가 제어하는가가 LLM 호출과 에이전트를 가른다.",
  ],
  eduLabel: "학력 · 자격",
  education: [
    // Intel 과정을 경력이 아니라 여기 둔다 — 2025.04~10 공백을 설명하면서 지면을 덜 쓴다.
    // 그 과정의 산출물은 아래 「대표 프로젝트」가 이미 나르므로 정보가 사라지지 않는다.
    "경희대학교 환경공학 학사 · Intel AI for Future Workforce (한국표준협회 KDT, 2025.04~10, 1,000시간+) · 정보처리기사(필기) · 대기환경기사 · OPIc IH",
  ],
  footer: "프로젝트별 아키텍처·구현 상세와 엔지니어링 노트 전문",
};
