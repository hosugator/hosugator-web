---
created: 2026-07-03
updated: 2026-07-03
type: insight
status: 2-stable
subject: "[[Frontend]]"
project: "[[Hosugator Web]]"
tags:
  - ux
  - ui
  - reading
  - blog
publish: true
---
## Context
블로그 노트 뷰는 (1) 좌측 관련노트 사이드바가 본문을 오른쪽으로 밀어 중앙 정렬이 깨졌고, (2) 화면 중앙에 고정된 플로팅 알약 네비가 그 위에 떠서 어긋났으며, (3) 유리 알약 크롬이 종이/필기 톤의 노트와 이질적이었다.

## Insight
### 몰입형 리딩 뷰는 앱 크롬을 **레이어로 덮지 말고 숨겨야** 한다

목표는 "차분한 중앙 집중"이므로, 탐색은 뷰 내부로 가져온다 — 좌우 은은한 이전/다음 화살표(순차) + 본문에 저자가 직접 건 `[[백링크]]`(발견)로 분리. 
노트 열람 시 전역 TopNav를 이벤트(`hg:note`)로 숨기고, 사이드바를 제거해 본문을 중앙 정렬. 

## Related
- [[A single-demo detail page plays media inline while modals belong to grids]] — 같은 '레이어보다 흐름' 원칙
- [[Engineer dashboard UX design requires information architecture beyond component knowledge]]
- [[UX judgment is built through breadth of screens not depth of one screen]]
- [[A commit-log with a subject-project map entry beats a force graph for browsing a knowledge base]] — 블로그 탐색 구조 결정
