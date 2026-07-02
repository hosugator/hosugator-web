---
created: 2026-05-20
updated: 2026-05-22
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - ml
  - segmentation
  - anomaly-detection
  - unet
  - patchcore
publish: true
---
## Context
AOI 프로젝트에서 PatchCore(anomalib)를 써봤고, align-ai에서 U-Net(segmentation_models_pytorch)을 쓰면서 두 모델이 결과물은 비슷해 보이지만 원리가 다르다는 것을 이해했다.

## Insight
### PatchCore는 "정상과 얼마나 다른가"를 측정한다

정상 이미지들의 패치 특징 벡터를 스토어에 저장하고, 검사 이미지의 특징 벡터와의 거리를 픽셀 위치마다 계산한다. 출력은 이상 점수 맵(heatmap)이며, 임계값으로 잘라내면 세그멘테이션처럼 보이지만 픽셀을 직접 분류한 것이 아니다.

- 라벨 불필요 (정상 이미지만으로 학습)
- 이상/정상 구분에 최적화
- 세그멘테이션 결과는 부산물

### U-Net은 픽셀마다 클래스를 직접 분류한다

픽셀별 라벨(마스크)로 지도 학습한다. 각 픽셀이 "배경인가, 라인인가"를 직접 예측하며 세그멘테이션이 목적 자체다.

- 픽셀 단위 라벨 필수
- 라벨 품질이 성능의 상한선
- 위치 찾기 태스크에 적합

### 태스크에 따라 선택이 달라진다

| 태스크 | 선택 |
|---|---|
| 정상/이상 구분 | PatchCore |
| 특정 객체/구조 위치 찾기 | U-Net |

align-ai 라인 검출은 "라인이 어디 있는가"이므로 U-Net이 맞는 선택. PatchCore로는 접근 자체가 어렵다.

### 라벨 품질이 낮으면 U-Net이 PatchCore를 역전당할 수 있다

U-Net의 이론 우위는 조건부다. PatchCore는 정상 이미지만으로 작동하므로 라벨 품질 리스크에 면역이다. 오퍼레이터가 직접 라벨링할 때처럼 품질 일관성이 보장되지 않는 상황에서는 PatchCore가 실질적으로 U-Net을 앞설 수 있다.

## Related
- [[Operator label quality is the hidden ceiling for supervised segmentation over anomaly detection]]
- [[DiceLoss prevents all-background collapse in sparse foreground segmentation]] [[Backpropagation computes gradient direction without trying random weights]] [[Open-set AI separates unknown defect types without forcing them into known classes]]