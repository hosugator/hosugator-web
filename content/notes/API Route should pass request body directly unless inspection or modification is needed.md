---
created: 2026-06-26
updated: 2026-06-27
type: insight
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - nextjs
  - api-route
  - dry
  - frontend
publish: true
---
## Context
Align-AI 5단계에서 `/api/predict` route.ts를 작성하다가, formData를 꺼냈다가 다시 담는 방식이 DRY 원칙 위반임을 발견했다. "실용주의 프로그래머"에서 배운 DRY 원칙이 여기서 바로 적용됐다.

## Insight
### formData를 꺼냈다가 다시 담는 건 불필요한 반복이다 — 원칙은 맞지만 실제로는 동작하지 않는다

```ts
// DRY 위반 — 이미 포장된 걸 풀었다가 똑같이 다시 포장
const formData = await request.formData()
return fetch("...", { method: "POST", body: formData })

// DRY 원칙상 맞지만 Next.js에서 실제로 동작하지 않음 (아래 참고)
return fetch("...", { method: "POST", body: request.body, headers: request.headers })
```

### request.body 직통은 두 가지 이유로 Next.js에서 실패한다

#### 1. `duplex: "half"` 누락

Node.js 18+에서 `fetch()`에 `ReadableStream`을 body로 넘길 때 반드시 필요하다. 없으면 빈 body가 전달된다.

```ts
return fetch("...", {
  method: "POST",
  body: request.body,
  headers: request.headers,
  duplex: "half"  // TypeScript RequestInit 타입에 없어서 as any 캐스팅 필요
} as any)
```

#### 2. `host` 헤더 충돌

`request.headers`를 그대로 넘기면 `host: localhost:3000`이 포함된다. 대상 서버(FastAPI 등)가 이를 거부하거나 오동작한다.

```ts
const headers = new Headers(request.headers)
headers.delete("host")
```

두 가지를 모두 처리하면 직통이 가능하지만, formData 방식보다 코드가 복잡해진다. **단순 중계 목적이라면 formData 추출이 실용적으로 더 낫다.**

### 꺼내야 하는 경우는 내용을 검사·수정할 때다

```ts
// 검증이 필요할 때는 꺼내는 게 맞다
const formData = await request.formData()
const file = formData.get("file")
if (!file) return Response.json({ error: "파일 없음" }, { status: 400 })
// 파일 크기·확장자 검증 후 전달
```

단순 중계 → formData 추출 (직통은 Node.js 제약으로 실용적이지 않음). 보안·검증·변환 필요 → formData 꺼내서 처리.

## Related
- [[Next.js server components fetch directly while client components require API Route for CORS]] — API Route 역할
- [[Browser events pass DOM state to handler functions enabling file upload pipelines]] — 업로드 플로우
