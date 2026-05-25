---
created: 2026-05-13
updated: 2026-05-13 14:02
type: adr
status: 2-stable
subject: "[[MOC - PKM]]"
project: "[[2026 자기계발]]"
tags:
  - pkm
  - zettelkasten
  - frontmatter
  - adr
---
## Context
[[pkm-역할-재정의]]에서 "MOC와 태그가 유일한 탐색 구조"로 결정했으나, frontmatter의 `subject` 필드 역할이 모호했다. 
초기 설계는 `subject: "[[MOC - AI]]"` 형태로 Dataview가 해당 필드를 쿼리해 MOC를 자동 구성하는 top-down 방식이었다. 
이는 사실상 폴더 시스템과 동일한 구조이며 Zettelkasten의 bottom-up 원칙과 충돌한다는 것이 명확해졌다.
동시에 subject 필드를 완전히 제거하면 "제목은 모르지만 주제는 아는" 상황에서의 탐색 수단을 잃는다. 
Obsidian + Dataview 조합에서 frontmatter 기반 필터링은 실용적 가치가 있다.

## Decision

**frontmatter와 본문 링크를 두 개의 독립 레이어로 분리한다.**

| 레이어 | 도구 | 인지 모드 | 역할 |
|--------|------|-----------|------|
| Obsidian 탐색 레이어 | subject, project, tags | 검색/필터 | "AI 관련 노트 뭐가 있지?" |
| Zettelkasten 지식 그래프 | 본문 백링크, 그래프 뷰 | 사고/발견 | "이 개념이 무엇과 연결되는가?" |

**구체적 결정:**

1. `subject` = 도메인 필터 레이블. MOC 소속 선언이 아니다. Dataview 쿼리용 메타데이터.
2. `project` = 출처 추적(provenance). "이 노트가 어느 맥락에서 생겼는가". 유지.
3. `tags` = 다차원 분류. subject 단일값의 한계를 보완.
4. **본문 링크가 실제 Zettelkasten 구조의 1차 수단**이다. frontmatter는 탐색 편의 레이어.
5. 그래프 뷰는 per-note 습관이 아니라 **주기적 vault review** 시 활용.
6. 노트 작성 시 핵심 습관 = 관련 노트 1-2개 본문에 백링크 추가.

## Consequences

- frontmatter의 역할이 축소되지만 제거하지 않는다. 두 레이어는 충돌하지 않고 다른 목적을 수행한다.
- MOC는 Dataview top-down 구성 대신 **본문 링크가 모이는 곳에 자연 발생**하는 방식으로 전환.
- Obsidian 그래프 뷰의 연결망이 실질적인 지식 지형도가 됨 → 백링크 밀도가 PKM 품질 지표.
- `Attention 개념 정리.md`처럼 기존 방대한 노트를 원자화하고 MOC로 전환하는 작업이 이 결정의 실천 사례.

## Succeeding

- [[pkm-역할-재정의]] — PKM 역할 재정의 (상위 ADR)
- [[My Zettelkasten Principles; Hybrid Approach]] — Zettelkasten 운영 원칙
