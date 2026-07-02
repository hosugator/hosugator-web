---
created: 2026-05-21
updated: 2026-05-21
type: insight
status: 2-stable
subject: "[[PKM]]"
project: "[[Edge AI LMR]]"
tags:
  - documentation
  - information-architecture
  - decision
publish: true
---

## Rationale

역할 기준 폴더(`rfc/`)는 청자가 늘어날수록 이질적인 문서가 혼재한다. 청자 기준 도메인 폴더는 "이 폴더는 이 사람들과 주고받은 것"이라는 직관적 경계를 만들어 분류 판단을 단순하게 한다.

```
❌ role-based:  rfc/  (내부보고 + 외부협의 + 기술분석 혼재)
✅ audience-based:
   internal/   ← DTK 내부
   skku/       ← 성균관대
```

각 도메인 폴더는 `NNN_` 루트 + `logs/` + `resources/` 세 레이어로 충분하다. 날짜 기반 logs는 append-only이므로 closed artifact 속성이 구조적으로 보장된다.

## Context

PJT-EDGE-AI-LMR의 `docs/rfc/` 폴더에 세 종류의 이질적인 문서가 혼재했다.

- 내부 기술 분석 문서 (001, 002, 003)
- 이동일 이사 대상 진행 보고 (005)
- 성균관대 협의 이메일 로그

Comms 폴더를 역할 기준(`rfc/`)으로 정의했지만, 청자가 달라 역할이 모호해졌다. 동시에 `docs/spec/reference/`에는 외부 논문·규격서와 내부 회의록이 섞여 있어, "Immutable Source"라는 정의와도 맞지 않았다.

## Decision

`docs/rfc/` 폴더를 폐기하고 청자 기준 도메인 폴더(Comms 계층)를 도입했다.

```
docs/
  internal/    ← DTK 내부: NNN_ 정제 문서 + logs/
  skku/        ← 성균관대 협업: logs/ + resources/
```

각 도메인 폴더 구조:
- `NNN_` 루트 파일: 정제된 분석·설계 참조 문서
- `logs/`: 날짜 기반(`YYYYMMDD_`) 회의·이메일·활동 기록
- `resources/`: 외부 수신 원본 문서

`spec/reference/`는 외부 자료(논문·규격서·벤더 스펙)만 남겨 SPEC 정의와 일치시켰다.
파일 이동은 `git mv`로 수행해 히스토리 유지.

주: 이 프로젝트의 Comms 폴더는 `docs/` 직하에 배치했다. 이후 표준(`docs/comms/<audience>/`)과 구조가 다르나 결정 당시 기준으로 유효하다.

## Consequences

- Comms 폴더 혼용 문제가 구조적으로 해결됨
- 이해관계자 추가 시 폴더 하나 신설로 확장 가능 (`empinix/` 등)
- `spec/reference/`가 순수 외부 자료 보관소로 정의와 일치
- breadcrumb(`rfc/000_template.md` archived 처리 + INDEX.md 안내)로 히스토리 보존

## Related

- [[Organize communication artifacts by audience not by document role]] — 이 결정의 근거가 된 원리
- [[3-tier document architecture satisfy SSOT, audit-trail, and cooperation]] — SPEC/ADR/Comms 3계층 전체 맥락
