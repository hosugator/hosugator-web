---
created: 2026-07-30
updated: 2026-07-30
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - oop
  - encapsulation
  - state
  - architecture
publish: true
---
## Context
재사용 가능한 코드의 원칙을 정리하다가 "모듈은 값을 소유하지 않고 입력받아 출력한다"에 도달했다. 그런데 이것이 OOP의 캡슐화("객체는 자기 데이터를 소유한다")와 반대인 것처럼 보였다.

## Insight
### 캡슐화의 목적은 은닉이 아니라 불변식 보호다

```
X   자기 완결성을 위해 데이터를 품는다
O   그 상태에 대한 규칙을 지키는 유일한 지점이 되기 위해
```

`BankAccount`가 `balance`를 private으로 두는 이유는 감추려는 게 아니라 누구도 잔액을 음수로 만들 수 없게 보장하려고다. 모든 변경이 자기를 통과해야만 규칙을 강제할 수 있다.
그렇게 읽으면 "불변식을 강제하는 단일 지점"과 "single source of truth"가 같은 말이 된다. 두 진술은 대립하지 않는다.

### god object 판별은 docstring 으로 된다

`이 상태에 대해 내가 지키는 규칙을 적을 수 있는가?` 적을 게 있으면 소유하고, 없으면 그냥 들고 있는 것이라 소유할 이유가 없다. 실제 코드로 검증하면 깔끔히 갈린다.

| 상태                        | 지키는 규칙                                  | 판정  |
| ------------------------- | --------------------------------------- | --- |
| `_cuda_diag` (모듈 전역 캐시)   | "진단은 한 번만. 매번 하면 CUDA 초기화가 수 초 + 경고 반복" | ✅   |
| `_gpu_proc` (QProcess 핸들) | "동시에 한 건만 조회" — `state()`로 검사           | ✅   |
| `self._gpu_value` (라벨 참조) | 없음                                      | ❌   |

앞의 둘은 docstring에 규칙이 실제로 적혀 있고, 마지막은 적을 것이 없다. 그게 차이다.
이 판별은 [[Repository layer encapsulates persistence not authorization]]의 "함수 시그니처가 책임 범위를 결정한다"와 같은 구조다 — 받지 않으면 책임질 수 없고, 지킬 규칙이 없으면 소유할 이유가 없다. 양쪽 다 "무엇을 가졌는지가 무엇을 책임지는지를 정한다"는 이야기다.

### 진짜 트레이드오프는 불변식을 어디서 강제하느냐다

교환이 아예 없는 것은 아니다. 검사 위치가 갈린다.

|              | 강제 시점     | 대가                             |
| ------------ | --------- | ------------------------------ |
| OOP — 객체가 소유 | 변경할 때마다   | 읽는 쪽이 늘면 접근자·시그널이 늘어난다         |
| 함수형 — 불변값 전달 | 생성할 때 한 번 | 공유는 쉽지만 변경을 표현하려면 새 값을 만들어야 한다 |

그래서 실무 규칙이 이렇게 나뉜다.

```
불변 값                     전달한다 (함수형 쪽)
규칙이 있는 가변 상태        소유한다 (OOP 쪽)
계산 결과가 항상 같은 값      캐시해도 안전 — _cuda_diag 가 이 경우
시간에 따라 바뀌는 관측값     보유하지 않고 흘려보낸다 (시그널·반환값)
다른 곳에도 있는 값의 사본    금지 — 소유자에게서 받는다
```

## Related
- [[Shared state belongs at the lowest common ancestor of its consumers]] — 소유해야 할 상태를 어디에 둘지
- [[Re-read external state between decisions and freeze it within one]] — 값과 상태의 구분, 그리고 외부 상태를 다루는 규칙
- [[Separability and reusability are opposite directions of coupling so one test cannot show both]] — 소유를 줄인 결과를 어떻게 검증하는지
- [[Repository layer encapsulates persistence not authorization]] — 시그니처가 책임 범위를 정한다는 같은 구조
- [[Stateless design makes any instance interchangeable by externalizing state]] — 상태를 밖으로 밀어내는 것의 효과
- [[Coupling]] · [[Cohesion]] — 결합도·응집도 개념
- [[객체지향개발의 데이터 독립성]] — OOP 계보