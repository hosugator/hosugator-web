---
created: 2026-05-22
updated: 2026-05-22
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[Edge AI LMR]]"
tags:
  - ml
  - classification
  - multi-label
  - sigmoid
publish: true
---

## Context

DTK AOI 프로젝트에서 하나의 렌즈 이미지에 스크래치·이물·금형마모가 동시에 존재할 수 있는 다중 결함 문제를 풀면서 접근 방식을 정리했다.

## Insight

### Multi-label은 softmax 대신 sigmoid를 각 클래스에 독립 적용한다

```python
# Softmax (단일 분류, Closed-set)
output = softmax([logit_scratch, logit_foreign, logit_mold])
# → [0.85, 0.10, 0.05] — 합이 1, 하나만 "가장 가능성 높은" 클래스

# Sigmoid (멀티라벨)
output = sigmoid([logit_scratch, logit_foreign, logit_mold])
# → [0.92, 0.07, 0.85] → threshold(0.5) → [1, 0, 1]
# → "스크래치 있음, 이물 없음, 금형마모 있음"
```

### 단일 모델로 N개 이진 분류기를 대체한다

N개 별도 모델(Model_scratch, Model_foreign, ...)을 쓰지 않아도 된다. backbone을 공유하는 단일 모델에 클래스 수만큼의 sigmoid 출력 헤드를 연결하면 한 번의 추론으로 모든 클래스를 독립 판정한다.

- 학습 손실: Binary Cross-Entropy (BCE) per class의 합산
- 역치: 클래스별로 독립 조정 가능 — 결함 유형마다 다른 임계값 적용 가능
- 공존 가능: [1, 1, 0], [1, 0, 1], [0, 1, 1] 등 모든 조합이 유효한 출력

### 이미지 단위 라벨만 필요하다

픽셀 단위 라벨 없이 "이 이미지에 스크래치가 있는가?"라는 이미지 단위 레이블만으로 학습한다. 결함의 존재 여부는 판단하지만 위치 정보는 이 모델만으로는 얻을 수 없다 — 위치는 PatchCore 이상 맵 등 별도 컴포넌트와 조합해 제공한다.

→ 관련: [[Open-set AI separates unknown defect types without forcing them into known classes]] [[U-Net classifies pixels while PatchCore measures distance from normal features]]
