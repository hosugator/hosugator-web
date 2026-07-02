---
created: 2026-06-30
updated: 2026-06-30
type: insight
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - react
  - component
  - design
  - frontend
  - state-management
publish: true
---
## Context
Align-AI Phase 2 리팩토링에서 EmptyState 논의 중 두 가지 질문이 섞였다. "이 상태는 어디에 살아야 하는가"와 "이 UI 조각을 별도 컴포넌트로 뽑을 것인가"를 같은 문제로 취급했다가, 독립된 문제임을 인식했다.

## Insight
### 상태 위치와 컴포넌트 추출은 축이 다른 결정이다

**상태 위치 (State Location)**: "이 데이터가 어느 컴포넌트에 사는가"
```
showOverlay: boolean → InferencePanel에 산다 (ImagePanel + ResultPanel 둘 다 소비하므로)
```

**컴포넌트 추출 (Component Extraction)**: "이 UI 조각을 재사용 가능한 단위로 뽑을 것인가"
```
<div>아이콘 + 안내문</div> → <EmptyState message="..." />
```

EmptyState는 상태를 갖지 않는 표시 전용 컴포넌트(presentational)다. 어디서 몇 번 쓰이든 상태 위치 문제와 무관하다.

### 컴포넌트는 두 종류로 분류된다 — 변수와 순수 함수의 유사성

컨테이너(Container)는 상태를 소유하고 변경한다 — 값을 갖는 변수와 같다.
표시(Presentational)는 props를 받아 렌더링만 한다 — 입력이 같으면 항상 같은 출력, 순수 함수와 같다.

표시 컴포넌트는 상태가 없으므로 테스트가 쉽다. 입력만 통제하면 된다.

### 판단 기준

- 두 컴포넌트 이상이 같은 데이터를 소비하는가 → 상태를 공통 부모로 올린다
- 같은 UI 패턴이 여러 곳에 반복되는가 → 컴포넌트로 추출한다

두 질문은 독립적이다. 상태를 올린다고 해서 컴포넌트를 추출할 이유가 생기는 게 아니고, 컴포넌트를 추출한다고 해서 상태 위치가 달라지는 게 아니다.

## Related
- [[React sibling components share state by lifting it to a common parent]] — 상태 위치 결정 원칙
- [[Frontend UI development follows structure, data flow, behavior, polish order]] — 두 결정이 일어나는 단계(구조/데이터 흐름)
