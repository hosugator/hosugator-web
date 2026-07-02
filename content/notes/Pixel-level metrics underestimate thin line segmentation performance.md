---
created: 2026-06-18
updated: 2026-06-18
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - segmentation
  - evaluation-metric
  - thin-line
  - iou
  - recall
publish: true
---
## Context
hesung v7 성능 분석 중 "F-2를 쓰면 IoU 문제가 해결되지 않냐"는 질문에서 출발. 픽셀 단위 지표의 한계가 IoU에만 국한되지 않음을 확인했다. 또한 우리의 detect_rate가 픽셀 Recall인지 이미지 단위 Recall인지를 구분하게 됐다.

## Insight
### F-2도 픽셀 단위면 같은 구조적 문제를 가진다

얇은 선이 2px 밀리면 FN/FP가 많이 발생하는 구조는 F-2도 피할 수 없다. F-2는 FN에 4배 가중치를 줘서 IoU보다 Recall 쪽으로 관대하지만, 근본적인 문제(픽셀 단위 겹침 기준)는 동일하다.

| 픽셀 단위 지표 | 얇은 선 문제 |
|---|---|
| IoU | 1픽셀 밀림 → 교집합 거의 0 |
| 픽셀 F-1 (Dice) | IoU보다 관대하나 동일 구조 |
| 픽셀 F-2 | IoU보다 관대하나 동일 구조 |

### detect_rate는 픽셀 Recall이 아니라 이미지 단위 Recall이다

```
detect_rate = 선을 찾은 이미지 수 / 전체 이미지 수
```

connected component(연결된 픽셀 덩어리)가 1개 이상 검출됐는지로 판단한다. 픽셀 단위 겹침 계산이 아니라 "덩어리가 있냐 없냐"가 기준이므로 얇은 선 문제를 피한다.

### FP/FN 시각화는 진단 도구이지 평가 지표가 아니다

픽셀 단위 FP/FN을 색깔로 오버레이하면 "어느 영역에서 틀렸는가"를 육안으로 볼 수 있다. blob 영역에서 FP가 집중되는지, 선 끝부분에서 FN이 많은지 같은 **라벨 전략·데이터 문제 진단**에 유용하다. 하지만 "이 모델이 좋은가"를 숫자 하나로 요약하는 용도로는 맞지 않는다.

## Related
- [[segmentation-metric-position-over-iou]] — IoU가 얇은 선에 구조적으로 불리한 원인 (Q-edge 사례)
- [[Validation metric and training loss serve different roles in ML pipeline]] — 어떤 Metric으로 체크포인트를 고를 것인가
