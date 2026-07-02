---
created: 2026-06-05
updated: 2026-06-05
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[MarqVision screening interview prep 2026-06-04]]"
tags:
  - deep-learning
  - neural-network
  - activation-function
publish: true
---
## Context
MarqVision 면접 대비 중 딥러닝 모델 내부 구조를 처음부터 이해하는 과정에서, "활성화 함수가 왜 필요한가"라는 질문에서 만났다.

## Insight
### 활성화 함수 없이 레이어를 아무리 쌓아도 수학적으로 단일 선형 변환과 동일하다

```
Layer1: y = W1·x + b1
Layer2: y = W2·(W1·x + b1) + b2
       = (W2·W1)·x + (W2·b1 + b2)
       = W'·x + b'   ← 레이어 하나와 동일
```

레이어 100개도 결국 y = W'x + b' 형태로 합쳐진다. 깊이 자체가 의미 없어진다.

### 비선형 함수가 레이어 깊이를 유효하게 만든다

```
ReLU:    f(x) = max(0, x)
Sigmoid: f(x) = 1 / (1 + e^-x)
```

비선형 함수가 레이어 사이에 끼어들면 각 레이어가 독립적으로 표현력에 기여한다. 이미지에서 고양이를 분류하는 것처럼 선형으로 분리 불가능한 문제를 풀 수 있게 된다.

## Related
- [[Polysemanticity means single neurons respond to multiple unrelated concepts]] — 같은 대화에서 이어진 뉴런 해석 한계
- [[Feature Extraction - 사전학습 표현의 고정 재사용]] — 레이어 구조 활용 패턴