---
created: 2026-06-17
updated: 2026-06-17
type: study
status: 1-draft
subject: "[[AI]]"
project: "[[DTK in 2026]]"
tags:
  - deep-learning
  - architecture
  - transformer
  - attention
publish: true
---
## Context
RNN의 순차 처리 한계(병렬화 불가, 기억 소실)를 해결한 구조로 Transformer를 학습했다. Q, K, V 메커니즘을 중심으로 이해했다.

## Insight
### Q·K로 관련도를 계산하고 V를 가중합산한다

W_Q, W_K, W_V는 레이어의 가중치(학습됨, 고정). Q, K, V는 이를 통해 토큰마다 생성되는 가변값.

```
x_t → [W_Q] → Q_t   ("나는 무엇과 관련있는가?" 질문)
x_t → [W_K] → K_t   ("나는 이런 정보를 갖고 있다" 명패)
x_t → [W_V] → V_t   ("내 실제 내용")

score = Q · K^T         → 모든 토큰 쌍의 관련도
weight = softmax(score) → 확률로 정규화
output = weight · V     → 관련 있는 V를 많이, 없는 V는 적게 가져옴
```

일정 기준 이상만 참조하는 게 아니라, 모든 토큰의 V를 점수 비율대로 가중합산한다.

### Q, K, V가 분리된 이유

Q=K=V이면 자기 자신을 항상 가장 높게 평가하는 편향이 생긴다. 세 역할을 분리해야 "무엇을 찾는가"와 "무엇을 제공하는가"를 독립적으로 학습할 수 있다.

### Self-Attention vs Cross-Attention

```
Self-Attention:  Q, K, V 모두 같은 시퀀스에서 나옴 (BERT, GPT, ViT)
Cross-Attention: Q는 출력 시퀀스, K/V는 입력 시퀀스 (번역 모델 Decoder)
```

### Attention 출력은 벡터다. 단어가 아니다

Attention 출력 → FFN 레이어들 → Linear(어휘 사전 크기) → Softmax → 가장 높은 토큰 선택
임베딩 공간에서 유사한 의미의 단어는 유사한 벡터를 가진다. 가중합산 결과가 예상치 못한 위치에 놓이면 엉뚱한 단어가 선택될 수 있다(Hallucination의 한 원인).

### Transformer 블록 = Attention + FFN

레이어 하나는 두 단계로 구성된다.

```
입력
→ Self-Attention   (토큰 간 관계 파악)
→ FFN              (토큰 개별 변환)
→ 출력
```

레이어당 가중치 행렬 6개:
```
Attention: W_Q, W_K, W_V, W_O  (W_O: 멀티헤드 출력 합치기)
FFN:       W1 (확장), W2 (압축)
```

### V 선형결합의 한계를 FFN이 보완한다

Attention의 비선형성과 선형성이 분리되어 있다:

```
Q·K → softmax → 가중치   ← 비선형 (softmax)
가중치 · V    → 출력      ← 선형결합, 여기서 표현력 한계
출력 → FFN               ← 비선형으로 보완
```

softmax로 가중치를 비선형으로 잘 결정해도, V를 합산하는 순간 선형결합의 제약에 갇힌다. FFN이 그 제약을 푼다. FFN 가중치는 사실적 지식을 저장하는 역할도 한다 ("파리 + 수도 맥락 → 프랑스 특징 활성화").

FFN 구조:
```
입력 (d) → W1 (d × 4d) → ReLU/GELU → W2 (4d × d) → 출력 (d)
```

임베딩 차원 d가 크면 W1, W2가 각각 d×4d 크기가 되어 파라미터 대부분을 차지한다.

### O(n²) 한계

모든 토큰 쌍을 비교하므로 토큰 수 n에 대해 n² 연산이 필요하다. 긴 시퀀스에서 병목이 된다.

## Related
- [[RNN accumulates past inputs into a fixed-size hidden state across time steps]] — Transformer가 해결한 RNN의 순차 처리 한계
- [[SSM replaces nonlinear recurrence with linear state equations enabling parallel training]] — Transformer의 O(n²) 한계를 해결하려는 시도
- [[self-attention]] — Self-Attention 상세
- [[transformer-block]] — Transformer Block 구조
- [[Each backbone architecture is optimized for a different data structure]] — 구조 축 전체 비교
