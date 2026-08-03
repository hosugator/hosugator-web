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
  - design
publish: true
---
## Context
IDENTITY 섹션에 인사이트를 9개로 확장하니 "너무 많은가?"라는 의문이 들었다. 그런데 실제 원인은 개수가 아니라, 각 행이 [인용문(2줄 줄바꿈) + 프로젝트 태그(별도 줄) + 넉넉한 패딩]으로 두꺼웠던 것이다.

## Insight
### 목록이 길어 보이는 체감은 **행 수 × 행 높이**다

항목을 줄이기 전에 행 높이를 줄여라. 
한 줄 accordion(인용문 한 줄 + 펼침 아이콘, 상세는 클릭 시)으로 압축하면 **포괄성(9개)과 스캔성이 공존**한다. 깊이는 펼침으로 지연시킬 수 있다. → 섹션 개수를 줄이는 "1이 최선, 3이 최대"와 달리, 스캔 가능한 목록은 길어도 된다.

## Related
- [[One is best three is max — a minimal section triad frames a portfolio more persuasively]] — 섹션 레벨의 미니멀리즘(대비되는 축)
- [[UI 설계 원칙]]
