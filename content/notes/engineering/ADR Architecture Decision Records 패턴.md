---
created: 2026-03-30 10:58
updated: 2026-03-30 10:58
type: insight
status: 2-stable
subject: "[[MOC - PKM]]"
project: "[[2026 자기계발]]"
tags:
  - adr
  - architecture-decision
  - documentation-pattern
  - software-engineering
---

# ADR (Architecture Decision Records) 패턴

## 정의

기술적 의사결정의 배경, 이유, 트레이드오프를 기록하는 문서 패턴. 소프트웨어 아키텍처를 설계할 때 내린 '결정'과 그 '이유(맥락)'를 짧은 텍스트 파일로 보존한다.

> 엔지니어링에서 가장 위험한 상황 중 하나: "이거 왜 이렇게 설계되어 있죠?"에 "원래 그렇게 되어 있었는데요"라고 답하는 것.

## 형식: Context → Decision → Consequences

```markdown
## Context
결정이 필요하게 된 배경과 문제 상황. 어떤 제약 사항이 있었나?

## Decision
선택한 해결책과 이유. 왜 이 선택을 했나?

## Consequences
### 긍정적 결과
- ...
### 부정적 결과 / 트레이드오프
- ...
### 후속 작업
- ...
```

## 파일명: 순번 기반

형식: `NNN-kebab-case-title.md`

날짜 대신 순번을 쓰는 이유 두 가지:
1. **코드 주석 인용 안정성**: `// see adr/003-modbus-polling-strategy` — 날짜가 아닌 번호이므로 변경되지 않는다.
2. **맥락의 순서**: 결정들 사이의 선후 관계(어떤 결정이 어떤 결정을 전제로 했는지)가 의미를 가진다.

## 삭제 금지 원칙

결정이 번복되더라도 기존 ADR을 삭제하지 않는다.

- 기존 ADR: `status: superseded`로 표시 + "이 결정은 ADR-NNN으로 대체됨" 명시
- 새 ADR: 새 번호로 추가, 이전 결정과의 관계를 Context에 서술

이유: 왜 번복했는지의 맥락 자체가 지식이다.

## 코드 주석 인용 패턴

```python
# Polling interval은 500ms로 고정 — see adr/003-modbus-polling-strategy
POLLING_INTERVAL_MS = 500
```

코드와 결정 사이의 추적성(traceability)을 확보하는 핵심 기법.

## 가치

- **히스토리 파악**: 6개월 뒤의 나 또는 신규 팀원이 당시 고민 맥락을 이해할 수 있다.
- **중복 논의 방지**: 이미 검토하고 기각한 선택지를 다시 논의하는 낭비를 막는다.
- **책임과 근거**: 추측이 아닌 데이터와 논리에 기반한 결정을 유도한다.

## 위치

> 가장 중요하지만 가장 자주 누락되는 문서 유형.

팀이 기술 결정을 내리는 순간마다 즉시 `1-draft` 상태로 생성하는 것이 핵심이다. 사후 작성은 맥락을 잃는다.

## 관련 노트

- [[Docs-as-Code 원칙]] — ADR이 따르는 문서 관리 기반 원칙 (파일명 불변, frontmatter 필수 등)
- [[ADR.md]] — 기존 ADR 개요 노트 (초기 개념 정리)
