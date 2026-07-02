---
created: 2026-07-01
updated: 2026-07-01
type: study
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - react
  - state
  - frontend
publish: true
---
## Context
Align AI UI stats 페이지 작업 중 `useState`를 쓰는 이유를 설명하다가 "상태가 무슨 개념인가"라는 질문이 나왔다. 일반 변수와의 차이를 처음 의식적으로 비교했다.

## Insight
### React는 일반 변수 변경을 감지하지 못한다

```tsx
// 일반 변수 — 바뀌어도 화면 안 바뀜
let result = null;
result = data;  // React가 모름 → 재렌더 없음

// 상태 — setResult 호출 시 React가 감지 → 재렌더
const [result, setResult] = useState(null);
setResult(data);
```

`useState`를 쓰는 유일한 이유는 React에게 "이 값이 바뀌면 다시 그려"라고 알리기 위함이다.

### 상태는 UI가 기억해야 하는 값이다

변할 수 있고, 변하면 화면을 다시 그려야 하는 값. Align AI 예시:

```
이미지 업로드 전  → result = null    → "대기중" 배지
업로드 후        → result = {...}   → "ok" / "fail" 배지
```

### 상태가 필요 없는 경우도 있다

데이터가 고정(Mock)이거나 매 렌더마다 계산해도 결과가 같으면 상태 불필요:

```tsx
// MOCK 데이터는 안 바뀌므로 상태 없이 바로 계산
const summary = calcSummary(MOCK_HISTORY);
```

상태가 필요해지는 시점은 데이터가 외부에서 비동기로 오거나 사용자 인터랙션으로 바뀔 때다.

## Related
- [[State location and component extraction are orthogonal design problems]] — 상태를 어디에 둘지는 별개 문제
- [[ViewModel computes without state while hooks combine computation with state]] — 상태 유무가 ViewModel과 Hook을 가르는 기준
