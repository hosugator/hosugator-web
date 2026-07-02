---
created: 2026-06-19
updated: 2026-06-19
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - ml-training
  - optimizer
  - gradient
publish: true
---
## Context
`src/train.py`에 Gradient Clipping을 추가하면서 "AdamW가 이미 gradient 크기를 조절하는데 Clipping이 왜 필요하냐"는 질문에서 출발. DiceLoss + AdamW 조합에서 Clipping 없이도 학습이 안정적이었던 이유도 함께 정리.

## Insight
### Loss 값의 범위와 gradient 크기는 별개다

DiceLoss는 구조적으로 0~1 범위지만, 역전파에서 계산되는 gradient는 Loss를 가중치로 미분한 값이라 범위 제한이 없다.

```
loss = 0.3   (0~1 범위)
∂loss/∂W = 15.7   (미분값은 범위 무제한)
```

Loss가 작아도 gradient가 폭발할 수 있고, Loss가 커도 gradient가 작을 수 있다.

### AdamW는 방향은 따르되 크기를 파라미터별로 정규화한다

```
SGD:    W -= lr × gradient
AdamW:  W -= lr × gradient / (√gradient² 누적 + ε)
```

파라미터마다 누적된 gradient 통계를 분모에 넣어서 스텝 크기를 자동 조율한다. gradient가 크면 분모도 커져서 실제 업데이트가 억제된다. "방향은 gradient가, 크기는 AdamW가" 결정하는 구조.

### AdamW와 Gradient Clipping은 보완 관계다

| | AdamW | Gradient Clipping |
|---|---|---|
| 방식 | 누적 통계 기반 적응형 스텝 | 전체 gradient 벡터에 하드 캡 |
| 한계 | 학습 초반 누적 통계 없어 완충 약함 | 방향 정보 일부 손실 |
| 시작 시점 | 통계 누적 후 | 첫 배치부터 즉시 |

AdamW가 더 정교하지만 학습 초반에는 누적 통계가 없어서 완충이 약하다. Gradient Clipping은 단순하지만 첫 배치부터 작동하는 안전장치다.

### DiceLoss + AdamW가 Clipping 없이 안정적인 이유

세 가지가 겹쳤다:

1. DiceLoss — 0~1 범위라 gradient가 구조적으로 작게 나옴
2. AdamW — 누적 통계 기반 완충
3. BatchNorm (smp.Unet 내부) — 순전파 안정화가 역전파 gradient도 간접 안정화

SGD를 쓰거나, BatchNorm 없는 깊은 네트워크, Cross Entropy + 큰 LR 조합에서는 Clipping이 더 중요해진다.

## Related
- [[Backpropagation computes gradient direction without trying random weights]] — gradient 계산 원리
- [[Standard ML training and evaluation components beyond loss and accuracy]] — 업계 표준 구성요소 목록
