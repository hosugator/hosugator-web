---
created: 2026-07-30
updated: 2026-07-30
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - architecture
  - state
  - oop
  - qt
publish: true
---
## Context
모듈은 값을 소유하지 않고, 상태가 필요하면 소유하되 공유되어야 하면 한 계층 위로 올린다는 원칙을 준수하기 위해 무엇이 필요할지 고민해보았다.

## Insight
### 올리는 방향만 정하면 반대편 실패가 생긴다

```
너무 낮으면   공유가 안 되어 사본이 생긴다        →  불일치
너무 높으면   전역 상태가 되어 모두가 결합된다     →  god object
정답          필요한 것들의 최소 공통 조상 (LCA)
```

과도 상승이 반대 방향의 실패다. 전부 최상위로 올리면 "모든 상태를 아는 하나의 객체"가 생기고, 그러면 애초에 피하려던 결합이 다시 생긴다. UI 프레임워크의 lifting state up은 올리는 방법이고, 멈추는 조건이 LCA다.
**실제 코드에서 소비자를 세어보면 옳은 높이가 나온다.**

### 트리가 아닌 구조에서는 올리는 대신 추출한다

"한 계층 위"는 부모-자식 트리를 전제한다. 서비스·모듈처럼 트리가 아닌 곳에서는 다르다.
한쪽에 밀어넣으면 그 모듈이 다른 모듈의 의존 대상이 되어 방향이 꼬인다. 
**제3의 소유자를 만들어 양쪽이 주입받는 편이 화살표를 단순하게 유지한다.**

### 배치는 시간에 따라 틀려진다

LCA를 알려면 소비자를 다 알아야 하는데, 소비자는 나중에 생긴다. 오늘 옳게 놓은 상태가 내일 잘못된 위치가 된다.
그래서 이건 한 번 적용하는 규칙이 아니라 계속 조정하는 규율이고, 진단 신호를 기억하는 편이 실용적이다.

```
같은 값의 사본이 두 곳에 있다        →  올린다
상위가 자기는 안 쓰는 상태를 들고 있다 →  내린다
인자가 계속 늘어난다                  →  경계 자체가 잘못 그어졌을 수 있다
두 번 인스턴스화하면 깨진다            →  숨은 공유 상태가 있다
```

## Related
- [[Encapsulation exists to protect an invariant so state without a rule should not be owned]] — 무엇을 소유할지
- [[Separability and reusability are opposite directions of coupling so one test cannot show both]] — 마지막 진단 신호의 근거
- [[Stateless design makes any instance interchangeable by externalizing state]] — 같은 원리를 파드 수준에 적용한 사례
- [[Software abstraction repeatedly extracts structure from values at increasing scales, a fractal pattern]] — 같은 규칙이 규모를 바꿔 반복되는 것
- [[Place the seam where the data crossing it is small and cold]] — 배치의 상위 문제인 분할
- [[Coupling]] — 결합도 개념
- [[Abstraction is triggered by the need to share so abstracting the unshared only adds cost]] — 이 규칙이 특수 사례인 상위 원리
