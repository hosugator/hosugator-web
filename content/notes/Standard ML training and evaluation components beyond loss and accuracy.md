---
created: 2026-06-18
updated: 2026-06-18
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - ml-training
  - evaluation-metric
  - mlops
publish: true
---
## Context
hesung 파이프라인을 설계하면서 "우리 코드에 없는데 업계 표준인 것들이 있냐"는 질문에서 정리. 현재 파이프라인(고정 LR + val IoU + CSV 로그)과 업계 표준 구성요소를 비교했다.

## Insight
### 학습 단계에서 빠진 표준 구성요소

| 구성요소 | 현재 | 업계 표준 | 효과 |
|---|---|---|---|
| LR 스케줄러 | CosineAnnealingLR 사용 중 | CosineAnnealing, ReduceLROnPlateau | 수렴 후반부 안정화 |
| Warmup | 없음 | 초반 LR 낮게 시작 후 점진적 상승 | 초반 불안정 방지 |
| Gradient clipping | 추가됨 (`max_norm=1.0`) | `clip_grad_norm_` | 손실 폭발 방지, 한 줄 구현 |
| 혼합 정밀도 | FP32 | `torch.amp` FP16 | 속도 2배, 메모리 절반 |
| Pretrained backbone | 사용 중 (`imagenet`) | ImageNet 사전학습 | 데이터 부족 보완 |
| 실험 추적 | CSV | MLflow, Weights & Biases | 실험 간 비교, 시각화 |
| Model EMA | 없음 | 가중치 이동평균 | 더 안정적인 best 모델 |

### 평가 단계에서 빠진 표준 구성요소

| 구성요소         | 현재     | 업계 표준           | 효과              |
| ------------ | ------ | --------------- | --------------- |
| threshold 탐색 | 0.5 고정 | 0.1~0.9 스윕      | 운영점 최적화         |
| 픽셀 FP/FN 시각화 | 없음     | 오버레이 이미지        | 라벨 전략 진단        |
| TTA          | 없음     | 추론 시 여러 변환 후 평균 | 예측 안정성 향상       |
| 교차검증         | 없음     | k-fold          | 데이터 적을 때 평가 안정화 |

### 지금 규모에서 가장 효과적인 것은 LR 스케줄러다

`ReduceLROnPlateau`는 val loss 개선 없으면 LR을 자동으로 줄인다. early stopping과 자연스럽게 맞물리고, 구현 난이도 대비 수렴 안정성 향상이 크다.

```python
scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
    optimizer, mode="min", patience=5, factor=0.5
)
scheduler.step(val_loss)  # 매 epoch 끝에 호출
```

## Related
- [[Validation metric and training loss serve different roles in ML pipeline]] — Loss vs Metric 역할 구분
- [[Pixel-level metrics underestimate thin line segmentation performance]] — 얇은 선에서 표준 지표의 한계