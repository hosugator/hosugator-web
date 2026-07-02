---
created: 2026-06-25
updated: 2026-06-25
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[DTK in 2026]]"
tags:
  - deep-learning
  - architecture
  - moe
publish: true
---
## Context
MoE의 "전문가"가 실제로 무엇인지 구조적으로 파악하는 과정. "하나의 큰 FFN을 전문가별 작은 FFN으로 모듈화"라는 표현이 핵심을 정확히 담는다.

## Insight
### MoE는 FFN을 N개의 독립적 가중치 뭉치로 분해한다

```
일반 Transformer:
  토큰 → [단일 FFN 가중치] → 출력

MoE:
  토큰 → Router → expert_1 FFN ┐
                  expert_2 FFN  │ → 가중합 → 출력
                  expert_3 FFN  │
                  ...           ┘
```

각 expert는 독립적인 FFN 가중치 세트를 보유한다. Router가 토큰마다 Top-K expert를 선택하고, 선택된 expert들의 출력을 가중합산한다.

### Attention은 공유, FFN만 교체된다

```
[Attention: Q, K, V — 모든 토큰이 공유]  ← 변경 없음
         ↓
[FFN: expert_1 ~ expert_N]              ← 여기만 MoE로 교체
         ↓
[Attention: Q, K, V — 공유]
         ↓
[FFN: expert_1 ~ expert_N]
```

MoE는 전체 아키텍처를 바꾸는 게 아니라 FFN 레이어를 교체한다. FFN이 파라미터의 2/3를 차지하기 때문에 expert 수를 늘릴수록 전체 파라미터가 선형으로 증가하지만, 실제 계산은 Top-K만 하므로 연산량은 고정된다.

### 활성 파라미터 비율이 낮은 이유

```
DeepSeek-V3: 671B 전체 / 37B 활성 (~5.5%)
```

전체 671B 중 Attention 가중치 + 선택된 K개 expert 분량만 계산에 참여한다. 나머지 수백 개 expert의 FFN 가중치는 해당 토큰에서 연산하지 않는다.

## Related
- [[FFN transforms individual token representations between Attention layers]] — FFN이 무엇인지
- [[Expert specialization in MoE emerges from gradient source separation not data separation]] — expert 전문화가 생기는 원리
- [[Frontier models converged on sparse MoE with under 10 percent active parameters by 2025]] — 실제 모델 수치
