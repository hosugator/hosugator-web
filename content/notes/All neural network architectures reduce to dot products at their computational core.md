---
created: 2026-07-01
updated: 2026-07-01
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Self-development in 2026]]"
tags:
  - deep-learning
  - architecture
  - linear-algebra
publish: true
---
## Context
FFN 구조(Linear + ReLU + 차원 확장)를 깊이 파고들다가 "CNN, RNN, Transformer도 결국 같은 원리 아닌가?"를 따라가보니 모든 아키텍처의 핵심 연산이 내적으로 수렴한다는 걸 발견했다.

## Insight
### 아키텍처별 핵심 연산은 모두 내적이다

| 아키텍처 | 내적 대상 |
|---|---|
| FC | 뉴런 가중치 벡터 · 입력 벡터 |
| CNN | 커널 · 이미지 패치 |
| Transformer Attention | Q · Kᵀ |
| RNN | 가중치 행렬 · hidden state 벡터 |

아키텍처 간 차이는 **그 내적을 어떤 구조로 어디에 반복하느냐**다. 내적 자체는 동일하다.

### 가중치 공유는 같은 내적을 다른 위치에서 재사용하는 것이다

- FC: 위치마다 독립 가중치로 내적 — 공유 없음, 파라미터 폭발
- CNN: 하나의 커널을 모든 공간 위치에 반복 내적 — 공간 공유
- RNN: 하나의 가중치 행렬을 모든 시간 스텝에 반복 내적 — 시간 공유
- Transformer: W_Q, W_K, W_V를 모든 토큰 위치에 반복 내적 — 위치 공유

파라미터 효율성의 실체는 결국 내적의 재사용 여부다.

## Related
- [[FC assigns independent weights to each neuron making it parameter-inefficient]] — 내적을 공유 없이 쓰는 구조
- [[CNN shares one kernel across spatial positions to detect location-invariant patterns]] — 공간 위치에 내적 공유
- [[FFN transforms individual token representations between Attention layers]] — Transformer FFN의 내적 구조
- [[Transformer computes all token relationships simultaneously through QKV attention]] — Q·Kᵀ 내적
- [[Activation function prevents stacked linear layers from collapsing into one]] — 내적 사이의 비선형성
- [[Backpropagation computes gradient direction without trying random weights]] — 내적으로 이루어진 네트워크를 학습하는 방법
