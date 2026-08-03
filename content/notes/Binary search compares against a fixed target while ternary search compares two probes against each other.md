---
created: 2026-07-24
updated: 2026-07-24
type: study
status: 2-stable
subject: "[[CS]]"
project: "[[에코마케팅 - 마케팅 프로세스 자동화 개발자 (Python)]]"
tags:
  - coding-test
  - binary-search
  - ternary-search
  - parametric-search
publish: true
---
## Context
09_immigration 문제를 이진탐색으로 풀고 난 뒤, "삼분탐색은 언제 쓰는가"를 변증하며 두 기법을 구분하는 기준을 처음 정리했다.

## Insight
### 이진탐색은 판별 결과를 고정된 상수와 비교하고, 삼분탐색은 함수 자신의 두 값끼리 비교한다
이진탐색은 `count(mid)`처럼 판별 함수의 결과를 문제에서 주어진 고정 상수(n)와 비교해 경계를 좁힌다. 삼분탐색은 비교할 고정 상수가 없다 — 대신 같은 함수를 두 지점(`mid1`, `mid2`)에서 평가한 값끼리 비교해서, 극값이 있을 수 없는 쪽을 버린다.

### 이 차이는 판별 함수의 모양에서 나온다
판별 함수가 단조(한 번만 경계를 넘음)면 상수와 비교해 경계를 찾을 수 있어 이진탐색이 적용된다. 판별 함수가 골짜기/봉우리 모양(convex/concave, 최솟값·최댓값이 하나)이면 경계라는 게 없어 상수 비교가 불가능하고, 두 지점을 비교해 극값 방향을 추론하는 삼분탐색이 필요하다.

### 단조성이 깨지는 대표 반례 두 가지
- "정확히(exactly)" 조건: 배열 `[1,4]`에서 합 S를 만들 수 있는지는 S=0,1(가능)→2,3(불가능)→4,5(가능)로 왔다 갔다 한다. "이상/이하"가 아니라 "정확히" 조건은 단조성이 거의 항상 깨진다.
- U자형 최적화: 그룹을 나누는 기준점을 움직이며 두 그룹 합의 차이를 최소화하는 문제는, 기준점이 커질수록 차이가 줄다가 다시 늘어난다 — 판별할 경계가 없고 극값만 있다.

### 이름 자체도 "몇 지점으로 몇 조각을 내는가"에서 왔다
이진탐색은 기준점 1개(`mid`)로 구간을 2조각, 삼분탐색은 기준점 2개(`mid1`, `mid2`)로 구간을 3조각으로 나눈다. "이진/삼분"이라는 이름은 이 조각 수를 가리킨다. 한국어에서는 "이진탐색"(binary의 직역)과 "이분탐색"(나누기 동작의 직역)이 동의어로 쓰이는데, "삼분탐색"과의 명명 일관성 면에서는 "이분탐색"이 더 자연스럽다.

## Related
- [[Binary search's left boundary is always inclusive, only the right boundary's convention varies]] — 이진탐색 경계 조건을 다루는 다른 축의 노트
- [[Recognizing an algorithm pattern requires checking the invariant behind the parameter split, not just the split itself]] — 이 구분법이 적용되는 상위 방법론(3단계: 불변식 확인)의 구체 사례
