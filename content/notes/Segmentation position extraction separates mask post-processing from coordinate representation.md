---
created: 2026-06-23
updated: 2026-06-23
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - segmentation
  - postprocessing
  - skeleton
  - cv
publish: true
---
## Context
align-ai 라인 검출 모델의 예측 마스크에서 실제 좌표를 뽑는 방법을 탐구하면서 정리했다. argmax만으로 마스크를 만들면 예측 덩어리가 넓어지는 문제, skeleton과 threshold로 이를 줄이는 방법, 그리고 위치를 직선 1개가 아닌 곡선으로 표현하는 방법까지 이어졌다.

## Insight
### argmax만으로는 예측 덩어리가 두꺼워진다

모델은 각 픽셀에 대해 클래스별 확률을 출력한다. argmax는 그 중 가장 높은 클래스를 선택하는 가장 단순한 방법인데, 확률 차이가 미미해도(예: 34% vs 33%) 무조건 확정한다. 결과적으로 불확실한 경계 픽셀까지 마스크에 포함되어 예측이 넓고 두꺼워진다.

### mask post-processing과 coordinate extraction은 독립적인 두 단계다

```
[모델 출력] → argmax → 마스크
                          ↓
                   [post-processing]   ← method 선택
                   skeleton / threshold / (없음)
                          ↓
                   [coordinate extraction]   ← representation 선택
                   직선(line) / 곡선(curve)
```

method와 representation은 직교한다. 모든 조합이 가능하다.

### skeleton은 중심 경로를 추출하는 형태학적 세선화다

마스크의 가장자리를 반복적으로 제거해 1픽셀 두께의 중심선(centerline)만 남긴다. 덩어리 두께나 형태와 무관하게 구조의 경로를 추출할 수 있다.
**현업 활용 사례**: 필기체 OCR(획의 중심선), 의료영상 혈관 경로 추적, 지문 융선 분석, 위성 이미지 도로망 추출. 공통 조건: 두께는 노이즈이고 경로가 신호인 경우.

### threshold는 저확률 픽셀을 배경으로 처리해 마스크를 줄인다

argmax 이후 각 픽셀의 클래스 확률이 기준치 미만이면 배경으로 재분류한다. 확신 있는 픽셀만 남기므로 덩어리가 얇아지지만, 탐지 가능한 범위(coverage)가 줄어드는 트레이드오프가 있다.
argmax 없이 `prob[target_class] > threshold`로 바로 마스크를 만드는 방식도 가능하며 결과는 거의 동일하다.

### 직선과 곡선은 위치 정보를 얼마나 보존하느냐의 차이다

- **직선(line)**: 컴포넌트 전체 픽셀의 중앙값 → 좌표 1개. 형태 정보 손실.
- **곡선(curve)**: 행(또는 열)마다 중앙값 → 좌표 N개. 실제 휨과 기울기 보존.

곡선 방식은 라인의 물리적 경로를 추적해야 하거나 구간별 오차를 측정해야 할 때 적합하다.

## Verification
align-ai best_v7 기준 H 라인 위치 오차(px):

- median(후처리 없음) 직선: mean_err 1.8
- threshold(0.8) 직선: mean_err 1.2 — coverage 일부 감소
- skeleton 직선: mean_err 1.8 — 이 케이스에서는 유의미한 개선 없음

coverage가 낮은 케이스의 원인은 후처리 방법보다 이물질(blob)이 있는 입력에서 모델 자체가 탐지 실패하는 것으로 확인됐다.

## Related
- [[U-Net classifies pixels while PatchCore measures distance from normal features]] — argmax 기반 마스크 분류가 U-Net의 출력 방식
- [[Pixel-level metrics underestimate thin line segmentation performance]] — 마스크 품질보다 위치 오차를 지표로 써야 하는 이유
- [[segmentation-metric-position-over-iou]] — IoU 대신 위치 오차 체계를 선택한 배경
