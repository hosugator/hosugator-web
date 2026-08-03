---
created: 2026-07-15
updated: 2026-07-15
type: insight
status: 2-stable
subject: "[[Optics]]"
project: "[[Corning Varioptic]]"
tags:
  - photonics
  - optical-fiber
  - lens-design
publish: true
---
## Context
광트랜시버의 결합광학계를 설명하다가 "난반사보다 직진이 빠를 텐데 왜 시준(collimate)해서 넣지 않고 집속(focus)해서 넣는지"라는 질문에 답하며 정리함.

## Insight
### 시준광은 애초에 한 점에 모이지 않는다
시준은 빛을 평행광선(퍼지지도 모이지도 않는 다발)으로 만드는 것이다. 
평행광은 폭이 얼마든 균일하게 퍼진 다발일 뿐이라, 싱글모드 코어처럼 지름 9μm짜리 좁은 점에 에너지를 몰아넣을 수 없다. 
그 지점에 에너지를 모으려면 반드시 수렴(집속)시켜야 한다.

### 시준은 코어 진입 지점이 아니라 각도 민감 소자를 통과할 때 쓰는 중간 단계다
아이솔레이터·필터처럼 평평한 면을 가진 소자는 입사각에 민감해서(박막 간섭 필터는 각도에 따라 필터링 파장이 달라짐), 빛이 퍼지거나 모이는 중(각도가 제각각인 상태)에 통과하면 광선마다 다르게 걸러져 왜곡이 생긴다.
그래서 광섬유에서 나온 빛을 일단 시준(평행화)해 소자를 통과시킨 뒤, 다시 집속해서 다음 광섬유 코어에 넣는다(섬유→시준→소자통과→재집속→섬유).

> 집속과 시준은 경쟁 관계가 아니라 서로 다른 목적을 위한 별개 단계다 — 집속은 "좁은 점에 넣기", 시준은 "평평한 소자를 왜곡 없이 통과시키기".

## Related
- [[Fiber core diameter determines single-mode versus multi-mode operation and dispersion]]
