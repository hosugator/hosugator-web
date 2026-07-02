---
created: 2026-07-01
updated: 2026-07-01
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[DTK in 2026]]"
tags:
  - deep-learning
  - inference
  - reasoning
  - cot
publish: true
---
## Context
Test-time compute scaling의 두 구현 방향을 비교하다가, 겉으로 달라 보이는 CoT와 hidden state 순환이 같은 원리임을 발견했다.

## Insight
### CoT는 입력 토큰을 누적하며 forward pass를 반복한다

```
pass 1: [점심 뭐 먹지]               → "오늘"
pass 2: [점심 뭐 먹지, 오늘]          → "뭘"
pass 3: [점심 뭐 먹지, 오늘, 뭘]      → "먹을까"
...
pass N: [점심 뭐 먹지, 오늘, 뭘, ...] → "김치찌개"
```

매 pass마다 입력이 달라진다 (토큰 누적). 추론 과정이 토큰으로 외부에 드러난다. `reasoning_effort`는 중간 추론 토큰을 얼마나 길게 생성할지 조절한다.

### Hidden state 순환은 블록을 내부에서 반복한다 (연구 단계)

```
[점심 뭐 먹지] → 블록 → h
                 블록 → h   ← 출력층 안 가고 반복 (1~50회)
                 블록 → h
                 → 출력층 → "김치찌개"
```

입력 고정, 동일 블록을 hidden state에 반복 적용. 생성 토큰 수는 변하지 않고 내부 처리만 깊어진다. Recurrent Latent-Space Reasoning(2025): 3.5B 모델이 50B급 벤치마크 성능.

### 둘은 가시화 여부만 다른 같은 메커니즘이다

```
CoT:          처리 대상이 매 pass마다 달라짐 (토큰 누적, 외부에 가시화)
Hidden state: 처리 대상이 매 pass마다 달라짐 (h 정제, 내부에서만 변화)
```

"한 번에 답을 내지 않고 반복 처리로 표현을 발전시킨다"는 원리는 동일하다. hidden state의 각 h를 토큰화하면 CoT와 구조적으로 동일해진다.

## Related
- [[Test-time compute scaling extends model capability without architecture changes]] — test-time compute scaling 개요 허브
