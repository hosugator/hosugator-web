---
created: 2026-07-01
updated: 2026-07-02
type: study
status: 1-draft
subject: "[[AI]]"
project: "[[DTK in 2026]]"
tags:
  - deep-learning
  - activation-function
  - gradient
publish: true
---
## Context
FFN 내부 구조를 파고들면서 ReLU → GELU 전환 이유를 따라가다, 활성화 함수의 종류가 gradient 흐름에 미치는 영향을 정리했다.

## Insight
### 활성화 함수는 레이어 사이의 비선형 관문이다

선형 변환만 쌓으면 레이어가 몇 개든 수학적으로 하나의 선형 변환과 동일해진다. 활성화 함수가 레이어 사이에 끼어야 깊이가 의미를 갖는다.

### 함수 종류마다 gradient 소멸 방식이 다르다

| 함수 | 문제 구간 | 원인 | 현황 |
|---|---|---|---|
| ReLU | 음수 전체 | gradient = 0, dying neuron | 여전히 널리 쓰임 |
| GELU | 없음 (거의) | 음수를 확률적으로 통과 | Transformer 기본값 |
| Sigmoid | 양 극단값 | 포화 구간에서 gradient → 0 | 초기 신경망, 현재는 출력층 한정 |
| Tanh | 양 극단값 | Sigmoid와 유사, 중앙 대칭 | RNN 내부 게이트에 잔존 |

### Dying neuron vs Vanishing gradient는 다른 문제다

- **Dying neuron** (ReLU): 특정 뉴런이 음수 구간에 고착되면 gradient가 영구적으로 0이 되어 그 뉴런만 학습 정지
- **Vanishing gradient** (Sigmoid/Tanh): 레이어가 깊어질수록 gradient가 곱셈으로 누적되어 초반 레이어까지 전달되기 전에 0에 수렴

### GELU가 현대 Transformer의 기본값이 된 이유

ReLU의 dying neuron과 Sigmoid의 vanishing gradient를 모두 피한다. 음수를 완전히 차단하지 않고 확률적으로 작은 값을 통과시켜 gradient 흐름을 유지한다.

## Question
- In vanishing gradient, assumption seems gradient is greater than 1 but we can apply normalization to prevent diffusion. After diffusion, Sigmoid is better than GELU?

## Related
- [[Activation function prevents stacked linear layers from collapsing into one]] — 비선형성이 필요한 근본 이유 상세
- [[FFN 4x dimension expansion compensates for ReLU information loss]] — ReLU 사용 시 차원 확장이 필요한 이유
- [[Backpropagation computes gradient direction without trying random weights]] — gradient 흐름이 학습에 미치는 영향
- [[FFN transforms individual token representations between Attention layers]] — 활성화 함수가 쓰이는 FFN 구조
