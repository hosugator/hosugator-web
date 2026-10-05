// app/resume/pxd/page.tsx — pxd AI 플랫폼 & 백엔드 엔지니어(AX) 제출용 통합 초안 (지원 동기 + 이력서 + 포트폴리오)
//
// 뼈대는 딥오토판(draft/deepauto · app/resume/deepauto/page.tsx)을 그대로 쓴다 — 세 문서 역할 분리,
// 대응표의 ○△×, print:hidden 검토 메모. 그 결정의 WHY 는 딥오토판 머리 주석에 있다.
// 여기에는 pxd 에서 「달라진 것」만 적는다.
//
// WHY 무게중심이 비전에서 플랫폼·백엔드로 옮겨갔나  ← 이 파일에서 가장 중요한 결정
//   pxd 필수 3개는 (1) 상용 LLM/Agent/RAG 프로덕션 (2) 백엔드·데이터 파이프라인·CI/CD 배포·운영
//   (3) 모호한 요구 → 엔지니어링 문제 · 다직군 소통. 비전 모델 성능은 어디에도 없다.
//   (1)은 갭이라 앵커가 될 수 없고, (2)(3)이 앵커다. 그래서 강조 블록은 GV-001 이 아니라
//   AlignAI 의 학습 → 배포 파이프라인이고, 포트폴리오에서 격자 인덱싱 · Edge LMR 을 뺐다.
//
// WHY 「운영」이라는 단어를 쓰지 않나
//   pxd 공고는 「배포 및 운영 경험」을 묻는데, 내 쪽은 설계·구축까지다. k3s 는 로컬 PoC 검증
//   (main 58cd080 정정), go2fit 은 출시 준비 중(테스터 12명 확보, 2026-10-05 정정)이다.
//   「운영」이라 쓰면 면접 첫 질문(장애 · 트래픽 · 비용)에서 깨진다 → 대응표에서 △ 로 둔다.
//
// WHY go2fit 이 한 줄에서 사례로 올라왔나
//   우대 「인증/인가 · 보안」, 「DB 설계 · 정합성」에 직접 닿는 유일한 근거다. 딥오토판에서는
//   「삭제 후보」였던 항목이 여기서는 포트폴리오 한 칸을 차지한다 — 같은 경험, 다른 공고.
//
// WHY 갭 넷(상용 LLM · MCP · Routing/Gateway · LLM Observability)을 대응표에 다 적나
//   딥오토판과 같은 이유 — × 를 먼저 적어야 ○ 를 믿는다.
//
// 근거: 볼트 [[Master Resume]] · [[Job Analysis - pxd]] · [[Resume - pxd - AI 플랫폼 & 백엔드 AX]]
//
// PDF: npm run dev 를 띄운 상태에서  npm run resume:pdf -- pxd  → resumes/resume-pxd.pdf

import type { Metadata } from "next";
import { ArrowRight, Github, Globe, Linkedin, Mail } from "lucide-react";
import Mermaid from "@/components/ui/Mermaid";

export const metadata: Metadata = {
  title: "Draft — pxd AI 플랫폼 & 백엔드",
  robots: { index: false, follow: false },
};

const COMPANY = "pxd";
const ROLE = "AI 플랫폼 & 백엔드 엔지니어 (AX)";

// WHY 여기 따로 두나 — 딥오토판 주석 참고("use client" 모듈의 값 import 는 빈 프록시가 된다).
const CONTACT = {
  email: "hosugator@gmail.com",
  github: "github.com/hosugator",
  githubUrl: "https://github.com/hosugator",
  linkedin: "linkedin.com/in/seungwanhong",
  linkedinUrl: "https://linkedin.com/in/seungwanhong",
  web: "hosugator.com",
  // 전제: lib/outreach.ts 에 'pxd' 항목이 main 에 배포돼 있어야 한다 — 없으면 404
  webUrl: "https://hosugator.com/r/pxd/",
};

// ── 타입 ────────────────────────────────────────────────────────────────
type Line = { text: string; note?: string };
type ResumeItem = { title: string; text: string; note?: string };

type Experience = {
  company: string;
  role: string;
  period: string;
  /** 이력서 전체에서 하나만 둔다 — 인사 담당자가 한 곳만 읽어도 되게 */
  highlight?: ResumeItem & { points: string[] };
  items: ResumeItem[];
};

type CaseStudy = {
  id: string;
  title: string;
  problem: string;
  approach: string[];
  result: string;
  diagram?: string;
  note?: string;
};

type TrackRow = { track: string; level: "○" | "△" | "×"; evidence: string };

// ── 1. 지원 동기 — 왜 맞는가. 숫자 없이 ───────────────────────────────────
// ── 채울 곳 1 ───────────────────────────────────────────────────────────
// 네 문단 구조는 딥오토판과 같다: ① 공고에서 멈춘 문장 + 내가 하는 일 ② 두 번째 축 ③ 갭을 인정하는
// 문단 ④ 한 줄 마무리. 각 note 가 겨냥할 요건을 적어 두었다.
//   WHY ①을 필수 3번으로 여나 — 필수 1번(상용 LLM)은 갭이라 첫 문장에 둘 수 없고, 2번(인프라)은
//   흔한 요건이라 첫 문장으로는 약하다. 3번은 PM 경력이 정면으로 답하는, 이 지원만의 차별점이다.
const LETTER: Line[] = [
  {
    text:
      "pxd 공고에서 멈춘 문장은 「모호한 비즈니스 요구사항을 명확한 엔지니어링 문제와 시스템 구조로 정의한다」였습니다. 지금 DTK 에서 가장 오래 붙들고 있는 일이 그것입니다. 산학협력 외관 검사 과제는 「품질을 고도화해 달라」는 한 문장으로 시작했고, 경영 · 설비 설계 · 대학 연구팀 · 현장 작업자가 저마다 다른 것을 기대했습니다. 저는 그 문장을 OK/NG 판정이라는 착수 가능한 범위로 좁히고, 어떤 후보 모델이 와도 같은 자리에 꽂히는 평가 인터페이스를 먼저 고정했습니다. EPC PM 으로 미국 · 인도 · 한국 엔지니어 사이에서 요구를 기술 명세로 옮기던 일이, 개발자가 된 뒤에는 이런 모양이 되었습니다.",
    note: "겨냥: 필수 3 「모호한 비즈니스 요구사항 → 엔지니어링 문제 · 다직군 소통」. 재료: 산학 AOI 「품질 고도화」 → OK/NG 이진 판정 · 4직군 조율 · score_image/score_map 인터페이스. Zeeco 3국 조율은 한 구절로.",
  },
  {
    text:
      "그 위에서 만들어 온 것은 모델 자체보다 모델이 사람에게 닿는 길입니다. 학습에서 ONNX 변환, 이미지 빌드, Argo CD 배포까지를 한 줄의 GitOps 파이프라인으로 혼자 세웠고, 사이드 팀에서는 인증과 데이터 정합성부터 설계한 앱 백엔드로 출시를 준비하고 있습니다. 모델을 모르는 현장 오퍼레이터를 위해서는 모델을 도구로 불러 결과를 현장 언어로 해설하는 에이전트를 만들었습니다. pxd 의 사용자가 디자이너와 리서처라는 것을 보고, 「AI 를 모르는 사람이 매일 쓰는 도구」라는 같은 문제로 읽었습니다.",
    note: "겨냥: 필수 2 백엔드 · CI/CD + 주요업무 「사내 구성원이 매일 체감하는」. 재료: 학습 → ONNX → Argo CD 파이프라인 단독 구축, go2fit 백엔드. 사용자가 디자이너 · 리서처라는 점과 「현장 오퍼레이터에게 설명하는 에이전트」를 잇는 문장이 들어가면 강하다.",
  },
  {
    text:
      "아직 없는 것도 분명합니다. 그 에이전트는 PoC 까지였고, 상용 환경에서 LLM 서비스를 운영하며 품질 · 비용 · 장애를 관측해 본 적은 없습니다. 다만 배포 파이프라인과 인증, 평가 기준을 먼저 세우는 방식으로 일해 왔기에, 그 위에 LLM 서비스를 올리고 관측 체계를 붙이는 일이 pxd 에서 가장 먼저 채우고 싶은 곳입니다.",
    note: "겨냥: 필수 1 갭 인정. 「에이전트는 PoC 까지, 상용 운영 · 관측은 아직 — pxd 에서 가장 먼저 채우고 싶은 곳」. 나머지 갭은 아래 대응표의 × 가 말한다.",
  },
  {
    text:
      "사내에서 검증한 것을 제품으로 고도화한다는 pxd 의 방식 안에서, 모호한 요구를 시스템으로 옮기는 일부터 함께 하고 싶습니다.",
    note: "한 줄 마무리. 「사내에서 검증해 제품으로 고도화한다」는 pxd 의 구조를 받으면 자연스럽다.",
  },
];

// ── 2. 이력서 — 1쪽. 강조 하나, 나머지 한 줄 ─────────────────────────────
// ── 채울 곳 2 ── 헤드라인 한 줄. 딥오토판은 「검출 결과에서 구조를 복원하고…」였다.
//   방향: 플랫폼 · 백엔드 + 요구를 시스템으로 번역. 「운영」은 쓰지 않는다(머리 주석).
const HEADLINE =
  "AI Engineer · 모호한 요구를 시스템으로 옮기고, 모델이 사람에게 닿는 길을 만듭니다";

const SUMMARY: Line = {
  text: "모델 학습에서 GitOps 배포까지의 파이프라인과, 인증 · 데이터 정합성부터 세운 앱 백엔드를 단독으로 설계 · 구축했습니다. 글로벌 EPC PM 출신으로, 여러 직군의 모호한 요구를 착수 가능한 기술 명세로 좁히는 일에 익숙합니다.",
  note: "2문장. ① 학습 → 배포 파이프라인과 백엔드를 단독 설계 · 구축 ② EPC PM 출신이라 여러 직군의 모호한 요구를 기술 명세로 옮기는 데 익숙. LLM 갭은 지원 동기가 말하므로 여기선 쓰지 않는다.",
};

const EXPERIENCE: Experience[] = [
  {
    company: "DTK",
    role: "AI Engineer",
    period: "2026.03 ~ 현재",
    highlight: {
      title: "AlignAI ML CI/CD · GitOps 배포 파이프라인",
      text: "모델 학습부터 배포까지를 한 줄의 파이프라인으로 단독 설계 · 구축했습니다.",
      points: [
        "학습 → ONNX 익스포트 → 추론 이미지 빌드 → GHCR → Argo CD 롤링 업데이트 E2E",
        "추론(Deployment)과 학습(Job)의 라이프사이클을 분리해 독립 CI 로 관리, 이미지 레이어 핑거프린트로 불필요한 재학습 제거",
        "liveness/readiness probe · Argo CD self-heal 로 OOM 자동 복구를 k3s 로컬 PoC 에서 검증 — GITHUB_TOKEN 정책 · Job 재생성 이슈는 ADR 로 기록",
      ],
      note: "필수 2 정면 대응. 「엣지 배포」 · Harbor 는 뺐다 — 현장 배포가 아니고 Harbor 는 에어갭 토폴로지 설계까지(2026-10-05 확인). k3s 는 로컬 PoC(58cd080), replica 1 이라 HA 미검증.",
    },
    items: [
      {
        title: "산학협력 외관 검사 · 요구 조율",
        text: "경영 · 설비 설계 · 대학 연구팀 · 현장 4직군의 「품질 고도화」를 OK/NG 이진 판정으로 좁히고, 후보 모델을 배제하지 않는 평가 인터페이스(score_image 필수 / score_map 선택)를 고정",
        note: "필수 3. 합격선은 미확정(현장 배치 전).",
      },
      {
        title: "AlignAI 설명 에이전트 (PoC)",
        text: "자사 U-Net 을 도구로 호출해 추론 결과를 현장 언어로 해설 · function calling → RAG → ReAct 직접 구현, SSE 스트리밍",
        note: "필수 1 의 인접 근거. PoC 표기 유지.",
      },
      {
        title: "GV-001 라벨 · 평가 기준",
        text: "3인 × 3회 순서형 판정으로 라벨러 간 α 0.588 → 0.723, 단일 점수 대신 운영점(미탐 5% 에서 과탐 21% → 11%)으로 모델 비교",
        note: "우대 「AI 서비스의 정량적 평가」. 비전 평가이지 LLM 평가는 아님 — 대응표에서 △.",
      },
      {
        title: "ERP 백업 자동화",
        text: "API 없는 레거시 ERP 의 결재 문서 수만 건을 Playwright 로 무인 추출, 자격증명 분리 · CSV 전수 감사 로그",
        note: "주요업무 「외부 도구 연결 · 수집 · 가공」에 약하게 닿는다. 1쪽이 넘치면 삭제 1순위.",
      },
    ],
  },
  {
    company: "go2fit",
    role: "3인 팀 · Backend & Infra",
    period: "2025.10 ~ 현재",
    items: [
      {
        title: "피트니스 소셜 앱 백엔드",
        text: "User · Exercise · Community 3축 PostgreSQL 스키마와 JWT 4중 보안(Refresh Rotation · 해시 저장 · jti Blacklist · Idempotency Key) 단독 설계, 비동기 영상 분석 잡 큐와 얼굴 비식별화 파이프라인 분리 · Google Play 출시 준비 중",
        note: "우대 「인증/인가 · 개인정보」 「DB 정합성」. 테스터 12명은 출시 요건용 확보이지 실사용자가 아님 — 숫자를 넣을지는 판단.",
      },
    ],
  },
  {
    company: "Zeeco Asia",
    role: "Project Manager",
    period: "2024.02 ~ 2025.04",
    items: [
      {
        title: "연소 설비 EPC",
        text: "수십억 규모 대체 프로젝트를 시운전까지 총괄, 미·인·한 3국 이해관계자의 추상적 요구를 기술 명세로 번역 · 목표 마진 4% 초과",
        note: "필수 3.",
      },
    ],
  },
];

const PROJECTS: ResumeItem[] = [
  { title: "공고 분석 LLM 워크플로", text: "매일 무인 실행 · 규칙 → Haiku → Sonnet 3단계로 좁혀, 주당 검토 공고 ~7 → ~500건 · 분석 1 → ~20건(하루 약 $6), 최종 판단은 사람", note: "개인 · 2026.09~ 운영 중. 주요업무 1 「구성원 생산성 AI 워크플로」에 가장 가까운 근거라 맨 위." },
  { title: "Dotodo", text: "음성 STT 기반 RAG 추천 · Backend/Model 서버 분리 · LLM-as-a-Judge 선택 호출로 API 비용 60% 절감", note: "교육 프로젝트. 우대 「비용 최적화」 「RAG」." },
  { title: "Sodam Diary", text: "GPT-4V 단독을 BLIP → CLIP → LLM 3-Stage 로 분리 · 운영비 30% 절감 · 한국장애인해커톤 본선", note: "우대 「다중 AI 모델 통합」의 인접 근거 — Routing 은 아님." },
  { title: "Hosugator Web", text: "EC2/Nginx → S3 정적 전환으로 TCO 80% 절감 · GitHub Actions + IAM OIDC 로 액세스 키 없는 CI/CD", note: "필수 2 「클라우드 인프라 배포」. Dorosee 대신 들어왔다." },
];

const SKILLS =
  "Python · FastAPI · Django · PostgreSQL · JWT/OIDC · asyncio · LLM function calling · RAG(ChromaDB) · Docker · k3s · Argo CD · GitHub Actions · AWS(EC2 · S3 · IAM) · PyTorch · ONNX";

const EDUCATION =
  "경희대학교 환경공학 학사 · Intel AI for Future Workforce (KDT, 2025.04~10) · 대기환경기사 · 정보처리기사(필기) · OPIc IH";

// ── 3. 포트폴리오 — 숫자 · 과정 · 다이어그램은 여기에만 ─────────────────────

// 확인 필요: 노드 이름은 Master Resume 서술로 재구성했다. 실제 워크플로 파일 · ADR 의 단계 이름과
// 맞추면 더 정확하다.
const GITOPS_DIAGRAM = `flowchart LR
  subgraph CI["GitHub Actions"]
    direction LR
    TR["학습 Job"] --> OX["ONNX 익스포트"] --> IMG["추론 이미지 빌드"]
    FP{"레이어 핑거프린트"} -.->|"변경 없음"| SKIP["재학습 생략"]
  end
  IMG --> REG[("GHCR")]
  REG --> GIT["매니페스트 태그 갱신"]
  GIT --> ARGO["Argo CD · 롤링 업데이트"]
  ARGO --> K3S["k3s · probe · self-heal"]`;
// 노드 이름 근거: 볼트 [[Portfolio - Slides - AlignAI-MLOps]] · ci.yml / train.yml 두 트리거

// ── 채울 곳 3 ── go2fit 다이어그램. 무엇을 그릴지가 판단이다.
//   후보 A: 토큰 생애(발급 → Rotation → Blacklist) — 우대 「인증/인가」에 정면
//   후보 B: 영상 분석 잡 FSM(PENDING → PROCESSING → COMPLETED/FAILED) — 「데이터 파이프라인」에 정면
//   한 사례에 다이어그램은 하나다(A4 반쪽). 공고가 더 무겁게 묻는 쪽을 고른다.
// 고른 것: A(토큰 생애). B(잡 FSM)가 닿는 「데이터 파이프라인」은 GitOps 사례가 이미 그림으로
// 덮고, 우대 「인증/인가」는 이 사례 말고는 그림으로 보일 곳이 없다.
const GO2FIT_DIAGRAM = `flowchart LR
  K["카카오 OAuth 검증"] --> ISS["Access 15분 · Refresh 30일 발급"]
  ISS --> DB[("refresh_tokens · SHA-256 해시만 저장")]
  C["재발급 요청"] --> CHK{"해시 대조"}
  DB -.-> CHK
  CHK -->|"처음 쓰는 토큰"| ROT["Rotation · 새 쌍 발급 · 이전 것 폐기"]
  CHK -->|"이미 쓴 토큰"| BL["재사용 감지 → 그 유저의 전 토큰 jti Blacklist"]`;

const AGENT_DIAGRAM = `flowchart LR
  Q["오퍼레이터 질문 + 검사 이미지"] --> LLM
  subgraph LOOP["ReAct 루프 · 계속할지는 모델이 매 턴 결정"]
    LLM["LLM"] -->|"tool_calls"| T1["run_prediction · U-Net"]
    LLM -->|"tool_calls"| T2["analyze_image"]
    LLM -->|"tool_calls"| T3["search_reference · 과거 사례"]
    T1 -->|"관측 → messages 누적"| LLM
    T2 --> LLM
    T3 --> LLM
  end
  LLM -->|"tool_calls 비움 = 종료"| A["현장 언어 해설 · SSE 스트리밍"]`;

// WHY 두 줄인가 — 한 줄 LR 은 노드 9개라 A4 폭에서 글자가 읽히지 않았다(v1 첫 PDF). 자동 구간과
// 사람 구간으로 접었다 — 경계가 그대로 human-in-the-loop 의 위치다.
const JOBFLOW_DIAGRAM = `flowchart TB
  subgraph AUTO["자동 · launchd 매일 21:00 · 비싼 단계일수록 좁게"]
    direction LR
    C["수집 · 하루 ~88건"] --> F["규칙 트리아지 · ~73건"] --> S["Haiku · 전량 채점"] --> A["Sonnet · 조사 + 초안 · 3건"]
  end
  subgraph HUMAN["사람 · human-in-the-loop"]
    direction LR
    H["사람 검토 · 하루 3건"] --> AP["지원 · 보류 · 점수 정정"]
  end
  AUTO --> HUMAN
  AUTO -.-> L[("runs.jsonl · 토큰 · 비용 · 시간")]`;

const CASES: CaseStudy[] = [
  {
    id: "alignai-gitops",
    title: "AlignAI · 학습에서 배포까지 한 줄로 잇는 GitOps 파이프라인",
    problem:
      "AlignAI 는 실험 단계의 모델이라 배포 경로가 아예 없었습니다. 모델을 바꿀 때마다 「어떤 코드 · 의존성 · 가중치로 만든 모델이 어디에 떠 있는가」에 답할 수단이 없었고, 그 답을 Git 하나에서 얻도록 경로를 처음부터 설계했습니다.",
    approach: [
      "추론은 Deployment(늘 떠 있어야 함), 학습은 Job(한 번 돌고 끝나야 함)으로 분리 — Git 을 desired state 로 보는 Argo CD self-heal 이 끝난 학습 Job 을 「사라졌다」고 보고 되살려 학습이 반복됐고, batch/Job 을 resource.exclusions 로 관리 대상에서 뺐습니다.",
      "학습 이미지 = 코드 + 의존성이므로, 이미지가 같으면 다시 학습할 이유가 없다고 봤습니다. docker .Id 는 빌드 시각이 섞여 매번 달라서 RootFS.Layers 해시로 비교하고, 이미지로는 안 보이는 데이터 변경은 force_train 으로 명시적으로 트리거합니다.",
      "CI 가 매니페스트의 이미지 태그를 커밋해야 Argo CD 가 움직입니다 — GITHUB_TOKEN 커밋은 다음 워크플로를 트리거하지 않아 gh workflow run 으로 잇고, merge-base 로 중복 호출을 막았습니다. 트러블슈팅 3건은 ADR 로 남겼습니다.",
    ],
    result:
      "git push 한 번으로 CI 빌드 → GHCR → 매니페스트 태그 커밋 → Argo CD Synced 까지 E2E 를 검증했고, 배포 이력과 롤백이 git log · git revert 로 남습니다. 코드 · 의존성이 그대로면 약 1시간짜리 학습을 건너뜁니다. 다만 로컬 k3s · replica 1 에서의 PoC 검증이며, 현장 설비 배포와 HA 는 아직입니다.",
    diagram: GITOPS_DIAGRAM,
    note: "필수 2 의 앵커. 「현장 배포 아님」 확인(2026-10-05). problem 둘째 문장은 GitHub SSOT 설계 의도에서 재구성.",
  },
  {
    id: "go2fit-backend",
    title: "go2fit · 인증과 비동기 잡을 정합성부터 설계한 백엔드",
    problem:
      "3인 팀의 운동 기록 앱은 체육관의 끊기는 네트워크, 수십 초 걸리는 영상 분석, 사용자 계정 토큰을 동시에 다뤄야 했습니다. 기능보다 먼저 「중복 · 유실 · 탈취가 구조적으로 생기지 않는가」를 정해야 했습니다.",
    approach: [
      "토큰 4중 — 원본 Refresh 는 클라이언트에만 두고 DB 에는 SHA-256 해시만(DB 유출 대비), 쓸 때마다 새 쌍으로 Rotation(탈취 토큰의 수명 단축), 이미 쓴 토큰이 다시 오면 그 유저의 모든 토큰을 jti Blacklist(탈취 확정 시 전면 차단). Hypothesis 로 위조 · 만료 · 재사용 경계값 수백 케이스를 자동 생성해 검증했습니다.",
      "체육관의 불안정한 네트워크에서 오프라인 싱크 큐가 같은 요청을 다시 보내므로, X-Idempotency-Key 미들웨어가 중복 요청에 재실행 없이 저장된 응답을 돌려주고, Bulk API 는 최대 100건을 All-or-Nothing 으로 처리합니다.",
      "영상 분석은 수십 초가 걸려 API 요청을 붙잡지 않도록 잡 큐(PENDING → PROCESSING → COMPLETED/FAILED)로 빼고, 클라이언트는 상태만 조회합니다. 얼굴 비식별화도 같은 비동기 경계 뒤의 별도 서비스로 두었습니다.",
    ],
    result:
      "Google Play 출시를 준비 중이며, 출시 요건인 비공개 테스트용 테스터 12명을 확보했습니다. 실사용 지표가 아직 없어 결과는 설계 판단으로 말합니다 — 고아 리소스를 보상 삭제(saga)로 지우라는 티켓은 「세션 find-or-create + 단일 트랜잭션」으로 바꿔 고아가 생기는 창 자체를 없앴고, 상세한 선정 기준이 붙은 로직은 실측해 보니 해당 케이스가 0건이라 구현하지 않았습니다.",
    diagram: GO2FIT_DIAGRAM,
    note: "우대 「인증/인가」 「DB 정합성」. 결과의 saga → 단일 트랜잭션은 필수 3(요구 → 엔지니어링 문제)의 코드 레벨 증거.",
  },
  {
    id: "alignai-agent",
    title: "AlignAI 설명 에이전트 (PoC) · 추론 결과를 현장 언어로 해설한다",
    problem:
      "AI 모델에 익숙하지 않은 현장 오퍼레이터와 유관 부서 엔지니어는 추론값(gap_mm)만으로 「왜 이런 결과인지」 알 수 없었습니다. 결과를 읽을 수 없는 모델은 현장에서 쓰이지 않습니다.",
    approach: [
      "텍스트 API → 멀티모달 → tool use(function calling 직접 구현) → RAG → ReAct 순으로, 각 단계가 앞 단계로 못 푸는 것을 확인한 뒤 올렸습니다.",
      "도구는 run_prediction(자사 U-Net) · analyze_image · search_reference(과거 검사 사례). 루프 제어권을 모델에 넘길수록 풀 수 있는 문제와 디버깅 비용이 함께 커지는 것을 코드로 비교했습니다.",
    ],
    result:
      "검사 로그와 도메인 지식을 데이터화해 두면 에이전트가 모델을 도구로 불러 결과를 현장 언어로 해설할 수 있다는 개념을 증명했습니다. 현업 투입 전이며, 상용 환경의 관측 · 비용 관리는 아직 해보지 않았습니다.",
    diagram: AGENT_DIAGRAM,
    note: "딥오토판 그대로 + 결과 끝 문장만 추가(필수 1 · 우대 Observability 갭을 사례 안에서 인정).",
  },
  {
    id: "job-workflow",
    // WHY 제목에 「채용」을 앞세우지 않나 — 소재가 구직이라 「대량 지원 봇」으로 읽힐 수 있다.
    // 이 사례가 보여줄 것은 소재가 아니라 단계 · 모델 배정 · 사람 검토의 구조다. 본문에서는 숨기지 않는다.
    // WHY 전후 비교가 「주당」인가 — 이전 방식은 1~2주에 한 번 몰아 보는 것이라 하루 단위로는 0 인 날이
    // 대부분이다. 같은 기간으로 맞추려면 주 단위가 가장 작은 공통 단위다.
    title: "공고 분석 LLM 워크플로 · 놓치지 않고 보되, 읽는 것은 좁힌다",
    problem:
      "공고를 찾고 → 경력과 맞는지 판단해야 지원서를 쓸 수 있는데, 1~2주에 한 번 몰아 보느라 그사이 공고는 대부분 놓쳤고 원문 10건 남짓에서 1건을 분석하는 게 한계였습니다. 자격 조건 한 줄을 놓쳐 지원할 수 없는 공고를 한참 분석한 적도 있습니다.",
    approach: [
      "비싼 단계일수록 앞에서 좁힘 — 규칙 트리아지(자격 조건 · 경력 하한, LLM 없음) → Haiku 1턴 채점 → 상위만 Sonnet 이 조사 · 분석 · 초안. 사람이 놓치기 쉬운 자격 조건은 규칙이 먼저 자릅니다.",
      "채점 기준은 Master Resume — 점수가 「내 경력과의 정합성」으로 설명됩니다. 기준은 기존에 손으로 쓴 분석 19건과 대조해 고쳤고(연차 감점 과다 · 직접 구현을 도구 미충족으로 본 것), 기준이 바뀌면 버전을 올려 전량 재채점합니다.",
      "자동화는 초안에서 멈추고 지원 판단은 사람이 합니다. 단계 간은 레코드 파일로만 이어 중간에 멈춰도 다음 실행이 이어 갑니다.",
    ],
    result:
      "2026.09.29 부터 매일 무인 실행. 첫 6일 실측 수집 529 → 통과 438 → 전량 채점 → 분석 · 초안 20건, $34(하루 약 $6). 주 단위로 판단하는 공고가 약 7 → 500건, 분석까지 가는 공고가 1 미만 → 약 20건이 됐고, 제가 매일 읽는 것은 상위 3건입니다. 시간을 못 낸 날의 공고도 점수와 함께 남습니다. 사용자는 저 한 명이고, 자동 점수와 사람 판단의 일치도는 아직 재지 않았습니다.",
    diagram: JOBFLOW_DIAGRAM,
    note: "근거: runs.jsonl 9/29~10/4 집계 · job_score.py RUBRIC v3 주석(기존 JA 19건 대조). 「이전」(1.5주에 원문 ~10 · 분석 1)은 본인 회고. 「~1000건」이 아니라 ~500건인 이유: 하루 수집이 60~100건(중복 제거 후 평균 73).",
  },
];

// WHY 필수 3 + 우대 5 = 8행인가 — 공고의 요건 목록을 그대로 따른다. 주요업무 3줄은 필수와 겹친다.
const TRACKS: TrackRow[] = [
  { track: "상용 환경 LLM · Agent · RAG 프로덕션 구현", level: "△", evidence: "function calling · RAG · ReAct 를 직접 구현한 설명 에이전트(PoC) · 매일 무인으로 도는 개인 LLM 워크플로 — 상용 운영은 아직" },
  { track: "백엔드 API · 데이터 파이프라인 · CI/CD 배포", level: "○", evidence: "학습 → ONNX → Argo CD GitOps 단독 구축 · go2fit PostgreSQL · 비동기 잡 큐 · OIDC CI/CD — 상용 트래픽 운영은 아님" },
  { track: "모호한 요구 → 엔지니어링 문제 · 다직군 소통", level: "○", evidence: "「품질 고도화」를 OK/NG 판정과 평가 인터페이스로 좁히며 4직군 조율 · EPC 3국 이해관계자 조율" },
  { track: "Agent Workflow · Tool Calling · MCP", level: "△", evidence: "Tool Calling 직접 구현 · 스킬 기반 에이전트를 스케줄로 무인 실행 — MCP 는 아직" },
  { track: "RAG · 검색 품질 · DB 설계 · 정합성", level: "○", evidence: "2-Stage 하이브리드 검색 · Ko-BERT 필터 · go2fit FK 체인 · 단일 트랜잭션으로 고아 리소스 원천 차단" },
  { track: "다중 모델 통합 · Model Routing · AI Gateway", level: "△", evidence: "단계 비용에 맞춰 모델 배정(규칙 → Haiku → Sonnet) · BLIP → CLIP → LLM 분리 — 동적 라우팅 · 게이트웨이는 아직" },
  { track: "인증/인가 · 개인정보 보호", level: "○", evidence: "JWT 4중(Rotation · 해시 저장 · jti Blacklist · Idempotency) · 얼굴 비식별화 분리 · IAM OIDC" },
  { track: "정량 평가 · 관측 · 비용/성능 최적화", level: "△", evidence: "운영점 기반 모델 평가 · 실행별 토큰 · 비용 · 시간 로그 · LLM-as-a-Judge 비용 60%↓(교육) — 트레이싱 · 메트릭 관측 체계는 아직" },
];

// ── 렌더링 ──────────────────────────────────────────────────────────────

/** 검토 메모 — 화면 전용 */
function Note({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p className="print:hidden mt-1 rounded bg-amber-50 border-l-2 border-amber-400 px-2 py-1 text-[10.5px] leading-snug text-amber-800">
      {children}
    </p>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400 mb-1.5">
      {children}
    </h2>
  );
}

/** 문서 경계 — PDF 에서 세 문서가 각자 새 페이지에서 시작한다 */
function Part({ label, first, children }: { label: string; first?: boolean; children: React.ReactNode }) {
  return (
    <div className={first ? "" : "mt-16 pt-10 border-t-4 border-neutral-900 print:mt-0 print:pt-0 print:border-0 break-before-page"}>
      <p className="print:hidden mb-6 font-mono text-[11px] font-bold uppercase tracking-widest text-accent">
        {label}
      </p>
      {children}
    </div>
  );
}

/** 문서 머리 — 세 문서가 같은 틀로 시작한다: 문서 제목 → 이 문서의 한 줄 → (이름 · 연락처)
 *
 * WHY 이름이 아니라 문서 제목이 h1 인가 — 1 · 2쪽이 둘 다 「홍승완」으로 시작하면 같은 문서가 반복되는
 *   것처럼 보인다. 문서 제목이 같은 자리 · 같은 크기에 있으면 넘기는 순간 「왜 / 무엇 / 어떻게」가 갈린다.
 * WHY 이름 · 연락처를 지우지 않나 — 인사 담당자는 이력서 한 장만 떼어 보거나 출력한다. 연락처는 남기되
 *   제목 아래 한 줄로 내린다. 포트폴리오는 앞 두 장과 함께 읽히므로 contact 를 생략한다. */
function Header({ title, lead, contact = true }: { title: string; lead: string; contact?: boolean }) {
  return (
    <header className="mb-3">
      <h1 className="text-3xl font-black tracking-tighter leading-[1.15] pb-0.5">{title}</h1>
      <p className="mt-1.5 text-[13px] font-medium text-accent">{lead}</p>
      {contact && (
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-neutral-500">
        <span className="font-bold text-neutral-800">홍승완</span>
        <span className="inline-flex items-center gap-1.5"><Mail size={12} /> {CONTACT.email}</span>
        <a href={CONTACT.githubUrl} className="inline-flex items-center gap-1.5 hover:text-accent">
          <Github size={12} /> {CONTACT.github}
        </a>
        <a href={CONTACT.linkedinUrl} className="inline-flex items-center gap-1.5 hover:text-accent">
          <Linkedin size={12} /> {CONTACT.linkedin}
        </a>
      </div>
      )}
    </header>
  );
}

function ItemRow({ it }: { it: ResumeItem }) {
  return (
    <li className="break-inside-avoid">
      <div className="flex gap-2 text-[11.5px] leading-snug text-neutral-600">
        <span className="mt-[7px] shrink-0 w-1 h-1 rounded-full bg-accent/70" />
        <span>
          <b className="font-bold text-neutral-800">{it.title}</b> — {it.text}
        </span>
      </div>
      <Note>{it.note}</Note>
    </li>
  );
}

/** 회사가 찾는 사람 × 내가 해 온 일 — 지원 동기의 마무리
 *
 * WHY 표 제목이 「공고 요구와 나의 대응」이 아닌가
 *   그 표현은 분석 노트(JA)의 말투다. 지원 동기에서 이 표가 할 일은 「그래서 저를 뽑으셔야
 *   합니다」의 근거를 한눈에 보여주는 것이라, 읽는 사람(회사)을 주어로 두고 내 경험을 답으로 둔다.
 * WHY × 를 남기나 — 해보지 않은 것을 먼저 적어야 ○ 를 믿을 수 있다. 과제 테스트와 포트폴리오
 *   리뷰가 서류 다음 단계라, 서류가 부풀린 것은 두 번째 단계에서 바로 드러난다. */
function FitTable() {
  return (
    // WHY mt-12 + 윗선 — 산문에서 표로 넘어갈 때 여백이 없으면 표가 마지막 문단의 부록처럼 읽힌다
    <section className="mt-12 pt-6 border-t border-neutral-200 break-inside-avoid">
      <h2 className="text-[15px] font-black tracking-tight text-neutral-900">
        {COMPANY} 가 찾는 사람, 제가 이미 해 온 일
      </h2>
      <p className="mt-1.5 mb-4 text-[11px] leading-relaxed text-neutral-500">
        공고의 자격요건과 우대사항 여덟 가지에 제 경험을 하나씩 대 보았습니다. 아직 해보지 않은 것도 그대로 적었습니다 —
        해봤다고 적은 것은 면접에서 그대로 확인하셔도 좋습니다.
        <span className="ml-1.5 whitespace-nowrap text-neutral-400">○ 해봤습니다 · △ 닿아 있습니다 · × 아직입니다</span>
      </p>
      <table className="w-full text-left text-[10.5px] leading-snug border-collapse">
        <thead>
          <tr className="border-b-2 border-neutral-900 text-[10px] font-bold tracking-wider text-neutral-500">
            <th className="pb-1.5 pr-3 font-bold">{COMPANY} 가 찾는 것</th>
            <th className="pb-1.5 pr-3" />
            <th className="pb-1.5 font-bold">제가 해 온 것</th>
          </tr>
        </thead>
        <tbody>
          {TRACKS.map((t) => (
            <tr key={t.track} className="border-b border-neutral-200 align-top">
              <td className="py-2 pr-3 w-[34%] font-medium text-neutral-900">{t.track}</td>
              <td className="py-2 pr-3 w-6 text-center font-bold text-accent">{t.level}</td>
              <td className="py-2 text-neutral-600">{t.evidence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default function PxdDraftPage() {
  return (
    <div className="relative w-full md:max-w-2xl md:mx-auto px-5 md:px-8 pt-8 pb-20 print:p-0 text-neutral-900">
      <p className="print:hidden mb-8 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-[11.5px] text-amber-900">
        검토용 초안 v1 (딥오토판 v5 기반) — 지원 동기는 「왜」(대응표 포함), 이력서는 「무엇」(1쪽), 포트폴리오는 「어떻게」만 말합니다. 노란 메모는 PDF 에서 빠집니다.
      </p>

      {/* ── 1. 지원 동기 ── */}
      <Part label="1 / 3 · Cover Letter" first>
        {/* WHY 헤드라인 대신 지원 부문인가 — 커버레터의 첫 정보는 「누가」보다 「어디에 무엇으로」다.
            헤드라인은 이력서에만 둔다. */}
        <Header title="Cover Letter" lead={`${COMPANY} · ${ROLE}`} />
        <div className="h-px bg-neutral-200 mb-6" />
        <div className="space-y-4">
          {LETTER.map((p, i) => (
            <div key={i} className="break-inside-avoid">
              <p className="text-[12.5px] leading-relaxed text-neutral-700">{p.text}</p>
              <Note>{p.note}</Note>
            </div>
          ))}
        </div>
        <FitTable />
      </Part>

      {/* ── 2. 이력서 ── */}
      <Part label="2 / 3 · Resume">
        <Header title="Resume" lead={HEADLINE} />
        <div className="h-px bg-neutral-200 mb-3" />

        <section className="mb-5">
          <p className="text-[12px] leading-relaxed text-neutral-600">{SUMMARY.text}</p>
          <Note>{SUMMARY.note}</Note>
        </section>

        <section className="mb-5">
          <SectionLabel>경력</SectionLabel>
          <div className="space-y-4">
            {EXPERIENCE.map((exp) => (
              <div key={exp.company}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 mb-1.5">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-[14px] font-black tracking-tight">{exp.company}</span>
                    <span className="text-[11.5px] font-medium text-neutral-500">{exp.role}</span>
                  </div>
                  <span className="font-mono text-[10.5px] text-neutral-400">{exp.period}</span>
                </div>

                {exp.highlight && (
                  // WHY 여기만 박스인가 — 1쪽 이력서에서 눈이 먼저 가는 곳을 하나로 정한다.
                  // 둘 이상 강조하면 어느 것도 강조되지 않는다.
                  <div className="mb-2.5 rounded-md border-l-4 border-accent bg-accent/5 px-3 py-2 break-inside-avoid">
                    <p className="text-[12px] font-bold text-neutral-900">{exp.highlight.title}</p>
                    <p className="mt-0.5 text-[11.5px] leading-snug text-neutral-700">{exp.highlight.text}</p>
                    <ul className="mt-1 space-y-0.5">
                      {exp.highlight.points.map((pt, i) => (
                        <li key={i} className="flex gap-2 text-[11px] leading-snug text-neutral-600">
                          <span className="shrink-0 text-accent">·</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <Note>{exp.highlight.note}</Note>
                  </div>
                )}

                <ul className="space-y-1.5">
                  {exp.items.map((it) => <ItemRow key={it.title} it={it} />)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-5">
          <SectionLabel>프로젝트</SectionLabel>
          <ul className="space-y-1.5">
            {PROJECTS.map((it) => <ItemRow key={it.title} it={it} />)}
          </ul>
        </section>

        <section className="mb-5 break-inside-avoid">
          <SectionLabel>기술</SectionLabel>
          <p className="text-[11px] leading-snug text-neutral-600">{SKILLS}</p>
        </section>

        <section className="break-inside-avoid">
          <SectionLabel>학력 · 자격</SectionLabel>
          <p className="text-[11px] leading-snug text-neutral-600">{EDUCATION}</p>
        </section>

        {/* 하단 웹 링크 — ResumeTemplate 의 CTA 와 같은 모양. 남는 여백을 쓰는 자리다 */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t-2 border-accent/20 break-inside-avoid">
          <span className="text-[11px] text-neutral-500">
            프로젝트별 아키텍처 · 실험 기록 · 데모와 엔지니어링 노트 전문
          </span>
          <a
            href={CONTACT.webUrl}
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-[12.5px] font-black text-white print:shadow-none"
          >
            <Globe size={13} /> {CONTACT.web} <ArrowRight size={14} />
          </a>
        </div>
      </Part>

      {/* ── 3. 포트폴리오 ── */}
      <Part label="3 / 3 · Portfolio">
        <Header title="Portfolio" lead="이력서 항목 중 과정과 판단을 설명할 필요가 있는 네 가지입니다." contact={false} />
        <div className="h-px bg-neutral-200 mb-6" />

        <div className="space-y-10">
          {CASES.map((c) => (
            // WHY 사례마다 새 페이지를 강제하지 않나 — v2 는 사례당 1쪽이라 여백이 반씩 남았다.
            // 사례 안에서만 끊기지 않게 하고(break-inside-avoid) 두 사례가 한 쪽에 앉게 둔다.
            <article key={c.id} className="break-inside-avoid">
              <h3 className="text-[15px] font-black tracking-tight">{c.title}</h3>
              <Note>{c.note}</Note>

              <div className="mt-2.5 space-y-2.5 text-[11.5px] leading-normal text-neutral-700">
                <p><b className="font-bold text-neutral-900">문제</b> — {c.problem}</p>
                <ul className="space-y-1">
                  {c.approach.map((a, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="shrink-0 font-mono text-[10px] text-neutral-400">{j + 1}</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
                {c.diagram && (
                  // WHY svg 높이 상한 — 사이트 다이어그램은 웹 상세 페이지용이라 세로로 길다.
                  // viewBox 가 있어 높이만 누르면 비율대로 줄어든다.
                  <div className="[&_svg]:mx-auto [&_svg]:max-h-[20rem] print:[&_svg]:max-h-[13rem]">
                    <Mermaid chart={c.diagram} />
                  </div>
                )}
                <p className="font-medium text-neutral-900"><b className="font-bold">결과</b> — {c.result}</p>
              </div>
            </article>
          ))}
        </div>
      </Part>
    </div>
  );
}
