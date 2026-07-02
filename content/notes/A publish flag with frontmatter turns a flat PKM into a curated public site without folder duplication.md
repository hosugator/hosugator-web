---
created: 2026-07-02
updated: 2026-07-02
type: insight
status: 2-stable
subject: "[[PKM]]"
project: "[[Hosugator Web]]"
tags:
  - pkm
  - publishing
  - static-site
  - frontmatter
publish: true
---
## Context
약 1,600개 루트 노트를 flat + 검색 기반으로 관리하는 PKM을 포트폴리오 사이트(hosugator-web) 블로그로 발행해야 했다. 초기에는 노트를 category 폴더로 복제해 넣었는데, sync할 때마다 폴더에 끼워넣는 마찰이 생기고 비공개 노트(이력서·면접 준비 등)가 섞일 위험이 있었다.

## Insight
### 발행 레이어는 폴더가 아니라 프론트매터로 만든다
이미 모든 노트가 `subject`(도메인)·`project`·`tags` 프론트매터를 가진다. 이를 그대로 재사용하면 repo에 별도 분류 체계를 만들 필요가 없다 — `subject` → 브랜치/카테고리, `project` → 필터로 매핑된다. 폴더는 잉여다.

## Decision
`publish: true` 플래그 하나만 추가하고, sync 스크립트가 그 노트만 repo로 **flat 복사**한다. repo는 폴더가 아니라 프론트매터에서 구조를 도출한다.
- **폴더 미러링(대안)을 기각한 이유**: PKM의 flat/검색 모델과 어긋나 sync 마찰과 중복 유지보수를 낳는다.
- **전환 조건**: 단일 flat 디렉토리가 성능·도구 한계에 달할 만큼 발행 노트가 많아지면 그때 분할을 고려한다.

## Consequences
- 폴더 유지보수 0, 큐레이션 내장(비공개 자동 제외), 한 노트가 subject+project+tags로 여러 뷰에 동시 노출.
- 함정: 노트 **내용**이 안전해도 `project` 라벨 자체가 맥락을 폭로할 수 있다(예: 특정 회사 면접 준비 프로젝트명이 공개 필터에 노출됨). 발행 시 내용뿐 아니라 **라벨**도 검토해야 한다.

## Related
- [[PKM outlasts any project and is the single source of truth that skills derive from]] — PKM이 SSOT이고 파생물이 여기서 나온다는 원칙의 구체적 구현
- [[PARA archive has no depth constraint because retrieval is by search not navigation]] — flat 유지의 근거
- [[Subject MOCs over PARA Areas-Resources until note volume requires splitting]] — subject 기반 분류와 연결
- [[Manageable hierarchy depth limit of three applies to both PKM and component trees]] — 깊은 폴더 대신 얕은/평평한 구조 선호
