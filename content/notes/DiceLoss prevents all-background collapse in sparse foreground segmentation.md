---
created: 2026-05-20
updated: 2026-05-20
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - ml
  - segmentation
  - loss-function
publish: true
---

## Context

align-ai `train.py` 리뷰 중 손실함수로 CrossEntropy 대신 DiceLoss를 쓰는 이유를 파악했다. 검사 대상인 3px 라인은 768×1024 이미지에서 전체 픽셀의 ~1%에 불과하다.

## Insight

### CrossEntropy는 foreground가 희박한 세그멘테이션에서 잘못된 최적화를 유도한다

foreground(라인)가 ~1%인 경우, 모델이 모든 픽셀을 배경으로 예측해도 CrossEntropy loss가 낮아진다. 학습이 진행되어도 라인을 전혀 찾지 못하는 모델이 만들어질 수 있다.

### DiceLoss는 클래스 불균형에 강하다

```
Dice = 2 × |예측 ∩ 정답| / (|예측| + |정답|)
```

전부 배경으로 예측하면 분자(교집합)가 0이 되어 Dice = 0, Loss = 1이 된다. 클래스 비율과 무관하게 foreground 탐지 자체를 강제한다.

### 적용 기준

얇은 구조물 세그멘테이션(라인, 혈관, 균열 등)이나 foreground 비율이 낮은 모든 세그멘테이션 태스크에서 DiceLoss 또는 DiceLoss + CrossEntropy 조합이 기본 선택이다.

→ 관련: [[U-Net classifies pixels while PatchCore measures distance from normal features]]
