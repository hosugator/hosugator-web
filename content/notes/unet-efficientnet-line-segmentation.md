---
created: 2026-05-14
updated: 2026-05-15 16:44
type: study
status: 1-draft
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - unet
  - efficientnet
  - segmentation
  - architecture
publish: true
---
## context
align-ai 프로젝트에서 `segmentation_models_pytorch`의 `smp.Unet(encoder_name="efficientnet-b0")`을 사용했다. 코드는 돌아가지만 내부 원리를 아직 잘 모른다. 나중에 채워야 할 노트.

- **U-Net**: 이미지를 압축했다가 다시 픽셀 단위로 펼치는 구조. 각 픽셀이 "선인가 배경인가"를 분류.
- **EfficientNet-B0**: 압축(인코딩) 역할. ImageNet으로 사전학습된 가중치를 쓰면 작은 데이터로도 학습 가능.
- **Skip Connection**: 인코더 중간 레이어의 정보를 디코더에 직접 연결. 압축 과정에서 잃어버린 위치 정보를 보완한다고 이해함.
- **in_channels=1**: 그레이스케일 입력. RGB가 아닌 명암만 사용.
- **classes=2**: 배경 / 선 이진 분류.

## 아직 모르는 것

- EfficientNet이 다른 인코더(ResNet 등) 대비 어떤 장단점이 있는가
- Skip Connection이 구체적으로 어떻게 위치 정보를 보존하는가
- Dice Loss가 Cross-Entropy 대비 얇은 선 탐지에서 왜 더 나은가

## 실험 결과 (참고)

- 학습 데이터: 100장 (Q-display, 2개 선 GT만)
- val IoU: 0.2992 (얇은 선 구조 특성상 낮음, 실제 성능과 무관)
- 탐지 성공률: 100%, PASS율: 91%
- CPU 추론: ~330ms/장

## succeeding
- [[AOI]]