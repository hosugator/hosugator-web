---
created: 2026-06-25
updated: 2026-06-25
type: study
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - html
  - css
  - javascript
  - dom
  - jsx
  - babel
  - react
  - frontend
publish: true
---
## Context
Align-AI 대시보드 UI 학습 1단계 시작 전, Next.js 코드를 이해하기 위한 기초 재료들을 체계화했다. HTML/CSS/JS의 역할 분리는 이미 알고 있었으나, JSX·Babel·React·DOM이 어떻게 연결되는지 처음으로 명확히 정리했다.

## Insight
### HTML·CSS·JS는 역할이 분리된 세 계층이고, DOM은 그 결과의 실행 상태다

| 재료 | 역할 |
|---|---|
| HTML | 구조 (틀) |
| CSS | 스타일 (디자인) |
| JavaScript | 기능 (로직) |
| DOM | 브라우저가 HTML을 메모리에 올린 객체 트리 — 실제 실행 상태 |

DOM은 HTML 파일이 아니라 브라우저가 HTML을 파싱해서 메모리에 만든 라이브 객체다. JS가 DOM을 조작하면 화면이 바뀐다.

### JSX는 HTML 구조를 JS 파일 안에서 쓸 수 있게 해주는 문법이다

JSX는 새로운 언어가 아니라 `React.createElement()` 호출을 짧게 쓰는 syntax sugar다. CSS는 여전히 별도 파일로 존재하거나 Tailwind 클래스명 문자열로 참조한다 — JSX가 세 계층을 완전히 통합하는 게 아니라, HTML 구조만 JS 파일 안으로 들어온 것이다.

```
JSX 문법 → Babel이 React.createElement()로 변환 → React가 실행
```

JSX와 React는 별개다. React 없이도 JSX를 쓸 수 있고(Preact, Solid.js), React는 JSX 없이도 동작한다.

### Babel은 빌드 타임에 1회 변환하고, React는 런타임 내내 DOM을 동기화한다

| 도구 | 역할 | 시점 |
|---|---|---|
| Babel | JSX → 브라우저가 읽을 수 있는 JS로 변환 | 빌드 타임 (1회) |
| React | 데이터(상태)가 바뀔 때 DOM을 자동으로 업데이트 | 런타임 내내 |

Babel이 없으면 브라우저가 JSX를 읽지 못한다. React가 없으면 데이터가 바뀌어도 DOM이 자동 갱신되지 않아 개발자가 DOM 조작을 직접 추적해야 한다.

## Related
- [[React declarative state sync is structurally identical to ArgoCD Git-to-cluster sync]] — 선언형 패턴을 ArgoCD와 연결한 통찰
- [[Next.js Tailwind shadcn over Vite React for learning minimal UI as backend engineer]] — 스택 선택 결정 및 Next.js 계층 구조
- [[Next.js UI learning roadmap from components to Align-AI dashboard]] — 학습 로드맵
