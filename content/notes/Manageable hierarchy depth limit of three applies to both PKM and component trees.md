---
created: 2026-06-30
updated: 2026-06-30
type: insight
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - hierarchy
  - complexity
  - pkm
  - react
  - cognitive-load
  - systems-thinking
publish: true
---
## Context
Align-AI Phase 2에서 React 컴포넌트 계층을 3층 이하로 유지하자는 이야기를 하다가, "PKM에서도 계층이 깊어지는 문제를 체감했다"는 연결이 나왔다. 소프트웨어 설계와 지식 관리가 같은 제약에 걸린다는 인식.

## Insight
### 인간이 추적 가능한 계층 깊이의 한계는 도메인을 가리지 않는다

React 컴포넌트 계층 3층 이하 → props drilling이 생기지 않는다.
PKM 폴더 계층 3층 이하 → 노트를 찾는 데 인지 부하가 걸리지 않는다.

같은 숫자가 나타나는 이유: 인간의 작업 기억(working memory)이 추적할 수 있는 깊이의 한계가 공통적으로 작용하기 때문이다.

### 4층 이상이 되면 중간 노드가 "통과"만 하게 된다

React에서 4층 이상 → 중간 컴포넌트들이 상태를 그냥 통과시킴(props drilling) → 전역 상태 관리 필요
PKM에서 4층 이상 → 중간 폴더가 분류만 하고 의미를 잃음 → flat + 태그 체계로 전환

두 경우 모두 해결책이 "계층을 버리고 전역 인덱스를 쓰는 것"으로 수렴한다. React의 Zustand/Redux, PKM의 Dataview MOC가 같은 역할이다.

## Related
- [[State location and component extraction are orthogonal design problems]] — React 계층 설계 맥락
- [[Engineer dashboard UX design requires information architecture beyond component knowledge]] — 이 인식이 나온 세션
