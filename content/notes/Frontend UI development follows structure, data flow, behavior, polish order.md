---
created: 2026-06-30
updated: 2026-06-30
type: study
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - frontend
  - ux
  - development-workflow
  - react
publish: true
---
## Context
Align-AI Phase 2 대시보드 리팩토링에서 3-column 레이아웃을 설계하면서 처음으로 "어떤 순서로 개발하는 게 맞는가"를 명시적으로 정리했다. 컴포넌트를 "어떻게 만드는가"는 알았지만 "어떤 순서로 접근하는가"가 없었다.

## Insight
### 개발 순서는 가역성 비용의 순서다

```
1. 구조 (Structure)   — 무엇이 어디에 있는가
2. 데이터 흐름        — 상태가 어느 컴포넌트에 살고 어느 방향으로 내려가는가
3. 기능 (Behavior)    — 클릭하면 무슨 일이 일어나는가
4. 시각 polish        — hover, transition, animation
```

뒤에서 앞으로 되돌리는 비용이 크다. 애니메이션을 먼저 만들었는데 레이아웃이 바뀌면 다시 짜야 한다. 구조가 확정되어야 어떤 요소에 어떤 효과가 붙는지 결정할 수 있다.

### 데이터 흐름은 기능보다 먼저 — 상태 위치가 컴포넌트 위계를 결정하기 때문이다

엄밀히는 순서가 아니라 우선순위다. 구조를 잡으면서 "이 데이터가 어디서 오는가"를 동시에 결정하게 된다. 상태 위치를 모르고 버튼 이벤트를 연결하면, 나중에 컴포넌트를 뜯어고쳐야 한다.
시니어는 기능 목록에서 "이 상태들이 서로 공유되는가, 독립적인가"를 먼저 분류한다. 그 분류 결과가 컴포넌트 위계가 된다. 주니어는 기능을 만들다가 그때그때 올린다(state lifting). 리팩토링 횟수가 다른 이유다.

### 빈 상태(Empty State)는 polish가 아니라 구조다

"아이콘 + 안내문"처럼 보이지만, "이미지 패널이 비어있을 때 공간을 어떻게 쓸 것인가"는 레이아웃 결정이다. 구조 단계에서 결정하지 않으면 레이아웃 자체가 완성되지 않는다.

## Related
- [[Engineer dashboard UX design requires information architecture beyond component knowledge]] — Phase 2 설계 결정, 이 노트가 나온 세션
- [[React sibling components share state by lifting it to a common parent]] — 데이터 흐름 결정의 핵심 패턴
- [[State location and component extraction are orthogonal design problems]] — 2단계(데이터 흐름)에서 혼동하기 쉬운 두 개념
