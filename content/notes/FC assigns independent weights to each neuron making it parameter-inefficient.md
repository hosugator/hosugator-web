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
  - fully-connected
publish: true
---
## Context
CNN/RNN/Transformer/SSM 각 구조 축을 학습하면서 FC가 이들의 기반이자 비교 기준임을 파악했다.

## Insight
### 뉴런이 가중치를 소유하는 유일한 구조다

FC에서는 뉴런마다 이전 레이어의 모든 뉴런과 연결되는 독립 가중치 벡터를 가진다.

```
입력: [x1, x2, x3]

뉴런1: w = [0.3, -0.2, 0.8]  → 출력1 = w·x + b
뉴런2: w = [0.1,  0.5, -0.4] → 출력2 = w·x + b
뉴런3: w = [0.9, -0.1, 0.2]  → 출력3 = w·x + b
```

가중치 수 = 입력 차원 × 출력 뉴런 수. 입력이 커질수록 파라미터가 폭발적으로 증가한다.

```
1000×1000 이미지 → 100만 입력
FC 뉴런 1000개   → 가중치 10억 개
```

### 현재는 출력 레이어 역할로 한정된다

CNN/Transformer가 특징을 추출한 뒤 FC 1~2개 레이어가 최종 분류를 담당하는 구조가 표준이다.

```
[Conv/Attention 레이어] → 특징 추출
[FC 레이어]             → "고양이 92%, 강아지 5%" 최종 판단
```

모든 특징을 조합해 최종 결정을 내리는 역할에는 여전히 적합하다.

## Related
- [[CNN shares one kernel across spatial positions to detect location-invariant patterns]] — FC의 파라미터 폭발을 가중치 공유로 해결한 구조
- [[Activation function prevents stacked linear layers from collapsing into one]] — FC 레이어를 쌓을 때 활성화 함수가 필요한 이유