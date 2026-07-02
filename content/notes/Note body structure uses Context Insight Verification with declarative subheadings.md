---
created: 2026-05-19
updated: 2026-05-19
type: insight
status: 2-stable
subject: "[[PKM]]"
project: "[[Self-development in 2026]]"
tags:
  - pkm
  - note-structure
  - writing
publish: true
---
## Context

기존 템플릿(Ver 1.2)은 Essence / Mechanism / Connection 구조였다. insight·study 노트를 쓰면서 중제목이 Why / When 같은 6하 원칙이나 임의 명사형으로 혼재되었다. 구조가 일정하지 않아 나중에 읽을 때 내용이 눈에 잘 들어오지 않는 문제가 있었다.

## Decision

**insight·study 노트의 본문 구조를 아래로 통일한다.**

```
## Context      ← 배경, 상황 (필수)
## Insight      ← 핵심 발견 (필수)
## Verification ← 검증 사례, 반례, 업데이트 (선택)
```

**소제목(###)은 명제형으로 작성한다.**

파일명이 명제형인 것과 같은 이유 — 헤딩 자체가 인사이트를 담아야 스캔 시 내용이 전달된다.

```
# Bad
### Why

# Good
### 조직 공백이 역할 팽창을 만든다
```

Verification은 인사이트가 실제로 맞았는지 추적하는 용도. status: superseded와 자연스럽게 연결된다.

## Consequences

- Context만 있고 Insight가 없으면 노트가 일기에 가까워진다 — Insight 섹션이 없으면 저장 가치를 재검토한다.
- Verification이 쌓이면 인사이트의 신뢰도와 수명을 평가할 수 있다.
- 기존 노트에 소급 적용은 하지 않는다. 새로 쓰거나 수정할 때 자연스럽게 전환한다.

→ 관련: [[Sentence case English with spaces is the PKM filename standard]] [[PKM Infrastructure Design]]
