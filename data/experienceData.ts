// data/experienceData.ts
//
// WHY 숫자가 거의 없나 (2026-09-28 개편)
//   딥오토 지원서를 10쪽에서 4쪽으로 줄이며 세운 규칙을 사이트에도 적용했다 — 섹션마다 한 가지만
//   말한다. PATH 는 「어디서 무엇을 했나」의 흐름이고, 수치 · 과정 · 다이어그램은 Projects 가 맡는다.
//   같은 수치가 두 곳에 있으면 한 곳이 갱신에서 밀려 서로 어긋난다(Edge AI LMR 99.99% 가 그 경우였다).
// Pic-Tag 는 뺐다 — 그 프로젝트의 ML 엔지니어가 본인이 아니다(data/resumeLevitVision.ts 참고).
export const experienceData = {
  topLabel: "Experience",
  title: "Professional\nJourney.",
  items: [
    {
      company: "DTK",
      role: "AI Developer",
      period: "2026.03 - Present",
      description: "제조 비전 검사를 규칙 기반에서 딥러닝으로 옮기고, 모델을 재는 기준까지 세웁니다.",
      highlights: [
        "GV-001 — 검출 좌표에서 격자 구조 복원, 라벨 · 평가 기준 설계",
        "AlignAI — U-Net 전환, GitOps ML CI/CD, 설명 에이전트 PoC",
        "V1-AOI — 라벨 없는 이물 검사 · Edge AI LMR (설계) · ERP 자동화",
      ],
      tags: ["Vision AI", "Evaluation", "MLOps", "PatchCore", "LLM Agent (PoC)"]
    },
    {
      company: "Intel AI for Future Workforce",
      role: "AI 풀라이프사이클 실전 과정",
      period: "2025",
      description: "1,000시간 AI 풀사이클 과정 — RAG · VLM · CV 팀 프로젝트를 기획부터 배포까지 완주했습니다.",
      highlights: [
        "Dorosee — 멀티모달 응급상황 탐지 UGV, 2025 UWC 해커톤 대상",
        "Sodam Diary — VLM 사진 해설, 한국장애인해커톤 본선",
        "Dotodo — 음성 RAG 추천과 LLM-as-a-Judge 평가 루프",
      ],
      tags: ["RAG", "VLM", "YOLOv8", "FastAPI", "PyTorch"]
    },
    {
      company: "Zeeco Asia",
      role: "Project Manager",
      period: "2024.02 - 2025.04",
      description: "글로벌 연소 설비 기업에서 수십억 규모 EPC 프로젝트를 시운전까지 총괄했습니다.",
      highlights: [
        "미 · 인 · 한 3국 이해관계자의 기술 충돌 조율",
        "추상적 현장 요구를 기술 명세로 번역",
        "목표 마진율 4% 초과 달성",
      ],
      tags: ["Strategic Communication", "Problem Solving", "PM", "Global Projects"]
    }
  ]
};
