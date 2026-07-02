// data/insightsData.ts
export const insightsData = {
  topLabel: "Engineering Principles",
  title: "3가지\n엔지니어링 원칙.",
  items: [
    {
      number: "01",
      title: "E2E 오너십",
      principle: "사업 정의부터 제품 배포·운영까지 전 주기를 책임질 때 AI는 현장에서 작동한다.",
      desc: "글로벌 EPC PM으로 장기 프로젝트의 시작과 끝을 관리한 경험이, 기획·데이터·ML·인프라·배포·운영까지 전 계층을 잇는 풀스택 실행으로 이어집니다. 실제 제조 공정에 GitOps·k3s로 AI를 배포·운영하며 비즈니스 임팩트를 증명했습니다.",
      project: "EPC PM → AlignAI 배포·운영",
    },
    {
      number: "02",
      title: "시스템 설계",
      principle: "데이터의 골든 키를 먼저 정의하면 시스템의 나머지는 따라온다.",
      desc: "다축 센서 데이터를 타임스탬프만으로 연결할 수 없는 문제에서 Cycle_ID를 Golden Key로 설정, 전 계층 단일 키 조인과 이상 구간 즉시 재현·처방 루프를 확보했습니다. 인프라 설계 전 데이터 모델 정의가 선행되어야 합니다.",
      project: "Edge AI LMR",
    },
    {
      number: "03",
      title: "에이전트 설계",
      principle: "루프를 누가 제어하는가가 LLM 호출과 에이전트의 분기점이다.",
      desc: "tool_calls 분기(코드 제어)와 ReAct 루프(모델이 while True 종료를 매 턴 결정)를 순서대로 직접 구현하며 구조적 차이를 코드 레벨로 체득했습니다. 제어권이 모델로 넘어갈수록 표현력과 디버깅 난이도가 함께 오릅니다.",
      project: "AlignAI LLM Agent",
    },
  ],
};
