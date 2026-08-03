---
created: 2026-07-06
updated: 2026-07-06
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[AOI]]"
tags:
  - vdg
  - anomaly-detection
  - data-augmentation
  - aoi
publish: true
---
## Context
SKKU AOI PJT KOM에서 VDG(Virtual Defect Generation)가 핵심 기술로 소개되어 DTK 측은 기본 파이프라인에 포함되는 것으로 이해했으나, 이창현 박사과정의 1차 기술 미팅 요청 회신에서 VDG 적용 조건이 명확해졌다.

## Insight
### VDG는 데이터 난이도가 높을 때만 필요한 조건부 기법이다

결함 난이도가 낮은 경우(육안으로 잘 보이는 결함, 충분한 양품 이미지) 반지도·비지도학습 기반 이상탐지(PatchCore 등)로 충분히 성능을 확보할 수 있다. VDG가 필요한 조건:

- 결함 데이터 수집이 극히 어렵거나 수량이 매우 적을 때
- 클래스 불균형이 심각할 때
- 지도학습 모델이 필요한데 라벨 데이터가 부족할 때

### 플랫폼은 VDG 적용 여부를 사용자가 선택할 수 있도록 설계해야 한다

데이터 시나리오에 따라 파이프라인이 달라지므로, VDG를 고정 단계로 두지 않고 옵션으로 제공하는 것이 맞다. 이는 플랫폼 설계 단계에서 반영해야 한다.

## Related
- [[AOI]]