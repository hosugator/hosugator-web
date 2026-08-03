---
created: 2026-07-15
updated: 2026-07-15
type: study
status: 2-stable
subject: "[[CS]]"
project: "[[에코마케팅 - 마케팅 프로세스 자동화 개발자 (Python)]]"
tags:
  - algorithm
  - binary-search
  - python
publish: true
---
## Context
에코마케팅 코딩테스트(마케팅 프로세스 자동화 개발자, 인터넷 검색 불가) 준비 중 `~/projects/coding-test-prep`에서 이진 탐색(binary search) 문제를 스캐폴딩 없이 독립적으로 풀다가 겪은 버그에서 비롯됨.
`right = len(arr)`로 시작하며 `while left < right`, `right = mid`로 좁히는 방식(exclusive)과, `right = len(arr) - 1`로 시작하며 `right = mid - 1`로 좁히는 방식(inclusive)을 섞어 써서, `target`이 배열 맨 앞(인덱스 0)에 있는 경우를 한 번도 확인하지 않고 건너뛰는 off-by-one 버그가 발생했다.

## Insight
### 경계의 inclusive/exclusive 정의가 비교 연산자를 결정한다
`right`가 "마지막 유효 인덱스"(inclusive)인지 "마지막 인덱스+1, 포함 안 됨"(exclusive)인지에 따라 "탐색 범위가 비었는가"의 판정 기준 자체가 달라진다.

- inclusive: `[left, right]`가 비지 않으려면 `left <= right`. 그래서 루프 조건은 `while left <= right`.
- exclusive: `[left, right)`가 비지 않으려면 `left < right`. 그래서 루프 조건은 `while left < right`.

비교 연산자는 임의로 고르는 게 아니라 경계의 정의에서 그대로 도출된다.

### left는 두 컨벤션 모두 항상 inclusive라, 왼쪽 축소는 항상 mid+1이다
`left`가 가리키는 인덱스는 두 컨벤션에서 공통적으로 "아직 확인 안 된 유효한 후보"다.
`arr[mid] < target`으로 판명되면 `mid`는 이미 확인되어 제외 대상이므로, 컨벤션과 무관하게 `left = mid + 1`로 처리한다.

### right만 정의에 따라 축소 폭이 갈린다
- inclusive `right`는 그 자신도 유효한 후보여야 하므로, `mid`를 제외하려면 한 칸 더 내려가야 한다 → `right = mid - 1`.
- exclusive `right`는 이미 "포함 안 함"이 정의이므로, `right = mid`만으로 `mid`가 자동으로 제외된다. 여기에 `-1`을 더하면 `mid` 바로 아래의 아직 확인 안 된 유효 후보까지 실수로 잘라내는 버그가 된다 (실제로 겪은 버그의 원인).

### 세 번째 컨벤션: 파라메트릭 서치는 양쪽 다 exclusive
"값이 있는지"가 아니라 "조건을 처음 만족하는 위치를 찾아라" 류(파라메트릭 서치, 예: 프로그래머스 "입국심사")에서는 `left`도 exclusive로 두는 컨벤션이 흔하다.
`left`="조건 불만족의 마지막 위치", `right`="조건 만족의 첫 위치"로 두고 `while right - left > 1`로 좁혀, "정답이 맨 앞일 수도, 아예 없을 수도 있는" 경우를 특별 처리 없이 다룬다.

## Decision
이후 "값 찾기" 류 이진 탐색은 exclusive 컨벤션(`right = len(arr)`, `while left < right`, `right = mid`, `left = mid + 1`)을 기본으로 채택. 파이썬의 `range()`, 슬라이싱, `bisect` 모듈이 전부 반열린구간(half-open) 방식이라 일관성이 있고, 나중에 파라메트릭 서치로 확장할 때도 개념이 자연스럽게 이어지기 때문. inclusive 컨벤션이 이미 손에 익은 경우까지 강제로 바꿀 필요는 없음 — 전환 조건은 "파라메트릭 서치 문제를 만나 세 번째 컨벤션(양쪽 exclusive)이 필요해질 때" 재검토.

## Related
- [[Classification evaluation metrics guide for team model comparison]] — 같은 코딩테스트 준비 기간에 작성된 다른 팀 공유 문서, 직접 연관은 없으나 같은 프로젝트 맥락
