---
created: 2026-06-23
updated: 2026-06-23
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Self-development in 2026]]"
tags:
  - product
  - ux
  - ai-assisted-development
  - career
publish: true
---
## Context
넷플릭스에서 콘텐츠를 고르는 심리(손실 회피·선택의 역설)에서 출발해 앱 기능 설계로 넘어갔다. 기능 구현 비용이 0에 수렴하는 AI 시대에 어떤 제품 설계가 차별점이 되는지를 분석했다.

## Insight
### 선택 불안은 완벽함 기대가 아니라 손실 회피에서 온다

넷플릭스에서 오래 고르는 건 "최고를 찾겠다"가 아니라 "2시간을 낭비하기 싫다"는 심리다.
선택지가 많을수록 인식된 기회비용이 커지고 손실 불안이 높아진다.
선택지와 손실 회피는 비례가 아니라 역U자 곡선 — 선택지가 수백 개가 되면 비교를 포기하게 된다.

### 앱에서 단일 기능은 진입을 낮추고 다기능은 이탈을 막는다

- **진입 단계**: 단일 기능 앱이 유리. "이 앱이 뭘 해주는가"가 즉각 명확하다.
- **유지 단계**: 다기능 앱이 유리. 데이터·습관이 쌓이면 전환 비용이 높아진다.

기능이 많아도 단일 기능처럼 느껴지면 두 이점을 동시에 갖는다.

### AI가 기능 구현 비용을 0으로 만들면 "복잡함을 단순하게 보이게 하는 설계"가 모트가 된다

모두가 같은 기능을 낮은 비용으로 만들 수 있게 되면 기능 스펙은 차별점이 되지 않는다. 남는 차별점은 **progressive disclosure** — 기능을 숨기는 게 아니라 필요한 시점에만 꺼내는 설계다.

```
TikTok  → 알고리즘·광고·커머스가 있지만 사용자는 스와이프만 한다
Linear  → Jira와 기능이 비슷하지만 Jira처럼 느껴지지 않는다
```

역설적으로 이 설계 판단은 AI가 낮춰주지 못한다. 구현이 평준화될수록 판단이 희소해지는 구조 — PKM이 쌓일수록 AI가 대체하기 어려운 개인 지식이 되는 것과 같은 원리.

## Related
- [[Technical skill value depends on judgment intensity and evaluation difficulty not stack layer]] — 구현이 아닌 설계 판단이 프리미엄인 이유의 일반 프레임워크
- [[PKM captures internalization but needs active output to complete the knowledge discovery loop]] — 실행 비용 0 수렴 → 내부화·발견 능력이 희소 역량이 되는 같은 구조
