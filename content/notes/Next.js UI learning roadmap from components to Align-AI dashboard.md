---
created: 2026-06-25
updated: 2026-06-25
type: insight
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - nextjs
  - frontend
  - learning-plan
  - tailwind
  - shadcn
publish: true
---
## Context
LLM 에이전트 로드맵(Stage 1~6) 완료 후 다음 인풋으로 UI를 선택했다. 전담 프론트엔드가 없는 환경에서 ML 추론 결과를 시각화하고 현장 오퍼레이터가 사용할 수 있는 인터페이스를 만들어야 하는 상황이 반복된다. Align-AI는 현재 UI 없음 — 탐지 결과를 커맨드라인으로만 확인 가능하다.
목표: 각 줄을 이해하며 minimal하고 직관적인 UI를 필요 시 생성할 수 있는 수준. 풀스택 엔지니어가 아니라 ML 결과를 보여줄 수 있는 수준.
스택: **Next.js + TypeScript + Tailwind + shadcn/ui**

## Insight
### 목표 UI의 입력과 역할

```
이미지 업로드 ──┐
추론 요청     ──┤→ [Align-AI 대시보드] → 탐지 결과 시각화 / PASS·FAIL 상태 / 위치 오차
로그 조회     ──┘
```

현장 오퍼레이터가 이미지를 올리면 V·H 라인 탐지 결과와 공차 판정을 시각적으로 확인하는 대시보드. FastAPI 추론 서버와 연동.

### 빌딩 블록 6개를 순서대로 쌓는다

**1단계: Next.js 프로젝트 구조 (1일)**
- `app/page.tsx`, `app/layout.tsx`, 파일 기반 라우팅
- React 컴포넌트 = JSX를 반환하는 함수
- Tailwind 클래스로 첫 페이지 스타일링
- 왜 이 순서인가: 모든 페이지가 이 구조 위에서 동작한다. 레이아웃을 이해해야 컴포넌트를 어디에 놓을지 판단할 수 있다

**2단계: FastAPI 연동 — 데이터 가져오기 (1-2일)**
- `fetch()` → Next.js API Route → FastAPI
- Server Component에서 데이터 요청
- 왜 이 순서인가: 백엔드 맥락에서 가장 빨리 이해되는 영역. "API를 어떻게 부르는가"가 해결되면 나머지는 표시 방법이다

**3단계: shadcn 컴포넌트로 결과 표시 (1-2일)**
- Table, Badge, Card 기본 컴포넌트
- 추론 결과를 테이블/카드로 표시
- 왜 이 순서인가: ML 결과 시각화의 90%는 테이블 + 상태 뱃지다. shadcn은 컴포넌트 코드가 프로젝트 안에 복사되므로 각 줄을 읽고 수정할 수 있다

**4단계: 이미지 + 마스크 오버레이 (2일)**
- Next.js `<Image>` 컴포넌트
- Canvas로 세그멘테이션 마스크 오버레이
- 왜 이 순서인가: Align-AI의 핵심 출력이 이미지 위 탐지 결과다. 이미지 처리를 브라우저에서 어떻게 하는지 이해해야 한다

**5단계: 사용자 입력 처리 (1일)**
- 파일 업로드 (이미지 → 추론 요청)
- react-hook-form 기본
- 왜 이 순서인가: 오퍼레이터가 이미지를 올리고 추론을 트리거하는 플로우가 필요하다. 데이터 표시(3~4단계)를 먼저 만들어두면 입력 처리 후 결과 연결이 쉽다

**6단계: Align-AI 대시보드 프로토타입 (3일)**
- 이미지 업로드 → 추론 요청 → 결과 표시 통합
- PASS/FAIL 상태, V·H 라인 위치 오차 시각화
- 로그 조회 패널

## Related
- [[Next.js Tailwind shadcn over Vite React for learning minimal UI as backend engineer]] — 스택 선택 결정
- [[LLM agent learning roadmap from API basics to multimodal industrial agent]] — 동일 구조의 선행 로드맵
- [[Next.js와 FastAPI 기반의 BFF 포트폴리오 아키텍처]] — FastAPI 연동 구조
