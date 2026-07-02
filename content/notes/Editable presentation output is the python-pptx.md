---
created: 2026-05-18
updated: 2026-05-18
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[Align AI]]"
tags:
  - python-pptx
  - slides-as-code
  - docs-as-code
  - presentation
publish: true
---
# ADR: 프레젠테이션 도구로 python-pptx 단독 채택

## Context

비즈니스 팀과 자료 공유가 빈번한 AI 개발자 포지션. 슬라이드를 전달받은 상대방이 앱(WPS, PowerPoint)에서 직접 수정해야 하는 워크플로우가 필수. 동시에 반복 생성 자동화 필요성도 있음.

후보군:
- Marp / Slidev / MDX Deck — MD 기반, PPTX 출력 시 이미지 변환(편집 불가)
- python-pptx — 코드로 편집 가능한 `.pptx` 직접 생성
- MD → python-pptx 파이프라인 — 내용/양식 분리, 재렌더링 가능

## Decision

**python-pptx 단독 사용.** MD 분리 없이 스크립트에 내용 직접 작성.

판단 기준: **"이 슬라이드를 다음에 또 비슷하게 만들 일이 있는가?"**
- 아니오 → python-pptx에 직접 작성 (현재 상황)
- 예 → MD 분리 또는 템플릿 스크립트 도입 (패턴이 생기면 그때 추가)

## Consequences

**얻은 것**
- 비즈니스 팀이 WPS/PowerPoint로 수정 가능한 진짜 `.pptx` 출력
- 파일 하나로 단순한 구조 (MD 파서 의존성 없음)
- 반복 작업 자동화 가능

**포기한 것**
- 내용의 Git 버전 관리 (스크립트 자체는 관리되지만 내용 diff가 불명확)
- MD 기반 도구의 빠른 초안 작성 경험

**비자명한 기술 제약**: MD→PPTX 변환은 단방향 손실 변환이다. `.pptx`는 레이아웃·마스터·테마·애니메이션이 XML 참조로 얽혀 있어, 앱에서 수정한 순간 MD와 PPTX가 분기된다. 양방향 동기화가 구조적으로 불가능하므로 "MD로 관리하면서 앱에서도 수정"하는 워크플로우는 성립하지 않는다.

## 관련 노트

- [[Version control the Docs as Code]] — Slides as Code는 이 철학의 프레젠테이션 도메인 적용
