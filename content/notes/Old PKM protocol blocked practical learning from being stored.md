---
created: 2026-05-18
updated: 2026-05-18
type: insight
status: 2-stable
subject: "[[PKM]]"
project: "[[Self-development in 2026]]"
tags:
  - pkm
  - protocol
  - adr
publish: true
---
## Context
Corning GTC 검토 세션에서 처음 문제가 드러났다.
세션에서 배운 계약 개념들(비례적 면책, Distributor Investment Protection Clause 등)을 PKM에 남기려 하자 기존 프로토콜이 막았다. 저장 금지 원칙이 "LLM이 답할 수 있으면 저장 금지"였고, study 판별 기준이 "EIP, 독서 등 공식 학습 프로젝트"로 한정되어 있었기 때문이다.
핵심 갈등: 프로젝트 레포는 한시적이고, PKM은 영구적이다. 실무에서 처음 만난 개념이 프로젝트 레포에만 남으면, 프로젝트가 닫힌 후 그 학습 맥락도 함께 사라진다. 평생 SSOT가 PKM이어야 한다면, 실무 학습도 PKM으로 끌어올려야 한다.

## Decision
저장 금지 원칙 재정의: LLM 대체 가능성이 기준이 아니다. 개인적 맥락(내가 이것을 언제, 어떤 상황에서 만났는가)이 없는 순수 사전적 정의만 금지한다.
study 판별 기준 교체: "특정 학습 프로젝트(EIP, 독서) 맥락인가?" → "처음 만난 상황이 구체적으로 기억나는가? 나중에 같은 개념을 다시 마주쳤을 때 그 맥락이 이해를 돕는가?"
형식 강제 없음: `first-encounter`를 의무 섹션으로 강제하지 않는다. 가드레일은 판별 기준(진입 게이트)에 있어야 하고, 통과 후 작성은 자유롭다. 단, 본문은 개념 정의보다 접촉 상황을 먼저 서술하는 것을 원칙으로 한다.

## Consequences
- 실무 프로젝트에서 배운 개념이 PKM 지식 그래프에 연결될 수 있다
- 프로젝트 레포 → PKM으로의 지식 상승 흐름이 프로토콜에 명시된다
- 리스크: 판별 기준이 느슨해지면 덤프 노트가 늘 수 있다 — 진입 게이트 질문을 엄격하게 적용해야 한다

## Related
-  [[first-distribution-agreement-negotiation]] [[Deep understanding creates authority even if just focal point]]
