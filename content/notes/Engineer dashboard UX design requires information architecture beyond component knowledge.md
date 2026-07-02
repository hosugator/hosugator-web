---
created: 2026-06-30
updated: 2026-07-01
type: insight
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - ux
  - dashboard
  - information-architecture
  - engineer-tools
  - saas-design
  - learning-plan
publish: true
---
## Context
Align-AI Stage 6 완성 — 이미지 업로드 → 추론 → 오버레이 + 수치 표시 파이프라인이 동작한다. 이 시점에서 UI는 기능 검증용 컴포넌트들을 늘어놓은 상태. 다음 학습 목표를 설정하는 과정에서, 컴포넌트를 "어떻게 만드는가"는 이제 알지만 "어떻게 배치하는가"는 아직 모른다는 걸 인식했다.

## Insight
### 컴포넌트 지식과 레이아웃 설계는 다른 기술이다

Stage 1~6은 "무엇을 어떻게 코드로 만드는가"를 배웠다. 그 다음 벽은 "어떤 데이터를 어떤 순서와 계층으로 보여주는가" — 정보 설계(Information Architecture)다. 컴포넌트는 재료이고 IA는 건축이다.
엔지니어 대상 도구는 이 간극이 특히 크다. 데이터가 많고, 판단을 돕는 구조가 필요하다. "예쁜 UI"가 아니라 "빠르게 판단할 수 있는 UI".

### 엔지니어 타겟을 선택한 이유

현장 작업자 타겟은 단순화가 핵심이라 설계 결정의 폭이 좁다. 엔지니어 타겟은 데이터를 다각도로 다루고 배치해야 하므로, 레이아웃 설계 감을 익히기에 적합하다. 학습 목적과 제품 목적이 일치하는 선택이다.

### 최종 목표는 엔지니어 + 소비자의 교집합 — SaaS 제품 디자인 수준

오퍼레이터 UX는 단순화가 전부라 설계 결정의 폭이 좁아 학습 효율이 낮다. 목표는 **엔지니어 UX(데이터 밀도, 분석 흐름)와 소비자 UX(시각적 설득력, 명확한 계층)의 교집합**이다.

레퍼런스: Vercel, Linear, Supabase, Grafana Cloud — 엔지니어가 쓰지만 소비자가 봐도 설득력 있는 수준. (SaaS = Software as a Service: 이 회사들의 제품 UI 완성도를 기준점으로 삼는 것. 토이 프로젝트가 아닌 프로덕션 레벨 웹 제품 디자인.)

디자이너 수준과의 차이:
- Figma 목업, 픽셀 단위 검토 → 불필요
- "컴포넌트 라이브러리 위에서 배치와 계층을 의식적으로 설계" → 목표 수준

이 수준이 가능한 이유: 앱 개발, 포트폴리오 코드 작성, 개인 사이트 운영으로 동일 백엔드/ML 개발자 대비 UI 접근성이 높다. 이 우위를 SaaS 제품 수준으로 끌어올리는 것.

## Decision
**Align-AI 대시보드를 4단계로 고도화하여 엔지니어 대상 데이터 UI/UX 설계를 실습한다.**

| Phase | 목표 | 핵심 학습 | 상태 |
|---|---|---|---|
| 1 | 기능 검증 완료 | 컴포넌트, 상태 관리, 추론 파이프라인 | ✅ 완료 |
| 2 | 단일 이미지 분석 고도화 | 레이아웃 분할, 정보 계층, 인터랙션 | ✅ 완료 |
| 3 | 배치 & 이력 | 리스트 + 상세 패턴, 필터, 정렬 | 🔄 진행중 (mock 데이터로 리스트+상세 레이아웃 완성, 실데이터 연동 전) |
| 4 | 통계 & 분석 | 차트 연동, 집계 데이터 시각화 | ⏳ 대기 |

Phase 2 상세 (레퍼런스: Vercel 대시보드 라이트 모드):

레이아웃:
```
[사이드바] | [이미지 패널] | [결과 패널]
단일 검사   업로드 전: 빈상태  Badge (ok/FAIL)
이력        아이콘 + 안내문   Line 1 / Line 2 / Gap
통계        업로드 후: 이미지  방향(V/H)
            + canvas 오버레이
```

디자인 결정:
- 테마: 라이트 모드 (shadcn 기본)
- 사이드바: 라이트 그레이 배경 + 다크 텍스트
- 메인: 화이트 + subtle border 카드
- 빈 상태: 아이콘 + 안내 텍스트 (Vercel "Deploy your first project" 패턴)
- 방향(V/H) 표시 추가
- 원본 / 오버레이 토글
- 이미지 줌

학습 방법: 레퍼런스 카피 → 각 결정의 이유를 역으로 분석

전환 조건: 현장 오퍼레이터 시나리오가 생기면 심플 버전을 별도 뷰로 분리 검토.

## Related
- [[Next.js UI learning roadmap from components to Align-AI dashboard]] — Stage 1~6 빌딩 블록 학습 로드맵 (선행 단계)
- [[AlignAI Stage 6 transforms portfolio narrative and signals natural job switch timing]] — Stage 6 완성의 포트폴리오 의미
