---
created: 2026-05-22
updated: 2026-05-22
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Edge AI LMR]]"
tags:
  - ml
  - segmentation
  - anomaly-detection
  - labeling
  - patchcore
  - unet
publish: true
---

## Context

DTK에서 내부적으로 검토한 접근(ResNet 이미지 분류 + PatchCore 이상탐지)과 성균관대 RISE 과제가 제안한 접근(Lightweight U-Net 픽셀 세그멘테이션 + Open-set 탐지기)을 비교하면서 발생한 통찰이다.

U-Net이 이론상 더 정밀하다는 것은 자명하다 — 픽셀 단위 클래스 레이블 + 결함 위치를 동시에 출력하니까. 문제는 "이론상 더 정밀하다"가 현장에서 실제로 더 잘 작동한다는 뜻이 아니라는 점이다.

## Insight

### U-Net의 성능은 라벨 품질에 종속되고, PatchCore는 라벨 품질에 면역이다

```
U-Net 실제 성능 = f(모델 구조, 라벨 품질)
PatchCore 실제 성능 = f(모델 구조)  ← 라벨 불필요
```

U-Net 선택이 PatchCore보다 나은 것은 **오퍼레이터가 충분히 일관된 픽셀 마스크를 생성할 수 있을 때만**이다. 현장 작업자가 라벨링하는 경우, 이 가정이 보장되지 않는다.

### 지도학습 모델 선택의 숨은 전제: 라벨링 인프라가 모델보다 중요할 수 있다

모델 아키텍처 논쟁(U-Net vs ResNet vs PatchCore)은 라벨링 인프라를 암묵적으로 "충분히 좋다"고 가정한다. 하지만 현장 운영 맥락에서는 라벨 수집 시스템의 품질이 모델 선택보다 더 결정적인 변수가 되는 경우가 있다.

SAM 반자동 라벨링(클릭 → 마스크 자동 생성 → 작업자 확인)은 이 격차를 줄이는 인프라 투자다. U-Net을 채택한다면 모델 개발보다 라벨링 파이프라인(CVAT/labelme+SAM)에 먼저 투자해야 한다.

### 전략적 시사점

| 상황 | 권장 |
|------|------|
| 라벨 품질 보장 가능 (전문가 라벨러, 반자동 검수 체계) | U-Net — 이론 우위를 현실에서 실현 가능 |
| 라벨 품질 불확실 (현장 오퍼레이터 직접 라벨링) | PatchCore 병행 유지 + U-Net 점진 전환 |
| 라벨이 아예 없거나 수집 불가 | PatchCore — 정상 이미지만으로 작동 |

새로운 결함 유형 탐지(Open-set)가 필요해지는 시점에는 U-Net 전환이 불가피하지만, 전환 조건은 "모델 준비"가 아니라 "라벨링 인프라 준비"다.

## Verification

- 2026-05-22 DTK vs SKKU 접근 비교에서 도출. 아직 실증 데이터 없음.
- Stage 2 현장 재학습 루프에서 U-Net vs PatchCore 성능 비교로 검증 가능.

→ 관련: [[U-Net classifies pixels while PatchCore measures distance from normal features]] [[Open-set AI separates unknown defect types without forcing them into known classes]]
