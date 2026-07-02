---
created: 2026-06-12
updated: 2026-06-12
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - llm
  - agent
  - learning-plan
  - multimodal
publish: true
---
## Context
Align AI 인프라 E2E(Docker, k8s, GitHub Actions, Argo CD) 학습을 마친 후 다음 인풋으로 LLM을 선택했다. 단순 API 호출 학습이 아니라 현장 적용 가능한 에이전트를 목표로 설정했다.

## Insight
### 목표 에이전트의 입력과 역할

```
사용자 입력 ──┐
화면 이미지 ──┤→ [에이전트] → 현장 판단 / 이상 설명 / 조치 제안
프로그램 로그 ─┤
소스 코드 ───┘
```

현장 오퍼레이터가 "왜 이상이 났는가"를 물으면, 화면 + 로그 + 코드를 종합해서 설명하고 조치를 제안하는 에이전트. 비전 AI가 탐지한 결과를 LLM이 설명하는 2단계 파이프라인.

### 빌딩 블록 4개를 순서대로 쌓는다

각 단계가 다음 단계의 전제가 된다. 건너뛰면 에이전트 오작동 원인을 디버깅할 수 없다.

**1단계: LLM API 텍스트 (1-2일)**
- system / user / assistant 역할 구조
- conversation history 관리
- 왜 이 순서인가: 멀티모달·툴 유즈도 결국 이 메시지 구조 위에 올라탄다

**2단계: 멀티모달 이미지 입력 (3-4일)**
- base64 인코딩으로 이미지 주입
- 화면 스크린샷 / 비전 AI 결과 이미지를 컨텍스트로 전달
- 왜 이 순서인가: 현장 에이전트의 핵심 입력이 이미지이므로 텍스트 다음으로 가장 중요

**3단계: Tool use (5일)**
- function calling 구조
- 에이전트가 도구를 선택하고 결과를 받아 다음 판단을 내리는 원리
- 왜 이 순서인가: RAG와 에이전트 루프 모두 툴 유즈 위에 구현됨

**4단계: RAG (2주차 1-2일)**
- 임베딩, 벡터 유사도 검색
- 로그 파일 / 소스 코드를 청크로 나눠 관련 부분만 컨텍스트에 주입
- 왜 이 순서인가: 로그·코드 전체를 컨텍스트에 넣으면 토큰 한계 + 노이즈

**5단계: ReAct 에이전트 루프 (2주차 3-4일)**
- Thought → Action → Observation 사이클
- 에이전트가 스스로 도구를 선택하고 결과를 관찰하며 다음 행동을 결정

**6단계: 통합 프로토타입 (2주차 5일)**
- 4개 입력을 받아 판단하는 에이전트 완성

## Related
- [[Study - My-LLM-Study-Log]] — 이전 LLM 학습 이력
- [[RAG은 어떻게 LLM을 진화시키나]] — RAG 개념 배경
- [[AI 에이전트 시대 실무자의 이해 수준 — 무엇을 알아야 하는가]] — 에이전트 학습 동기
- [[Industrial edge deployments split Windows hardware integration from Linux inference servers]] — 이 에이전트가 적용될 현장 컨텍스트
