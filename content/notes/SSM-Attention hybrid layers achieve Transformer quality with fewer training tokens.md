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
  - hybrid
publish: true
---
## Context
2025-2026 아키텍처 트렌드 리서치. SSM이 Transformer를 "대체"하는 게 아니라 "섞는" 방식으로 수렴하고 있음을 파악.

## Insight
### 순수 대체가 아니라 인터리빙(교차 배치)이 주류다

Attention 레이어와 SSM 레이어를 교차 배치하는 구조가 효율 최적점으로 수렴했다.

```
Nemotron-H (NVIDIA):  Mamba:Attention = 7:1 비율
OLMo Hybrid (Ai2):    GatedDeltaNet 75% + Attention 25%
Jamba 1.5 (AI21):     Mamba + Attention + MoE 혼합, 프로덕션 배포
Kimi Linear:          KDA 75% + MLA 25%, 1M 컨텍스트에서 KV 캐시 75% 감소
```

OLMo Hybrid 기준: 동급 순수 Transformer 대비 **학습 토큰 49% 절감**으로 동일 성능 달성. 아키텍처 변경만으로 데이터 효율이 2배가 됐다.

### 기존 Transformer를 변환하는 것도 가능하다

Priming(2026) 기법: 기존 학습된 Transformer(예: Qwen3-32B)를 하이브리드 SSM으로 변환할 때 원본 학습 토큰의 **0.5%**만 추가 학습하면 된다. 처음부터 재학습 불필요.
변환 후 디코딩 처리량 최대 **2.3배** 향상.

### 왜 완전 대체가 안 되는가

A가 고정인 SSM은 복잡한 장거리 의존성 추론에서 Attention보다 약하다. 따라서 "긴 시퀀스는 SSM이 처리하고, 복잡한 추론은 Attention이 담당"하는 역할 분담이 자연스럽게 이루어진다.

## Related
- [[SSM replaces nonlinear recurrence with linear state equations enabling parallel training]] — SSM 기본 원리
- [[Transformer computes all token relationships simultaneously through QKV attention]] — SSM과 역할을 나누는 구조
- [[Frontier models converged on sparse MoE with under 10 percent active parameters by 2025]] — 함께 등장하는 또 다른 효율화 트렌드
