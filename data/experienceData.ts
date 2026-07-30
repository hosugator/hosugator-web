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
      // 프로젝트로 링크 — 이 시기에 한 일의 증거는 highlights 재서술이 아니라 Projects 섹션에 있다.
      projects: ["AlignAI", "Edge AI LMR", "ERP Backup"],
      tags: ["Vision AI", "Edge AI", "MLOps", "k3s", "PyTorch", "Agentic AI"]
    },
    {
      company: "Intel AI for Future Workforce",
      role: "AI 풀라이프사이클 실전 과정",
      period: "2025",
      description: "1,000시간+ 엔드투엔드 AI 개발 실전 과정. 기획부터 배포까지 다수 팀 프로젝트를 완주했습니다.",
      projects: ["Dotodo", "Sodamdiary", "Pictag", "Dorosee", "KDLC"],
      tags: ["LangChain", "RAG", "OpenVINO", "FastAPI", "PyTorch", "AWS"]
    },
    {
      company: "Zeeco Asia",
      role: "Project Manager",
      period: "2024.02 - 2025.04",
      description: "글로벌 연소 설비 기업에서 수십억 규모 EPC 프로젝트를 시운전 단계까지 총괄했습니다.",
      // 연결할 프로젝트 카드가 없는 유일한 경력 — 토글 펼침으로 상세를 남긴다.
      highlights: [
        "3국(미·인·한) 이해관계자 간 기술 충돌을 조율하는 커뮤니케이션 허브 역할 수행",
        "추상적 현장 요구를 기술 명세로 번역하고, 비기술 의사결정자에게 리스크·트레이드오프를 설명",
        "Q/C/D 관리와 선제적 리스크 대응으로 목표 마진율 +4% 초과 달성",
      ],
      tags: ["Strategic Communication", "Problem Solving", "PM", "Global Projects"]
    }
  ]
};
