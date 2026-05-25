// data/insightsData.ts
export const insightsData = {
  topLabel: "Engineering Principles",
  title: "6가지\n엔지니어링 원칙.",
  items: [
    {
      number: "01",
      title: "비즈니스 감각",
      principle: "비즈니스 문제를 에이전틱 문제로 재정의하는 것이 에이전트 설계의 절반이다.",
      desc: "EPC PM 시절 3국 이해관계자의 추상적 현장 요구를 기술 명세로 번역한 경험이 AI 설계에 직결됩니다. 기술 선택이 곧 운영 비용임을 현장에서 증명했습니다.",
      project: "EPC PM → Edge AI LMR",
    },
    {
      number: "02",
      title: "자동화",
      principle: "반복 병목은 코드로 제거한다 — 자동화 범위를 먼저 정의해야 yak shaving을 피한다.",
      desc: "ERP Backup에서 공식 API 부재 환경을 Playwright + Promise.all로 돌파, 수일 수작업을 완전 무인 자동화로 전환했습니다. 정합성 100% 달성.",
      project: "ERP Backup",
    },
    {
      number: "03",
      title: "시스템 설계",
      principle: "데이터의 골든 키를 먼저 정의하면 시스템의 나머지는 따라온다.",
      desc: "다축 센서 데이터를 타임스탬프만으로 연결할 수 없는 문제에서 Cycle_ID를 Golden Key로 설정, 전 계층 단일 키 조인과 이상 구간 즉시 재현 루프를 확보했습니다.",
      project: "Edge AI LMR",
    },
    {
      number: "04",
      title: "지식 관리",
      principle: "AI가 대체할 수 없는 나의 맥락과 의사결정은 PKM에 저장한다.",
      desc: "Obsidian Smart Connections로 노트를 벡터 인덱스화하고 세션 맥락을 Zettelkasten에 연결하는 워크플로우를 직접 구축했습니다. RAG 아키텍처를 학습 도구 자체에 내재화.",
      project: "PKM + DaC",
    },
    {
      number: "05",
      title: "트러블슈팅",
      principle: "에러는 로그 기반으로 후보 원인을 좁혀 재발을 막는다.",
      desc: "GPU 드라이버 충돌로 비결정적 발현된 문제를 dmesg·journalctl 파싱으로 특정하고, ADR로 기록해 동일 이슈 재발을 구조적으로 방지했습니다.",
      project: "AlignAI · Linux",
    },
    {
      number: "06",
      title: "도구 활용",
      principle: "도구는 목적을 위해 존재한다 — 지금 이 작업이 목적에 유용한가를 먼저 자문한다.",
      desc: "LLM, CLI, PKM, 자동화 스크립트 등 다양한 도구를 조합하지만, 항상 '이 도구가 지금 목표에 기여하는가'를 먼저 검토합니다. 도구 학습이 목적을 대체하지 않도록 경계합니다.",
      project: "전 프로젝트 공통",
    },
  ],
};
