---
created: 2026-07-03
updated: 2026-07-10
type: insight
status: 2-stable
subject: "[[Web]]"
project: "[[Hosugator Web]]"
tags:
  - ux
  - ui
  - web
publish: true
---
## Context
프로젝트 상세 페이지의 데모 영상이 썸네일 클릭 → 모달 팝업으로 재생되고 있었다. 상세 페이지는 이미 단일 컬럼의 몰입형 문서인데, 모달이 레이어·닫기 동작·컨텍스트 손실을 더했다.

## Insight
모달 오버레이는 **여러 썸네일 중 하나를 집중 선택**하는 그리드 맥락에 맞는다. 반면 데모가 하나뿐인 상세 페이지는 읽는 흐름 안에서 **인라인 재생**하는 게 낫다 — 불필요한 레이어가 없고, 모바일에서도 매끄럽다. "모달은 다수 중 선택, 인라인은 단일 초점 미디어"가 판단 기준.

## Decision
`ProjectVideoModal`을 제거하고, 히어로 자리에 muted 루프 프리뷰 → 클릭 시 사운드+컨트롤로 인라인 전환하는 방식으로 교체했다. (Cureat의 LIVE DEMO는 앱 시뮬레이션이라 모달 유지 — 단일 미디어가 아니라 인터랙션이므로.)

**갱신(2026-07-10)**: "muted 루프 프리뷰" 구현이 원본 비율이 다른 영상에서 크롭 문제를 일으켜, 정지 poster 이미지로 교체함. 인라인 재생 원칙 자체는 유지 → [[A static poster frame beats autoplay preview when demo video aspect ratios vary]].

## Related
- [[An immersive reading view hides global chrome instead of layering it over content]] — 같은 '레이어보다 흐름' 원칙
- [[Hosugator Web]]
