---
created: 2026-06-26
updated: 2026-07-02
type: study
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - react
  - canvas
  - useref
  - useeffect
  - usestate
  - frontend
publish: true
---
## Context
Align-AI 대시보드 4단계 실습 중. 추론 이미지 위에 탐지 라인을 동적으로 그리기 위해 Canvas 오버레이 구조를 처음으로 구현했다.

## Insight
### 이미지 위에 Canvas를 겹치려면 공통 기준 컨테이너가 필요하다

```tsx
<div style={{ position: "relative" }}>     // 좌표 기준 컨테이너
  <Image src="..." width={800} height={600} />
  <canvas
    style={{ position: "absolute", top: 0, left: 0 }}
    width={800} height={600}
  />
</div>
```

`position: relative` 없으면 Canvas가 viewport(화면 전체)를 기준으로 위치를 잡아 이미지와 어긋난다. Canvas와 Image의 width/height를 일치시켜야 좌표계가 맞는다.

### useRef는 DOM 요소 참조, useEffect는 렌더링 후 실행 타이밍을 제어한다

```tsx
const canvasRef = useRef<HTMLCanvasElement>(null)

useEffect(() => {
  const canvas = canvasRef.current   // DOM 생성 후에 접근 가능
  const ctx = canvas.getContext("2d")
  ctx.strokeStyle = "red"
  ctx.beginPath()
  ctx.moveTo(0, 300)
  ctx.lineTo(800, 300)
  ctx.stroke()
}, [])   // [] = 마운트 시 1회만 실행
```

JSX return 시점에는 DOM이 없다. useEffect가 "DOM 생긴 후 실행"을 보장한다. `[]`는 의존성 배열 — 빈 배열이면 마운트 시 1회, `[data]`면 data 변경 시마다 재실행.

### Canvas 그리기 API는 경로 정의 후 stroke()로 한 번에 그린다

```
beginPath()     → 새 경로 시작
moveTo(x, y)    → 펜 이동 (선 안 그음)
lineTo(x, y)    → 경로 추가
stroke()        → 경로를 실제로 화면에 그림 (이전까지는 화면에 없음)
```

### useRef → useState → useEffect 순서로 흐른다

DOM을 직접 건드리는 작업에서 세 훅의 역할이 자연스럽게 순서를 만든다.

```
useRef      →  DOM 요소를 참조할 변수 준비 (값이 바뀌어도 재렌더링 없음)
useState    →  값 변경 → 재렌더링 트리거 ("재렌더링 해줘" 요청)
useEffect   →  DOM 반영 완료 후 실제 작업 실행 ("DOM 끝났어, 이제 해도 돼" 보장)
```

`setState`는 재렌더링 요청일 뿐, DOM 반영 완료 시점을 보장하지 않는다. canvas처럼 실제 DOM 요소에 접근해야 하는 작업은 `useEffect` 안에서만 안전하다.

```tsx
// OverlayCanvas의 실제 흐름
const canvasRef = useRef(null)          // 1. 참조 준비
// useState는 InferencePanel에서 관리   // 2. 값 변경 → 재렌더링
useEffect(() => {
  const canvas = canvasRef.current      // 3. DOM 반영 후 canvas 접근 가능
  ctx.moveTo(...)
}, [result])                            // result 바뀔 때마다 재실행
```

### Canvas는 "use client" 필요 — 브라우저 API이기 때문이다

Canvas는 브라우저에서만 실행 가능한 API다. 서버 컴포넌트에서 쓰면 에러난다. 별도 클라이언트 컴포넌트로 분리해서 `"use client"`를 선언한다.

## Related
- [[Next.js server components fetch directly while client components require API Route for CORS]] — 클라이언트 컴포넌트 분리 이유
- [[HTML CSS JS DOM JSX Babel React each occupy a distinct layer in web]] — DOM 개념
