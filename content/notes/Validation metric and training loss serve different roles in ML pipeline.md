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
  - early-stopping
publish: true
---
## Context
hesung 모델 early stopping 기준을 설계하면서, 학습 중에 두 가지 숫자가 서로 다른 역할을 한다는 것을 처음 명확히 구분했다. "왜 Loss로 체크포인트를 고르지 않지?"라는 질문에서 출발.

## Insight
### Loss와 Validation Metric은 목적이 다르다

| 구분 | 역할 | 요구 조건 |
|---|---|---|
| **Loss** | 역전파 — 가중치 업데이트 방향 계산 | 미분 가능해야 함 |
| **Validation Metric** | 체크포인트 선택 — "이 epoch를 저장할까?" | 운영 목표와 일치해야 함 |

둘이 같을 필요가 없다. BCE+Dice Loss로 학습하면서 F-2 또는 Recall로 best epoch를 고르는 조합이 자연스럽다.

### Validation Metric은 비즈니스 목표로 고른다

"어떤 실수가 더 비싼가"로 결정한다:

- FN(미탐)이 더 위험 → Recall 또는 F-2 (FN에 4배 패널티)
- FP(오탐)가 더 위험 → Precision 또는 F-0.5

얇은 선 탐지처럼 "선을 못 찾는 것"이 더 위험한 태스크에서는 F-2 또는 detect_rate(Recall)가 Validation Metric으로 맞다.

### threshold는 학습과 운영에서 분리된다

```
학습 중: threshold=0.5 고정 → 빠른 체크포인트 선택
최종 모델: 0.1~0.9 스윕 → 운영 threshold 결정
```

체크포인트는 고정 threshold로 고르고, 실제 배포 전에 threshold를 따로 결정하는 패턴이 표준이다.

## Related
- [[Checkpoint naming separates resume from deployment in ML training]] — best epoch 체크포인트 파일 관리
- [[segmentation-metric-position-over-iou]] — 얇은 선에서 IoU가 잘못된 지표인 이유
- [[ML 임계값과 ROC 커브 - 모델 평가와 운영점 선택]] — threshold 탐색 상세
