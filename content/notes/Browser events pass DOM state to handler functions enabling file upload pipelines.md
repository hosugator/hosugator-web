---
created: 2026-06-26
updated: 2026-06-26
type: study
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - react
  - events
  - formdata
  - file-upload
  - frontend
publish: true
---
## Context
Align-AI 대시보드 5단계 실습 중. 오퍼레이터가 이미지를 업로드하면 FastAPI로 추론 요청을 보내는 플로우를 처음으로 구현했다.

## Insight
### 이벤트는 파이프라인의 트리거다

```
파일 선택    →  onChange 트리거  →  handleChange 실행
버튼 클릭   →  onClick 트리거   →  handleClick 실행
폼 제출     →  onSubmit 트리거  →  handleSubmit 실행
```

ArgoCD에서 Git push가 sync를 트리거하는 것과 같은 패턴이다. 이벤트 = "무언가가 발생했다"는 신호.

### event 객체는 브라우저가 자동으로 핸들러에 넘긴다

```tsx
<input type="file" onChange={handleChange} />
// 브라우저가 자동으로: handleChange(event) 호출
```

개발자가 직접 event를 넘기지 않아도 된다. `event.target`은 이벤트가 발생한 DOM 요소, `event.target.files`는 선택된 파일 목록(배열).

### 파일 업로드 플로우

```tsx
async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0]   // 옵셔널 체이닝으로 null 방어
  if (!file) return                       // undefined면 조용히 종료 (앱 크래시 방지)
  const formData = new FormData()
  formData.append("file", file)
  const res = await fetch("/api/predict", { method: "POST", body: formData })
  const data = await res.json()
}
```

### FormData는 바이너리 파일을 HTTP 요청에 담는 컨테이너다

JSON은 텍스트만 담을 수 있다. 이미지처럼 바이너리 데이터는 FormData로 포장해야 한다. FastAPI의 `UploadFile = File(...)`이 FormData를 받는 쪽이다.

## Related
- [[Next.js server components fetch directly while client components require API Route for CORS]] — 클라이언트 컴포넌트에서 API Route 경유
- [[Next.js App Router maps folder structure to URLs and file names to component roles]] — route.ts 구조
