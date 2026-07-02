---
created: 2026-06-23
updated: 2026-06-23
type: insight
status: 2-stable
subject: "[[Web]]"
project: "[[Self-development in 2026]]"
tags:
  - frontend
  - nextjs
  - react
  - nodejs
  - learning
publish: true
---
## Context
인프라·비즈니스 로직 담당이지만 전담 프론트엔드가 없는 중소기업 환경에서 기능 검증을 UI로 보여줘야 하는 상황이 반복됐다. ML·Infra 쉐도잉처럼 FE도 각 줄을 이해하며 minimal하고 직관적인 UI를 필요시 생성할 수 있는 수준을 목표로 삼았다.

## Insight
### Node.js는 언어가 아니라 JavaScript를 브라우저 밖에서 실행하는 런타임이다

```
JavaScript  → 언어
브라우저    → JavaScript 런타임 (클라이언트)
Node.js     → JavaScript 런타임 (서버·개발 환경)
```

Python : CPython = JavaScript : Node.js 관계다. Next.js·Vite·npm 등 개발 도구는 전부 Node.js 위에서 돌아간다.

Node.js는 두 가지 시점에서 존재한다:

- **빌드 시**: React/TS 소스코드 → HTML/CSS/JS 변환 (개발자 컴퓨터)
- **런타임 시**: Next.js 서버 프로세스로 요청 처리 (서버)

### Next.js는 Node.js 위에서 React를 포함하는 웹 프레임워크다

```
Node.js        → 런타임
  └── Next.js  → 프레임워크 (라우팅, SSR, API routes)
        └── React    → UI 컴포넌트 모델 (JSX, hooks)
              └── 빌드 결과: HTML/CSS/JS (브라우저가 실제로 받는 것)
```

Python : FastAPI = JavaScript : Next.js 관계. Next.js 안에서 React 문법으로 컴포넌트를 작성한다.

### Next.js API routes가 BFF 역할을 하므로 별도 BFF 서버가 필요 없다

```
브라우저
  ↕ HTTP
Next.js 서버 (Node.js 프로세스, port 3000) ← BFF 내장
  ↕ HTTP
FastAPI 서버 (Python 프로세스, port 8000)
```

독립적인 Node.js Express BFF 서버 없이 Next.js 하나로 UI + API 브리지를 처리한다. ML 추론 등 Python 비즈니스 로직은 FastAPI가 담당하고 Next.js는 그 앞단이 된다.

## Decision
**Next.js + TypeScript + Tailwind + shadcn/ui**를 FE 학습 스택으로 선택한다.

- **Tailwind**: 클래스 이름으로 스타일을 조합. 각 클래스가 하나의 스타일만 담당 — k8s manifest 각 필드처럼 역할이 명확하다.
- **shadcn/ui**: 컴포넌트 코드를 프로젝트 안으로 복사해오는 방식. 블랙박스가 아니라 각 줄을 읽고 수정할 수 있다 — Dockerfile 쉐도잉과 같은 방식.

전환 조건: 모바일 앱이 주 타겟이 되거나 팀에 전담 디자이너가 생길 때 재검토.

## Related
- [[Different role among Vite React FastAPI Node.js in web application]] — 기존 Vite+React+FastAPI 스택 맥락
- [[Next.js와 FastAPI 기반의 BFF 포트폴리오 아키텍처]] — BFF 패턴 구조
- [[Developer value shifts from code generation to code evaluation as AI generation cost approaches zero]] — 쉐도잉으로 검증 능력을 확보하는 근거