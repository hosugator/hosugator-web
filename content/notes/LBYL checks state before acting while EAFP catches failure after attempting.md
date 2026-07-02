---
created: 2026-06-29
updated: 2026-06-29
type: study
status: 2-stable
subject: "[[App]]"
project: "[[Go2fit]]"
tags:
  - error-handling
  - defensive-programming
  - patterns
publish: true
---
## Context
go2fit 오프라인 큐 구현 중 connectivity_plus race condition 디버깅에서 출발. catch fallback이 왜 connectivity 사전 체크보다 신뢰성 높은지를 설명하다가 상위 개념으로 탐색.

## Insight

### Defensive programming은 실패를 전제하고 설계하는 철학이다

코드가 정상 경로만 가정하지 않고, 실패 가능성을 구조적으로 다루는 프로그래밍 접근이다. 두 가지 전략이 대립한다.

### LBYL — 뛰기 전에 먼저 봐라 (사전 체크)

```
if connected:
    api.call()
```

상태를 먼저 확인하고, 조건이 충족될 때만 행동한다.

**적합한 경우:**
- 실패 자체에 비용이 클 때 (결제, DB 트랜잭션)
- 실패 후 복구가 불가능할 때 (파일 덮어쓰기)
- 예외 원인을 구분해야 할 때
- UX 목적으로 미리 알려야 할 때

### EAFP — 허락보다 용서가 쉽다 (catch fallback)

```
try:
    api.call()
except SocketException:
    enqueue()
```

시도 후 실패를 잡아 대체 경로로 전환한다.

**적합한 경우:**
- 상태를 미리 알 수 없거나 체크가 신뢰할 수 없을 때 (TOCTOU race condition)
- 시도 비용이 낮을 때
- 실패가 유일한 진실일 때

### 둘은 배타적이지 않다

LBYL을 1차 방어선으로, EAFP를 최종 보루로 조합하는 2단계 구조가 더 견고하다. connectivity 체크(LBYL)는 UX와 불필요한 시도 방지용, catch fallback(EAFP)은 race condition 커버용으로 역할이 분리된다.

## Related
- [[Connectivity type check does not guarantee reachability]] — LBYL+EAFP 2단계 구조의 실제 적용 사례
- [[Type systems implement fail-fast by shifting error detection from runtime to compile time]] — 실패를 조기에 잡는다는 같은 방향의 다른 메커니즘
- [[try-except 문에서 except는 언제 실행되는가]] — EAFP 구현의 기초 메커니즘
