---
created: 2026-05-14
updated: 2026-05-15 16:40
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - labeling
  - data-quality
  - annotation
  - lighting
publish: true
---
## 조명이 다른 이미지 쌍에 라벨을 복사할 때 보이지 않는 대상이 생긴다
같은 물리적 장면을 다른 조명으로 촬영한 이미지 쌍(Org_1/Org_2)에서 한쪽에서 라벨링한 JSON을 다른 쪽에 그대로 복사했다. 이미지 구조가 같으니 좌표도 같을 거라 생각했다.
실제로는 Org_1과 Org_2의 픽셀 차이 평균이 119/255였다. 조명 방향과 강도가 달라 한쪽에서만 보이는 선이 있었다. 결과적으로 "선이 없는 이미지에 라벨이 있는" 노이즈 데이터가 생성됐고, 이게 모델의 탐지 실패 원인 중 하나가 됐다.

## 핵심
같은 물리 대상이라도 **조명이 다르면 가시성이 다르다**. 좌표 동일 = 가시성 동일이 아니다. 라벨 복사와 같은 편의성을 위한 자동화 작업에서는 반드시 결과가 의도와 정합하는지 직접 확인해야 한다.

## succeeding
- [[inconsistent-gt-count-kills-detection]]
