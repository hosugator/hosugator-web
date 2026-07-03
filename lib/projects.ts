// lib/projects.ts — 프로젝트 슬러그·조회·아키텍처 플로우
import { projectsData } from '@/data/projectsData';
import { projectsDataEn } from '@/data/projectsData.en';

export const shortNameOf = (title: string) => title.split(':')[0].trim();

export const slugify = (title: string) =>
  shortNameOf(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const projectSlugs = (): string[] => projectsData.items.map((p) => slugify(p.title));

export type ProjectItem = typeof projectsData.items[number];

export function getProject(slug: string, locale: 'ko' | 'en'): ProjectItem | null {
  const items = (locale === 'en' ? projectsDataEn : projectsData).items;
  return items.find((p) => slugify(p.title) === slug) || null;
}

// 관련 노트 기반 아키텍처 플로우 (기술 용어라 언어 중립)
export interface Flow {
  label: string;
  stages: string[];
}

// Flow(선형 단계)를 Mermaid flowchart 문자열로 변환
export function flowToMermaid(flow: Flow): string {
  const esc = (s: string) => s.replace(/"/g, "'");
  const lines: string[] = ['flowchart LR'];
  for (let i = 0; i < flow.stages.length - 1; i++) {
    lines.push(`  n${i}["${esc(flow.stages[i])}"] --> n${i + 1}["${esc(flow.stages[i + 1])}"]`);
  }
  return lines.join('\n');
}

// 리치 커스텀 Mermaid (있으면 flow 변환 대신 사용). 슬러그당 다이어그램 배열.
export const PROJECT_MERMAID: Record<string, string[]> = {
  'edge-ai-lmr': [
    `flowchart TB
  PLC["PLC 설비 · 10ms 센서"]
  subgraph EDGE["Edge · k3s (GPU)"]
    ENGINE["data-engine"]
    subgraph CHAIN["3-Stage AI Chain"]
      M1["M1 · 1D-CNN AE"] --> M2["M2 · LSTM+XGBoost"] --> M3["M3 · DQN 처방"]
    end
    HMI["React+TS HMI"]
    ENGINE -->|"gRPC · WARM"| CHAIN
    CHAIN --> HMI
  end
  PLC -->|"MQTT Binary · HOT"| ENGINE
  ENGINE -->|"Parquet · COLD"| LAKE[("Data Lake")]
  M3 -->|"Set-point 피드백"| PLC
  LAKE -.->|재학습| CHAIN`,
  ],
  'alignai': [
    `flowchart TB
  subgraph INFER["추론 · k3s Edge"]
    IMG["공정 이미지"] --> UNET["U-Net · EfficientNet-B0"] --> CTR["중심선 → 액추에이터"]
  end
  subgraph MLOPS["GitOps ML CI/CD"]
    GH["GitHub SSOT"] --> CI["ci.yml · build"] --> GHCR["GHCR"] --> ARGO["Argo CD"]
    GH -.->|"workflow_dispatch"| TRAIN["train.yml · GPU Job"]
    TRAIN --> ONNX["ONNX"] --> GHCR
  end
  ARGO -->|"rolling deploy"| INFER`,
  ],
  'erp-backup': [
    `flowchart TB
  ERP["K-System Ace · 레거시 ERP"]
  subgraph BOT["Playwright 자동화 엔진"]
    POM["POM 패턴"] --> ASYNC["Promise.all 동시성"] --> POPUP["동적 팝업 핸들링"]
  end
  ERP <-->|"비공식 UI 자동화"| BOT
  ENV[".env 자격증명"] -.-> BOT
  BOT --> CSV["CSV 전수 감사 로그"]
  CSV -.->|"체크포인트 재처리"| BOT`,
  ],
  'dotodo': [
    `flowchart TB
  App["앱 · STT 음성 입력"]
  App -->|REST| BE["Backend · AWS EC2"]
  BE --> DB[("PostgreSQL")]
  BE -->|추론 요청| MECAB
  subgraph MS["Model Server · AWS EC2 · RAG"]
    MECAB["Mecab-ko 형태소"] --> EMB["768D 임베딩"] --> CHROMA[("ChromaDB · Top-K=3")]
    CHROMA --> LLM["LLM 추천"] --> JUDGE["LLM-as-Judge"]
    JUDGE -.->|"저점수 재생성"| LLM
  end`,
  ],
  'sodamdiary': [
    `flowchart TB
  App["앱 · 사진 / STT"] -->|REST| API["FastAPI · Docker (AWS EC2)"]
  subgraph PIPE["VLM 3-Stage · OpenVINO 4-bit"]
    BLIP["BLIP · 캡션"] --> LLM["LLM · 해설"]
    CLIP["CLIP · 감성 Top-3"] --> LLM
  end
  API -->|"asyncio.gather"| PIPE
  LLM --> TTS["TTS 음성"] --> App`,
  ],
  'pictag': [
    `flowchart TB
  CAM["매장 CCTV · RTSP"]
  subgraph EDGE["엣지 (GPU 없음) · OpenVINO INT8 · 4-Thread"]
    CAP["Capture"] --> DET["Detection · YOLO"] --> EMB["Embedding · Attention"] --> REID["Re-ID"]
  end
  CAM --> CAP
  REID --> WS["Django + WebSocket"] --> DASH["히트맵 대시보드"]`,
  ],
  'hosugator': [
    `flowchart TB
  User["방문자"] --> R53["Route 53 + ACM"] --> CFN
  subgraph AWS["AWS · 서버리스"]
    CFN["CloudFront CDN"] --> S3["S3 · 정적 호스팅"]
  end
  GH["GitHub"] -->|push| GA["GitHub Actions"]
  GA -.->|"OIDC 단기 토큰"| AWS
  GA -->|"next build → out/"| S3`,
  ],
  'cureat': [
    `flowchart TB
  subgraph COLLECT["수집 · asyncio.gather"]
    REST["REST API"]
    CRAWL["웹 크롤링"]
    RSS["RSS"]
  end
  COLLECT --> FILTER["Ko-BERT 광고 필터"] --> VDB[("Vector DB · ChromaDB")]
  App["React Native 앱"] -->|검색| API["FastAPI"]
  API --> S1["Stage1 · 코사인 유사도"] --> S2["Stage2 · 위치 Re-rank"]
  VDB --> S1
  S2 --> App`,
  ],
  'dorosee': [
    `flowchart TB
  subgraph TRIG["3중 트리거 · 2/3 + 10초 지속"]
    VIS["YOLOv8 비전"]
    MOT["MediaPipe 모션"]
    VOX["STT Wakeword"]
  end
  TRIG --> FUSE["가중치 융합 판단"]
  FUSE --> LLM["LLM 대화"] --> TTS["TTS"]
  FUSE --> AED["AED 자동 신고"]
  FUSE --> UGV["UGV 제어 · Unity 3D HAL"]`,
  ],
  'kdlc': [
    `flowchart LR
  DATA["유통 데이터"] --> FE["45+ 피처 공학"]
  FE --> CV["TimeSeriesSplit"]
  CV --> SAR["SARIMA"]
  CV --> LSTM["LSTM"]
  CV --> LGBM["LightGBM"]
  SAR --> ENS["가중 앙상블 · RMSE 역수"]
  LSTM --> ENS
  LGBM --> ENS
  ENS --> PRED["수요 예측"]`,
  ],
  'go2fit': [
    `flowchart TB
  App["Flutter App · Android"]
  App -->|"go2fits.com"| CF["Cloudflare · DNS"]
  CF -->|"REST · JWT"| API
  App -.->|OAuth| KAKAO["Kakao Login"]
  App -.-> ADMOB["AdMob"]
  App -->|출시| STORE["Google Play Store"]
  subgraph ORACLE["Oracle Cloud · k3s"]
    API["FastAPI Server"]
    subgraph MLP["ML 파이프라인"]
      POSE["MediaPipe Pose · 33 landmarks"] --> RULES["Rule Analyzers · 스쿼트/벤치/데드리프트"]
    end
    DB[("PostgreSQL")]
    API --> MLP
    API --> DB
  end
  subgraph DEVOPS["Dev & Ops"]
    JIRA["Jira · Confluence"]
    GITLAB["GitLab CI/CD"]
  end
  GITLAB -->|deploy| ORACLE`,
  ],
};

export const PROJECT_FLOWS: Record<string, Flow[]> = {
  'edge-ai-lmr': [
    { label: '4-Tier Architecture', stages: ['Field', 'Control', 'Edge', 'Cloud'] },
    { label: '3-Stage AI Chain', stages: ['1D-CNN AE', 'LSTM + XGBoost', 'DQN'] },
  ],
  'alignai': [
    { label: 'Vision', stages: ['OpenCV (rule-based)', 'U-Net Segmentation'] },
    { label: 'GitOps ML CI/CD', stages: ['Code', 'GitHub Actions', 'GHCR', 'Argo CD', 'k3s'] },
  ],
  'erp-backup': [
    { label: 'Automation Pipeline', stages: ['Legacy ERP', 'Playwright · Promise.all', 'CSV Audit Log'] },
  ],
  'hosugator': [
    { label: 'Keyless CI/CD', stages: ['GitHub', 'Actions · IAM OIDC', 'S3 + CloudFront'] },
  ],
  'dotodo': [
    { label: 'RAG Pipeline', stages: ['STT', 'RAG · ChromaDB', 'LLM', 'LLM-as-Judge'] },
  ],
  'sodamdiary': [
    { label: 'VLM 3-Stage', stages: ['BLIP', 'CLIP', 'LLM'] },
  ],
  'pictag': [
    { label: '4-Thread Pipeline', stages: ['Capture', 'Detection', 'Embedding', 'Re-ID'] },
  ],
  'kdlc': [
    { label: '3-Model Ensemble', stages: ['SARIMA', 'LSTM', 'LightGBM', 'Weighted Ensemble'] },
  ],
  'go2fit': [
    { label: 'Exercise FK Chain', stages: ['Session', 'Exercise', 'Set', 'RepAnalysis'] },
  ],
  'cureat': [
    { label: 'Curation Pipeline', stages: ['Collect', 'Ko-BERT Filter', 'Okt Intent', '2-Stage Search'] },
  ],
  'dorosee': [
    { label: 'Multimodal UGV', stages: ['YOLOv8', 'LLM Voice', 'UGV Control'] },
  ],
};
