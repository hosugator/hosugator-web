---
created: 2026-07-30
updated: 2026-08-03
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - state
  - caching
  - architecture
  - concurrency
publish: true
---
## Context
값과 상태의 차이를 "상태는 자극이 없어도 변한다"는 명제로 세웠다.
그러나 변증하다보니 그 명제는 거짓이었다.

## Insight
### 차이는 자발성이 아니라 통제 범위다

상태는 저절로 변하지 않는다. 

```
값     아무도 바꿀 수 없다 == 같은 입력에 같은 출력이다
상태   누군가는 바꿀 수 있다  →  내가 안 바꿨는데 바뀌어 있을 수 있다 == 같은 입력에 다른 출력이
```

바꿀 수 있는 주체의 집합이 내가 통제하는 범위보다 넓다는 것이 문제다. 정확한 기준은 "내가 아는 자극만으로 결과를 예측할 수 있는가"다.

### 어려움은 상태에서 나온다

| 어려움             | 원인               |
| --------------- | ---------------- |
| 두 번 인스턴스화하면 깨진다 | 공유 상태            |
| 두 스레드가 충돌한다     | 같은 상태를 만진다       |
| 테스트가 순서에 의존한다   | 이전 호출이 남긴 상태     |
| 재사용이 안 된다       | 남의 맥락을 상태로 들고 있다 |

### 판단 사이에는 재확인, 판단 안에서는 고정

```
판단과 판단 사이   →  다시 읽는다 (캐시하지 않는다)
하나의 판단 안     →  한 번 읽어 값으로 고정하고, 그것을 전달한다
```

즉 프로세스 수명이라는 창 안에서만 불변이고, 그 창을 명시했기 때문에 캐시가 정당하다.
단, 캐시의 정당성은 "만료되면 다시 읽는다"는 전제에 의존하고, 그 갱신 경로 자체가 우리가 감시하지 않는 외부 상태다. 
그래서 외부 상태를 캐시하는 것은 보이는 것보다 위험하다 — 데이터가 낡는 것이 문제가 아니라 갱신 장치가 죽었는지 모르는 것이 문제다.

## Related
- [[Encapsulation exists to protect an invariant so state without a rule should not be owned]] — 무엇을 소유할지의 기준
- [[Shared state belongs at the lowest common ancestor of its consumers]] — 사본 문제의 공간 버전
- [[SFTP FUSE mount serves stale data when SSH connection silently drops]] — 갱신 경로가 조용히 죽은 실례
- [[Sealing moves uncertainty into lifecycle management so its net gain depends on change frequency]] — "감시 지표가 엉뚱한 것을 본다"의 다른 사례
- [[Stateless design makes any instance interchangeable by externalizing state]] — 상태를 밖으로 밀어내는 효과
- [[Concurrency Control]] · [[Locking]] — 상태 경쟁을 다루는 수단
- [[Event loops remove waiting threads not computing threads]] — 폴링 주기를 이벤트 루프에서 다루는 근거
