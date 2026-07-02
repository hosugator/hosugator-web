---
created: 2026-07-01
updated: 2026-07-01
type: study
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - ux
  - design-principle
  - ui
  - saas-design
publish: true
---
## Context
Align-AI Phase 2에서 오버레이 토글 버튼 위치를 논의하다가 처음으로 명시적으로 이름을 붙였다. ResultPanel(데이터 패널)에 두는 게 자연스럽다고 생각했는데, ImagePanel(이미지 패널) 안에 두는 게 더 직관적이라는 걸 인식했다.

## Insight
### 컨트롤은 관련 데이터가 아니라 효과가 일어나는 곳 가까이 있어야 한다

오버레이 토글 → 효과는 이미지 위에서 발생 → ImagePanel 안에 두는 게 맞다.

레퍼런스 패턴:
- YouTube 전체화면 버튼 — 사이드바가 아닌 영상 위
- Figma 줌 컨트롤 — 메뉴바가 아닌 캔버스 하단
- VS Code 미니맵 토글 — 에디터 영역 내

"이 컨트롤이 어디에 있어야 하는가"의 판단 기준: **효과가 어디서 일어나는가**를 먼저 묻는다.

## Related
- [[Engineer dashboard UX design requires information architecture beyond component knowledge]] — 이 원칙이 나온 프로젝트 맥락
- [[Frontend UI development follows structure, data flow, behavior, polish order]] — 근접성 원칙은 polish 단계에서 적용
