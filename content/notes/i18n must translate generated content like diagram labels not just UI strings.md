---
created: 2026-07-03
updated: 2026-07-03
type: insight
status: 2-stable
subject: "[[Web]]"
project: "[[Hosugator Web]]"
tags:
  - i18n
  - ux
  - dataviz
publish: true
---
## Context
프로젝트 상세의 영문 콘텐츠(맥락·의사결정·구현·성과)를 모두 추가했는데, EN 모드에서도 Mermaid 아키텍처 다이어그램의 노드 라벨은 한글로 남아 있었다. 다이어그램이 단일 세트로 하드코딩돼 있었기 때문이다.

## Insight
로컬라이제이션 범위는 `t()` UI 문자열과 본문 카피뿐 아니라 **임베디드·생성 아티팩트**(다이어그램, 차트, 캔버스/SVG 텍스트)까지 포함해야 한다. 이들은 컴포넌트가 아니라 데이터/문자열로 그려지기 때문에 번역 대상에서 누락되기 쉬운 엣지 케이스다.

## Decision
로케일별 다이어그램 세트(`PROJECT_MERMAID_EN`)를 두고 `getMermaid(slug, locale)`이 EN이면 영문, 없으면 KO로 폴백하도록 했다. 구조·노드 ID·엣지는 동일, 라벨만 번역.

## Verification
- EN 모드 edge-ai-lmr 다이어그램의 한글 문자 수 0, KO 모드는 유지 확인.

## Related
- [[A single-demo detail page plays media inline while modals belong to grids]]
- [[Hosugator Web]]
