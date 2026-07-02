---
created: 2026-05-26
updated: 2026-05-26
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Edge AI LMR]]"
tags:
  - ml
  - engineering
  - labeling
  - deployment
  - system-thinking
publish: true
---

## Context

제조 현장 AI 프로젝트에서 U-Net(픽셀 세그멘테이션)과 PatchCore(이상 탐지)의 실전 성능을 비교하면서 발생한 통찰. U-Net이 이론상 더 정밀함에도 불구하고, 라벨링 인프라 품질에 따라 PatchCore에 역전당할 수 있다는 사실이 출발점이다.

→ [[Operator label quality is the hidden ceiling for supervised segmentation over anomaly detection]]

## Insight

### 모델 아키텍처 논쟁은 라벨링 인프라를 암묵적으로 "충분히 좋다"고 가정한다

```
U-Net 실제 성능 = f(모델 구조, 라벨 품질)
PatchCore 실제 성능 = f(모델 구조)
```

U-Net의 이론적 우위는 픽셀 마스크 라벨이 충분히 일관될 때만 현실이 된다. 이 전제가 깨지면 라벨 리스크에 면역인 PatchCore가 실질적으로 앞선다.

### 시스템 성능은 가장 이론적으로 정교한 컴포넌트가 아니라 가장 약한 병목이 결정한다

모델 선택(무엇이 이론상 우월한가)보다 **현재 맥락에서 어떤 변수가 실제 병목인가**를 먼저 파악하는 것이 좋은 엔지니어링 판단이다.

U-Net 채택 시 병목은 모델이 아니라 라벨링 파이프라인이다. 병목이 제거되지 않으면 모델을 개선해도 천장은 그대로다.

### 이론적 우위를 현장에서 실현하려면, 그 이론이 요구하는 전제 조건부터 점검해야 한다

| 상황 | 우선 투자 |
|------|-----------|
| 라벨 품질 보장 가능 | 모델 개선 |
| 라벨 품질 불확실 | 라벨링 파이프라인 (SAM 반자동 + 검수 체계) |
| 라벨 수집 불가 | PatchCore 유지 |

## Related

- [[U-Net classifies pixels while PatchCore measures distance from normal features]] — 두 모델의 작동 원리 차이
- [[label-copy-lighting-mismatch-risk]] — 라벨 품질 저하의 구체적 사례
- [[Self-supervised Learning - 레이블 없이 만드는 지도 신호]] — 라벨 없이 학습하는 대안적 접근
- [[Domain Adaptation - 레이블 없이 도메인 분포 정렬]] — 라벨 없이 도메인 격차를 줄이는 접근
- [[A theoretically better model does not guarantee better results in the field]] — 이 인사이트 기반 LinkedIn 포스트
