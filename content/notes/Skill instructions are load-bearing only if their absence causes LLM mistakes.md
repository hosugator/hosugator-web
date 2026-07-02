---
created: 2026-05-26
updated: 2026-05-26
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Self-development in 2026]]"
tags:
  - skill
  - llm
  - prompt-engineering
  - pkm
publish: true
---

## Context

pkm-management 스킬(136줄)을 검토하면서 어떤 줄을 삭제할 수 있는지 기준이 필요했다. 자주 호출되는 스킬일수록 불필요한 내용이 매번 컨텍스트에 로드되어 토큰 비용이 누적된다.

## Insight

### 삭제 기준: "이 줄이 없으면 LLM이 실수하는가?"

Yes → 유지. No → 삭제 후보.

두 가지 삭제 후보 유형:
1. **배경 맥락 설명** — LLM이 이미 아는 도입부 설명. 행동 규칙이 아님 (e.g., "Claude Memory는 세션 간 단기 컨텍스트")
2. **템플릿 주석의 산문 중복** — 형식 템플릿의 `← 설명`으로 이미 명시된 내용을 별도 불릿으로 다시 쓴 경우

역으로, 유지해야 하는 줄:
- **LLM 직관과 반대되는 규칙** (e.g., sc_search 한국어 단독 쿼리 금지)
- **판단 기준** (e.g., type 판별 질문, 점수 임계값)
- **형식 템플릿 자체**

## Decision

pkm-management 스킬(136줄)에서 7줄 삭제:
- Section 1 `공간 분리` 표·도입 문장 (4-5줄) — LLM이 이미 아는 Claude vs PKM 설명
- Section 4 `Decision`/`Verification` 불릿 설명 (2줄) — 바로 위 템플릿 주석과 동일 내용

전환 조건: 스킬 호출 후 Decision/Verification 섹션 사용 방식이 잘못 적용되면 다시 추가.

**추가 결정 (2026-05-27)**: `subject`·`project` frontmatter 규칙 추가.
- 없으면 LLM이 string으로 쓰거나 존재하지 않는 노트를 임의 생성함 → load-bearing
- 값 결정: 0.80+ 노트에서 추출(이미 읽음). 없으면 최상위 결과 1개를 `limit: 10`으로만 읽어 참조. 불확실하면 비움
- 이 규칙은 Dataview 의존성과 sc_search 기존 흐름을 활용하므로 추가 토큰 비용 최소

## Related

- [[PKM outlasts any project and is the single source of truth that skills derive from]] — PKM SSOT 원칙. 스킬은 PKM에서 파생되므로 스킬 변경 전 PKM 노트가 선행되어야 함
- [[sc_search with query cap outperforms grep on token efficiency and recall]] — 스킬 내 sc_search 규칙의 토큰 효율성 근거
