---
created: 2026-07-30
updated: 2026-07-30
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - architecture
  - methodology
  - testing
  - refactoring
publish: true
---
## Context
상태 소유·배치 모델을 정리한 뒤 "앞으로 이 모델에 기초해 개발해도 적절한가"를 판단해야 했다. 

## Insight
### 이 모델의 장점은 검증 가능하다는 것이다

- 같은 값의 사본이 두 곳에 있다        →  너무 낮다
- 상위가 자기는 안 쓰는 상태를 든다      →  너무 높다
- 두 번 인스턴스화하면 깨진다            →  숨은 공유 상태
- 지키는 규칙을 docstring 에 못 쓴다     →  소유할 이유가 없다
- 플래그를 두기 어렵다                  →  경계가 가짜다

### 그러나 이 모델이 답하지 않는 것이 네 개 있다

| 답하지 않는 것 | 왜                                                                                 |
| -------- | --------------------------------------------------------------------------------- |
| 병행성      | 소유권은 "누가 값을 갖는가"를 정하고 "어느 스레드가 만질 수 있는가"는 정하지 않는다. 단일 소유자여도 두 스레드가 건드리면 깨진다       |
| 수명       | LCA는 어디를 말하고 얼마나 오래를 말하지 않는다. 배치가 옳아도 수명이 틀리면 죽은 객체를 참조한다                         |
| 기능 분할    | 어디를 자를지는 별개 축이다 — [[Place the seam where the data crossing it is small and cold]] |
| 멈춤 조건    | 끝까지 밀어내면 매개변수 10개짜리 함수가 되고, 그걸 묶으면 다시 god object다                                 |
특히, 네 번째가 흔한 실수다. 
멈추는 기준은 "이 모듈에 지킬 불변식이 있는가"이고, 그것이 없으면 밀어내기를 멈춘다.

### 잘 도는 기존 코드는 건드리지 않는다

```
새 기능              →  모델대로 만든다
이미 손대는 모듈      →  그때 함께 정리한다
잘 도는 코드          →  건드리지 않는다
```

어떤 모듈을 기능 추가 때문에 어차피 크게 손대야 하면 그 시점에 모델에 맞춘다.
그리고 진단 신호가 실제 결함으로 나타나면(예: 다중 GPU 지원이 필요해져 단일 슬롯이 막으면) 그것을 근거로 그 부분만 고친다.

## Related
- [[Encapsulation exists to protect an invariant so state without a rule should not be owned]] — 모델의 소유 규칙
- [[Shared state belongs at the lowest common ancestor of its consumers]] — 모델의 배치 규칙
- [[Separability and reusability are opposite directions of coupling so one test cannot show both]] — 모델의 검증 방법
- [[Place the seam where the data crossing it is small and cold]] — 모델이 답하지 않는 상위 문제
- [[A non-deterministic component in the verification environment destroys the implication CI sells]] — 원칙을 테스트로 강제하는 것과 같은 계보
- [[Existing team familiarity can outweigh a technically superior tool's advantages in real adoption decisions]] — 더 나은 것이 있어도 바꾸지 않는 판단
