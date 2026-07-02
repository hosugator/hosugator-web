---
created: 2026-05-28
updated: 2026-05-29
status: 1-draft
type: insight
subject: "[[PKM]]"
project: "[[Self-development in 2026]]"
tags: []
publish: true
---
## Context
PKM의 원자 노트 설계는 "지금 이 도메인의 현재 상태가 뭔가?"를 즉시 파악하기 어렵게 만든다. repo-doc-management의 `spec`처럼 living document를 읽으면 끝나는 편리함이 PKM에는 구조적으로 없다는 문제를 탐색하다가 나온 논의.

## Insight
### 원자 노트의 현재 상태 문제는 두 레이어로 분리된다

- **인벤토리 문제** ("어떤 노트들이 지금 유효한가?"): MOC + Dataview로 해결 가능. `status: 2-stable` 필터가 살아있는 노트를 자동 집계한다.
- **합성 문제** ("이 노트들이 합쳐서 뭘 말하는가?"): Dataview가 줄 수 없다. 읽어야 안다.

합성 문제는 MOC 노트 자체가 상단에 prose 섹션을 두는 방식으로 흡수할 수 있다 — Dataview 인벤토리 + 직접 쓴 현재 상태 요약을 한 파일에 공존시키면 `overview` 같은 별도 타입 없이도 작동한다.

### 활동 인벤토리는 Dataview가 해결하는 세 번째 차원이다

지식 인벤토리가 "어떤 노트들이 유효한가?"를 묻는다면, 활동 인벤토리는 "지금 무엇이 미완료인가?"를 묻는다. daily-log 노트 안에 체크박스(`- [ ]`)를 태스크 단위로 심고, MOC에서 Dataview `TASK WHERE !completed FROM "daily-log"` 쿼리로 vault 전체의 미완료 태스크를 집계하면 별도 태스크 앱 없이 vault 안에서 SSOT가 완결된다.

두 인벤토리를 같은 메커니즘이 담당한다:
- **지식 인벤토리**: `status: 2-stable` 필터 → 살아있는 노트 목록
- **활동 인벤토리**: `!completed` 필터 on daily-log → 미완료 태스크 목록

프로젝트 MOC에 두 쿼리를 함께 두면 "이 프로젝트에서 알고 있는 것"과 "아직 해야 할 것"을 한 파일에서 파악할 수 있다. 태스크가 완료되면 그 결과물(노트)이 지식 인벤토리로 이동하는 흐름이 자연스럽게 생긴다.

### 시스템 변경의 기준은 실제로 겪은 마찰이다

타입 추가, MOC 역할 재정의 같은 시스템 변경은 "이론적으로 더 낫다"는 이유만으로는 불충분하다. 현재 시스템에서 실제로 반복적인 불편을 경험한 뒤에 바꾼다. 그 전에 바꾸면 복잡도만 늘고 실익이 없다.

### source 타입의 존재 기준

원문을 PKM에 source로 저장할 기준: **"이 원문으로 다시 돌아와 새 insight를 뽑을 것인가?"**
- Yes → source 유지 (원문 자체가 반복 재사용 자산)
- No → insight에 흡수하거나 외부 시스템에 보관

source는 문서 관리 개념이 PKM에 이식된 것에 가깝다. 진입 장벽이 낮을수록 source보다 insight에 흡수하는 방향을 택한다.

## Decision

타입 체계 변경 보류. 현행 유지:
- frontmatter(`subject`·`project`) 엄격히 채우기
- MOC를 적극 활용해 인벤토리 문제 해소
- 합성이 필요한 도메인은 MOC 상단에 prose 섹션 추가로 대응

전환 조건: 현행 시스템에서 반복적인 마찰을 경험했을 때 재검토.

## Related

- [[PKM]] — PKM 설계 전반
- [[PKM outlasts any project and is the single source of truth that skills derive from]] — SSOT 원칙
- [[Personal knowledge base is the only SSOT that survives company changes and project endings]] — SSOT 원칙 보완
