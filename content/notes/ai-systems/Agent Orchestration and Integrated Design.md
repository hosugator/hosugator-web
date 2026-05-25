---
created: 2026-03-26 15:05
updated: 2026-03-26 15:40
type: insight
status: 2-stable
subject: "[[MOC - AI]]"
project: "[[2026 자기계발]]"
tags:
  - agent-orchestration
  - software-architecture
  - domain-driven-design
  - modularity
  - efficiency
  -
---
# Agent Orchestration and Integrated Design

## 1. 개요 (Insight)
복잡한 작업을 수행하는 AI 에이전트 시스템에서 에이전트의 수는 **'필요악'**이다. 에이전트가 많아질수록 전문성은 높아지지만, 맥락 전환(Context Switching) 비용과 중복된 데이터 전달 문제가 발생한다.

## 2. 통합의 원리 (Principles of Consolidation)
- **도메인 응집도(Domain Cohesion)**: 작업의 '주제'가 아닌 '책임 영역'을 기준으로 통합한다. (예: 로직 설계, 데이터 설계, 네트워크 설계는 모두 '시스템 아키텍처'라는 하나의 도메인에 속함)
- **명확한 진입점(Entry Point)**: 오케스트레이터(PM)를 도입하여 복잡한 전체 프로세스를 분해하고 분배하는 '단일 책임 원칙'을 적용한다.
- **분리된 기록 책임(Separated Documentation)**: '수행자'와 '기록자'를 분리함으로써 수행자는 작업 품질에만 집중하고, 기록자는 전체 지식의 정합성과 정제 품질을 높인다.

## 3. 에이전트 설계 패턴 (Agentic Design Patterns)
### 5-Expert 모델 (The 5-Expert Model)
사용자 인터페이스, 시스템 구조, 품질 검증, 지식 관리, 전체 지휘라는 5대 도메인을 독립적인 페르소나로 정의하는 패턴이다. 이는 인간 소프트웨어 개발 팀의 전형적인 구성을 모방하여 협업 효율을 최적화한다.

## 4. 교훈 (Lessons Learned)
- **네이밍 컨벤션**: 에이전트(Personas)와 스킬(Protocols)의 이름을 명확히 구분함으로써 사용자 직관성과 시스템 호출의 정합성을 동시에 확보할 수 있다.
- **오케스트레이터의 가치**: AI 에이전트가 단독으로 작업을 완수하기보다, PM 역할을 수행하는 에이전트가 전체 사이클(Research-Strategy-Execution)을 모니터링할 때 결과물의 품질이 가장 안정적이다.
