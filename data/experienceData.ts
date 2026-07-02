// data/experienceData.ts
export const experienceData = {
  topLabel: "Experience",
  title: "Professional\nJourney.",
  items: [
    {
      company: "DTK",
      role: "AI Developer",
      period: "2026.03 - Present",
      description: "제조 도메인 Vision AI를 단독 설계·구현. AlignAI: 규칙 기반 OpenCV를 U-Net Segmentation으로 대체(탐지율 100% · PASS율 91% · CPU 추론 ~330ms), ProductConfig 레지스트리로 단일 레포 3개 제품 지원, latest/best/onnx 3파일 분리 체크포인트로 resume 복원 버그 제거, GitHub SSOT 기반 ML CI/CD(GHCR→Argo CD)를 k3s 엣지 클러스터에 단독 구축(엣지 케이스는 ADR로 기록). Edge AI LMR: Field→Cloud 4계층 · 3-Stage AI 체인으로 AUROC 99.99%. Agentic ERP 자동화로 수일 수작업을 정합성 100% 무인화. Corning Varioptic(프랑스) 계약 협상 창구 병행.",
      tags: ["Vision AI", "Edge AI", "MLOps", "k3s", "PyTorch", "Agentic AI"]
    },
    {
      company: "Intel AI for Future Workforce",
      role: "AI 풀라이프사이클 실전 과정",
      period: "2025",
      description: "1,000시간+ 엔드투엔드 AI 개발 실전 이수. Dotodo(LangChain RAG·LLM as a Judge), Sodam Diary(VLM 3-Stage 파이프라인·해커톤 본선), Pictag(Re-ID SaaS·OpenVINO INT8), Dorosee(UGV·해커톤 대상), KDLC(시계열 3-Model 앙상블) 등 다수 팀 프로젝트.",
      tags: ["LangChain", "RAG", "OpenVINO", "FastAPI", "PyTorch", "AWS"]
    },
    {
      company: "Zeeco Asia",
      role: "Project Manager",
      period: "2024.02 - 2025.04",
      description: "글로벌 연소 설비 기업 수십억 규모 EPC 프로젝트를 시운전 단계까지 총괄. 3국(미·인·한) 이해관계자 기술 조율 허브 역할. 추상적 현장 요구를 기술 명세로 번역하고 Q/C/D·선제적 리스크 관리로 목표 마진율 +4% 초과 달성.",
      tags: ["Strategic Communication", "Problem Solving", "PM", "Global Projects"]
    }
  ]
};
