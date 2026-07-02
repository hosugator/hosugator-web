---
created: 2026-07-01
updated: 2026-07-01
type: insight
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - nextjs
  - architecture
  - frontend
  - server-component
publish: true
---
## Context
Align AI UI에서 `app/stats/page.tsx`가 비어 있고 실제 내용은 `StatsPanel` 컴포넌트로 분리하는 구조를 논의했다. "왜 page와 panel을 나누는가"라는 질문에서 단순 관리 편의가 아닌 구조적 이유를 명확히 했다.

## Insight
### page.tsx는 URL에 1:1로 묶인 재사용 불가 파일이다

```
app/stats/page.tsx   ← /stats URL에 고정, import해서 다른 곳에 끼울 수 없음
components/StatsPanel.tsx ← React 컴포넌트, 어디서든 import 가능
```

Next.js가 `page`, `layout`, `loading`, `error`를 라우팅 목적으로 예약한 파일명이다. 그 외 재사용 가능한 UI는 `components/`에 둔다.

### metadata와 "use client"는 같은 파일에 공존할 수 없다

```tsx
// app/stats/page.tsx — Server Component로 유지
export const metadata = { title: "Statistics | Align AI" };  // ← 여기에

import StatsPanel from "@/components/StatsPanel";  // ← Client Component 호출
export default function Stats() { return <StatsPanel />; }
```

```tsx
// components/StatsPanel.tsx
"use client";  // ← 여기에 선언, page.tsx에 넣으면 metadata export 불가
```

page.tsx에 `"use client"`를 붙이면 metadata를 내보낼 수 없다. Client boundary를 컴포넌트로 밀어내는 이유다.

### 현재는 metadata를 안 쓰지만 구조적 이유가 있다

지금 Align AI는 사내 B2B 툴이라 SEO 의미가 없고 metadata도 미사용이다. 그러나 나중에 탭 제목(`title`)을 붙이는 순간 이 구조가 필요해진다. 관리 편의가 아닌 기능적 제약이다.

## Related
- [[Next.js App Router maps folder structure to URLs and file names to component roles]] — App Router 라우팅 구조 전체
- [[Next.js server components fetch directly while client components require API Route for CORS]] — Server/Client Component 경계의 다른 적용 사례
- [[Technical feasibility and operational manageability are separate design layers]] — "할 수 있다(page에 다 넣기)"와 "해야 한다(분리)"는 다른 계층
