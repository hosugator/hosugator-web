---
created: 2026-07-24
updated: 2026-07-24
type: insight
status: 2-stable
subject: "[[CS]]"
project: "[[에코마케팅 - 마케팅 프로세스 자동화 개발자 (Python)]]"
tags:
  - binary-search
  - two-pointer
  - parametric-search
  - invariant
publish: true
---
## Context
09(파라메트릭 서치)와 10(두 포인터) 문제의 이진탐색 경계 조건을 리뷰하며, "이건 inclusive냐 exclusive냐"로 판단하려다 막혔다. `right=mid`/`right=mid-1` 두 변형을 직접 만들어 스트레스 테스트로 검증하며, inclusive/exclusive라는 이분법이 파라메트릭 서치에는 깔끔하게 안 맞는다는 걸 발견했다.

## Insight
### `<`와 `<=`를 가르는 건 "경계가 이미 검증됐는가"이지, inclusive/exclusive라는 이름표가 아니다
루프가 끝나 `left`와 `right`가 만나는 순간 남는 값이 "이미 확인 끝난 값"이면 더 볼 필요 없어 `while left < right`, "아직 한 번도 검사 안 해본 값"이면 한 번 더 봐야 하니 `while left <= right`. 이 질문 하나로 배열 탐색, 파라메트릭 서치, 두 포인터의 모든 경계 조건이 설명된다.

### 배열 탐색에서는 "존재"와 "검증"이 항상 같이 묶여 있어서 inclusive/exclusive라는 이름이 통했다
배열 탐색의 inclusive `right`(`len(arr)-1`)는 실제 존재하는 인덱스지만 검증은 안 된 상태고, exclusive `right`(`len(arr)`)는 애초에 존재하지 않는 자리다. 이 경우 "존재 여부"가 곧 "검증 필요 여부"와 사실상 같이 움직여서, inclusive/exclusive라는 하나의 이름표로 충분했다.

### 파라메트릭 서치는 단조성 덕분에 "존재"와 "검증"이 분리된다
`count(mid) >= n`을 확인하는 순간 단조성 때문에 `mid`보다 큰 값 전부가 자동으로 검증된다. 그래서 `right = mid`로 두면 `right`는 "존재하면서 동시에 이미 검증까지 끝난" 상태가 되는데, 이건 배열 탐색에서는 나올 수 없는 조합이다. 이 조합 때문에 09번은 exclusive 루프 조건(`<`)을 쓰면서도 `right`가 유효한 값을 유지하는 특이 케이스가 됐다.

### "몇 개가 유효한가"로 세는 접근은 반례에서 깨진다
배열 탐색 inclusive는 `left`, `right` 둘 다 실제로 존재하는(유효한) 인덱스지만 여전히 `<=`가 필요하다 — "유효한 개수"가 아니라 "검증 여부"가 기준이라는 걸 보여주는 반례.

## Related
- [[Binary search's left boundary is always inclusive, only the right boundary's convention varies]] — 이 원리가 일반화하는 배열 탐색 사례. 그 노트의 "세 번째 컨벤션(파라메트릭 서치, 양쪽 exclusive)" 설명은 이 노트의 통합 기준으로 재해석 가능
- [[Recognizing an algorithm pattern requires checking the invariant behind the parameter split, not just the split itself]] — "불변식을 확인하라"는 상위 방법론의 구체적 적용 사례
- [[Binary search compares against a fixed target while ternary search compares two probes against each other]] — 같은 스프린트에서 나온 경계 조건 관련 다른 노트
