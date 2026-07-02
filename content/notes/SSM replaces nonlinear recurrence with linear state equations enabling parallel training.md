---
created: 2026-06-17
updated: 2026-06-17
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[DTK in 2026]]"
tags:
  - deep-learning
  - architecture
  - ssm
  - mamba
publish: true
---
## Context
Transformer의 O(n²) 한계를 해결하는 구조로 SSM(Mamba)을 학습했다. RNN과 Transformer의 장점을 결합하려는 시도다.

## Insight
### 핵심 수식: 비선형 함수 f를 선형 행렬 곱으로 대체한다

```
RNN:  h_t = f(h_{t-1}, x_t)         ← 비선형, 순차 처리만 가능
SSM:  h_t = A·h_{t-1} + B·x_t      ← 선형, 병렬화 가능
      y_t = C·h_t
```

선형 점화식은 수학적으로 전개가 가능해서 모든 시점을 한 번에 계산할 수 있다.

```
h_1 = A·h_0 + B·x_1
h_2 = A²·h_0 + A·B·x_1 + B·x_2
h_3 = A³·h_0 + A²·B·x_1 + A·B·x_2 + B·x_3
→ 전체를 행렬 연산 하나로 표현 가능 → 병렬 처리
```

### 가중치 구조

```
A         : 이전 h를 얼마나 유지할지 (고정 행렬, 학습됨)
W_B, W_C  : B_t, C_t를 생성하는 레이어 가중치 (고정, 학습됨)
B_t = W_B · x_t  : 현재 입력을 h에 얼마나 반영할지 (토큰마다 가변)
C_t = W_C · x_t  : h에서 출력을 어떻게 추출할지 (토큰마다 가변)
```

W_B, W_C는 CNN의 커널, Transformer의 W_Q/W_K/W_V와 동급의 레이어 가중치다. 별도의 추가 가중치가 아니다.

### Mamba: B, C를 입력에 따라 가변으로 만든다

기본 SSM은 모든 토큰에 동일한 A, B, C를 사용한다. Mamba는 B_t, C_t를 x_t로부터 즉석 계산해 토큰별로 다르게 적용한다. A는 병렬화 수학 구조 유지를 위해 고정 유지.

```
기본 SSM: h_t = A·h_{t-1} + B·x_t    (B 고정)
Mamba:    h_t = A·h_{t-1} + B_t·x_t  (B_t = W_B·x_t, 토큰마다 다름)
```

LSTM 게이트와 같은 역할(선택적 기억/망각)을 행렬 곱 형태로 구현했다.

### RNN/Transformer 대비 포지션

```
         학습    추론    장거리 기억  복잡도
RNN      순차    순차    약함         O(n)
Transformer 병렬  병렬    강함         O(n²)
Mamba    병렬    순차    강함         O(n)
```

긴 시퀀스(DNA, 오디오, 긴 문서)에서 강점. Vision에서는 아직 Transformer 대비 검증 부족(2023~).

## Related
- [[Transformer computes all token relationships simultaneously through QKV attention]] — Mamba가 해결하려는 O(n²) 한계
- [[RNN accumulates past inputs into a fixed-size hidden state across time steps]] — SSM이 개선한 RNN 구조
- [[Each backbone architecture is optimized for a different data structure]] — 구조 축 전체 비교
