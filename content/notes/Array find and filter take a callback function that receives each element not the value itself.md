---
created: 2026-07-01
updated: 2026-07-01
type: study
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - javascript
  - array
  - callback
  - frontend
publish: true
---
## Context
Align-AI History 페이지에서 선택된 항목을 찾는 코드를 작성하다가 `find(selectedId)`가 아니라 `find((item) => item.id === selectedId)`로 써야 하는 이유를 처음으로 명확히 이해했다.

## Insight
### array.find()는 값이 아니라 "판단 함수"를 받는다

```js
// ❌ 값을 직접 넘기면 동작 안 함
MOCK_HISTORY.find(selectedId)

// ✅ 각 요소를 받아 조건을 판단하는 함수를 넘겨야 함
MOCK_HISTORY.find((item) => item.id === selectedId)
```

`find`는 배열을 순회하면서 각 요소를 콜백 함수에 넘기고, `true`를 반환하는 첫 번째 요소를 돌려준다. `item`은 현재 순회 중인 요소를 가리키는 임시 변수명 — `x`, `el`로 써도 동작은 같다.

### 같은 패턴을 쓰는 array 메서드들

```js
arr.find((item) => 조건)      // 첫 번째 일치 요소 반환
arr.filter((item) => 조건)    // 일치하는 모든 요소 배열 반환
arr.map((item) => 변환)       // 각 요소를 변환한 새 배열 반환
arr.some((item) => 조건)      // 하나라도 일치하면 true
arr.every((item) => 조건)     // 모두 일치하면 true
```

모두 "각 요소에 실행할 함수"를 인자로 받는 고차 함수(higher-order function) 패턴이다.

## Related
- [[State location and component extraction are orthogonal design problems]] — HistoryPanel에서 selectedId 상태 위치 결정
