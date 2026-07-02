// data/resumeData.ts
// Master Resume.md(~/zettelkasten) 기반 벤더링 데이터.
// 원본은 레포 밖이라 빌드 시 접근 불가 → 레포 안 단일 소스로 관리한다.
// 갱신 시 Master Resume.md와 이 파일을 함께 업데이트할 것.

export interface ResumeExperienceItem {
  title: string;
  body: string;
}

export interface ResumeExperience {
  company: string;
  role: string;
  period: string;
  items: ResumeExperienceItem[];
}

export interface ResumeProject {
  category: string;
  name: string;
  body: string;
}

export interface ResumeInsight {
  label: string;
  quote?: string;
  body: string;
}

export interface ResumeData {
  name: string;
  headline: string;
  summary: string[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  insights: ResumeInsight[];
  education: string[];
}

export const resumeData: ResumeData = {
  name: '홍승완',
  headline: 'AI Engineer · 비즈니스 문제를 코드로 해결',
  summary: [
    "'왜'라는 질문과 함께, 제품의 시작과 끝을 이해하고 만들 줄 아는 AI 엔지니어입니다. 글로벌 EPC PM 경험으로 장기 프로젝트의 흐름을 이해하며, 다양한 계층의 요구 사항을 '왜'를 기반으로 제품의 기술 명세로 번역하는 데 능숙합니다.",
    '이 호기심은 기획-데이터-ML-인프라-백엔드-DB-UI/UX-운영까지 개발 프로젝트의 전체 요소를 이해하는 풀스택 AI 개발자로의 동력이 되었습니다. 이로 얻은 가장 큰 역량은 현재 프로젝트에서 어디에 자원을 더 투입해야 병목이 해결되는지 파악할 수 있다는 점입니다.',
    '현재는 제조 도메인에서 AI 개발자로 일하며, 타부서 업무 자동화부터 비전 정렬 모델·이상탐지 모델 실증, GitOps 파이프라인을 단독 구축했습니다. 또한 비전 탐지 결과를 LLM이 현장 언어로 설명하고 문제를 선제적으로 해결하는 에이전트를 프로토타입 검증했습니다.',
    '기술이 기술로만 남는 것을 경계합니다. 기술을 현장의 유용한 도구로 만들기 위한 고민이야말로 어느 규모, 어떤 직무에서든 항상 품고 있어야 한다고 생각합니다.',
  ],
  experience: [
    {
      company: 'DTK',
      role: 'AI Developer',
      period: '2026.03 ~ 현재',
      items: [
        {
          title: 'AlignAI: 비전 정렬 프로세스 자동화 + ML CI/CD + 다중 제품 확장',
          body: '기존 OpenCV(Canny Edge + 수동 임계값)의 환경 민감도 문제를 U-Net(EfficientNet-B0) 기반 딥러닝 Segmentation으로 전환. Dice Loss·Skip Connection 최적화, Albumentations 증강으로 Q-display 탐지율 100%·PASS율 91%·CPU 추론 ~330ms, Q-edge 탐지율 100%·PASS율 100% 달성. 제품 3종 확장으로 발생한 코드 분기 폭발을 ProductConfig @dataclass 레지스트리 패턴으로 해결(새 제품 = config 한 줄). latest.pth/best_vN.pth/best_vN.onnx 3파일 분리 체크포인트로 resume 시 bad state 복원 버그를 구조적으로 제거. 학습→ONNX→이미지 빌드→Harbor→Argo CD 롤링 업데이트 ML CI/CD를 단독 구축하고 레이어 핑거프린트 스킵으로 불필요한 재학습 제거. GITHUB_TOKEN downstream 트리거 정책은 workflow_dispatch 우회로, Argo CD Job 반복 재생성은 resource.exclusions로 해결하고 ADR로 기록.',
        },
        {
          title: 'AlignAI: 엣지 AI k3s 클러스터 배포 인프라 설계',
          body: 'GitHub를 SSOT로 삼는 GitOps 구조로 게이트웨이 PC(Linux + k3s) 위 엣지 AI 배포 인프라를 단독 설계·로컬 검증. 추론 이미지(Deployment, 상시 서빙)와 학습 이미지(Job, 수동 트리거) 라이프사이클을 분리해 각각 독립 CI(ci.yml/train.yml)로 관리. 코드 변경→GitHub Actions→GHCR→Argo CD diff 감지→자동 롤링 배포 E2E 구축. Service·liveness/readiness probe·Argo CD self-heal·sync를 활성화해 replica:1 구성에서 OOM·프로세스 비정상 종료 시 셀프힐링 복원력을 로컬 검증. 설비 PC(Windows C SDK 클라이언트)는 노드에서 제외하는 현장 현실 기반 배포 경계 설계.',
        },
        {
          title: 'LLM 에이전트 로드맵: 현장 멀티모달 에이전트 구현 (진행 중)',
          body: '현장 오퍼레이터의 "왜 이상이 났는가" 시나리오를 목표로 LLM 에이전트를 단계적으로 직접 구현. Stage 1(텍스트 API)→2(멀티모달)→3(Tool use, function calling 직접 구현)→4(RAG, 임베딩 원리 실습)→5(ReAct 루프: 모델이 종료를 직접 결정) 완료. tool_calls 구조(코드 흐름 제어)와 ReAct 루프(모델 자율 제어)의 구조적 차이를 코드 레벨로 체득. Stage 6 통합 프로토타입(화면+로그+코드 입력 → 판단/이상 설명/조치 제안) 구현 예정.',
        },
        {
          title: 'Edge AI LMR: 이상탐지 시스템 설계',
          body: '렌즈 열성형 공정 지능화를 위해 Field→Control→Edge→Cloud 4계층 아키텍처 설계. MQTT Binary Batching과 gRPC·SQLite-Parquet 계층형 저장으로 10ms 고주파 PLC 데이터 무손실 처리, Cycle_ID를 Golden Key로 설정해 다축 센서 시공간 데이터 전 계층 단일 키 조인 구현. 1D-CNN AE→LSTM+XGBoost→DQN 3-Stage AI 체인, Anomalib(PatchCore) 기반 AUROC 99.99% 확보. k3s에서 NVIDIA Device Plugin·CDI로 GPU 추론 컨테이너 구성, React+TS HMI 대시보드 단독 운영.',
        },
        {
          title: '성균관대 산학협력 AOI: Data-centric 비교 검증',
          body: '외관 검사 AI 접근법 검증을 위해 PatchCore(Few-shot 정상 특징 거리)·SAM(픽셀 세그멘테이션)·합성 데이터 3방식 병렬 비교. SAM이 기술적으로 정밀하나 다현장·다품종에서 오퍼레이터 재라벨링 병목이 배포 효율을 저해함을 확인, 이미지 단위 접근의 현장 배포 우위를 내부 공유.',
        },
        {
          title: 'Agentic AI 기반 ERP 자동화',
          body: '입사 1주 차, K-System Ace 레거시 ERP의 수만 건 결재 문서 백업 병목을 Playwright 기반 자율 웹 마이그레이션 엔진으로 단독 해결. 공식 API 부재·비표준 동적 팝업 환경에서 Playwright를 선택하고 Promise.all 동시성으로 비동기 팝업 Race Condition을 구조적으로 제거. POM 패턴, .env+.gitignore 자격증명 분리, CSV 전수 감사 로그로 수주 소요 수작업을 100% 정합성 무인 자동화로 전환.',
        },
        {
          title: 'Corning Varioptic 계약 협상 Focal Point',
          body: '프랑스 광학 액추에이터 기업 Corning Varioptic의 Distributor 계약 Focal Point를 자발적 수행. 조건 검토 및 해외 담당자와 기술·상업 협상 창구 역할로 계약 체결, 이후 한국 방문 주선·양사 공식 소개·제품 1차 Tech Training 완수. DTK 주력 제품(렌즈)·광학계와의 기술 접목 가능성을 자체 조사 중.',
        },
      ],
    },
    {
      company: 'Zeeco Asia',
      role: 'Project Manager',
      period: '2024.02 ~ 2025.04',
      items: [
        {
          title: '글로벌 EPC 프로젝트 총괄 리딩 및 수익성 최적화',
          body: '글로벌 연소 설비 기업에서 수십억 규모 시스템 대체 프로젝트를 시운전 단계까지 총괄. 3국(미·인·한) 이해관계자 간 기술 충돌을 조율하는 커뮤니케이션 허브로서 추상적 현장 요구를 기술 명세로 번역하고, 비기술 의사결정자에게 리스크·트레이드오프를 설명하며 Q/C/D 관리·선제 리스크 대응으로 목표 마진율을 4% 초과 달성.',
        },
      ],
    },
  ],
  projects: [
    {
      category: 'Generative AI & LLM Agent',
      name: 'Dotodo — 개인화 할 일 추천 LLM RAG 서비스',
      body: "음성 STT 기반 RAG 추천 에이전트. AWS EC2 MSA로 Backend/Model 서버 분리로 모델 독립 업그레이드 보장. Mecab-ko 형태소 분석 + 768D ChromaDB 벡터 검색, FastAPI asyncio 비동기 파이프라인으로 LLM 응답 지연 60% 단축. 'LLM as a Judge'로 추천 결과를 관련성·유용성 기준 자율 평가·재생성 루프 구성, 최하위 점수 항목에만 선택적 Judge 호출로 API 비용 60% 절감. Cold Start는 인기 태스크 초기값 주입으로 해결.",
    },
    {
      category: 'Generative AI & LLM Agent',
      name: 'Sodam Diary — 시각장애인용 VLM 기반 사진 해설',
      body: 'GPT-4V 단독(월 130만원·30초)을 대체하기 위해 BLIP→CLIP(코사인 유사도 Top-3)→LLM 3-Stage 멀티모달 파이프라인 직접 설계. OpenVINO 4-bit 양자화·asyncio 병렬로 운영비 30% 절감·응답 30→20초 단축. Django 동기 ORM 병목을 FastAPI+Docker로 재구축. 2025 한국장애인해커톤 본선 진출.',
    },
    {
      category: 'Generative AI & LLM Agent',
      name: 'Cureat — AI 미식 큐레이션 및 데이터 거버넌스',
      body: '파편화된 비정형 미식 데이터를 수집하고 Ko-BERT 필터링으로 광고성 콘텐츠 20%+ 제거. 2-Stage 하이브리드 검색 파이프라인으로 정교한 개인화 추천 구현.',
    },
    {
      category: 'Industrial AI & Computer Vision',
      name: 'AlignAI — 비전 정렬 자동화 + 엣지 AI 인프라 (DTK)',
      body: '규칙 기반 OpenCV의 환경 민감도 한계를 U-Net(EfficientNet-B0) Segmentation으로 전환. 인코더 사전학습으로 수렴 3배↑, Dice Loss로 클래스 불균형(배경 99% vs 정렬선 1%) 극복. Q-display 탐지율 100%·PASS율 91%·CPU ~330ms, Q-edge 100%/100%. ProductConfig 레지스트리로 단일 레포 3제품 관리. GitHub SSOT GitOps — 추론/학습 이미지 분리, GHCR→Argo CD 자동 배포 E2E 단독 구축, probe+self-heal OOM 셀프힐링 검증.',
    },
    {
      category: 'Industrial AI & Computer Vision',
      name: 'Dorosee — 응급상황 탐지 멀티모달 AI 플랫폼',
      body: '2025 UWC 해커톤 대상. YOLOv8 파인튜닝 + LLM 음성 인터페이스 결합 UGV 플랫폼. Unity 3D 시뮬레이션으로 하드웨어 제약을 극복하고 AI 모델 통합 테스트 완수.',
    },
    {
      category: 'Industrial AI & Computer Vision',
      name: 'Pic-Tag — 소상공인용 경량 CCTV AI SaaS',
      body: 'YOLO 백본 분해로 Linear·Pooling·Attention Head 3방식 A/B 실험, Attention이 Re-ID 정확도·학습 효율 모두 50%↑ 확인 후 채택. OpenVINO INT8 양자화로 GPU 없는 엣지 실시간 추론. Capture·Detection·Embedding·Re-ID 4-Thread 독립 큐, Django+WebSocket 히트맵 대시보드 구축.',
    },
    {
      category: 'Industrial AI & Computer Vision',
      name: 'KDLC — 물류센터 수요 예측 (경진대회)',
      body: 'Lag·Rolling·sin/cos 주기성·공휴일·프로모션 등 45개+ 피처 공학. TimeSeriesSplit으로 Data Leakage 차단, SARIMA·LSTM·LightGBM 3-Model 가중 앙상블(검증 RMSE 역수 자동 가중). 피처 공학이 모델 선택보다 성능 영향이 큼을 실증.',
    },
    {
      category: 'Cloud-Native & Infrastructure',
      name: 'Hosugator Web — TCO 최적화 클라우드 인프라',
      body: 'AWS 서버리스(ALB+ECS)를 EC2/Nginx 자가 관리형으로 전환해 TCO 80% 절감. GitHub Actions + IAM OIDC 연동으로 액세스 키 없는 역할 기반 임시 자격증명 패스워드리스 CI/CD 구축. 정적 특성에 맞춰 최종 S3 정적 호스팅 전환.',
    },
    {
      category: 'Cloud-Native & Infrastructure',
      name: 'ERP Backup — 레거시 ERP 자동화 파이프라인 (DTK)',
      body: 'K-System Ace 레거시 Web ERP의 수만 건 결재 문서 수작업 병목을 공식 API 부재 환경에서 Playwright + Promise.all Agentic 파이프라인으로 단독 해결. POM 패턴, 자격증명 분리, CSV 전수 감사 로그로 수일 수작업을 100% 정합성 무인 자동화로 전환.',
    },
    {
      category: 'Full-Stack AI Product Backend',
      name: 'go2fit — 피트니스 소셜 앱 백엔드 & DB 설계',
      body: 'User·Exercise·Community 3축 PostgreSQL 스키마 단독 설계. User는 UUID PK(카카오 소셜, kakao_id UNIQUE), Exercise는 Session→Exercise→Video→Set→RepAnalysis 5계층 FK 체인, Community는 Post+Like+Comment. 크로스 도메인 FK(Post.session_id→Session)로 운동 기록을 소셜 피드에 연동. JWT + Refresh Token Rotation(DB엔 SHA-256 해시만) + TokenBlacklist + Idempotency Key 4중 보안. MediaPipe 운동별 독립 분석기를 DDD 구조로, 비동기 영상 분석 잡 큐(FSM)와 얼굴 비식별화 파이프라인 분리.',
    },
  ],
  insights: [
    {
      label: '자동화',
      quote: '3회 이상 반복되는 병목은 반드시 자동화한다.',
      body: '입사 1주차 수만 건 결재 문서 수작업 병목을 공식 API 부재 제약에서 Playwright Agentic 파이프라인으로 100% 정합성 무인 자동화 전환. 단, git worktree 멀티 브랜치 병렬 개발에서 인간의 인지 맥락 한계가 실질적 병목임을 확인 — 자동화 범위를 먼저 정의해야 yak shaving을 피한다.',
    },
    {
      label: '시스템 설계',
      quote: '데이터의 골든 키를 먼저 정의하면 시스템의 나머지는 따라온다.',
      body: '다축 센서 데이터를 타임스탬프만으로 연결할 수 없는 구조에서 Cycle_ID를 Golden Key로 설정. 전 계층 단일 키 조인과 이상 구간 즉시 재현·처방 루프가 성립. 인프라 설계 전 데이터 모델 정의가 선행되어야 함을 실전 확인.',
    },
    {
      label: '평가 설계',
      quote: '모델이 좋은지는 평가 설계가 결정한다.',
      body: 'Edge AI LMR에서 이상 발생률 1% 미만이라 accuracy 99%는 무의미 → AUROC를 핵심 메트릭으로 재정의. Dotodo에서는 LLM-as-a-Judge 자율 평가 루프로 사람 없이 품질을 검증하고 API 비용 60% 절감. 평가 없이 배포는 없다.',
    },
    {
      label: '트레이드오프',
      quote: '정확도와 지연의 최적점은 현장 데이터로만 결정된다.',
      body: 'AlignAI에서 TensorRT 대신 CPU ONNX Runtime을 선택한 것은 현장 추론 빈도·하드웨어를 측정한 결과. ~330ms가 공정 사이클 대비 충분함을 데이터로 확인 후 단순 구조 유지. 최신 기술이 항상 현장 최적해는 아니다.',
    },
    {
      label: '비즈니스 감각',
      quote: '기술적으로 나은 결정이 비즈니스·관계 비용 관점에서 항상 나은 결정은 아니다.',
      body: 'EPC PM 시절 최적 기술 스펙보다 3국 이해관계자가 납득하는 스펙을 선택해 완수. AOI에서도 SAM의 기술적 정밀함보다 다현장 재라벨링 병목을 근거로 이미지 단위 접근의 배포 우위를 공유. 기술 선택이 곧 운영 비용임을 현장에서 증명.',
    },
    {
      label: '지식 관리',
      quote: 'AI가 대체할 수 없는 나의 맥락과 의사결정은 PKM에 저장한다.',
      body: 'CLI AI 세션 종료 시 맥락 소실 문제를 Obsidian Smart Connections(로컬 임베딩)로 노트를 벡터 인덱스화하고 세션 맥락을 Zettelkasten에 연결하는 워크플로우로 해결. RAG 아키텍처를 학습 도구에 내재화.',
    },
    {
      label: 'ML 파이프라인 설계',
      quote: '체크포인트는 resume·best·배포 세 역할을 분리해야 한다.',
      body: 'hesung 다중 클래스 학습에서 latest=best 복사 방식이 best가 초반 epoch일 때 resume이 퇴보가 되는 버그를 경험. latest.pth/best_vN.pth/best_vN.onnx 3파일 분리로 역할 혼용을 구조적으로 제거. 파일 하나에 두 역할을 섞으면 반드시 충돌한다.',
    },
    {
      label: '에이전트 설계',
      quote: '루프를 누가 제어하는가가 LLM 호출과 에이전트의 분기점이다.',
      body: 'tools.py(Stage 3)와 react.py(Stage 5)를 순차 구현하며 구조 차이를 코드로 도출. tools.py는 tool_calls 여부를 코드가 분기하는 1회성 구조, react.py는 while True를 코드가 제공하되 지속·종료를 모델이 매 턴 결정. 루프 제어권이 모델로 갈수록 복잡한 문제를 풀지만 예측 가능성·디버깅 난이도도 함께 상승.',
    },
  ],
  education: [
    'Intel AI for Future Workforce — 1,000시간+ AI 풀라이프사이클 실전 과정 이수 (LLM RAG·CV·VLM·시계열 다수 팀프로젝트)',
    'OPIc IH (영어) · 정보처리기사(필기 합격) · 대기환경기사 · 경희대학교 환경공학사',
  ],
};
