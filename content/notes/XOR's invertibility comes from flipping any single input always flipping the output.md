---
created: 2026-07-27
updated: 2026-08-03
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[AOI]]"
tags:
  - xor
  - boolean-algebra
  - erasure-coding
  - parity
publish: true
---
## Context
"패리티는 원본 전체를 재료로 한 계산값"이라는 노트를 다시 읽다가, "왜 하필 XOR인가, 다른 연산으로는 안 되는가"를 변증했다. AND/OR/다수결과 비교하며 XOR만의 조건을 규명했다.

## Insight
### 가역적 축약은 "아무 조합에서나 하나를 뒤집으면 반드시 결과가 뒤집힌다"는 조건이다

n개 입력을 1개로 축약하는 함수가 있을 때, 그 결과와 나머지 n-1개만으로 없어진 하나를 항상 복원하려면 — 다른 입력이 어떤 값이든 상관없이, 문제의 입력 하나를 뒤집으면 결과도 반드시 뒤집혀야 한다. 이 조건이 예외 없이 성립해야 "역산 가능"이 보장된다.

### 이 조건을 만족하는 건 XOR과 그 부정형(XNOR)뿐이다

2-입력 기준 가능한 16개 불리언 함수 중 이 조건을 만족하는 건 2×2 진리표가 라틴방진을 이루는 경우뿐이고, 그건 XOR과 XNOR 두 개뿐이다. n≥3으로 확장해도 "전체 XOR" 또는 그 부정만 성립한다. 둘은 마지막에 부정을 붙였는지 차이뿐이라 본질적으로 같은 구조다.

### 참의 개수의 홀짝(parity) 판단으로 일반화된다

2-입력의 "정확히 하나만 참일 때 참"은, n-입력에서는 "참끼리 둘씩 짝지어 소거하고 남는 게 있는가(홀수인가)"로 확장된다. `1 XOR 1 = 0`(자기소거), `X XOR 0 = X`이 이 짝짓기 소거를 뒷받침하는 성질이다.

## Related
- [[Parity reconstructs data from equations over the whole set, not from copying part of it]] — 이 노트의 복구 메커니즘이 성립하는 근본 조건(가역성)을 규명
- [[Bit-pattern equality ignores magnitude, so numeric proximity needs subtraction instead of XOR]] — XOR이 대신 포기하는 성질(수치적 근접성)과의 대비
