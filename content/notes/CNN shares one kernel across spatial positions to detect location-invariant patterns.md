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
  - cnn
publish: true
---
## Context
FC의 파라미터 폭발 문제를 해결한 구조로 CNN을 학습했다. 가중치 공유 개념이 핵심이었다.

## Insight
### 가중치는 뉴런이 아니라 레이어가 소유한다

FC와 달리 CNN에서는 커널(가중치)을 레이어가 소유하고 모든 위치의 뉴런이 공유한다.

```
커널 w = [0.3, -0.2, 0.8, 0.1, 0.5, -0.4, 0.9, -0.1, 0.2]  ← 레이어 소유

위치1의 뉴런: 픽셀[1~9]  × w → 출력1
위치2의 뉴런: 픽셀[2~10] × w → 출력2   ← 입력값만 다름
위치3의 뉴런: 픽셀[3~11] × w → 출력3
```

"같은 함수(커널)를 다른 입력(위치)에 반복 적용"하는 구조다.

### 가중치 공유가 이미지에 적합한 이유

이미지에서 "엣지"나 "질감" 같은 패턴은 위치와 무관하게 동일한 방식으로 감지된다. 왼쪽 상단의 엣지와 오른쪽 하단의 엣지를 같은 커널로 감지해도 무방하다.

```
픽셀 → 엣지 → 질감 → 형태 → 객체  (레이어를 쌓을수록 추상화)
```

### 파라미터 수 비교

```
FC:  100만 입력 × 뉴런 1000개 = 가중치 10억 개
CNN: 3×3 커널 64개            = 가중치 576개
```

## Related
- [[FC assigns independent weights to each neuron making it parameter-inefficient]] — CNN이 해결한 FC의 파라미터 폭발 문제
- [[Each backbone architecture is optimized for a different data structure]] — 구조 축 전체 비교
- [[Feature Embedding - 사전학습 CNN을 특징 추출기로 활용하는 원리]] — CNN의 계층적 특징 추출을 전이학습에 활용하는 원리
- [[비전 모델 설계 비교 - MobileNet EfficientNet ViT DETR]] — CNN 기반 대표 모델들
