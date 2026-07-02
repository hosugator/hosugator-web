---
created: 2026-04-28 10:22
updated: 2026-04-28 10:28
subject: "[[AI]]"
project: "[[Edge AI LMR]]"
type: insight
status: 1-draft
tags:
  - MVTecAD
  - PatchCore
  - ROI-Masking
  - Machine-Vision
publish: true
---
## 1. MVTec AD의 정의와 현업 위상

- 정의: MVTec Software GmbH에서 공개한 산업용 이상탐지(Anomaly Detection) 데이터셋. 정상 데이터만으로 학습하여 결함을 찾아내는 알고리즘의 성능을 측정하는 '골드 스탠다드' 벤치마크이다.
- 현업 활용: 새로운 알고리즘의 기술적 우위를 입증하는 지표로 활용되며, 현업에서는 MVTec AD로 검증된 알고리즘(예: PatchCore)을 베이스 엔진으로 채택하고 도메인 특화 데이터를 결합하는 방식이 정석이다.

---

## 2. PatchCore 알고리즘 튜닝 포인트

PatchCore는 사전 학습된 가중치(Pre-trained Weights)를 고정(Frozen)하여 사용하지만, 다음과 같은 구조적 파라미터 튜닝을 통해 현장에 최적화한다.

- Backbone & Layer: 특징을 추출할 레이어 조합(Layer 2+3 등) 및 백본 모델(ResNet, WideResNet 등) 선정.
- Memory Bank 최적화: CoreSet 샘플링 비율 조절 및 Random Projection 차원 축소. [[MachineLearning_RandomProjection_JL_Lemma]]
- Scoring & Post-processing: KNN의 k값 결정 및 Anomaly Map의 가우시안 블러 처리.
- 데이터 전처리: 해상도 설정, 이미지 정렬(Alignment), ROI Masking.

---

## 3. ROI Masking의 상세 개념 및 차별점
### Cropping(자르기) vs. Masking(마스킹)
- Cropping: 이미지의 불필요한 외곽을 사각형 형태로 잘라내는 1차 전처리. 데이터 양을 줄이지만 복잡한 형태의 제품 외 배경을 완전히 제거하기 어렵다.
- Masking: 이미지 크기는 유지하되, 실제 검사할 영역(1)과 제외할 영역(0)을 정의한 마스크를 씌우는 기법. 원형 렌즈 등 비정형 제품 검사 시 필수적이다.

### PatchCore에서 Masking의 중요성
- Memory Bank 오염 방지: 검사 대상이 아닌 배경의 특징이 메모리에 저장되는 것을 막아 연산 효율과 정확도를 높인다.
- 과검(False Alarm) 방지: 배경의 조명 변화나 노이즈를 이상치로 오인하는 현상을 차단한다.

---

## 4. 추론(Inference) 단계의 ROI 적용 전략

추론 시에도 학습과 동일한 ROI가 적용되어야 하며, 이를 위해 다음 프로세스가 권장된다.
1. 이미지 정렬(Alignment): 템플릿 매칭 등을 통해 제품의 위치를 마스크 좌표와 일치시킨다.
2. 추론 및 히트맵 생성: 모델을 통해 전체 영역에 대한 이상치 점수를 산출한다.
3. 결과 마스킹(Output Masking): 생성된 히트맵 위에 ROI 마스크를 씌워 영역 밖의 점수를 0점 처리한다.

---

## 5. 결론 및 인사이트

- 이상탐지 모델의 성능은 알고리즘 자체의 성능만큼이나 "검사 영역을 얼마나 정밀하게 정의하고 정렬하느냐"라는 전처리/후처리 전략에 크게 의존한다.
- 가중치가 고정된 PatchCore와 같은 모델에서는 ROI Masking이 알고리즘의 '주의력(Attention)'을 제어하는 가장 강력한 튜닝 도구가 된다.