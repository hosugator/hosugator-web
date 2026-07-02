---
created: 2026-05-14
updated: 2026-05-15 16:42
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - training
  - model-selection
  - detection-rate
  - iou
publish: true
---
# ADR: 라인 탐지 모델의 best model 선택 기준

## Context
학습 중 매 에포크마다 val IoU를 기준으로 best model을 저장하고 있었다. Q-display 학습에서 탐지 성공률이 40%로 낮아 개선이 필요했다. val IoU만으로는 "2개 선을 분리 탐지했는가"를 측정하지 못한다.

## Decision
```
score = val_iou + detect_rate × 0.1
```

`detect_rate` = GT에서 2개 선이 탐지 가능한 이미지 중 예측도 2개 탐지한 비율.
IoU를 주 기준으로 두되, 탐지율은 보조 기준으로 반영한다.

### 실패한 시도
처음에 `detect_rate × 1000`으로 가중치를 크게 줬다. Epoch 17에서 detect=1.00, IoU=0.1989인 모델이 저장됐고, 이후 IoU 0.26으로 올라간 에포크들이 무시됐다. 실제 평가에서 PASS율이 50%로 떨어졌다 (v3 실패).
탐지율 1/22 차이(0.04)가 IoU 0.07 개선보다 1000배 중요하게 취급된 결과였다.

## Consequences
v4에서 PASS율 91%, 탐지 성공률 100%. 가중치 0.1은 "탐지율 10% 차이 = IoU 0.01 차이" 수준의 보조 역할로 유지된다. 더 많은 데이터가 쌓이면 이 기준이 바뀔 수 있다.

## succeeding
- [[segmentation-metric-position-over-iou]]
