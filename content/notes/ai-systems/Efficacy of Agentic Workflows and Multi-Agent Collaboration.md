---
created: 2026-03-26 15:25
updated: 2026-03-26 15:40
type: insight
status: 2-stable
subject: "[[MOC - AI]]"
project: "[[2026 자기계발]]"
tags:
  - agentic-workflow
  - llm-engineering
  - multi-agent-systems
  - prompt-engineering
  - cognition
  -
---
# Efficacy of Agentic Workflows and Multi-Agent Collaboration

## 1. 개요 (Insight)
단순한 제로샷 프롬프팅(Zero-shot Prompting)보다 역할을 분산하고 피드백 루프를 명시적으로 설계한 에이전틱 워크플로우(Agentic Workflow)가 LLM의 성능을 비약적으로 향상시킨다는 점이 학계와 산업계에서 입증되고 있다.

## 2. 주요 연구 및 패턴 (Research & Patterns)
- **Andrew Ng's Agentic Patterns**: Reflection, Tool Use, Planning, Multi-agent Collaboration. GPT-3.5 수준의 모델도 이 패턴을 적용하면 GPT-4의 제로샷 성능을 넘가할 수 있음.
- **Multi-Agent Systems (ChatDev, MetaGPT)**: CEO, CTO, Programmer 등 역할을 세분화하여 관심사 분리(Separation of Concerns)를 실현함으로써 할루시네이션을 줄이고 결과물의 정합성을 높임.

## 3. 공학적 근거 (Engineering Rationale)
- **확률 공간의 축소 (Narrowing Probability Space)**: 특정 페르소나와 작업 범위를 좁게 정의할수록 모델이 선택하는 토큰의 확률 분포가 정교해짐.
- **명시적 비평 루프 (Explicit Feedback Loops)**: '창조(Architect)'와 '비평(Critic)'의 인지 부하를 분리하여 상호 보완적인 고품질 결과물 도출.
- **외부 메모리 확장 (External Memory Expansion)**: '기록자(Doc-Architect)'를 통한 지식의 영속화로 모델의 컨텍스트 한계를 극복.

## 4. 결론 (Conclusion)
계층화된 에이전트 시스템은 단순히 구조적인 우아함을 넘어, LLM의 추론 능력을 공학적으로 최적화하는 가장 효율적인 전략이다.
