---
created: 2026-07-30
updated: 2026-08-03
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - architecture
  - feature-flag
  - coupling
  - testing
publish: true
---
## Context
브랜치 단위로 추가하는 기능을 플래그 하나로 켜고 끄도록 설계하면, 그 자체가 모듈 경계를 강제하는 방법론이 되지 않느냐는 물음에서 출발했다.
그런데 그게 "그러면 그 기능은 재사용 가능하다"까지 나가는 것은 성립하지 않는다.

## Insight
### 플래그는 독립성에 대한 주장이다

플래그를 두는 것은 "이 기능은 따로 켜고 끌 수 있다"고 주장하는 것이다.
그 주장이 거짓이면 플래그는 버그 생성기가 된다.
예를 들어, A와 B가 실제로 얽혀 있는데 따로 플래그를 두면 플래그가 아키텍처에 대해 거짓말을 하고, 코드를 읽는 사람은 플래그를 보고 독립이라고 믿는다.

### 재사용성은 주입으로 확보된다

```
분리 가능성 시험   플래그로 끌 수 있는가
재사용성 시험      의존을 인자로 받는가
```

주입은 화살표를 역전시킨다 — `위젯 → nvidia-smi`가 `위젯 → 인터페이스 ← nvidia-smi`가 된다. 플래그를 추가해도 이건 생기지 않는다.
이건 [[Repository layer encapsulates persistence not authorization]]과 같은 이야기다 — 시그니처가 무엇을 받는지가 무엇을 할 수 있고 무엇에 묶이는지를 정한다.

### 두 시험은 서로 다른 결함을 잡는다

| 시험             | 잡아내는 것                              |
| -------------- | ----------------------------------- |
| 다른 곳에 붙일 수 있는가 | 호스트에 대한 가정 — 레이아웃 타입, 부모 클래스, 설정 존재 |
| 두 번 만들 수 있는가   | 숨은 공유 상태 — 전역 캐시, 고정 이름, 단일 슬롯      |

우리 코드에서 두 개를 만들면 세 곳이 깨진다.

```python
self._gpu_value, self._gpu_bar = ...        # 단일 슬롯 — 두 번째가 첫 번째를 덮어쓴다
QProgressBar#gpuBar::chunk { ... }          # 고정 objectName — QSS·findChild 가 모호해진다
_cuda_diag: tuple[bool, str] | None = None  # 모듈 수준 캐시 — 인스턴스와 무관하게 하나
```

핵심은 이것이다 — 실제로 두 개를 쓸 일이 없어도 시험으로서 값이 있다. "두 개를 만들 수 있다"가 "숨은 전역 상태가 없다"를 증명한다. 요구사항이 아니라 탐침이다.
그리고 이건 [[Stateless design makes any instance interchangeable by externalizing state]]를 객체 수준에 적용한 것이다 — 파드 교체 가능성을 결정하는 것과 위젯 두 개를 만들 수 있는지를 결정하는 것이 같은 성질이다.

### 참조 독립은 자원 독립이 아니다

플래그 경계를 정할 때 놓치기 쉬운 조건이다. 모듈 독립성은 코드 참조에 대한 진술이고 런타임 상호작용에 대한 진술이 아니다.
참조는 독립인데 자원은 공유하는 경우가 플래그 조합에서 예상 못 한 동작을 만들고, 경계가 진짜여도 남는다.

## Related
- [[Encapsulation exists to protect an invariant so state without a rule should not be owned]] — 소유를 줄이는 쪽의 원리
- [[Shared state belongs at the lowest common ancestor of its consumers]] — 숨은 공유 상태가 왜 생기는지
- [[Stateless design makes any instance interchangeable by externalizing state]] — "두 번 인스턴스화" 탐침의 원리
- [[Repository layer encapsulates persistence not authorization]] — 시그니처가 결합 방향을 정한다
- [[Place the seam where the data crossing it is small and cold]] — 경계를 어디에 그을지
- [[Coupling]] — afferent · efferent 결합도
