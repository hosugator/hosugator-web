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
  - transformer
publish: true
---
## Context
MoE 구조를 이해하는 과정에서 "Attention 외에 어떤 가중치가 있나?"라는 질문에서 출발해 FFN의 존재를 처음으로 명확히 인지했다.

## Insight
### Attention과 FFN의 역할 분담

- **Attention**: 모든 토큰 간의 관계를 계산. "이 단어가 다른 단어들과 어떻게 연결되는가"
- **FFN**: 토큰 하나의 표현을 독립적으로 변환. "이 토큰의 의미를 더 풍부하게 가공"

### FFN은 Transformer 블록의 절반을 차지하는 토큰 단위 변환기다

Transformer 블록 구조:
```
입력
 │
[Multi-Head Attention]  ← 토큰 간 관계 계산 (Q, K, V)
 │
[Add & Norm]
 │
[FFN]                   ← 토큰 하나의 표현을 변환
 │
[Add & Norm]
 │
출력
```

FFN 내부 구조:
```python
def ffn(x):
    x = Linear(d_model → d_ff)(x)   # 확장 (보통 4배)
    x = ReLU(x)
    x = Linear(d_ff → d_model)(x)   # 복원
    return x
```

### FFN이 파라미터의 대부분을 차지한다

전체 Transformer 파라미터 중 약 2/3가 FFN 가중치다. Attention은 나머지 1/3 수준. FFN의 hidden dimension이 모델 차원의 4배로 확장되기 때문이다.
이것이 MoE가 FFN만 교체해도 전체 파라미터를 폭발적으로 늘릴 수 있는 이유다.

## Related
- [[Transformer computes all token relationships simultaneously through QKV attention]] — Attention 레이어 구조
- [[MoE modularizes FFN into per-expert weight sets routed per token]] — FFN을 N개 expert로 분해하는 방식
- [[Frontier models converged on sparse MoE with under 10 percent active parameters by 2025]] — FFN 교체의 결과
