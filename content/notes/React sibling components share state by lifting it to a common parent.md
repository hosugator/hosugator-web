---
created: 2026-06-26
updated: 2026-06-26
type: study
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - react
  - state
  - component
  - props
  - frontend
publish: true
---
## Context
Align-AI 6단계에서 UploadForm(파일 업로드)과 OverlayCanvas(라인 그리기)를 연결하려다가 형제 컴포넌트끼리 직접 데이터를 주고받을 수 없다는 걸 처음 만났다. InferencePanel이라는 부모를 만들어서 해결했다.

## Insight
### 형제 컴포넌트는 직접 대화할 수 없다 — 부모가 중계해야 한다

```
불가능:
UploadForm → OverlayCanvas  (형제 간 직접 전달)

가능:
UploadForm → onResult(data) → InferencePanel(state) → result prop → OverlayCanvas
```

React의 데이터 흐름은 단방향이다 — 부모에서 자식으로만 흐른다. 자식이 부모에게 데이터를 올릴 때는 콜백 함수를 prop으로 받아서 호출한다.

### 각 컴포넌트는 하나의 역할만 담당한다

```tsx
UploadForm     → 파일 UI + 추론 요청 + 결과 전달 (onResult 호출)
OverlayCanvas  → 이미지 표시 + 라인 그리기 (result prop 소비)
InferencePanel → state 소유 + 둘을 연결
```

UploadForm이 직접 canvas를 건드리거나, OverlayCanvas가 fetch를 하면 역할이 뒤섞인다. "이 컴포넌트는 무엇만 한다"를 지키면 재사용이 쉬워진다.

### useState는 항상 [값, setter] 두 가지를 반환한다

```tsx
const [result, setResult] = useState<InferenceResult | null>(null)
//     ↑ 읽기             ↑ 쓰기
```

`setResult`를 UploadForm의 `onResult` prop으로 넘기면, UploadForm이 추론 결과를 받았을 때 InferencePanel의 state를 직접 업데이트할 수 있다.

## Related
- [[Browser events pass DOM state to handler functions enabling file upload pipelines]] — UploadForm의 파일 업로드 플로우
- [[Canvas overlay on image requires useRef for DOM access and useEffect for post-render execution]] — OverlayCanvas 구현
- [[Next.js server components fetch directly while client components require API Route for CORS]] — 클라이언트 컴포넌트 분리 이유
