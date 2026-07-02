---
created: 2026-06-19
updated: 2026-06-29
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - ml-training
  - evaluation-metric
  - overfitting
  - deployment
publish: true
---
## Context
hesung v7 학습 곡선에서 train_loss ≈ 0.11, val_loss ≈ 0.55로 5배 격차가 확인됐다. "이게 과적합인데 현장에서도 문제가 되냐"는 질문에서 출발.

## Insight
### "안정 환경에서 과적합이 괜찮다"는 명제는 환경 종속성을 과적합으로 표현한 것이다

이 명제는 고전적 과적합과 환경 종속성을 혼용한다.

**고전적 과적합** (train_loss 낮음, val_loss 높음, val ∈ 같은 분포):
- 모델이 훈련 샘플을 외웠고 같은 분포의 새 샘플에 일반화 실패
- val이 무작위 split이라면 val ∈ 운영 분포이므로, val_loss 높음 = 운영 성능도 나쁨
- "안정 환경" 논거로 구제되지 않는다

**환경 종속성 (distribution specialization)**:
- val_loss도 낮음 — 분포 D 내에서는 일반화됨
- 단, 다른 라인·카메라·조명(분포 D')에는 전이 안 됨
- 운영 환경이 D로 고정이면 D' 전이 실패는 문제 없음
- 이것이 명제가 실제로 상정하는 시나리오이며, 고전적 과적합이 아니다

```
"안정 환경에서 과적합이 괜찮다"
→ 실제 의미: D'에 전이 안 되는 D-특화 모델도, D에서만 운영하면 괜찮다
→ 전제: 분포 D 내에서는 이미 일반화되어 있음 (val_loss가 낮음)
```

무작위 split에서 val_loss가 높다면 이것은 고전적 과적합 신호이며, 환경 종속성 논거는 적용되지 않는다.

### val_loss가 아니라 운영 지표로 모델을 판단해야 한다

val_loss가 높아도 detect_rate와 위치 오차가 기준을 만족하면 쓸 수 있는 모델이다. val_loss는 픽셀 단위 정밀도를 측정하므로 과적합에 민감하지만, 실제 판정 기준(선을 찾았냐, 오차가 몇 mm냐)과 직결되지 않는다.

```
val_loss 높음 → 과적합 신호
detect_rate + 위치 오차 → 실제 운영 기준
```

둘이 충돌할 때는 운영 지표를 우선한다.

### val_loss 격차가 클 때 원인을 구분해야 한다

val_loss가 높은 이유가 두 가지일 수 있다:

1. **고전적 과적합** — 분포 내 일반화 실패, 운영 성능에도 직결
2. **val 샘플 부족** — 이미지 1장이 val_loss를 크게 흔드는 노이즈, 또는 소량 데이터 split 자체의 분포 편향

29장 val 세트에서 이미지 1장 = 3.4%p 변동이라 노이즈가 크다. val_loss 격차만 보고 판단하기 전에 샘플 수와 split 편향 가능성을 먼저 확인해야 한다. 최종 판단은 운영 지표로 직접 평가한다.

## Related
- [[segmentation-metric-position-over-iou]] — 픽셀 지표보다 위치 오차가 실제 운영 기준에 맞는 이유
- [[Validation metric and training loss serve different roles in ML pipeline]] — val_loss와 운영 지표의 역할 분리