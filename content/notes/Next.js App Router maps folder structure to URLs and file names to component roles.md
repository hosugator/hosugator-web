---
created: 2026-06-25
updated: 2026-07-01
type: study
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - nextjs
  - approuter
  - routing
  - frontend
publish: true
---
## Context
Align-AI 대시보드 Next.js 1단계 실습 중. `create-next-app`으로 프로젝트를 생성하고 `app/` 폴더 구조를 처음으로 직접 다뤘다. 라우팅 설정 파일 없이 폴더만 만들면 URL이 생기는 구조를 처음 확인했다.

## Insight
### 폴더 이름이 URL 경로가 되고 파일 이름이 역할을 결정한다

```
app/
├── page.tsx          →  /           (메인 페이지)
├── layout.tsx        →  모든 페이지 공통 껍데기
├── result/
│   └── page.tsx      →  /result     (결과 페이지)
└── api/
    └── health/
        └── route.ts  →  /api/health (API 엔드포인트)
```

별도 라우터 설정 파일 없음. 파일 트리 자체가 URL 구조다.

### page.tsx는 export default function이 반드시 있어야 한다

Next.js가 `page.tsx`를 발견하면 default export를 페이지 컴포넌트로 사용한다. 파일이 존재하는 것 자체가 "이 경로에 페이지가 있다"는 선언이므로 빈 파일은 500 에러를 낸다.

```tsx
export default function Result() {
  return <main>...</main>
}
```

### layout.tsx는 children으로 각 page를 감싼다

```tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>   // 각 page.tsx가 여기에 들어옴
    </html>
  )
}
```

네비게이션 바처럼 모든 페이지에 공통으로 들어갈 요소는 `{children}` 위에 추가하면 된다.

### route.ts는 HTTP 메서드 이름으로 named export한다

```ts
export async function GET() { ... }    // GET 요청 처리
export async function POST() { ... }   // POST 요청 처리
```

Next.js가 사전에 정의한 이름(GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS)으로 export해야 인식된다. `export default`가 아닌 named export를 사용한다.

## Related
- [[Next.js Tailwind shadcn over Vite React for learning minimal UI as backend engineer]] — 스택 선택 및 Next.js 계층 구조
- [[Next.js UI learning roadmap from components to Align-AI dashboard]] — 학습 로드맵
- [[Next.js Server Component와 기존 HTML 서버 구조 비교]] — 서버 컴포넌트 렌더링 아키텍처
