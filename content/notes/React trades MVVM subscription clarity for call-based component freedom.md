---
created: 2026-07-01
updated: 2026-07-08
type: insight
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - react
  - mvvm
  - architecture
  - frontend
publish: true
---
## Context
Align AI UI 아키텍처 논의 중 MVVM과 React Hook 방식의 차이를 비교했다. 처음에는 플랫폼 제조사들(Google, Apple)이 MVVM으로 수렴했다는 사실에서 MVVM이 우위의 아키텍처라고 생각했다.

## Insight
### MVVM 구독과 React 호출은 동일한 문제를 다른 비용으로 푼다

- MVVM은 View가 ViewModel을 구독한다 — 관계를 미리 선언해야 데이터를 받을 수 있다.
- React는 필요한 순간 그냥 호출한다 — 관계 선언이 없다.

구독은 관계를 미리 설정하는 비용이 있다. 조각이 잘게 쪼개질수록 이 비용이 누적된다. ViewModel을 조각 단위로 만들 수 있지만, 각 조각마다 선언 + 구독을 반복해야 한다.
호출은 선언 없이 조각마다 필요한 Hook만 골라 끼운다. 조합이 자유롭다.

### React의 호출형 채택은 웹의 변경 속도를 반영한 의도적 설계다

```
앱  — 배포 주기 길다 → 화면 단위 안정적 설계 → MVVM 구독 모델 자연스러움
웹  — 배포 주기 짧다 → 조각 단위 빠른 변경 → 호출형 자연스러움
```

MVVM이 열등해서가 아니다. MVVM의 구독(관계 선언) 오버헤드를 제거하고 조각 단위 자유도를 얻기 위해 호출형을 선택한 트레이드오프다.

### 호출형은 조각 단위 자유도를 얻는 대신 **상태 공유 복잡도**를 잃는다

MVVM은 ViewModel 스코프로 화면 내 상태 공유가 명확하다. React는 같은 Hook을 두 컴포넌트가 호출하면 다른 인스턴스가 된다 — 공유하려면 상태를 부모로 올리거나 Redux 같은 전역 store를 추가해야 한다.

## Related
- [[ViewModel computes without state while hooks combine computation with state]] — ViewModel과 Hook의 역할 분리
- [[State location and component extraction are orthogonal design problems]] — 상태 위치와 컴포넌트 추출은 독립 문제
- [[React sibling components share state by lifting it to a common parent]] — React에서 상태 공유의 구체적 패턴