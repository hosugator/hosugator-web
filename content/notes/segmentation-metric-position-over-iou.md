---
created: 2026-05-14
updated: 2026-05-14
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - segmentation
  - evaluation-metric
  - thin-line
  - iou
publish: true
---
## 얇은 선 세그멘테이션에서 IoU는 잘못된 지표다

Q-edge 모델이 IoU 0.44를 기록했는데 실제 측정 PASS율은 100%였다. 처음엔 모델이 실패한 줄 알았다.
원인을 추적하니 구조적 문제였다: 원본 해상도 4024px의 3px 라선을 768px로 resize하면 선이 sub-pixel 수준으로 얇아진다. IoU는 예측/정답의 교집합÷합집합인데, 선 두께가 1px 미만이면 1픽셀만 빗나가도 Union은 크게, Intersection은 0에 가깝게 계산된다.
얇은 선 탐지에서 진짜 질문은 "마스크가 얼마나 겹치는가"가 아니라 "선의 위치를 몇 mm 오차로 찾았는가"다.

## 내가 선택한 지표 체계

1. **탐지 성공률** — 2개 선 모두 탐지했는가 (Gate 역할)
2. **간격 오차 PASS율** — 탐지 성공 이미지 중 gap error ≤ 0.1mm 비율
3. **평균 위치 오차(mm)** — 각 선 위치의 GT 대비 절댓값 오차
4. val IoU — 참고용으로만

IoU가 낮아도 위 지표가 좋으면 실제로 쓸 수 있는 모델이다. 반대도 성립한다.

## succeeding
- [[adr-line-detection-best-model-criterion]]
