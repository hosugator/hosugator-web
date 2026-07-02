---
created: 2026-04-21
updated: 2026-04-21
subject: "[[AI]]"
project: "[[Edge AI LMR]]"
type: insight
status: 1-draft
tags:
  - ml
  - anomaly-detection
  - synthetic-data
publish: true
---
# ML 비지도 학습에서 합성 이상 데이터가 필요한 이유

비지도 학습 기반의 이상 탐지 모델에서도 이상(Anomaly) 데이터는 필수적이다.

## 핵심 이유: 평가(Evaluation)와 검증
- **학습용**: 비지도 학습 모델은 주로 정상 데이터(\`is_anomaly=0\`)만을 사용하여 학습한다.
- **평가용**: 모델이 정상과 이상을 얼마나 잘 구분하는지(F1-Score 등) 확인하기 위해 의도적으로 생성된 이상 데이터가 포함된 시험지가 필요하다.

## 현실 공정의 적용 전략
1. **초도 양산(Golden Batch)**: 장비 설치 초기 품질이 보증된 시기의 데이터를 정상 기준으로 학습한다.
2. **다수결의 원칙 (Isolation Forest)**: "정상은 다수이며 촘촘하고, 이상은 소수이며 고립되어 있다"는 가정을 활용하여 라벨 없이도 이상을 탐지한다.
