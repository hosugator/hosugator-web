// data/experienceData.ts
export const experienceData = {
  topLabel: "Experience",
  title: "Professional\nJourney.",
  items: [
    {
      company: "DTK",
      role: "AI Developer",
      period: "2026.03 - Present",
      description: "제조 도메인의 Vision AI · 엣지 인프라 · 현장 LLM 에이전트를 단독 설계·구현합니다.",
      highlights: [
        "AlignAI: 규칙 기반 OpenCV의 환경 민감도를 U-Net(EfficientNet-B0) Segmentation으로 대체 — 탐지율 100% · PASS율 91% · CPU 추론 ~330ms",
        "ProductConfig 레지스트리로 단일 레포 3개 제품 지원, GitHub SSOT 기반 ML CI/CD(학습→ONNX→GHCR→Argo CD 롤링)를 k3s 엣지 클러스터에 단독 구축 (엣지 케이스는 ADR로 문서화)",
        "Edge AI LMR: Field→Cloud 4계층 + Cycle_ID Golden Key + 1D-CNN→LSTM→DQN 3-Stage 체인으로 이상탐지 AUROC 99.99%, React+TS HMI 단독 운영",
        "LLM 에이전트 로드맵(function calling·ReAct 루프 직접 구현) · Agentic ERP 자동화로 수일 수작업을 정합성 100% 무인화 · Corning Varioptic(프랑스) 계약 협상 창구 병행",
      ],
      tags: ["Vision AI", "Edge AI", "MLOps", "k3s", "PyTorch", "Agentic AI"]
    },
    {
      company: "Intel AI for Future Workforce",
      role: "AI 풀라이프사이클 실전 과정",
      period: "2025",
      description: "1,000시간+ 엔드투엔드 AI 개발 실전 과정. 기획부터 배포까지 다수 팀 프로젝트를 완주했습니다.",
      highlights: [
        "Dotodo: LangChain·ChromaDB RAG + LLM-as-a-Judge 자율 평가로 응답 지연·API 비용 각 60%↓",
        "Sodam Diary: BLIP→CLIP→LLM VLM 3-Stage 파이프라인으로 운영비 30%↓ (한국장애인해커톤 본선)",
        "Pictag: Attention 임베딩 채택으로 Re-ID 50%↑ · OpenVINO INT8 엣지 추론 / Dorosee: 멀티모달 UGV(해커톤 대상)",
        "KDLC: SARIMA+LSTM+LightGBM 3-Model 가중 앙상블 · 45개+ 피처 공학",
      ],
      tags: ["LangChain", "RAG", "OpenVINO", "FastAPI", "PyTorch", "AWS"]
    },
    {
      company: "Zeeco Asia",
      role: "Project Manager",
      period: "2024.02 - 2025.04",
      description: "글로벌 연소 설비 기업에서 수십억 규모 EPC 프로젝트를 시운전 단계까지 총괄했습니다.",
      highlights: [
        "3국(미·인·한) 이해관계자 간 기술 충돌을 조율하는 커뮤니케이션 허브 역할 수행",
        "추상적 현장 요구를 기술 명세로 번역하고, 비기술 의사결정자에게 리스크·트레이드오프를 설명",
        "Q/C/D 관리와 선제적 리스크 대응으로 목표 마진율 +4% 초과 달성",
      ],
      tags: ["Strategic Communication", "Problem Solving", "PM", "Global Projects"]
    }
  ]
};
