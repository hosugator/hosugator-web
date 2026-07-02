---
created: 2026-06-25
updated: 2026-06-25
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[DTK in 2026]]"
tags:
  - deep-learning
  - moe
  - training
publish: true
---
## Context
"동일한 데이터로 학습하는데 어떻게 각 expert가 다른 전문성을 갖게 되는가"라는 질문에서 출발. 데이터가 분리되는 게 아니라 gradient 출처가 분리된다는 점을 파악했다.

## Insight
### 전문화의 원인은 데이터 분리가 아니라 gradient 출처 분리다

일반 FFN은 모든 토큰의 gradient가 동일한 가중치에 누적된다:
```
"파리는", "import", "∫f(x)dx" 모두
→ 동일한 FFN 가중치에 gradient 누적
→ 가중치가 전체 입력의 평균적 표현을 학습
```

MoE는 router가 토큰을 분리해서 보내므로 각 expert가 받는 gradient 출처가 다르다:
```
"파리는"     → expert_1 가중치에만 gradient
"import"    → expert_3 가중치에만 gradient
"∫f(x)dx"  → expert_5 가중치에만 gradient
```

같은 데이터지만 **어떤 가중치에 어떤 gradient가 쌓이느냐**가 다르다. 이것이 전문화의 실제 메커니즘이다.

### 전문화는 설계가 아니라 경쟁의 결과다

학습 초기 router는 거의 랜덤으로 토큰을 분배한다. 특정 expert가 우연히 특정 유형의 토큰에서 좋은 출력을 내면:

```
expert_3이 코드 토큰에서 좋은 출력
→ gradient가 expert_3을 코드 방향으로 업데이트
→ router도 코드 토큰을 expert_3으로 보내는 방향으로 업데이트
→ expert_3은 코드 토큰을 더 많이 받음 → 더 강해짐 → 반복
```

"이 expert는 코드 담당"으로 사전 지정하는 것이 아니라, router와 expert가 **공동으로 수렴**하면서 분업이 고착된다.

## Related
- [[MoE modularizes FFN into per-expert weight sets routed per token]] — expert의 구조적 정의
- [[DeepSeek dynamic bias decouples expert load balancing from gradient path]] — 전문화 수렴 과정에서 생기는 collapse 문제와 해결
