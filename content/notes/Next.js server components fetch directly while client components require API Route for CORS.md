---
created: 2026-06-25
updated: 2026-07-01
type: study
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - nextjs
  - cors
  - server-component
  - client-component
  - api-route
  - frontend
publish: true
---
## Context
Align-AI 대시보드 2단계 실습 중. FastAPI 추론 서버를 Next.js에서 호출하는 구조를 만들다가 서버/클라이언트 컴포넌트 구분과 CORS 우회 패턴을 처음으로 체득했다.

## Insight
### 서버 컴포넌트는 FastAPI를 직접 호출하고 클라이언트 컴포넌트는 API Route를 경유한다

```
서버 컴포넌트(page.tsx)   →   FastAPI 직접 호출 가능 (CORS 없음)
클라이언트 컴포넌트       →   /api/XXX → FastAPI (CORS 우회 필요)
```

브라우저가 다른 포트(3000 → 8000)로 직접 요청하면 CORS 에러가 난다. Next.js API Route는 서버끼리의 통신이라 CORS 제한이 없다.

### API Route는 로직 없는 얇은 중계가 권장된다

```ts
// route.ts — 한 줄 중계
export async function GET() {
  return fetch("http://localhost:30000/health")
}
```

비즈니스 로직은 FastAPI에 두고 API Route는 중계만 담당한다. res/data 파싱 후 재직렬화는 불필요한 왕복이다.

### API Route는 URL로 호출하는 게 표준이다

```tsx
// 잘못된 방식
import { GET } from "./api/health/route"
GET()

// 표준
fetch("/api/health")   // Next.js가 route.ts의 GET을 자동으로 실행
```

## Related
- [[Technical feasibility and operational manageability are separate design layers]] — 직접 호출 가능 vs /api/ 통일 원칙의 상위 인사이트
- [[Next.js App Router maps folder structure to URLs and file names to component roles]] — 파일 구조 및 역할
- [[CORS]] — CORS 원리 및 브라우저 보안 정책
- [[Next.js Server Component와 기존 HTML 서버 구조 비교]] — 서버 컴포넌트 스트리밍 아키텍처
- [[Next.js Tailwind shadcn over Vite React for learning minimal UI as backend engineer]] — BFF 구조