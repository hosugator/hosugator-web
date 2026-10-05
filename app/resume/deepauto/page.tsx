// app/resume/deepauto/page.tsx — 딥오토 AI Engineer 제출용 통합 초안 (지원 동기 + 이력서 + 포트폴리오)
//
// WHY 세 문서가 서로 다른 것만 말하나  ← v3 에서 가장 중요한 결정
//   v2 는 같은 사실(격자 인덱싱, 라벨 α, 운영점)을 세 문서가 각자 반복해 10쪽이 됐다. 인내심 없는
//   인사 담당자에게 10쪽은 그 자체로 허들이다. 그래서 역할을 가른다.
//     지원 동기   왜 맞는가 — JA 의 판단 근거만, 숫자 없이 짧게
//     이력서      무엇을 했나 — 1쪽. 핵심 하나만 강조하고 나머지는 한 줄. 자세한 것은 → P# 로 넘긴다
//     포트폴리오  어떻게 했나 — 숫자·과정·다이어그램은 여기에만
//   같은 사실이 두 곳에 필요하면 한 곳은 가리키기만 한다.
//
// WHY 한 파일인가 — 검토하며 지우는 단계라, 세 문서를 한 화면에서 위→아래로 읽어야 중복이 보인다.
//   안정되면 ResumeTemplate · CoverLetterTemplate 로 나눈다.
//
// WHY note 가 있나 — 검토용(JD 대응 · 출처 · 확인 필요). print:hidden 이라 PDF 에는 안 찍힌다.
//
// WHY 로컬 전용인가 — output: 'export' 라 main 에 푸시되면 S3 로 올라간다. 이 파일은 로컬 브랜치
//   draft/deepauto 에만 있다(v1 718ac84 · v2 5d561bc).
//
// 근거: 볼트 [[Master Resume]] · [[Job Analysis - DeepAuto]] · [[GV-001 라벨 기준 v4 측정 기록]]
//       · [[라벨 재검수를 3인 3회 4단계 순서형으로 한다]] · 사이트 data/projectDetails.ts
// Pic-Tag 는 넣지 않는다 — 그 프로젝트의 ML 엔지니어가 본인이 아니다(resumeLevitVision.ts 참고).
//
// PDF: npm run dev 를 띄운 상태에서  npm run resume:pdf -- deepauto  → resumes/resume-deepauto.pdf

import type { Metadata } from "next";
import { ArrowRight, Github, Globe, Linkedin, Mail } from "lucide-react";
import Mermaid from "@/components/ui/Mermaid";

export const metadata: Metadata = {
  title: "Draft — 딥오토 AI Engineer",
  robots: { index: false, follow: false },
};

// WHY ResumeTemplate 의 CONTACT 를 import 하지 않나
//   ResumeTemplate.tsx 는 "use client" 모듈이다. 서버 컴포넌트가 거기서 컴포넌트가 아닌 값을
//   가져오면 실제 객체가 아니라 클라이언트 참조 프록시를 받아 값이 비어 찍힌다(v1 첫 PDF).
//
// WHY 웹 링크가 추적 경로(/r/deepauto/)인가
//   CloudFront(OAC) 뒤 S3 로그에는 경로만 남으므로, 이 이력서를 받은 쪽만 아는 경로가
//   「링크가 열렸나」의 유일한 증거다. 표시는 hosugator.com 그대로 두고 목적지만 바꾼다.
//   전제: lib/outreach.ts 의 'deepauto' 항목이 main 에 배포돼 있어야 한다 — 없으면 404.
//   그 항목은 별도 커밋이라 초안 페이지 없이 main 으로 cherry-pick 할 수 있다.
const CONTACT = {
  email: "hosugator@gmail.com",
  github: "github.com/hosugator",
  githubUrl: "https://github.com/hosugator",
  linkedin: "linkedin.com/in/seungwanhong",
  linkedinUrl: "https://linkedin.com/in/seungwanhong",
  web: "hosugator.com",
  // trailingSlash: true 라 끝 슬래시 필수(ResumeTemplate 의 CONTACT.webUrl 과 같은 규칙)
  webUrl: "https://hosugator.com/r/deepauto/",
};

// ── 타입 ────────────────────────────────────────────────────────────────
type Line = { text: string; note?: string };

// WHY 포트폴리오 참조 표시(→ P1)가 없나 — 4쪽짜리 문서에서 번호 표지는 가독성만 해친다.
// 사례 제목이 이력서 항목 이름과 같으므로 읽는 사람이 이름으로 찾는다.
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

// ── 1. 지원 동기 — 왜 맞는가. 숫자는 이력서·포트폴리오에 두고 여기서는 쓰지 않는다 ─────────
const LETTER: Line[] = [
  {
    text: "딥오토 공고에서 멈춘 문장은 「데이터 내부의 논리적 구조를 복원한다」였습니다. 지금 DTK 에서 하는 일이 그 작은 판입니다. 검출기가 내놓은 렌즈 수백 개의 좌표에 격자의 (행, 열) 자리를 매겨 배열 구조를 복원하고, 그 과정에서 규칙이 맡을 것과 모델이 맡을 것의 경계를 정해 왔습니다. 공고의 「Rule-based 전처리와 AI 모델을 결합한 하이브리드 추론」을 저는 그 경계를 정하는 일로 읽었습니다.",
    note: "겨냥: 직무 개요 + Track 1 하이브리드 · 객체 간 연결 관계. 상세는 포트폴리오 「격자 인덱싱」.",
  },
  {
    text: "모델을 만든 다음 남는 문제는 그 결과를 누가 읽느냐입니다. 모델을 모르는 현장 오퍼레이터와 유관 부서 엔지니어를 위해, 로그와 도메인 지식을 데이터로 만들어 두면 에이전트가 모델을 도구로 불러 추론 결과를 현장 언어로 해설할 수 있다는 것을 PoC 로 증명했습니다. 딥오토가 플랜트에 AI 를 들이며 공정 상태를 자연어로 보고하려는 이유와 같은 문제라고 봅니다. 환경공학을 전공하고 연소 설비 EPC 프로젝트를 시운전까지 관리한 경력도 그 현장의 언어를 아는 데서 쓰입니다.",
    note: "겨냥: Track 1 에이전트(PoC) + Track 4 자연어 보고 · 도메인. 상세는 포트폴리오 「설명 에이전트」.",
  },
  {
    text: "최근 가장 공을 들인 것은 모델이 아니라 모델을 재는 기준입니다. 라벨이 한 사람의 버릇을 담지 않도록 여러 사람이 독립으로 판정하는 절차를 세웠고, 모델은 한 점수가 아니라 「미탐을 이만큼 묶으면 과탐은 얼마」라는 현장의 언어로 비교했습니다. 그 대가로 여러 아키텍처를 비교해 본 시간은 적었지만, 평가 기반을 먼저 세워 두었기에 어떤 모델을 올리든 같은 저울에서 판정할 수 있습니다.",
    note: "겨냥: Track 2 평가 체계 · 자격요건 가설 → 실험 → 검증. 나머지 갭(SFT·DPO · 도면 파싱 · 시뮬레이터)은 바로 아래 대응표의 × 가 말한다. 상세는 포트폴리오 「라벨 기준과 평가 기준」.",
  },
  {
    text: "딥오토에서 산업 문서의 구조를 복원하는 일을, 규칙과 모델의 경계와 그것을 잴 기준을 정하는 데서부터 함께 하고 싶습니다.",
  },
];

// ── 2. 이력서 — 1쪽. 강조 하나, 나머지 한 줄 ─────────────────────────────
const HEADLINE =
  "AI Engineer · 검출 결과에서 구조를 복원하고, 그 결과를 현장 언어로 해설합니다";

const SUMMARY: Line = {
  text: "제조 현장의 비전 검사를 규칙 기반에서 딥러닝으로 옮기고, 모델을 재는 라벨·평가 기준과 모델 결과를 현장 언어로 해설하는 에이전트 PoC 까지 만들었습니다. 글로벌 EPC 연소 설비 PM 출신이라 공정 설비의 언어에 익숙합니다.",
  note: "2문장으로 줄였다 — 「왜 맞는가」는 지원 동기가 말한다.",
};

const EXPERIENCE: Experience[] = [
  {
    company: "DTK",
    role: "AI Engineer",
    period: "2026.03 ~ 현재",
    highlight: {
      title: "GV-001 MLA 외관 검사기",
      text: "검출 좌표에서 배열 구조를 복원하고, 그 위에 올라갈 모델을 재는 기준을 세웠습니다.",
      points: [
        "격자 인덱싱 — 검출 순번 대신 격자 절대 자리 (행, 열)을 매겨, 고배율 1868자리 두 경로 불일치 0 · 회전 2.9° · 이동 130px 까지 오식별 0",
        "라벨 기준 — 라벨 기준과 라벨링 툴을 만들어 3인 × 3회 4단계 순서형 판정, 라벨러 간 순서형 α 0.588 → 0.723",
        "평가 기준 — 웨이퍼 단위 교차검증과 운영점으로 비교, 미탐 5% 에서 과탐 21% → 11% · PatchCore 설비 배포 후 현장 진단",
      ],
      note: "이력서의 유일한 강조 블록. JA 에서 가장 강한 매칭(Track 1 구조 복원) + 사용자가 가장 공들인 축(라벨·평가)을 한 프로젝트로 묶었다.",
    },
    items: [
      {
        title: "AlignAI 설명 에이전트 (PoC)",
        text: "자사 U-Net 을 도구로 호출해 추론 결과를 현장 언어로 해설 · function calling → ReAct 직접 구현",
      },
      {
        title: "AlignAI 비전",
        text: "OpenCV 규칙 기반 정렬을 U-Net 세그멘테이션으로 대체(탐지율 100% · CPU ~330ms), 학습 → ONNX → Argo CD GitOps 단독 구축",
        note: "v2 포트폴리오 사례였으나 이력서 한 줄로 내렸다.",
      },
      {
        title: "V1-AOI",
        text: "라벨 없는 렌즈 이물 검사를 PatchCore 비지도 이상탐지로(Image AUROC 0.9906), circle-crop 전처리로 배경 오반응 제거",
        note: "v2 포트폴리오 사례였으나 이력서 한 줄로 내렸다. 우대 「ML/Vision 기초」.",
      },
      {
        title: "Edge AI LMR (설계)",
        text: "렌즈 열성형 공정의 10ms PLC 데이터를 공정 단위 키로 잇고 데이터 온도별로 계층을 나눈 아키텍처를 설계해 현장 검토를 요청했고, 우선순위가 밀린 사이 그 설계 경험을 AlignAI · GV-001 에 썼습니다",
        note: "구현 없음 — 설계 후 현장 의견 요청 상태(2026-09-28 정정). AUROC 99.99% 등 구현 수치는 전부 뺐다.",
      },
      {
        title: "ERP 백업 자동화",
        text: "API 없는 레거시 ERP 의 결재 문서 수만 건을 Playwright 로 무인 추출(정합성 100%)",
        note: "삭제 1순위 후보 — JD 연결 약함.",
      },
    ],
  },
  {
    company: "go2fit",
    role: "3인 팀 · Backend & Infra",
    period: "2025.10 ~ 현재",
    items: [
      {
        title: "피트니스 소셜 앱",
        text: "PostgreSQL 스키마 · JWT 보안 · 비동기 영상 분석 큐 설계, Google Play 비공개 테스트 운영",
        note: "JD 직접 연결 없음. 삭제 후보.",
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
        text: "수십억 규모 대체 프로젝트를 시운전까지 총괄, 미·인·한 3국 기술 조율로 목표 마진 4% 초과",
        note: "Track 4 도메인 · 협력사 커뮤니케이션.",
      },
    ],
  },
];

const PROJECTS: ResumeItem[] = [
  { title: "Dotodo", text: "음성 RAG 추천 · LLM-as-a-Judge 게이팅으로 API 비용 60% 절감", note: "확인: LangChain 사용 범위." },
  { title: "Sodam Diary", text: "BLIP → CLIP → LLM 사진 해설 · 운영비 30% 절감 · 한국장애인해커톤 본선", note: "직무 개요 「VLM/LLM」. 확인: 본인 담당 범위." },
  { title: "Dorosee", text: "YOLOv8 응급상황 탐지 UGV · Recall 92% · 2025 UWC 해커톤 대상", note: "우대 「객체 탐지」. 확인: 본인 담당 범위." },
];

const SKILLS =
  "Python · PyTorch · OpenCV · PatchCore · U-Net · ONNX Runtime · LLM function calling · FastAPI · Docker · k3s · Argo CD · GitHub Actions";

const EDUCATION =
  "경희대학교 환경공학 학사 · Intel AI for Future Workforce (KDT, 2025.04~10) · 대기환경기사 · 정보처리기사(필기) · OPIc IH";

// ── 3. 포트폴리오 — 숫자·과정·다이어그램은 여기에만 ─────────────────────────

// 확인 필요: 단계 순서는 Master Resume 서술로 재구성했다. lens_grid.py 4함수의 실제 경계와
// 맞는지 보고 노드 이름을 함수 이름으로 바꾸는 편이 더 정확하다.
const GRID_DIAGRAM = `flowchart LR
  D["원 검출 · 좌표 점 집합"] --> P["피치 · 중앙값"]
  P --> R["배열 기울기 · 평균"]
  R --> O["격자 원점 · 각도 평균(순환량)"]
  O --> IDX["(행, 열) 절대 자리"]
  IDX --> G{"잔차 가드"}
  G -->|"통과"| OUT["크롭 이름 = 격자 자리"]
  G -->|"90° 회전 등"| ERR["예외 · 자동 보정 안 함"]
  IDX -.->|"클램프 오검출"| ST["is_stray 로 보고"]`;

// WHY TB 바깥에 LR 안쪽인가 — 한 줄 LR 로 두면 단계가 9개라 A4 폭에 맞추느라 글자가
// 읽을 수 없게 줄어든다(v2 첫 PDF). 라벨 단계와 비교 단계를 두 줄로 접었다.
const LABEL_EVAL_DIAGRAM = `flowchart TB
  subgraph LABEL["라벨 · 3인 × 3회 독립 · 모델 점수 비공개"]
    direction LR
    R["4단계 순서형 판정"] --> M1["라벨러별 중앙값"] --> M2["라벨러 간 중앙값"] --> C["합의 라벨 + 폭 · 갈림"]
  end
  subgraph JUDGE["모델 비교"]
    direction LR
    BANK[("정상 뱅크 · 확실 정상 만장일치")] --> PC["PatchCore"] --> CV["웨이퍼 단위 교차검증"] --> OP["운영점 · 미탐 5% 에서 과탐"]
  end
  LABEL --> JUDGE`;

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

const CASES: CaseStudy[] = [
  {
    id: "gv001-grid",
    title: "GV-001 · 검출 결과에서 배열 구조를 복원하는 격자 인덱싱",
    problem:
      "크롭 이름이 검출 순번이라 검출 순서가 바뀔 때마다 같은 렌즈가 다른 번호가 됐습니다(어제 45번, 오늘 51번). 검사시트 대조 · 위치별 통계 · 구조적 제외가 전부 성립하지 않았습니다.",
    approach: [
      "격자의 절대 자리 (행, 열)을 부여 — 「그 행의 왼쪽부터」로 매기면 누락과 오검출이 겹칠 때 개수는 맞는데 전부 한 칸 밀리고, 개수 검사로는 잡히지 않습니다.",
      "요약 통계를 오차의 성질로 선택 — 피치는 중앙값(오검출 39% 까지 버팀), 기울기는 평균, 순환량인 원점은 각도로 바꿔 평균.",
      "추론 금지 — 90° 회전은 예외, 클램프 오검출은 is_stray 보고, 잘린 방향은 추론하지 않음. 실측에서 왼쪽이 잘렸는데 빈 자리는 오른쪽 끝에 나타났습니다.",
    ],
    result:
      "광각 10장 전수 187자리 · 15행 · 141대상 일치. 고배율 19625×19617 캔버스에서 두 인덱싱 경로 1868자리 불일치 0, 회전 2.9° · 배율 5% · 이동 130px 까지 오식별 0.",
    diagram: GRID_DIAGRAM,
    note: "딥오토의 「도면 구조 복원」과 문제 모양이 가장 닮았다. 이미지 없이 수치만 씀(기밀).",
  },
  {
    id: "gv001-label-eval",
    title: "GV-001 · 모델보다 먼저 세운 라벨 기준과 평가 기준",
    problem:
      "라벨이 한 사람이 한 번 찍은 것이라, AUROC 0.82~0.92 중 얼마가 결함을 찾는 능력이고 얼마가 그 사람의 버릇을 흉내낸 것인지 가를 수 없었습니다. 소규모 팀에서 놓치기 쉬운 라벨 오염입니다.",
    approach: [
      "라벨 기준과 간단한 라벨링 툴(모델 점수 비공개)을 만들어 3인이 각자 3회 독립 판정 — 1회만 하면 「사람이 다르게 본다」와 「과제가 애매하다」를 가를 수 없습니다.",
      "4단계 순서형(확실 · 애매 × 정상 · 이상)과 2단계 중앙값 해소(사람 안 → 사람 사이, 동률은 이상 쪽). 「미정」 한 칸은 쓰레기통이 되고, 다수결은 순서를 버립니다.",
      "모델은 웨이퍼 단위 교차검증 · 미탐 5% 운영점의 과탐으로 비교 — AUROC 를 +0.006 올리고 과검을 전 구간에서 악화시킨 전처리는 기각했습니다.",
    ],
    result:
      "기준 개정으로 순서형 α 0.588 → 0.723. 뱅크 20 → 38장은 AUROC +0.005 였지만 미탐 5% 에서 과탐 21% → 11%. 합의한 자리 AUROC 0.9939 · 갈린 자리 0.73 — 성능 상한이 모델이 아니라 라벨의 재현성에 걸려 있음을 특정했습니다.",
    diagram: LABEL_EVAL_DIAGRAM,
    note: "근거: v4 측정 기록 1·4·5·14절 · AUROC 노트. 확인: α 가 Krippendorff 인지, 「미탐 5%·과탐 20%」 목표를 현장과 합의한 기록이 있는지.",
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
      "검사 로그와 도메인 지식을 데이터화해 두면 에이전트가 모델을 도구로 불러 결과를 현장 언어로 해설할 수 있다는 개념을 증명했습니다. 현업 투입 전입니다.",
    diagram: AGENT_DIAGRAM,
    note: "PoC 로 한정. hosugator.com 데모에 붙어 있음.",
  },
  {
    id: "edge-ai-lmr",
    // WHY 「설계」를 제목에 박나 — 구현하지 않았다(2026-09-28 정정). 이 사례가 주장하는 것은
    // 결과가 아니라 공정 데이터를 어떻게 나누고 잇는지 미리 판단해 둔 경험이다.
    title: "Edge AI LMR (설계) · 공정 데이터를 잇는 키와 온도별 계층",
    problem:
      "렌즈 열성형 공정의 PLC 가 10ms 주기로 온도 · 압력 · 전력을 내지만, 타임스탬프만으로는 여러 센서를 한 사이클로 묶을 수 없어 이상탐지 · 품질예측 · 처방 어느 것도 시작할 수 없었습니다.",
    approach: [
      "공정 한 사이클을 식별하는 Cycle_ID 를 먼저 정의해 설비부터 클라우드까지 모든 계층이 같은 키로 조인되게 설계 — 인프라보다 데이터 모델이 먼저입니다.",
      "데이터를 온도별로 나눠 경로를 달리함 — 즉시 반응해야 하는 것(MQTT Binary), 분석으로 흘려보낼 것(gRPC 스트리밍), 재학습용으로 쌓을 것(Parquet 배치).",
      "공정 지식에서 출발 — 무엇을 이상으로 보고 어떤 Set-point 를 조정해야 하는지부터 현장 언어로 정리한 뒤 그 위에 모델 체인을 얹었습니다.",
    ],
    result:
      "설계를 현장에 공유하고 의견을 요청한 상태에서 우선순위가 밀려 구현은 하지 않았습니다. 다만 이때 미리 정리한 공정 지식과 「키를 먼저 정하고, 데이터 온도에 따라 경로를 나눈다」는 판단은 이후 AlignAI 와 GV-001 의 데이터 · 저장 설계에서 그대로 썼습니다.",
    // WHY 다이어그램이 없나 — 사이트의 edge-ai-lmr 다이어그램은 세로로 길어 A4 반쪽에 누르면
    // 읽을 수 없고(v3 첫 PDF), 구현되지 않은 체인을 그림으로 보여주면 구현된 것처럼 읽힌다.
    note: "구현 없음. 「AlignAI · GV-001 에서 그대로 썼다」의 구체 사례를 하나 대면 강해진다 — 예: GV-001 촬영–저장 경계(폴더 이름은 불변 정보만) 가 그 판단의 재사용인지 확인.",
  },
];

// WHY 지원 동기 하단에 두나 — 공고를 네 갈래 요구로 읽고 각각에 내가 어디까지 닿는지를 한 표로
// 보여주는 것이 「왜 맞는가」의 가장 짧은 증거다. × 를 숨기지 않는 것이 표의 신뢰를 만든다.
// WHY 트랙 번호를 안 쓰나 — 「Track 2」 는 공고를 방금 읽은 사람에게만 뜻이 있다. 요구 자체를 쓴다.
const TRACKS: TrackRow[] = [
  { track: "에이전트 설계 — Planning · Memory · Tool-Use", level: "○", evidence: "자사 비전 모델을 도구로 호출하는 설명 에이전트 — function calling · ReAct 직접 구현(PoC)" },
  { track: "Rule 전처리 + AI 하이브리드 추론", level: "○", evidence: "검출 좌표에 격자 자리를 매기는 추론 금지 규칙 · OpenCV → U-Net 전환 · circle-crop + PatchCore" },
  { track: "PDF · Excel · CAD 문서 구조 분석", level: "×", evidence: "도면 파싱 경험 없음. 가장 가까운 것은 검출 좌표에서 배열 구조를 복원한 격자 인덱싱" },
  { track: "LLM 파인튜닝 · 강화학습 (SFT · DPO)", level: "×", evidence: "아직 해보지 않았습니다" },
  { track: "벤치마크 평가 체계", level: "△", evidence: "고정 평가셋 · 웨이퍼 단위 교차검증 · 운영점 비교 — 비전 모델 평가이지 LLM 벤치마크는 아님" },
  { track: "학습 가능한 정제 데이터셋", level: "○", evidence: "3인 × 3회 순서형 라벨링 · 중앙값 해소 · 합의 강도 기록으로 라벨 오염 방지" },
  { track: "데이터 레이크하우스 · 분산 처리", level: "△", evidence: "공정 데이터 온도별 계층 설계(구현 전) · 촬영–저장 경계 설계 — 레이크하우스 · 분산 처리 규모는 아님" },
  { track: "화공 플랜트 설계 · 해석 에이전트", level: "△", evidence: "환경공학 전공 · 연소 설비 EPC PM · 공정 Set-point 처방 루프 설계 — 공정 시뮬레이터 경험 없음" },
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

function Header() {
  return (
    <header className="mb-3">
      <h1 className="text-3xl font-black tracking-tighter leading-[1.15] pb-0.5">홍승완</h1>
      <p className="mt-1.5 text-[13px] font-medium text-accent">{HEADLINE}</p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-neutral-500">
        <span className="inline-flex items-center gap-1.5"><Mail size={12} /> {CONTACT.email}</span>
        <a href={CONTACT.githubUrl} className="inline-flex items-center gap-1.5 hover:text-accent">
          <Github size={12} /> {CONTACT.github}
        </a>
        <a href={CONTACT.linkedinUrl} className="inline-flex items-center gap-1.5 hover:text-accent">
          <Linkedin size={12} /> {CONTACT.linkedin}
        </a>
      </div>
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

/** 딥오토가 찾는 사람 × 내가 해 온 일 — 지원 동기의 마무리
 *
 * WHY 표 제목이 「공고 요구와 나의 대응」이 아닌가
 *   그 표현은 분석 노트(JA)의 말투다. 지원 동기에서 이 표가 할 일은 「그래서 저를 뽑으셔야
 *   합니다」의 근거를 한눈에 보여주는 것이라, 읽는 사람(딥오토)을 주어로 두고 내 경험을 답으로 둔다.
 * WHY × 를 남기나 — 해보지 않은 것을 먼저 적어야 ○ 를 믿을 수 있다. 과제 테스트와 포트폴리오
 *   리뷰가 서류 다음 단계라, 서류가 부풀린 것은 두 번째 단계에서 바로 드러난다. */
function FitTable() {
  return (
    // WHY mt-12 + 윗선 — 산문에서 표로 넘어갈 때 여백이 없으면 표가 마지막 문단의 부록처럼 읽힌다
    <section className="mt-12 pt-6 border-t border-neutral-200 break-inside-avoid">
      <h2 className="text-[15px] font-black tracking-tight text-neutral-900">
        딥오토가 찾는 사람, 제가 이미 해 온 일
      </h2>
      <p className="mt-1.5 mb-4 text-[11px] leading-relaxed text-neutral-500">
        공고가 말한 역할 여덟 가지에 제 경험을 하나씩 대 보았습니다. 아직 해보지 않은 것도 그대로 적었습니다 —
        해봤다고 적은 것은 면접에서 그대로 확인하셔도 좋습니다.
        <span className="ml-1.5 whitespace-nowrap text-neutral-400">○ 해봤습니다 · △ 닿아 있습니다 · × 아직입니다</span>
      </p>
      <table className="w-full text-left text-[10.5px] leading-snug border-collapse">
        <thead>
          <tr className="border-b-2 border-neutral-900 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            <th className="pb-1.5 pr-3 font-bold">딥오토가 찾는 것</th>
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

export default function DeepautoDraftPage() {
  return (
    <div className="relative w-full md:max-w-2xl md:mx-auto px-5 md:px-8 pt-8 pb-20 print:p-0 text-neutral-900">
      <p className="print:hidden mb-8 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-[11.5px] text-amber-900">
        검토용 초안 v4 — 지원 동기는 「왜」(대응표 포함), 이력서는 「무엇」(1쪽), 포트폴리오는 「어떻게」만 말합니다. 노란 메모는 PDF 에서 빠집니다.
      </p>

      {/* ── 1. 지원 동기 ── */}
      <Part label="1 / 3 · 지원 동기" first>
        <Header />
        <div className="h-px bg-neutral-200 mb-4" />
        <div className="mb-6 flex items-baseline gap-3 text-[12px]">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400">지원 부문</span>
          <span className="font-bold">딥오토(DeepAuto) · AI Engineer</span>
        </div>
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
      <Part label="2 / 3 · 이력서">
        <Header />
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
      <Part label="3 / 3 · 포트폴리오">
        <h1 className="text-2xl font-black tracking-tighter">Portfolio</h1>
        <p className="mt-1 mb-6 text-[11.5px] text-neutral-500">
          이력서 항목 중 과정과 판단을 설명할 필요가 있는 네 가지입니다.
        </p>

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
