---
created: 2026-07-16
updated: 2026-07-16
type: insight
status: 2-stable
subject: "[[PKM]]"
project: "[[Corning Varioptic]]"
tags: [documentation, information-architecture, decision]
publish: true
---
## Rationale
계정별 파이프라인 상태(prospect→contact→demo→proposal→poc→won/lost)는 "지금 상태"라는 점에서 SPEC과 같지만, 변경 빈도가 SPEC의 다른 문서(세그먼트 정의, 제품 개요 등)보다 훨씬 높고 성격도 다르다(회사 단위로 반복되는 CRM 스키마). 
SPEC 폴더 밑에 넣으면 느리게 바뀌는 설계·전략 문서와 빠르게 바뀌는 영업 기록이 뒤섞여, "SPEC은 항상 최신 상태"라는 정의가 실제로는 무의미해진다.

## Context
DTK-Corning Varioptic 프로젝트에서 기존 `corning/`·`internal/`·`research/`·`strategy/` 구조를 `adr/`·`spec/`·`comms/`로 재편하면서, 원래 있던 `accounts/`(고객사별 `{company}/000_overview.md` 파이프라인 폴더)를 어디로 옮길지 결정해야 했다.

## Decision
`accounts/`를 `spec/accounts/`로 흡수하지 않고, `adr/`·`spec/`·`comms/`와 같은 레벨의 별도 최상위 폴더로 유지했다.

```
adr/       의사결정 기록 (closed, append-only)
spec/      현재 상태 문서 — 느리게 변함 (세그먼트 정의, 제품 개요, 계약 조건 등)
comms/     청중별 커뮤니케이션 기록 (closed)
accounts/  고객사별 파이프라인 — 빠르게 변함, 회사 단위 반복 스키마
```

## Consequences
- `spec/`는 정말로 "가끔 바뀌는 설계·전략 문서"만 남아 원래 정의에 더 가까워짐
- `accounts/`는 파이프라인 단계라는 고유 스키마를 가지므로, 이후 CRM 유사 데이터가 필요한 다른 프로젝트에도 같은 패턴(3계층 + 전용 운영 데이터 폴더)을 재사용할 수 있음
- 트레이드오프: "모든 문서가 3계층 중 하나에 속한다"는 단순함은 깨짐 — 4번째 폴더가 왜 예외인지 매번 설명이 필요해짐

## Related
- [[3-tier document architecture satisfy SSOT, audit-trail, and cooperation]] — 이 결정이 확장하는 원본 3계층 모델
- [[Retire rfc folder and introduce domain based communication folders]] — 3계층 모델이 특정 콘텐츠 유형에 안 맞을 때 전용 폴더로 분리한 선례(Edge AI LMR 프로젝트)
