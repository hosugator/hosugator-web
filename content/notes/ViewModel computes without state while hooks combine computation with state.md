---
created: 2026-07-01
updated: 2026-07-01
type: insight
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - react
  - mvvm
  - architecture
  - frontend
  - hooks
publish: true
---
## Context
Align AI stats 페이지 스캐폴딩을 작성하면서 `calcSummary` 같은 순수함수를 컴포넌트 밖에 두었다. "이게 ViewModel이냐 Hook이냐"는 질문이 나왔고, MVVM이 웹/앱을 가리지 않는 패턴임을 인식했다.

## Insight
### MVVM에서 ViewModel은 순수 변환이다

```
Model      ← 원본 데이터 (API 응답, types.ts)
ViewModel  ← UI용으로 가공 (순수함수, 상태 없음)
View       ← 렌더링 (JSX)
```

ViewModel은 "입력 → 출력"만 한다. `useState` 없이도 동작한다.

```tsx
// ViewModel — 상태 없음, 입력이 같으면 항상 같은 출력
function calcSummary(data) {
  return { total: data.length, passRate: ... }
}
```

### Hook은 ViewModel에 상태와 React 생명주기를 더한 것이다

```tsx
// Hook — ViewModel 계산 + 상태 소유 + 비동기 관리
function useInference() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function predict(file) {
    setLoading(true);
    const res = await fetch("/api/predict", { ... });
    setResult(await res.json());
    setLoading(false);
  }

  return { result, loading, predict };
}
```

`use`로 시작하는 이름 규칙이 Hook임을 표시한다. Hook 내부에는 반드시 `useState` 또는 다른 Hook이 있다.

### 경계 기준: "렌더 사이에 무언가를 기억해야 하는가"

| 조건 | 선택 |
|---|---|
| 입력 → 계산 → 출력, 기억 불필요 | 순수함수 (ViewModel) |
| API 호출 결과, 로딩 상태 등 기억 필요 | Hook |

utils와 ViewModel의 구분:
- `utils` — 도메인 무관 범용 함수 (`formatPercent`, `truncate`)
- `ViewModel` — 이 앱의 데이터를 UI용으로 해석하는 함수 (`calcPassRate`)

## Related
- [[React state triggers re-render while local variables are invisible to React]] — 상태 개념, Hook이 필요한 이유
- [[State location and component extraction are orthogonal design problems]] — 상태 위치와 컴포넌트 추출은 독립 문제
