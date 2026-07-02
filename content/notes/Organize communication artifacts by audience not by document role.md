---
created: 2026-05-21
updated: 2026-05-21
type: insight
status: 3-superseded
subject: "[[PKM]]"
project: "[[Edge AI LMR]]"
tags:
  - documentation
  - information-architecture
  - ssot
  - knowledge-management
publish: true
---
## Context

PJT-EDGE-AI-LMR에서 `docs/rfc/` 폴더를 "이해관계자 협의 문서"로 정의했지만, 이동일 이사 대상 보고·성균관대 협의·내부 분석이 뒤섞이며 역할이 흐려졌다. "RFC"라는 역할(role) 기준으로 묶었을 때 청자(audience)가 여럿이면 필연적으로 이질적인 문서가 한 폴더에 쌓인다.

## Insight

### 역할이 아닌 청자(이해관계자)로 폴더를 나눠야 한다

`rfc/`처럼 "협의 문서"라는 역할로 묶으면 청자가 늘어날수록 혼재가 심해진다. 이해관계자별 도메인 폴더는 "이 폴더는 이 사람들과 주고받은 것"이라는 직관적 경계를 만들어, 문서 분류 판단이 단순해진다.

```
❌ role-based:  rfc/  (내부보고 + 외부협의 + 기술분석 혼재)

✅ audience-based:
   internal/   ← DTK 내부 이해관계자
   skku/       ← 성균관대
   empinix/    ← 엠피닉스  (필요 시 추가)
```

### 각 도메인 폴더는 logs/ + resources/ + NNN_ 세 레이어로 충분하다

- `NNN_` 루트: 정제된 분석 결과 (SSOT 역할, 선택)
- `logs/`: 날짜 기반 append-only 기록 (회의록·이메일)
- `resources/`: 상대방이 제공한 원본 문서

### RFC의 "closed artifact" 속성은 domain/logs/ 구조에서 자동으로 유지된다

날짜 기반 로그는 append-only이므로, 별도로 "closed" 상태를 관리하지 않아도 닫힘 속성이 구조적으로 보장된다.

### spec/reference/는 외부 자료 전용으로 유지해야 한다

내부 회의록이 external reference 폴더에 섞이면 "Immutable External Source"라는 정의가 흐려진다. 내부 회의록은 `internal/logs/`로 분리해야 한다.

→ [[Retire rfc folder and introduce domain based communication folders]]

## Related

- [[3-tier document architecture satisfy SSOT, audit-trail, and cooperation]]
- [[Project document hierarchy architecture starts from domain to all]]
