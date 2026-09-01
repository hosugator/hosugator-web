// data/resumeGenon.ts — 제논(GenON) AI Product Engineer 제출용 이력서 데이터
//
// WHY 이 공고만 이력서의 무게가 다른가
//   자격요건 첫 줄이 「AI 로 만든 산출물 포트폴리오 제출 필수 (미제출 시 서류전형
//   불합격)」이다. 즉 서류를 통과시키는 것은 이력서가 아니라 산출물이고, 이 문서는
//   그 산출물을 어디서 보는지 가리키는 역할이 크다. 그래서 하단 CTA(/r/genon/)가
//   다른 회사보다 중요하고, 본문은 산출물에 없는 것 — 「그걸 어떻게 만들었나」와
//   「AI 가 만든 걸 검증할 수 있나」 — 를 채운다.
//
// 이 파일이 겨냥한 것 — 공고가 평가 기준으로 못 박은 세 축이다.
//   1) 결과물            → 0→1 로 만들어 배포·운영 중인 것들 (AlignAI 에이전트 · ERP · go2fit)
//   2) AI 활용 방식      → 각 항목에 「AI 를 어디까지 쓰고 어디서 직접 검증했나」를 한 절씩
//   3) 생산성 향상 근거  → 숫자 (1주 차 무인화 · API 60%↓ · 운영비 30%↓ · TCO 80%↓)
//
// WHY Fundamentals 를 경력 안에 흩지 않고 몰아 놓았나
//   공고가 「특정 프레임워크 숙련도보다」 동시성·네트워크·데이터 모델링·장애 추적을
//   더 본다고 명시했다. AI 로 빠르게 만든 사람에게 던지는 검증 질문이라, 흩어 놓으면
//   읽는 쪽이 대조를 못 한다. go2fit(데이터 모델링·일관성)과 DTK 마지막 불릿(로그
//   기반 장애 추적)이 그 자리다.
//
// WHY 네트워크·분산 시스템을 주장하지 않았나
//   볼트에 근거가 얇다. k3s·Nginx·API Gateway 경험은 있으나 분산 시스템 이론을 정면으로
//   다룬 기록이 없다. 1차 면접이 산출물 시연이라 「이 부분 왜 이렇게 했나」로 반드시
//   들어오는데, 여기서 부풀리면 그 자리에서 깨진다.

import type { ResumeData } from "@/components/sections/ResumeTemplate";

export const RESUME_GENON: ResumeData = {
  back: "홈으로",
  pdf: "PDF로 저장",
  name: "홍승완",
  headline: "AI Product Engineer · AI로 빠르게 만들고, 만든 것을 스스로 검증합니다",
  summaryLabel: "소개",
  summary:
    "AI 코딩 도구를 참고가 아니라 생산 수단으로 씁니다. 다만 생성된 코드를 그대로 두지 않고 테스트·리팩토링·장애 추적까지 붙여 운영 가능한 상태로 만드는 것을 제 몫으로 봅니다. 혼자 또는 소규모로 백엔드·인프라·프런트를 넘나들며 0에서 1을 만들어 실사용자에게 배포·운영해 왔고, 판단 근거는 전부 공개해 두었습니다.",
  expLabel: "경력",
  experience: [
    {
      company: "DTK",
      role: "AI Engineer",
      period: "2026.03 ~ 현재",
      items: [
        "ERP 자동화 — 입사 1주 차, 공식 API가 없는 레거시 ERP의 수만 건 결재 문서 수작업을 Playwright 자율 파이프라인으로 100% 정합성 무인화했습니다. 비동기 팝업 Race Condition은 Promise.all 기반 동시성으로 구조적으로 제거했고, 자격증명 분리와 CSV 전수 감사 로그로 사후 추적이 되게 했습니다.",
        "AlignAI 에이전트 (0→1 · 프로덕션 라이브) — 오퍼레이터가 측정값만으로는 「왜 이 결과인지」를 모른다는 문제에서 출발했습니다. 프레임워크로 감싸지 않고 Tool use·RAG·ReAct 루프를 직접 구현해 상황에 맞는 도구를 자율 선택하게 했고, 5~20초 지연은 SSE 스트리밍으로 도구 선택 과정을 노출해 이탈을 막았습니다.",
        "배포 자동화·관측성 — 학습→ONNX→GHCR→Argo CD 롤링 배포 ML CI/CD와 게이트웨이 PC k3s 클러스터를 단독 설계·구축했습니다. 추론(Deployment)과 학습(Job)의 라이프사이클을 분리하고, liveness/readiness probe와 self-heal로 OOM·비정상 종료 시 복구를 검증했습니다.",
        "장애 추적 — GITHUB_TOKEN 커밋이 downstream 워크플로우를 트리거하지 않는 Actions 보안 정책과 Argo CD의 Job 반복 재생성을 로그로 순차 규명해 각각 workflow_dispatch 우회·resource.exclusions로 해결했고, GPU 드라이버 충돌은 dmesg·journalctl을 직접 파싱해 근본 원인을 특정했습니다. 셋 다 결정 기록으로 남겼습니다.",
        "불완전한 요구를 스펙으로 — 산학협력 과제의 「품질 고도화」는 달성 여부를 판정할 수 없어 착수가 막혀 있었습니다. 「지금 할 수 있는 수준은 무엇인가」로 질문을 바꿔 OK/NG 판정으로 좁히고 네 직군의 합의를 만들었습니다.",
      ],
    },
    {
      company: "go2fit",
      role: "3인 팀 · Backend & Infra 담당",
      period: "2025.10 ~ 현재",
      items: [
        "데이터 모델링·일관성 — User·Exercise·Community 3축 PostgreSQL 스키마를 단독 설계했습니다. Exercise 축은 5계층 FK 체인으로 기록의 계층 무결성을 보장하고, 중복 생성은 user_id+key UNIQUE 제약의 Idempotency Key로 막았습니다. 인증은 Refresh Rotation·raw 토큰 미저장·jti 블랙리스트 4중으로 설계했습니다. Google Play 비공개 테스트로 실사용자 12명 대상 운영 중.",
        "티켓이 요구한 해법보다 그 전제를 먼저 확인합니다 — 고아 리소스를 보상 삭제·정리 Job(saga)으로 지우라는 요구를 「세션 find-or-create + 단일 트랜잭션」으로 바꿔 고아가 생기는 창 자체를 없앴습니다.",
      ],
    },
    {
      company: "Zeeco Asia",
      role: "Project Manager",
      period: "2024.02 ~ 2025.04",
      items: [
        "수십억 규모 글로벌 EPC 프로젝트를 시운전까지 총괄. 미·인·한 3국 이해관계자의 충돌을 조율하고 추상적 요구를 기술 명세로 번역했습니다.",
      ],
    },
  ],
  projLabel: "대표 프로젝트 — 개선 근거",
  projects: [
    "Dotodo — 음성 RAG 추천 에이전트. 무엇을 '좋은 응답'으로 볼지 직접 정의해 LLM-as-a-Judge 평가 루프를 붙이고, 최하위 점수 항목에만 선택 호출하도록 게이팅해 API 비용 60% 절감. FastAPI asyncio 파이프라인으로 응답 지연 60% 단축.",
    // Sodam Diary(3-Stage 캐스케이드로 운영비 30%↓·30초→20초)는 뺐다 — 1p 제약이고,
    // 「비싼 호출을 싼 단계로 게이팅한다」는 같은 축을 위 Dotodo 가 이미 나른다.
    // Hosugator(TCO 80%↓ · IAM OIDC 패스워드리스 CI/CD)는 뺐다 — 이 사이트 자체가
    // 제출 산출물이라 하단 CTA 가 이미 가리키고, 본문에서 한 번 더 설명하면 중복이다.
  ],
  principlesLabel: "일하는 방식",
  principles: [
    "AI가 만든 것은 내가 검증한 만큼만 내 것이다.",
    "티켓이 요구한 해법보다 그 전제가 참인지를 먼저 확인한다.",
    "판단의 근거는 결정 기록으로 남긴다 — 읽히지 않는 문서는 검증되지도 않는다.",
  ],
  eduLabel: "학력 · 자격",
  education: [
    "경희대학교 환경공학 학사 · Intel AI for Future Workforce (KDT, 2025.04~10) · 정보처리기사(필기) · 대기환경기사 · OPIc IH",
  ],
  footer: "산출물 · 아키텍처 상세 · 엔지니어링 노트 전문",
};
