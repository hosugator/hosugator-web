// data/insightsData.ts
export const insightsData = {
  topLabel: "Engineering Principles",
  title: "6가지\n엔지니어링 원칙.",
  items: [
    {
      number: "01",
      title: "비즈니스 감각",
      principle: "비즈니스 문제를 에이전틱 문제로 재정의하는 것이 에이전트 설계의 절반이다.",
      desc: "EPC PM 시절 3국 이해관계자의 추상적 요구를 기술 명세로 번역한 경험이 AI 설계에 직결됩니다. 기술적으로 나은 결정이 관계·운영 비용 관점에서 항상 최선은 아니며, 기술 선택이 곧 운영 비용임을 현장에서 증명했습니다.",
      project: "EPC PM → Edge AI LMR",
    },
    {
      number: "02",
      title: "자동화",
      principle: "반복 병목은 코드로 제거한다 — 단, 자동화 범위를 먼저 정의해야 yak shaving을 피한다.",
      desc: "입사 1주차, 공식 API 부재 환경에서 Playwright + Promise.all Agentic 파이프라인으로 수만 건 결재 문서 백업을 돌파했습니다. 수일 수작업을 정합성 100% 완전 무인 자동화로 전환했습니다.",
      project: "ERP Backup",
    },
    {
      number: "03",
      title: "시스템 설계",
      principle: "데이터의 골든 키를 먼저 정의하면 시스템의 나머지는 따라온다.",
      desc: "다축 센서 데이터를 타임스탬프만으로 연결할 수 없는 문제에서 Cycle_ID를 Golden Key로 설정, 전 계층 단일 키 조인과 이상 구간 즉시 재현·처방 루프를 확보했습니다. 인프라 설계 전 데이터 모델 정의가 선행되어야 합니다.",
      project: "Edge AI LMR",
    },
    {
      number: "04",
      title: "평가 설계",
      principle: "모델이 좋은지는 평가 설계가 결정한다 — 평가 없이 배포는 없다.",
      desc: "이상 발생률 1% 미만 환경에서 accuracy 대신 AUROC를 핵심 지표로 재정의해 99.99%를 확보했고, Dotodo에서는 LLM-as-a-Judge 자율 평가 루프로 사람 없이 추천 품질을 검증하며 API 비용 60%를 절감했습니다.",
      project: "Edge AI LMR · Dotodo",
    },
    {
      number: "05",
      title: "에이전트 설계",
      principle: "루프를 누가 제어하는가가 LLM 호출과 에이전트의 분기점이다.",
      desc: "tool_calls 분기(코드 제어)와 ReAct 루프(모델이 while True 종료를 매 턴 결정)를 순서대로 직접 구현하며 구조적 차이를 코드 레벨로 체득했습니다. 제어권이 모델로 넘어갈수록 표현력과 디버깅 난이도가 함께 오릅니다.",
      project: "AlignAI LLM Agent",
    },
    {
      number: "06",
      title: "지식 관리",
      principle: "AI가 대체할 수 없는 나의 맥락과 의사결정은 PKM에 저장한다.",
      desc: "CLI AI 세션이 끊길 때 맥락이 소실되는 문제에서, Obsidian Smart Connections(로컬 임베딩)로 노트를 벡터 인덱스화하고 세션 맥락을 Zettelkasten에 연결하는 워크플로우를 구축했습니다. RAG 아키텍처를 학습 도구 자체에 내재화했습니다.",
      project: "PKM + Docs-as-Code",
    },
  ],
};
