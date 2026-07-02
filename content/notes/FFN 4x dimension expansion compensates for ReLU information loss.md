---
created: 2026-07-01
updated: 2026-07-01
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[DTK in 2026]]"
tags:
  - deep-learning
  - transformer
  - ffn
  - activation-function
publish: true
---
## Context
FFN 코드에서 `Linear(d_model → d_ff)`의 d_ff가 d_model의 4배로 확장되는 이유를 이해하려다, Linear 변환이 실제로 무엇을 하는지부터 다시 짚었다.

## Insight
### Linear 변환은 복사가 아니라 재조합이다

출력 차원을 4배로 늘린다고 동일한 값이 4배 복사되는 게 아니다. 각 출력 차원은 입력 전체를 **다른 가중치 비율로 섞은** 값이다.

```
입력:  [a, b, c]

출력1 = 0.8a + 0.1b + 0.3c   ← 관점 1
출력2 = 0.2a + 0.9b + 0.1c   ← 관점 2
출력3 = 0.5a + 0.4b + 0.7c   ← 관점 3
...
```

가중치 W가 학습으로 결정되기 때문에, 각 출력 차원은 입력을 다른 각도에서 바라보는 독립적인 표현이 된다.

### 4배 확장이 필요한 이유는 ReLU 손실 보상이다

```
확장 후: [3.1, -0.5, 2.2, -1.8, 0.9, ...]
ReLU:    [3.1,  0.0, 2.2,  0.0, 0.9, ...]  ← 음수가 0으로 소멸
```

ReLU는 음수를 전부 0으로 죽인다. 원래 차원 그대로면 솎아낸 후 의미 있는 신호가 너무 적게 남는다. 4배로 넉넉하게 확장해야 ReLU 이후에도 충분한 표현력이 유지된다.

### 현대 Transformer는 ReLU 대신 GELU를 쓴다

ReLU는 음수를 완전히 0으로 죽이면서 해당 뉴런의 gradient도 0이 된다 (dying neuron 문제). GELU는 음수를 확률적으로 살짝 통과시켜 gradient 흐름을 보존한다. 원리는 "비선형 관문"으로 동일하다.

## Related
- [[FFN transforms individual token representations between Attention layers]] — FFN 전체 구조와 파라미터 비중
- [[Activation function prevents stacked linear layers from collapsing into one]] — 비선형성이 필요한 근본 이유
- [[All neural network architectures reduce to dot products at their computational core]] — Linear 변환이 결국 내적임
- [[Backpropagation computes gradient direction without trying random weights]] — dying neuron이 gradient에 미치는 영향
