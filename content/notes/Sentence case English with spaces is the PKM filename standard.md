---
created: 2026-05-19
updated: 2026-05-20
type: insight
status: 2-stable
subject: "[[PKM]]"
project: "[[Self-development in 2026]]"
tags:
  - pkm
  - convention
  - filename
  - zettelkasten
publish: true
---
## Context

기존 PKM 파일명이 한국어/영어, kebab/자연어, 타입 접두사 유무 등 다양한 형태로 혼재하고 있었음. 이로 인해 두 가지 문제가 발생:

1. **검색 혼선**: 어떤 파일은 한국어로, 어떤 파일은 영어로 검색해야 히트되는지 불명확
2. **단일 진실 공급원 위반**: `adr-`, `study-` 같은 타입 접두사가 frontmatter의 `type` 필드와 중복되어 불일치 가능성 존재

프로젝트 레포의 `NNN_kebab-style.md` 컨벤션과의 일관성도 고려했으나, 두 시스템의 목적이 다름을 확인:

- **프로젝트 레포**: 문서가 코드/스크립트에서 참조될 수 있어 공백 회피 필요 → kebab
- **PKM**: 코드에서 참조되지 않고 Obsidian이 공백을 네이티브 지원 → 가시성을 위해 공백 허용

## Decision

PKM 파일명 컨벤션을 다음으로 확정:

```
[English Sentence case with spaces].md
```

**구체적 규칙:**
- **언어**: 영어 전용 (검색 언어 단일화)
- **대소문자**: Sentence case — 첫 글자만 대문자, 고유명사·약어 제외
- **단어 구분**: 공백 (하이픈으로 공백 대체 금지)
- **접두사**: 없음 — 타입은 frontmatter `type` 필드가 SSOT
- **번호**: 없음 — flat PKM에 위계 불필요
- **제목 스타일**: 명제형(propositional) 권장 — 노트를 열지 않아도 주장이 전달되어야 함

**예시:**
```
✅ Sentence case English with spaces is the PKM filename standard.md
✅ Data-driven models outperform physics simulation for process optimization.md
✅ OT network isolation matters more than protocol choice.md
✅ Nvidia GSP D3 resume triggers PFM callback race condition.md

❌ adr-pkm-filename-convention.md   ← 타입 접두사 + kebab
❌ 제조산업 데이터수집 파이프라인.md  ← 한국어
❌ data-driven-models-outperform.md ← kebab
```

## Consequences

- 기존 파일 일괄 리네임 없음 — 자연스럽게 열리는 파일을 기회가 될 때 리네임
- `CONSTITUTION.md §2.2` 및 `CLAUDE.md` 업데이트 완료
- Obsidian `[[링크]]`에서 공백 포함 파일명 완벽 지원 확인
- `git add`, `git rm`, `git show -- "파일명"` 등 파일을 직접 지정할 때 quoting 필요 — 경미한 불편이나 허용 가능
