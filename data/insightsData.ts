// data/insightsData.ts
// IDENTITY 섹션의 accordion 목록 — Master Resume 인사이트 큐레이션(넓이순).
// 기본은 원칙(principle) 한 줄, 클릭 시 맥락(desc) 펼침.
export const insightsData = {
  topLabel: "Engineering Principles",
  title: "엔지니어링 원칙.",
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
      title: "자동화",
      principle: "3회 이상 반복되는 병목은 반드시 자동화한다.",
      desc: "입사 1주차, 공식 API 부재 제약에서 수만 건 결재 문서 수작업 병목을 Playwright Agentic 파이프라인으로 100% 정합성 무인 자동화 전환. 단, git worktree 멀티 브랜치 병렬 개발에선 인간의 인지 맥락 한계가 실질적 병목임을 확인 — 자동화 범위를 먼저 정의해야 yak shaving을 피한다.",
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
      principle: "모델이 좋은지는 평가 설계가 결정한다.",
      desc: "Edge AI LMR에서 이상 발생률 1% 미만이라 accuracy 99%는 무의미 → AUROC를 핵심 메트릭으로 재정의. Dotodo에서는 LLM-as-a-Judge 자율 평가 루프로 사람 없이 품질을 검증하고 API 비용 60% 절감. 평가 없이 배포는 없다.",
      project: "Edge AI LMR · Dotodo",
    },
    {
      number: "05",
      title: "트레이드오프",
      principle: "정확도와 지연의 최적점은 현장 데이터로만 결정된다.",
      desc: "AlignAI에서 TensorRT 대신 CPU ONNX Runtime을 선택한 것은 현장 추론 빈도·하드웨어를 측정한 결과. ~330ms가 공정 사이클 대비 충분함을 데이터로 확인 후 단순 구조를 유지했다. 최신 기술이 항상 현장 최적해는 아니다.",
      project: "AlignAI",
    },
    {
      number: "06",
      title: "ML 파이프라인 설계",
      principle: "체크포인트는 resume·best·배포 세 역할을 분리해야 한다.",
      desc: "다중 클래스 학습에서 latest=best 복사 방식이, best가 초반 epoch일 때 resume이 퇴보가 되는 버그를 경험. latest.pth / best_vN.pth / best_vN.onnx 3파일 분리로 역할 혼용을 구조적으로 제거했다. 파일 하나에 두 역할을 섞으면 반드시 충돌한다.",
      project: "AlignAI",
    },
    {
      number: "07",
      title: "에이전트 설계",
      principle: "루프를 누가 제어하는가가 LLM 호출과 에이전트의 분기점이다.",
      desc: "tool_calls 분기(코드 제어)와 ReAct 루프(모델이 while True 종료를 매 턴 결정)를 순서대로 직접 구현하며 구조적 차이를 코드 레벨로 체득했습니다. 제어권이 모델로 넘어갈수록 표현력과 디버깅 난이도가 함께 오릅니다.",
      project: "AlignAI LLM Agent",
    },
    {
      number: "08",
      title: "비즈니스 감각",
      principle: "기술적으로 나은 결정이 비즈니스·관계 비용 관점에서 항상 나은 결정은 아니다.",
      desc: "EPC PM 시절 최적 기술 스펙보다 3국 이해관계자가 납득하는 스펙을 선택해 완수. AOI에서도 SAM의 기술적 정밀함보다 다현장 재라벨링 병목을 근거로 이미지 단위 접근의 배포 우위를 공유. 기술 선택이 곧 운영 비용임을 현장에서 증명.",
      project: "EPC PM · AOI",
    },
    {
      number: "09",
      title: "지식 관리",
      principle: "AI가 대체할 수 없는 나의 맥락과 의사결정은 PKM에 저장한다.",
      desc: "CLI AI 세션 종료 시 맥락 소실 문제를, Obsidian Smart Connections(로컬 임베딩)로 노트를 벡터 인덱스화하고 세션 맥락을 Zettelkasten에 연결하는 워크플로우로 해결. RAG 아키텍처를 학습 도구에 내재화했다.",
      project: "PKM · Zettelkasten",
    },
  ],
};
