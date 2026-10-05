// app/resume/agilesoda/page.tsx — 애자일소다 AI Platform Engineer 제출용 통합 초안 (Cover Letter + Resume + Portfolio)
//
// 뼈대는 pxd판(draft/pxd)을 그대로 쓴다 — 세 문서 헤더 틀, 대응표 ○△×, print:hidden 검토 메모.
//
// WHY v2 에서 앵커를 바꿨나  ← 이 파일에서 가장 중요한 결정
//   v1 은 GPU 드라이버 freeze(일회성 · 오래전 사건)를 앵커로 세웠으나,
//   지금 하는 일을 대표하지 않아 뺐다. 대신 둘을 세운다.
//     ① go2fit 운영 서버 — 실제로 「운영」하며 겪은 일(산출물 80% 소실 실측 · 조용한 롤백 · 스키마 드리프트).
//        필수 1 「Docker · K8s 배포 · 운영」과 필수 4 「로그 · 메트릭 근거 원인 규명」을 한 프로젝트가 덮는다.
//     ② GPU 를 워크로드로 산정한 기록 — 주요업무 「GPU 를 포함한 하드웨어 사양 산정」「파드 리소스 산정」에
//        실측값(루프라인 · 해상도별 VRAM · 병목 재측정)으로 답한다. 드라이버 · 스택 경계 이해가 받친다.
//
// WHY 「고객 환경 운영」이 아니라고 계속 밝히나 — go2fit 은 테스터 대상 운영 서버, 단일 노드 k3s 다.
//   금융 · 공공 온프레미스 · 다중 노드라고 읽히면 면접에서 깨진다.
//
// WHY 「CloudFront 경유 제한」을 쓰지 않나 — AWS EC2 시절 설정이었고 지금은 CORS 뿐이다(2026-10-05 실측).
//
// 근거: go2fit-backend 커밋(GF-135~140 · 151 · 153 · 184) · 볼트 GPU 노트 7건 · [[Master Resume]]
//
// PDF: npm run dev 를 띄운 상태에서  npm run resume:pdf -- agilesoda  → resumes/resume-agilesoda.pdf

import type { Metadata } from "next";
import { ArrowRight, Github, Globe, Linkedin, Mail } from "lucide-react";
import Mermaid from "@/components/ui/Mermaid";

export const metadata: Metadata = {
  title: "Draft — 애자일소다 AI Platform Engineer",
  robots: { index: false, follow: false },
};

const COMPANY = "애자일소다";
const ROLE = "AI Platform Engineer";

const CONTACT = {
  email: "hosugator@gmail.com",
  github: "github.com/hosugator",
  githubUrl: "https://github.com/hosugator",
  linkedin: "linkedin.com/in/seungwanhong",
  linkedinUrl: "https://linkedin.com/in/seungwanhong",
  web: "hosugator.com",
  // 전제: lib/outreach.ts 에 'agilesoda' 항목이 main 에 배포돼 있어야 한다 — 없으면 404
  webUrl: "https://hosugator.com/r/agilesoda/",
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

// ── 1. Cover Letter — 왜 맞는가. 숫자 없이 ─────────────────────────────────
const LETTER: Line[] = [
  {
    text: "애자일소다 공고에서 멈춘 문장은 「GPU 를 포함한 하드웨어 사양 산정」과 「워크로드 특성에 따른 파드 리소스 산정」이었습니다. 학습 속도를 개선하며 배운 것이 바로 그 「특성에 따라」였습니다. 같은 GPU 에서도 입력 해상도를 바꾸면 병목이 연산에서 메모리 대역폭으로, 다시 VRAM 으로 옮겨 갔고, 한 조건에서 「VRAM 은 제약이 아니다」가 다른 조건에서는 「VRAM 이 유일한 제약」이 됐습니다. 그래서 사양은 표가 아니라 워크로드를 재서 정해야 한다고 생각하게 됐고, 개선할 때마다 병목을 다시 재는 습관이 생겼습니다.",
    note: "겨냥: 주요업무 「사양 산정 · 파드 리소스 산정」. 상세는 포트폴리오 「GPU 를 워크로드로 산정」.",
  },
  {
    text: "운영은 3인 팀 앱의 백엔드 · 인프라를 맡으며 배웠습니다. 단일 노드 k3s 에 GitLab CI 로 배포하는 서버를 테스터 대상으로 운영하면서, 배포할 때마다 분석 결과 파일이 조용히 사라지고 있던 것을 실측으로 찾아 영속 볼륨으로 막았고, 새 서버로 옮길 때 이미지 태그가 낡은 코드를 가리켜 조용히 롤백될 뻔한 것을 digest 고정으로 막았습니다. 장애가 나기 전에 「지금 실제로 무엇이 떠 있는가」를 확인하는 것이 운영의 대부분이라는 것을 그때 알았습니다.",
    note: "겨냥: 필수 1 · 4 + 「함께 하는 일」 재발 방지. 상세는 포트폴리오 「go2fit 운영 서버」.",
  },
  {
    text: "아직 없는 것도 분명합니다. 고객 환경에서 다중 노드 클러스터를 운영하거나 vLLM · Triton 으로 서빙해 본 적은 없고, 컨테이너 취약점을 점검해 조치한 경험도 없습니다. 다만 드라이버는 호스트의 커널 영역이라 컨테이너가 담지 못하고, GPU 는 CPU 처럼 잘게 나눠 쓰기 어렵다는 것을 직접 부딪혀 알게 된 만큼, 고객마다 다른 하드웨어에 같은 품질로 설치되는 표준이 왜 어려운지는 이해하고 있습니다. 그 표준을 만드는 일을 이 팀에서 배우고 싶습니다.",
    note: "겨냥: 갭 인정 + 「모든 고객 배포 환경에서 같은 품질」(팀 소개 첫 줄). 상세는 포트폴리오 「GPU 스택의 경계」.",
  },
  {
    text: "Claude Code 를 매일 무인으로 돌리는 파이프라인을 직접 운영해 온 만큼, AI 도구가 표준인 환경에서 배포 · 운영 표준을 함께 세우고 싶습니다.",
    note: "원문 「Claude Code, Codex 등 AI 도구가 표준 업무 환경」을 받는다.",
  },
];

// ── 2. Resume — 1쪽. 강조 하나, 나머지 한 줄 ─────────────────────────────
const HEADLINE =
  "AI Platform Engineer · 무엇이 실제로 떠 있는지 확인하고, 자원은 워크로드를 재서 정합니다";

const SUMMARY: Line = {
  text: "단일 노드 k3s 운영 서버의 배포 · 데이터 · 장애를 맡아 왔고, GPU 학습 워크로드의 병목을 연산 · 대역폭 · VRAM 으로 나눠 실측해 왔습니다. 글로벌 EPC PM 으로 설비를 시운전까지 넘기며 「현장에서 같은 품질로 돌아가는가」를 책임졌던 경험이 배포 표준을 보는 기준이 됐습니다.",
  note: "2문장. 갭은 Cover Letter 가 말한다.",
};

const EXPERIENCE: Experience[] = [
  {
    company: "DTK",
    role: "AI Engineer",
    period: "2026.03 ~ 현재",
    items: [
      {
        title: "GPU 학습 워크로드 산정",
        text: "RTX A4000 에서 해상도별 VRAM · 에폭 시간을 실측해(512: 3.2GB · 1160: 14.9GB · 3108: 배치 1 도 17.8GB) 병목이 대역폭 → VRAM 으로 바뀌는 지점을 특정, 원본 축소 대신 타일링을 택함. 학습 처리량은 단계마다 병목을 다시 재며 52초 → 24초(2.17배)",
        note: "주요업무 「사양 산정」. 근거: 볼트 「데이터 조건에 따라 같은 하드웨어에서도 병목이 바뀐다」 · 「학습 성능은 … 재측정해야 한다」.",
      },
      {
        title: "ML 배포 파이프라인 · k3s GPU (AlignAI)",
        text: "학습 → ONNX → 이미지 빌드 → GHCR → Argo CD 롤링 단독 구축, nvidia-device-plugin GPU 미탐지 4조건을 debug Pod 로 실측(로컬 k3s PoC)",
        note: "필수 2 괄호의 nvidia-device-plugin.",
      },
      {
        title: "폐쇄망 배포 설계 (구현 전)",
        text: "공장 에어갭 — 게이트웨이 PC 가 외부 레지스트리를 pull 해 내부 Harbor 에 적재, 완전 격리 시 이미지 물리 반입. 전환 트리거를 정해 두고 구현은 미룸",
        note: "우대 1. 설계까지임을 제목에 박는다.",
      },
      {
        title: "ERP 백업 자동화",
        text: "API 없는 레거시 ERP 결재 문서 수만 건을 Playwright 로 무인 추출, 자격증명 분리 · CSV 전수 감사 로그",
        note: "필수 3 「운영 작업 자동화」. 1쪽이 넘치면 삭제 1순위.",
      },
    ],
  },
  {
    company: "go2fit",
    role: "3인 팀 · Backend & Infra",
    period: "2025.10 ~ 현재",
    highlight: {
      title: "운영 서버 — 단일 노드 k3s · GitLab CI · 테스터 대상",
      text: "백엔드와 인프라를 맡아 배포 경로 · 데이터 · 장애를 직접 운영했습니다(저장소 커밋 409건 중 275건).",
      points: [
        "배포마다 분석 산출물이 사라지던 것을 실측(파드 교체일 기준 20건 중 16건 소실)으로 특정 → 영속 볼륨, RWO · fsGroup 통설을 노드에서 확인해 불필요한 Recreate 철회",
        "서버 이전 — ARM 빌드 스모크테스트로 Go/No-Go, Postgres 이전 후 행 수 검증, 이미지를 digest 로 고정해 낡은 :latest 로 조용히 롤백될 뻔한 배포를 차단",
        "운영 DB 스키마 드리프트(CREATE 4건 소실)를 로컬 재현 후 선별 적용, 기대 스키마와 컬럼 97개 대조 · MR 마다 ruff + Postgres 연동 pytest",
      ],
      note: "필수 1 · 3 · 4 를 한 블록이. 테스터 대상 · 단일 노드 — 고객 환경 아님. Google Play 출시 준비 중.",
    },
    items: [],
  },
  {
    company: "Zeeco Asia",
    role: "Project Manager",
    period: "2024.02 ~ 2025.04",
    items: [
      {
        title: "연소 설비 EPC",
        text: "수십억 규모 대체 프로젝트를 시운전까지 총괄, 미·인·한 3국 기술 조율로 목표 마진 4% 초과",
        note: "「고객 현장에 같은 품질로 넘긴다」의 비개발 판.",
      },
    ],
  },
];

const PROJECTS: ResumeItem[] = [
  { title: "Hosugator 데모 클러스터", text: "AWS EC2 k3s 를 Oracle ARM k3s 로 재이식 · Traefik Ingress · cert-manager TLS · GHCR 멀티아치 이미지로 데모 API 운영, 호스트 iptables 가 파드 라우팅을 막던 원인 특정", note: "필수 1 보강. 단일 노드 · 개인 트래픽." },
  { title: "공고 분석 LLM 워크플로", text: "Claude Code 를 launchd 로 매일 무인 실행 · 규칙 → Haiku → Sonnet 3단계 · 실행별 토큰 · 비용 · 시간 로그", note: "우대 4 「AI 도구 실무」." },
  { title: "Hosugator Web", text: "EC2/Nginx → S3 정적 전환으로 TCO 80% 절감 · GitHub Actions + IAM OIDC 로 장기 액세스 키 없는 배포", note: "우대 3 CI/CD." },
];

const SKILLS =
  "Linux · Docker · k3s · Kustomize · GitLab CI · GitHub Actions · Argo CD · Traefik · cert-manager · nvidia-device-plugin · OCIR · GHCR · PostgreSQL · Alembic · Python(FastAPI · Playwright) · PyTorch · ONNX Runtime · AWS · Oracle Cloud · Claude Code";

const EDUCATION =
  "경희대학교 환경공학 학사 · Intel AI for Future Workforce (KDT, 2025.04~10) · 대기환경기사 · 정보처리기사(필기) · OPIc IH";

// ── 3. Portfolio — 숫자 · 과정 · 다이어그램은 여기에만 ─────────────────────

// WHY 타임라인 모양인가 — 이 사례의 주장은 「COMPLETED 는 과거 기록이지 지금 볼 수 있다는 뜻이 아니다」이고,
// 그걸 드러낸 것이 파드 교체일이라는 경계 하나였다.
const GO2FIT_DIAGRAM = `flowchart TB
  subgraph FOUND["발견 · 운영 실측"]
    direction LR
    A["분석 완료 20건 · DB 는 정상"] --> B["파일 존재 확인"] --> C["파드 교체일 이전 16건 MISSING · 이후 4건 OK"]
  end
  subgraph FIX["조치"]
    direction LR
    D["산출물 → 영속 볼륨"] --> E["캐시가 파일 실재까지 확인"] --> F["API 가 artifacts_available 로 사실 보고"]
  end
  FOUND --> FIX`;

const GPU_SIZING_DIAGRAM = `flowchart TB
  subgraph CEIL["천장 셋 · RTX 5070 Laptop 실측"]
    direction LR
    SM["연산 · bf16 33.1 TFLOP/s"] ~~~ BW["대역폭 · 262 GB/s"] ~~~ VR["VRAM · 파라미터 · 그래디언트 · 옵티마이저 · 활성값"]
  end
  subgraph LOAD["같은 A4000 · 해상도만 변경"]
    direction LR
    R1["512 · 3.2GB · 대역폭 병목"] --> R2["1160 · 14.9GB · VRAM 위험"] --> R3["3108 · 배치 1 도 17.8GB · VRAM 이 유일한 제약"]
  end
  CEIL --> LOAD`;

const GPU_STACK_DIAGRAM = `flowchart TB
  subgraph IMG["컨테이너 이미지 · 휠이 실어 오는 층"]
    direction LR
    L4["프레임워크 · torch / onnxruntime"] --> L3["CUDA 라이브러리 · cuBLAS · cuDNN"] --> L2["CUDA 런타임 · cu126 / cu130"]
  end
  subgraph HOST["호스트 · 나눠 가질 수 없는 층"]
    direction LR
    L1["드라이버 · 커널 안 · 하나만"] --> L0["하드웨어 · sm_86 / sm_120"]
  end
  IMG --> HOST
  HOST -.->|"k3s 에 노출"| DP["nvidia-device-plugin · runtimeClassName"]`;

const CASES: CaseStudy[] = [
  {
    id: "go2fit-ops",
    title: "go2fit 운영 서버 · 「지금 실제로 무엇이 떠 있는가」를 확인하는 운영",
    problem:
      "3인 팀 운동 앱 백엔드를 단일 노드 k3s 에 GitLab CI 로 배포해 테스터 대상으로 운영합니다. 알림이 울리는 장애보다, DB 는 정상인데 실제 상태가 다른 「조용한」 문제가 많았습니다.",
    approach: [
      "산출물 소실 — 분석 완료 20건의 파일을 전수 확인해 파드 교체일 이전 16건이 사라진 것을 찾고 영속 볼륨으로 옮겼습니다. 「RWO 는 롤링 업데이트와 교착」「새 볼륨은 root 소유」라는 통설은 노드에서 확인해 해당 없음을 밝히고 불필요한 Recreate 를 철회했습니다.",
      "서버 이전 · 드리프트 — ARM 빌드 스모크테스트로 Go/No-Go, Postgres 는 행 수로 검증, :latest 가 낡은 이미지를 가리켜 조용히 롤백될 뻔한 것을 digest 고정으로 막았습니다. 테이블 4개의 CREATE 만 소실된 운영 DB 는 로컬 재현 후 선별 적용했습니다.",
    ],
    result:
      "기대 스키마와 컬럼 97개 일치, 산출물은 배포 후에도 유지되고 잃은 16건은 API 가 사실을 보고해 재업로드로 복구됩니다. 인메모리 큐라 replicas 확장 선행 조건(외부 큐)을 문서에 남겼습니다. 테스터 대상 · 단일 노드이며 고객 환경 운영은 아닙니다.",
    diagram: GO2FIT_DIAGRAM,
    note: "근거: go2fit-backend GF-135 · 138 · 140 · 151 · 153 커밋 본문. 필수 1 · 4 의 앵커.",
  },
  {
    id: "gpu-sizing",
    title: "GPU 를 사양표가 아니라 워크로드로 산정하기 · 연산 · 대역폭 · VRAM",
    problem:
      "GPU 를 VRAM 용량과 sm 사용률로만 봤는데, sm 100% 인데 행렬곱 상한의 26% 만 쓰거나 배치를 3배로 늘려도 에폭 시간이 그대로인 상태를 설명할 수 없었습니다.",
    approach: [
      "빠진 축을 실측 — 연산 33.1 TFLOP/s(bf16) · 대역폭 262 GB/s 로 임계 강도 127 FLOP/byte 를 구해, 강도 낮은 커널은 연산이 남아도 통로에서 막힘을 확인했습니다. VRAM 은 파라미터 · 그래디언트 · 옵티마이저 · 활성값 넷으로 나눠 봤습니다.",
      "같은 A4000 에서 해상도만 바꾸자 512 는 3.2GB · 대역폭 병목, 원본 3108 은 배치 1 로도 17.8GB 로 VRAM 이 유일한 제약 — 대리 워크로드의 숫자로 사양을 정하면 틀린다는 결론을 남겼습니다.",
    ],
    result:
      "학습 처리량을 단계마다 병목을 다시 재며 52초 → 24초(2.17배)로 줄였고, 같은 최적화도 순서에 따라 무효와 유효가 갈렸습니다. 결함 탐지는 축소 대신 타일링으로 정했고, GPU 를 고를 때 「어느 천장에 먼저 닿는 워크로드인가」를 먼저 묻습니다.",
    diagram: GPU_SIZING_DIAGRAM,
    note: "근거: 볼트 「GPU 는 연산과 대역폭이라는 두 천장…」 · 「데이터 조건에 따라 … 병목이 바뀐다」 · 「VRAM buys what cannot be decomposed…」 · 「학습 성능은 … 재측정해야 한다」. 주요업무 「사양 산정 · 파드 리소스 산정」.",
  },
  {
    id: "gpu-stack",
    title: "GPU 스택의 경계 · 왜 GPU 는 컨테이너로도 다 담기지 않고, 잘게 나눠 쓰기 어려운가",
    problem:
      "같은 GPU · 드라이버 · 가상환경인데 torch 는 CUDA 를 못 쓰고 onnxruntime 은 쓰는 상황에서, 휠을 올려 고치려 하자 다른 쪽이 깨졌습니다.",
    approach: [
      "스택을 하드웨어 · 드라이버 · CUDA 런타임 · 라이브러리 · 프레임워크 다섯 층으로 나눠, 휠에 내 GPU 아키텍처(sm_120)가 없으면 설정이 아니라 실행할 코드가 없음을 확인했습니다. 드라이버와 호스트 설정은 커널 영역이라 uv · conda · 컨테이너 어느 것도 담지 못해 배포 절차서로 따로 둡니다.",
      "GPU 가 CPU · RAM 처럼 나뉘지 않는 이유를 하드웨어에서 찾았습니다 — 전환 시 저장할 상태가 수만 스레드의 레지스터와 GB 단위 VRAM 이라 비싸고, SM 을 나눠도 VRAM 통로 · L2 는 공유라 대역폭에 묶인 작업은 서로 느려집니다.",
    ],
    result:
      "k3s 에서는 이 경계가 nvidia-device-plugin 설정 4조건으로 나타났고 debug Pod 로 실측해 풀었습니다(로컬 PoC). 「나눌 수 있으면 두 장, MIG · time-slicing 은 비싼 GPU 를 놀리지 않으려는 최적화」라는 판단은 세웠지만 운영해 보지는 않았습니다.",
    diagram: GPU_STACK_DIAGRAM,
    note: "근거: 볼트 「GPU 의 다층 스택은 독립적이기에…」 · 「패키지 매니저도 컨테이너도 못 푸는 경계는…」 · 「GPU 를 나누기 어려운 주된 이유는…」 · 「k3s NVIDIA device plugin …」. 공통 인프라 표준화의 nvidia-device-plugin 과 팀 소개 「모든 고객 환경에서 같은 품질」.",
  },
];

// WHY 필수 4 + 우대 4 = 8행 — 공고 요건 목록을 그대로 따른다.
const TRACKS: TrackRow[] = [
  { track: "Linux · Docker · Kubernetes 배포 · 운영", level: "○", evidence: "go2fit 운영 서버(단일 노드 k3s · GitLab CI · OCIR · Kustomize) · Oracle k3s 데모 클러스터 — 고객 환경 · 다중 노드는 아직" },
  { track: "AI 모델 서빙 · GPU 워크로드 (nvidia-device-plugin 등)", level: "△", evidence: "GPU 학습 워크로드 실측 · nvidia-device-plugin 4조건(로컬 PoC) · ONNX Runtime 서빙 — vLLM · Triton 은 아직" },
  { track: "Python 백엔드 · 운영 자동화", level: "○", evidence: "FastAPI · PostgreSQL 운영 백엔드 · 이전 · 스모크테스트 스크립트 · launchd 일일 LLM 파이프라인" },
  { track: "로그 · 메트릭 근거 원인 가설 · 검증", level: "○", evidence: "산출물 소실을 파드 교체일로 특정 · 통설을 노드 실측으로 정정 · 학습 병목을 단계마다 재측정" },
  { track: "폐쇄망 · 온프레미스 배포", level: "△", evidence: "공장 에어갭 배포를 내부 Harbor · 게이트웨이 pull · 물리 반입으로 설계 — 구현은 아직" },
  { track: "컨테이너 · 오픈소스 취약점 점검 → 조치", level: "×", evidence: "CVE 점검 · 조치 경험은 없습니다. IAM OIDC 로 장기 키 제거 · 자격증명 분리까지" },
  { track: "IaC · CI/CD (Helm · Ansible · Terraform · GitHub Actions)", level: "△", evidence: "GitLab CI(MR 검사 · 배포) · GitHub Actions → Argo CD · Kustomize base/overlays — Terraform · Ansible 은 아직" },
  { track: "LLM 등 AI 도구 실무 활용", level: "○", evidence: "Claude Code 를 매일 무인 실행하는 3단계 LLM 파이프라인 운영 · 업무 전반에 AI 도구 사용" },
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
        {COMPANY}가 찾는 사람, 제가 이미 해 온 일
      </h2>
      <p className="mt-1.5 mb-4 text-[11px] leading-relaxed text-neutral-500">
        공고의 자격요건과 우대사항 여덟 가지에 제 경험을 하나씩 대 보았습니다. 아직 해보지 않은 것도 그대로 적었습니다 —
        해봤다고 적은 것은 면접에서 그대로 확인하셔도 좋습니다.
        <span className="ml-1.5 whitespace-nowrap text-neutral-400">○ 해봤습니다 · △ 닿아 있습니다 · × 아직입니다</span>
      </p>
      <table className="w-full text-left text-[10.5px] leading-snug border-collapse">
        <thead>
          <tr className="border-b-2 border-neutral-900 text-[10px] font-bold tracking-wider text-neutral-500">
            <th className="pb-1.5 pr-3 font-bold">{COMPANY}가 찾는 것</th>
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

export default function AgilesodaDraftPage() {
  return (
    <div className="relative w-full md:max-w-2xl md:mx-auto px-5 md:px-8 pt-8 pb-20 print:p-0 text-neutral-900">
      <p className="print:hidden mb-8 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-[11.5px] text-amber-900">
        검토용 초안 v2 — 앵커를 go2fit 운영 · GPU 산정으로 교체 — 지원 동기는 「왜」(대응표 포함), 이력서는 「무엇」(1쪽), 포트폴리오는 「어떻게」만 말합니다. 노란 메모는 PDF 에서 빠집니다.
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
        <Header title="Portfolio" lead="이력서 항목 중 과정과 판단을 설명할 필요가 있는 세 가지입니다." contact={false} />
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
