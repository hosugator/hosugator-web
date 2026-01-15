---
created: 2025-10-12
tags: [kdlc, baseline_model, naive_forecasting, moving_average, lightgbm, xgboost, random_forest, demand_forecasting]
reference:
  - "[[kdlc - hub]]"
---
> **Last revised:** `= dateformat(this.file.mtime, "yyyy-MM-dd HH:mm")`


# 머신러닝 모델 테스트 전략

## 핵심 용어 정의
### 머신러닝 모델 핵심 용어 정의표
| 용어                                    | 정의                                                                                    |
| :------------------------------------ | :------------------------------------------------------------------------------------ |
| 지도 학습(Supervised Learning) 변환         | 과거 시점의 데이터를 특징(X)으로, 예측하고자 하는 시점의 수량을 타겟(y)으로 설정하여 시계열 문제를 일반적인 지도 학습 문제로 재정의하는 과정이다. |
| 특징 공학(Feature Engineering) 변수         | `Lag`, `Rolling`, `Diff`, 주기성(`sin/cos`), 외부 데이터 등 모델 학습의 입력으로 사용되는 모든 가공된 변수들이다.     |
| XGBoost                               | 경사 하강법 기반의 트리 부스팅 알고리즘이며, 높은 예측 성능과 병렬 처리 효율을 제공한다.                                   |
| LightGBM                              | `XGBoost`와 유사하나, 트리를 수직(Leaf-wise) 방식으로 성장시켜 속도가 빠르고 메모리 사용량이 적다. 대용량 데이터에 특히 유리하다.   |
| RMSE (Root Mean Square Error)         | 예측 오차의 제곱 평균에 루트를 취한 값이다. 오류 값에 비례하여 패널티를 부여하며, 예측 성능의 표준적인 지표로 사용된다.                 |
| MAE (Mean Absolute Error)             | 예측 오차의 절댓값 평균이다. 오류의 크기를 직관적으로 나타낸다.                                                  |
| MAPE (Mean Absolute Percentage Error) | 예측 오차를 실제 값으로 나눈 비율의 평균이다. 비율 오차를 나타내어 모델의 상대적인 예측 정확도를 판단하는 데 유용하다.                  |

## 1. 시계열 데이터를 지도 학습 문제로 변환
시계열 데이터는 다음 시점의 값을 예측하는 특성이 있으므로, 머신러닝 모델에 학습시키기 위해 지도 학습(Supervised Learning) 형태로 변환한다.
* 변환 과정: 특징 공학(Feature Engineering) 단계에서 생성된 `Lag`, `Rolling`, `Diff`, `sin/cos` 등의 변수들이 모델의 입력 특징(X)이 된다. 타겟 변수(y)는 예측하고자 하는 시점의 '수량'이다.
* 활용 데이터: 트리 계열 모델용으로 분할된 `Train` 및 `Validation` 데이터셋을 활용하여 모델을 학습하고 검증한다.

## 2. 머신러닝 모델 구축 및 학습
선정된 세 가지 트리 기반 모델을 사용하여 각 카테고리별 매입 및 매출 예측 과제에 대한 초기 성능을 확인한다.
* 모델 선정: `XGBoost`, `LightGBM`, `Random Forest` 모델을 사용한다.
* 기본 파라미터 학습: 각 모델의 과적합 방지 및 초기 성능 확인을 위해 복잡한 하이퍼파라미터 튜닝 없이 기본(Default) 파라미터 설정으로 학습을 진행한다.
* 활용 파일: `train_lightgbm.ipynb`, `train_xgboost.ipynb`, `train_random_forest.ipynb` 파일들을 사용하여 학습 코드를 구현한다.

## 3. 성능 평가 및 기준선 설정
학습된 모델들의 성능은 `Validation` 데이터셋을 통해 측정되며, 이를 통해 최종 앙상블 모델에 포함될 최적의 ML 모델을 선정하는 기초 자료로 활용된다.
* 평가 지표: 예측 성능 비교를 위해 `RMSE`, `MAE`, `MAPE` 세 가지 지표를 사용한다. `MAPE`는 수요 예측 분야에서 특히 중요한 상대적 오차율 지표이다.
* 성능 비교: 세 모델의 `Validation` 성능을 비교하여, 베이스 모델 성능을 상회하는지 확인하고 앙상블에 기여할 수 있는 모델을 선별하는 것이 목표이다.
