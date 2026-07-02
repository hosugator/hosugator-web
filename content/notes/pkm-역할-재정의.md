---
created: 2026-05-08
updated: 2026-05-08
type: insight
status: 2-stable
subject: "[[PKM]]"
project: "[[Self-development in 2026]]"
tags:
  - pkm
  - zettelkasten
  - adr
  - knowledge-management
publish: true
---
## Context
1,295개의 노트가 쌓이면서 세 가지 문제가 동시에 드러났다.
**탐색 붕괴**: 폴더 구조가 실질적으로 작동하지 않아 557개의 노트가 루트에 산재. 어떤 노트가 중요한지 파악할 수 없는 상태.
**저장 기준 오염**: 기존 저장 원칙("일반화 가능한 인사이트")이 LLM 대체 가능한 how-to, 개념 설명 노트를 양산. AI 에이전트가 세션에서 자동으로 저장하는 파이프라인이 이를 가속했다.
**LLM 역설**: LLM 성능 향상으로 "사실 기반 질의"에서는 LLM이 PKM보다 우월해졌다. PKM의 고유 가치가 무엇인지 재검토가 필요해졌다.

## Decision
**PKM의 역할을 "보편적 지식 저장소"에서 "나만의 통찰 + 의사결정 로그"로 재정의한다.**

1. **저장 금지 원칙 신설**: LLM에게 물어보면 동일한 답을 얻을 수 있는 내용은 저장하지 않는다.
2. **`type: adr` 도입**: 세션에서 내린 결정과 그 이유를 보존하는 전용 타입. 맥락 보존 필수, 추상화 금지. 기존 status 값으로 ADR 상태를 매핑한다 (`1-draft` = proposed, `2-stable` = accepted, `4-archive` = superseded).
3. **`type: source` 범위 축소**: 공개 정보의 원문 저장 폐지. LLM이 접근 불가한 비공개/사내 문서 원문만 허용.
4. **폴더 구조 하이브리드 flat 채택**: 모든 노트를 루트에 배치. 예외는 `daily-log/`(날짜 기반 노트)와 `templates/`만. 기존 `0. index`, `1. inbox`, `1. permanent`, `2. project`, `3. temporary` 폴더는 해소.
5. **`type: spec` 불도입**: PKM에는 "명세할 시스템"이 없다. spec처럼 보이는 내용은 `adr` 또는 `insight`로 충분.

## Consequences
**즉시 적용된 것**
- `dotfiles/ai/CONSTITUTION.md`, `skills/pkm-management/SKILL.md`, `roles/doc-architect.md` 업데이트 완료.
- AI 에이전트의 저장 기준이 재정의됨.

**후속 작업**
- 기존 1,295개 노트의 물리적 재구조화 필요. 기존 type: source 노트 대부분이 정리 대상.
- `0. index/MOC - Inbox.md` → 루트 이동 필요.
- 향후 노트 수는 줄어들고 밀도는 높아질 것으로 예상.

**트레이드오프**
- OS 파일 탐색기에서 루트에 1,000개 이상 파일이 보이게 됨. Obsidian 내에서는 문제없음.
- MOC와 태그가 유일한 탐색 구조가 됨 → MOC 관리 부담 증가.

## 관련 노트
- [[My Zettelkasten Principles; Hybrid Approach]] — 기존 PKM 운영 원칙
- [[ADR should have status, context, decisions and consequences]] — ADR 패턴 개요
- [[adr-frontmatter-layering]] — frontmatter와 본문 링크의 역할 분리 (후속 ADR)
