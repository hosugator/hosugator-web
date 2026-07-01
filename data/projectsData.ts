// data/projectsData.ts
export const projectsData = {
    topLabel: "Featured Projects",
    title: "Technical \nImplementations.",
    items: [
        {
            title: "Edge AI LMR: 렌즈 열성형 공정 지능화",
            tags: ["#Industrial-AI", "#Edge", "#PyTorch"],
            desc: "Field→Cloud 4계층 아키텍처 위에 1D-CNN→LSTM→DQN 3-Stage AI 체인을 구축한 제조 현장 AI 시스템. Cycle_ID Golden Key 설계로 전 계층 단일 키 조인 및 이상 구간 즉시 재현 루프 확보. AUROC 99.99% 달성. Docker 엣지 배포 + k3s 전환 아키텍처 설계, React+TS 실시간 HMI 운영 중.",
            pdfLink: "/portfolio.pdf#page=2",
            demoLink: "#",
            video: "",
            image: "/projects/edge_ai_lmr_thumb.png"
        },
        {
            title: "ERP Backup: 레거시 ERP 데이터 마이그레이션 자동화",
            tags: ["#Automation", "#TypeScript", "#Playwright"],
            desc: "공식 API 부재 + 비표준 동적 팝업 환경에서 Playwright + Promise.all로 비동기 Race Condition을 구조적으로 제거한 완전 무인 자동화 엔진. 입사 1주차 단독 개발. POM 패턴 유지보수성, .env 자격증명 분리, CSV 전수 감사 로그(Auditability). 수일 수작업 → 정합성 100% 달성.",
            pdfLink: "/portfolio.pdf#page=5",
            demoLink: "#",
            video: "",
            image: "/projects/erp_backup_thumb.png"
        },
        {
            title: "Dotodo: 음성 입력 기반 AI 개인화 할 일 추천 서비스",
            tags: ["#LangChain", "#RAG", "#FastAPI"],
            desc: "LangChain · ChromaDB 기반 RAG 파이프라인과 MSA 아키텍처(Backend/Model Server 분리)로 모델 업그레이드 무중단 구현. Mecab-ko 형태소 분석 + 768D 벡터 유사도 Top-K=3 검색. LLM as a Judge 자율 품질 검증 루프로 API 비용 60% 절감.",
            pdfLink: "/projects/dotodo_ko.pdf",
            demoLink: "#",
            video: "/projects/dotodo_demo.mov",
            image: "/projects/dotodo_thumb.png"
        },
        {
            title: "Sodamdiary: 시각장애인을 위한 음성 기반 사진 해설 앱",
            tags: ["#VLM", "#OpenVINO", "#FastAPI"],
            desc: "GPT-4V 단독 운영(월 130만원·응답 30초)을 BLIP+CLIP+LLM 3-Stage 파이프라인으로 대체. OpenVINO 4-bit 양자화 + asyncio 병렬 처리로 응답 20초·운영비 30% 절감 달성. 2025 한국장애인해커톤 본선 진출.",
            pdfLink: "/projects/sodamdiary_ko.pdf",
            demoLink: "#",
            video: "/projects/sodamdiary_demo.mp4",
            image: "/projects/sodamdiary_thumb.png"
        },
        {
            title: "Pictag: 소상공인 맞춤형 경량화 CCTV AI SaaS",
            tags: ["#Re-ID", "#OpenVINO", "#WebSocket"],
            desc: "YOLO 백본 분해 후 Linear / Pooling / Attention Head 3가지 임베딩 방식 A/B 실험 — Attention 채택으로 Re-ID 정확도·학습 효율 50%↑. OpenVINO INT8 양자화로 GPU 없는 엣지 실시간 추론 달성. 4-Thread 독립 큐 파이프라인, Django+WebSocket 히트맵 대시보드.",
            pdfLink: "/projects/pictag_ko.pdf",
            demoLink: "#",
            video: "/projects/pictag_demo.mp4",
            image: "/projects/pictag_thumb.png"
        },
        {
            title: "Hosugator: Cloud-Native Portfolio Architecture",
            tags: ["#Next.js", "#AWS", "#GitHub-Actions"],
            desc: "Next.js 기반 포트폴리오를 AWS S3 + CloudFront 서버리스 환경으로 구축. GitHub Actions CI/CD 파이프라인으로 무중단 배포, OIDC 기반 키 없는 인증, Route 53 + ACM 보안 최적화.",
            pdfLink: "/projects/hosugator_ko.pdf",
            demoLink: "#",
            video: "",
            image: "/projects/hosugator_thumb_latest.png"
        },
        {
            title: "Cureat: AI 미식 추천 시스템",
            tags: ["#NLP", "#VectorDB", "#FastAPI"],
            desc: "파편화된 비정형 미식 데이터를 수집하고 Ko-BERT 필터링으로 광고성 콘텐츠를 20%+ 제거. Okt 형태소 분석으로 사용자 의도를 파악하고 2-Stage 하이브리드 검색(Vector DB 코사인 유사도)으로 정교한 개인화 추천을 구현. FastAPI 비동기 파이프라인으로 응답 지연 최소화.",
            pdfLink: "/projects/cureat_ko.pdf",
            demoLink: "#",
            video: "/projects/cureat_demo.mov",
            image: "/projects/cureat_thumb.png"
        },
        {
            title: "Dorosee: CV/LLM 통합 멀티모달 UGV 플랫폼",
            tags: ["#CV", "#LLM", "#ROS"],
            desc: "2025 UWC 해커톤 대상 수상작. YOLOv8 파인튜닝과 LLM 음성 인터페이스를 결합한 상황 인지 멀티모달 UGV(무인 지상 차량) 플랫폼. Unity 3D 시뮬레이션 환경으로 하드웨어 제약을 극복하고 AI 모델 통합 테스트를 완수.",
            pdfLink: "/projects/dorosee_ko.pdf",
            demoLink: "#",
            video: "/projects/dorosee_demo.mp4",
            image: "/projects/dorosee_thumb.png"
        },
        {
            title: "KDLC: 물류센터 수요 예측 경진대회",
            tags: ["#Time-Series", "#Ensemble", "#Feature-Engineering"],
            desc: "45개+ 피처 공학(Lag·Rolling·sin/cos 주기성 인코딩)과 SARIMA+LSTM+LightGBM 3-Model 가중 앙상블. TimeSeriesSplit으로 Data Leakage 구조적 차단. 피처 설계가 모델 선택보다 성능에 더 큰 영향임을 실증.",
            pdfLink: "/portfolio.pdf#page=12",
            demoLink: "#",
            video: "",
            image: "/projects/kdlc_thumb.png"
        },
    ]
};
