---
created: 2026-05-29
updated: 2026-05-29
type: insight
status: 2-stable
subject: "[[Communication]]"
tags:
  - linkedin
  - content-strategy
  - audience
  - writing
publish: true
---

## Context

"넓힐수록, 정작 아무에게도 닿지 못했다" 훅으로 포스트를 작성하면서 두 개의 증거를 붙였다.

- 경험 1: 렌즈 검사 AI 모델 학습 데이터 분리 (ML 엔지니어 대상)
- 경험 2: 의사결정 문서 청자별 계층 분리 (지식 노동자 전반 대상)

훅은 보편적 공감을 약속했지만, 경험 1은 ML 독자만 끝까지 따라올 수 있었다. 포스트가 자기 주장을 어기고 있었다.

## Insight

훅이 약속한 청자와 증거의 도메인이 일치하지 않으면, 독자는 약속을 배신당했다고 느끼고 이탈한다.

훅을 먼저 쓴다면, 그 훅이 어떤 독자에게 약속을 거는지 확인하라.
증거가 그 독자의 언어로 쓰였는지 검토하라.
불일치가 있으면 훅을 좁히거나 증거를 교체하라.

## Decision

**기존 발행 포스트(2-stable) 4개 분석:**
- `Constraint placement` — LLM 기술, 수치 기반
- `ADR documents the decision` — 기술 주제이나 훅은 보편 언어
- `A theoretically better model` — ML 특화
- `Reversibility as AI agent delegation` — AI 기술

발행 포스트 기반이 기술 독자임을 확인. 이번 훅은 기존보다 더 보편적인 약속을 하고 있었고, ML 경험으로 연결하면 그 보편성을 소모하는 구조였다.

**결정:** 경험 1(AI 모델) 제거, 경험 2(문서 계층화)만으로 소통/지식 노동 포스트로 피벗.

→ [[Every optimization loses direction without a primary audience defined first]] (superseded)
→ [[A document written for everyone gets read by no one]] (새 포스트)

## Related

- [[Optimizing for non-primary audience introduces noise that bottlenecks the primary goal]] — 핵심 인사이트 원본
- [[Negative framing hooks outperform positive framing by making readers recognize their own failure]] — 훅 전략
- [[Post iteration separates audience friction removal from emotional frame direction]] — 포스트 반복 개선 방법론
