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

/**
 * 프로젝트 슬러그 → PKM 볼트의 `project` 태그.
 *
 * WHY 매핑이 필요한가:
 *   관련 노트 링크가 `shortNameOf(title)`(카드 제목의 ':' 앞부분)로 만들어졌는데, 볼트의
 *   `project` 태그는 다른 명명 규칙을 쓴다 — 공백(AlignAI vs "Align AI"), 대소문자
 *   (go2fit vs "Go2fit"), 어순(ERP Backup vs "Backup ERP"), 접두사("MOC - Cureat").
 *   두 이름 공간이 우연히 일치할 이유가 없어 12개 중 10개가 0건을 반환하고 있었다.
 *   AlignAI 143건, Edge AI LMR 83건처럼 노트가 가장 많은 프로젝트가 특히 유실됐다.
 *
 * WHY 볼트를 고치지 않는가:
 *   PKM이 SSOT다. 노트 수백 개의 태그를 포트폴리오 이름에 맞추면 볼트가 이 사이트에
 *   종속된다. 매핑은 소비하는 쪽(사이트)이 지는 게 맞다.
 *
 * 값은 추측하지 않고 content/notes의 실제 태그를 세어 확인했다 (2026-08-03).
 * 여기 없는 슬러그는 관련 노트가 없다는 뜻이고, 링크를 숨긴다.
 */
export const NOTE_PROJECT: Record<string, string> = {
  'edge-ai-lmr': 'Edge AI LMR',   // 83
  'v1-aoi': 'AOI',                // 31
  'alignai': 'Align AI',          // 143
  'erp-backup': 'Backup ERP',     // 2
  'dotodo': 'Dotodo',             // 4
  'hosugator': 'Hosugator Web',   // 37
  'go2fit': 'Go2fit',             // 19
  'cureat': 'MOC - Cureat',       // 1
  'sodamdiary': 'MOC - Sodam Diary', // 1
  // pictag · dorosee · kdlc — 볼트에 노트 없음
};

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
  'v1-aoi': [
    `flowchart TB
  subgraph TRAIN["학습 · 정상 데이터만"]
    NORM["정상 렌즈 267장"] --> CROP["circle-crop 236x236"]
    CROP --> FEAT["WideResNet50 · layer2+layer3"]
    FEAT --> CORE["Coreset 10% 압축"] --> BANK[("Memory Bank")]
  end
  subgraph INFER["추론 · 엣지 CPU"]
    IN["검사 이미지"] --> FEAT2["패치 임베딩"]
    FEAT2 --> NN["최근접 정상 패치 거리"]
    NN --> MAP["Anomaly Map"] --> TH["임계값 → 컨투어"] --> JUDGE["OK / NG 판정"]
  end
  BANK -.->|"거리 기준"| NN
  BANK --> ONNX["ONNX 변환 · onnxruntime"] -.-> INFER`,
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

// 영문 다이어그램 — PROJECT_MERMAID와 동일 구조, 라벨만 영문. EN 로케일에서 사용.
export const PROJECT_MERMAID_EN: Record<string, string[]> = {
  'edge-ai-lmr': [
    `flowchart TB
  PLC["PLC Equipment · 10ms sensors"]
  subgraph EDGE["Edge · k3s (GPU)"]
    ENGINE["data-engine"]
    subgraph CHAIN["3-Stage AI Chain"]
      M1["M1 · 1D-CNN AE"] --> M2["M2 · LSTM+XGBoost"] --> M3["M3 · DQN prescription"]
    end
    HMI["React+TS HMI"]
    ENGINE -->|"gRPC · WARM"| CHAIN
    CHAIN --> HMI
  end
  PLC -->|"MQTT Binary · HOT"| ENGINE
  ENGINE -->|"Parquet · COLD"| LAKE[("Data Lake")]
  M3 -->|"Set-point feedback"| PLC
  LAKE -.->|retrain| CHAIN`,
  ],
  'v1-aoi': [
    `flowchart TB
  subgraph TRAIN["Training · normal data only"]
    NORM["267 normal lenses"] --> CROP["circle-crop 236x236"]
    CROP --> FEAT["WideResNet50 · layer2+layer3"]
    FEAT --> CORE["Coreset 10% compression"] --> BANK[("Memory Bank")]
  end
  subgraph INFER["Inference · edge CPU"]
    IN["Inspection image"] --> FEAT2["Patch embedding"]
    FEAT2 --> NN["Distance to nearest normal patch"]
    NN --> MAP["Anomaly Map"] --> TH["Threshold → contour"] --> JUDGE["OK / NG verdict"]
  end
  BANK -.->|"distance basis"| NN
  BANK --> ONNX["ONNX export · onnxruntime"] -.-> INFER`,
  ],
  'alignai': [
    `flowchart TB
  subgraph INFER["Inference · k3s Edge"]
    IMG["Process image"] --> UNET["U-Net · EfficientNet-B0"] --> CTR["Centerline → actuator"]
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
  ERP["K-System Ace · legacy ERP"]
  subgraph BOT["Playwright automation engine"]
    POM["POM pattern"] --> ASYNC["Promise.all concurrency"] --> POPUP["Dynamic popup handling"]
  end
  ERP <-->|"unofficial UI automation"| BOT
  ENV[".env credentials"] -.-> BOT
  BOT --> CSV["CSV full audit log"]
  CSV -.->|"checkpoint reprocessing"| BOT`,
  ],
  'dotodo': [
    `flowchart TB
  App["App · STT voice input"]
  App -->|REST| BE["Backend · AWS EC2"]
  BE --> DB[("PostgreSQL")]
  BE -->|"inference request"| MECAB
  subgraph MS["Model Server · AWS EC2 · RAG"]
    MECAB["Mecab-ko morphology"] --> EMB["768D embedding"] --> CHROMA[("ChromaDB · Top-K=3")]
    CHROMA --> LLM["LLM recommend"] --> JUDGE["LLM-as-Judge"]
    JUDGE -.->|"regenerate low score"| LLM
  end`,
  ],
  'sodamdiary': [
    `flowchart TB
  App["App · photo / STT"] -->|REST| API["FastAPI · Docker (AWS EC2)"]
  subgraph PIPE["VLM 3-Stage · OpenVINO 4-bit"]
    BLIP["BLIP · caption"] --> LLM["LLM · narration"]
    CLIP["CLIP · emotion Top-3"] --> LLM
  end
  API -->|"asyncio.gather"| PIPE
  LLM --> TTS["TTS voice"] --> App`,
  ],
  'pictag': [
    `flowchart TB
  CAM["Store CCTV · RTSP"]
  subgraph EDGE["Edge (no GPU) · OpenVINO INT8 · 4-Thread"]
    CAP["Capture"] --> DET["Detection · YOLO"] --> EMB["Embedding · Attention"] --> REID["Re-ID"]
  end
  CAM --> CAP
  REID --> WS["Django + WebSocket"] --> DASH["Heatmap dashboard"]`,
  ],
  'hosugator': [
    `flowchart TB
  User["Visitor"] --> R53["Route 53 + ACM"] --> CFN
  subgraph AWS["AWS · Serverless"]
    CFN["CloudFront CDN"] --> S3["S3 · static hosting"]
  end
  GH["GitHub"] -->|push| GA["GitHub Actions"]
  GA -.->|"OIDC short-lived token"| AWS
  GA -->|"next build → out/"| S3`,
  ],
  'cureat': [
    `flowchart TB
  subgraph COLLECT["Collect · asyncio.gather"]
    REST["REST API"]
    CRAWL["Web crawling"]
    RSS["RSS"]
  end
  COLLECT --> FILTER["Ko-BERT ad filter"] --> VDB[("Vector DB · ChromaDB")]
  App["React Native app"] -->|search| API["FastAPI"]
  API --> S1["Stage1 · cosine similarity"] --> S2["Stage2 · location Re-rank"]
  VDB --> S1
  S2 --> App`,
  ],
  'dorosee': [
    `flowchart TB
  subgraph TRIG["Triple trigger · 2/3 + 10s sustained"]
    VIS["YOLOv8 vision"]
    MOT["MediaPipe motion"]
    VOX["STT wakeword"]
  end
  TRIG --> FUSE["Weighted fusion decision"]
  FUSE --> LLM["LLM dialogue"] --> TTS["TTS"]
  FUSE --> AED["AED auto-report"]
  FUSE --> UGV["UGV control · Unity 3D HAL"]`,
  ],
  'kdlc': [
    `flowchart LR
  DATA["Distribution data"] --> FE["45+ feature engineering"]
  FE --> CV["TimeSeriesSplit"]
  CV --> SAR["SARIMA"]
  CV --> LSTM["LSTM"]
  CV --> LGBM["LightGBM"]
  SAR --> ENS["Weighted ensemble · inverse RMSE"]
  LSTM --> ENS
  LGBM --> ENS
  ENS --> PRED["Demand forecast"]`,
  ],
  'go2fit': [
    `flowchart TB
  App["Flutter App · Android"]
  App -->|"go2fits.com"| CF["Cloudflare · DNS"]
  CF -->|"REST · JWT"| API
  App -.->|OAuth| KAKAO["Kakao Login"]
  App -.-> ADMOB["AdMob"]
  App -->|release| STORE["Google Play Store"]
  subgraph ORACLE["Oracle Cloud · k3s"]
    API["FastAPI Server"]
    subgraph MLP["ML pipeline"]
      POSE["MediaPipe Pose · 33 landmarks"] --> RULES["Rule Analyzers · Squat/Bench/Deadlift"]
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

// 로케일에 맞는 다이어그램 반환 (EN 없으면 KO로 폴백)
export function getMermaid(slug: string, locale: 'ko' | 'en'): string[] | undefined {
  if (locale === 'en' && PROJECT_MERMAID_EN[slug]) return PROJECT_MERMAID_EN[slug];
  return PROJECT_MERMAID[slug];
}

export const PROJECT_FLOWS: Record<string, Flow[]> = {
  'edge-ai-lmr': [
    { label: '4-Tier Architecture', stages: ['Field', 'Control', 'Edge', 'Cloud'] },
    { label: '3-Stage AI Chain', stages: ['1D-CNN AE', 'LSTM + XGBoost', 'DQN'] },
  ],
  'v1-aoi': [
    { label: 'Unsupervised AOI', stages: ['Normal-only Training', 'Memory Bank', 'Patch Distance', 'Anomaly Map'] },
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
