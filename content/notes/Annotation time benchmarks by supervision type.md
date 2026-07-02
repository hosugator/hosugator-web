---
created: 2026-05-20
updated: 2026-05-20
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[AOI]]"
tags:
  - computer-vision
  - annotation
  - labeling
  - benchmark
publish: true
---
## Context
DTK AOI PJT에서 성균관대 이동희 교수님께 라벨링 공수를 문의하면서, 선임이 유형별 소요 시간 수치를 요청했다. 세 편의 논문을 직접 확인하여 원출처 수치를 검증했다.

## Insight
### 유형별 소요 시간 (PASCAL VOC / COCO 기준, AMT 크라우드 워커)

| 유형          | 단위     | 수치              | 출처                      |
| ----------- | ------ | --------------- | ----------------------- |
| 이미지 단위 분류   | 이미지당   | **20.0초**       | Bearman et al., 2016    |
| 포인트 (클릭)    | 이미지당   | **22.1초**       | Bearman et al., 2016    |
| 바운딩 박스      | 객체 1개당 | **42.4초** (중앙값) | Su et al., 2012         |
| 인스턴스 세그멘테이션 | 객체 1개당 | **79초** (평균)    | Lin et al., 2014 (COCO) |
| 풀 세그멘테이션    | 이미지당   | **239.7초**      | Bearman et al., 2016    |

### 42.4초는 파이프라인 전체 중앙값이다

Su et al.의 42.4초는 바운딩 박스 그리기(25.5초) + 품질 검수(9.0초) + 커버리지 검수(7.8초)의 합산 중앙값. 순수 그리기만은 25.5초.

### 239.7초는 PASCAL VOC 특수 계산값이다

Bearman et al.의 239.7초 = 18.5초(클래스 없음 라벨) + 2.8개 × 79초(세그멘테이션). 이미지 특성(평균 객체 수)에 따라 달라지는 값. Agnew et al.(2024)이 "200초 이상"으로 보수적으로 재인용.

### 데이터 성격에 따라 편차가 크다

세 논문 모두 일상 사진(COCO, PASCAL VOC, ImageNet) 기준. 도메인 특화 이미지(렌즈 결함 등)는 객체 수가 적고 단순하므로 더 빠를 수 있으나, 도메인 지식이 필요하면 일반 크라우드 워커보다 느릴 수 있다.

## References

- Su, H., Deng, J., & Fei-Fei, L. (2012). *Crowdsourcing Annotations for Visual Object Detection.* [AAAI Workshop. ](https://www-cs.stanford.edu/groups/vision/pdf/bbox_submission.pdf)
- Lin, T. et al. (2014). *Microsoft COCO: Common Objects in Context.* https://arxiv.org/pdf/1405.0312
- Bearman, A. et al. (2016). *What's the Point: Semantic Segmentation with Point Supervision.* https://arxiv.org/pdf/1506.02106
- Agnew, C. et al. (2024). *Pretraining instance segmentation models with bounding box annotations.* https://doi.org/10.1016/j.iswa.2024.200454
