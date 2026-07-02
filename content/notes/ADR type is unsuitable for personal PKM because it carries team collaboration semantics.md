---
created: 2026-05-26
updated: 2026-05-26
type: insight
status: 2-stable
subject: "[[PKM]]"
project: "[[Self-development in 2026]]"
tags:
  - pkm
  - adr
  - insight
  - type-system
  - knowledge-management
publish: true
---

## Context

[[pkm-역할-재정의]](2026-05-08)에서 `type: adr`을 PKM에 도입했다. 개인 결정 기록 전용 타입으로 설계했고, 기존 status 값으로 ADR 상태를 매핑했다. 이후 pkm-management 스킬 재정비 과정에서 `adr` 타입을 제거하고 `insight + ## Decision` 섹션으로 통합했다.

## Insight

### ADR은 팀 협업 도구로 설계된 형식이다

ADR의 핵심 가정은 **여러 사람이 결정을 공유·리뷰·추적**한다는 것이다. 제목에 전환 조건이 필요하고, 별도 파일로 분리하며, status를 proposed → accepted → superseded로 명시적으로 관리하는 이유가 여기에 있다.

개인 PKM에서는 이 협업 가정이 성립하지 않는다. 리뷰어가 없고, 결정의 SSOT가 이미 나 자신이다.

### insight + Decision 섹션이 개인 결정 기록에 충분하다

`subject`로 지식 도메인을, `project`로 발생 맥락을 이미 표현할 수 있다. `## Decision` 섹션에 결정·이유·전환 조건을 담으면 단일 노트가 원리(insight)와 결정(adr) 두 역할을 동시에 수행한다.

별도 타입을 만들수록 type 판별 인지 부담만 늘고 실질 표현력은 늘지 않는다.

## Decision

`type: adr`을 PKM type 목록에서 제거. 개인 결정은 `type: insight` + `## Decision` 섹션으로 기록.

전환 조건: 결정에 리뷰어·승인 추적이 필요한 상황이 생기면 재도입 검토. 그 시점은 개인 PKM이 아닌 팀 협업 공간이 필요하다는 신호다.

## Related

- [[pkm-역할-재정의]] — 이 결정의 반대 방향: `type: adr` 도입 결정. 해당 노트의 Decision #2가 본 노트로 대체됨
- [[PKM outlasts any project and is the single source of truth that skills derive from]] — insight + ADR 통합의 SSOT 맥락
- [[ADR titles capture decision and transition condition rather than arguable propositions]] — ADR 제목 형식이 insight와 다른 이유 (type 통합 후에도 제목 컨벤션은 유지)
