---
created: 2026-07-01
updated: 2026-07-01
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - deep-learning
  - inference
  - reasoning
  - scaling
publish: true
---
## Context
align-ai U-Net에 test-time compute scaling을 적용할 수 있는지 탐구하다가 이 경계를 발견했다.

## Insight
### 지각 태스크와 추론 태스크는 정답의 위치가 다르다

```
지각 태스크 (U-Net):
  이미지 → 마스크  ← 정답이 입력에 이미 존재
  추론을 반복해도 이미지에 없던 라인이 생기지 않는다
  성능이 낮으면 가중치를 바꿔야 한다

추론 태스크 (LLM):
  "17 × 23 = ?"  ← 정답이 입력에 없다
  중간 단계를 생성하면서 정답에 접근한다
  CoT 토큰이 쌓일수록 최종 답의 품질이 높아진다
```

### test-time compute scaling의 전제는 중간 추론이 최종 답을 개선한다는 것이다

이 전제는 정답이 입력에 없는 태스크에서만 성립한다. U-Net처럼 입력에 답이 이미 있는 지각 태스크에서는 반복 추론이 아닌 **가중치 개선**이 맞는 접근이다.

## Related
- [[Test-time compute scaling extends model capability without architecture changes]] — test-time compute scaling 개요 허브
- [[CoT and hidden state recurrence differ only in whether intermediate reasoning is externalized]] — 경계가 적용되는 구현 방식들
