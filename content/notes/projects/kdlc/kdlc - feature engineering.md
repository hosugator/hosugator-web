---
created: 2025-10-12
tags: [kdlc, feature_engineering, time_series_features, demand_forecasting, lag_rolling_diff, external_data_integration]
reference:
  - "[[kdlc - hub]]"
---
> **Last revised:** `= dateformat(this.file.mtime, "yyyy-MM-dd HH:mm")`

# Feature Engineering (특징 엔지니어링)

## 1. 시간 특성 생성
데이터의 기본 시계열 패턴을 모델이 학습할 수 있도록 날짜 정보에서 파생된 특성을 생성했다.
* 기본 시간 변수: year, month, day, dayofweek, quarter를 생성하여 연간, 월간, 주간, 요일별 트렌드와 계절성을 포착한다.
* 주기성 변수: 요일(7일 주기)과 월(12개월 주기)의 순환적 특성을 효과적으로 반영하기 위해 sin/cos 변환을 적용했다. 이는 주기 시작점과 끝점의 인접성을 수치적으로 표현하여 모델의 학습 오류를 방지한다.
    * sin_dayofweek, cos_dayofweek
    * sin_month, cos_month

## 2. 시계열 지표 (판매/매입 수량 기반)
타겟 변수인 수량의 과거 패턴을 반영하는 지연(Lag), 이동 통계(Rolling), 차분(Diff), 누적 통계(Expanding) 특성을 생성했다. 이 변수들은 수요 예측 모델의 핵심 예측 요소로 활용된다.

### 2.1. 지연 특성 (Lag Features)
과거 특정 시점의 수량을 반영하여 단기 트렌드 및 전년 동기 계절성을 포착한다.
* 수량_lag_1 (1일 전)
* 수량_lag_7 (7일 전)
* 수량_lag_52 (52주 전) - 장기 계절성 (전년 동기)

### 2.2. 이동 평균 특성 (Rolling Features)
최근 N일간의 통계치를 계산하여 단기 변동성을 완화하고 안정적인 추세 및 변동성을 파악한다.
* 수량_rolling_mean_7 (7일 이동 평균)
* 수량_rolling_mean_30 (30일 이동 평균)
* 수량_rolling_std_7 (7일 이동 표준편차)

### 2.3. 차분 특성 (Differencing Features)
전 시점 대비 변화량/변화율을 측정하여 수요 증감 추세를 감지하고 시계열 데이터의 정상성 확보에 기여한다.
* 수량_diff_1 (전날 대비 수량 변화량)
* 수량_pct_change_1 (전날 대비 수량 변화율 %)

## 3. 외부 데이터 기반 특성 및 상호작용 특성
사전에 수집 및 병합된 외부 데이터를 활용하여 외부 환경 요인의 영향을 직접 반영하고, 복합 요인 간의 시너지 효과를 포착하는 특성을 생성했다.

### 3.1. 외부 데이터 기반 특성
| 변수명 | 목적 및 반영된 외부 데이터 |
| :--- | :--- |
| Is_Holiday | 공휴일 여부 (주말 제외) |
| Is_preholiday_week | 설날/추석 대목 7일 전 여부 |
| Is_Covid_Restriction | 코로나19 집합금지 조치 여부 (2021~2023) |
| avg_temp, temp_deviation | 평균기온, 평년 대비 기온 편차 |
| temp_change_7d | 7일 전 대비 기온 변화량 |
| is_heatwave, is_coldwave | 폭염/한파 발생 여부 (극한 기후) |
| cpi_inflation | 소비자 물가 상승률 (보간됨) |
| consumer_sentiment | 소비자 심리 지수 (CCSI, 보간됨) |
| interest_rate | 한국은행 기준금리 (보간됨) |
| 단가 지표 | (판매금액 + 부가세) / 수량을 계산하여 개당 부가세 포함 판매 가격을 모델에 포함. |

### 3.2. 상호작용 특성 (Interaction Features)
수요에 미치는 복합적인 영향력을 증폭시키기 위해 주요 변수를 교차하여 생성했다.
* temp_heatwave_interaction: avg_temp * is_heatwave (폭염일 때 기온 효과 증폭, 음료 수요 예측에 중요)
* temp_coldwave_interaction: avg_temp * is_coldwave (한파일 때 기온 효과 증폭, 라면 수요 예측에 중요)
* holiday_preholiday_interaction: Is_Holiday * Is_preholiday_week (연휴 및 대목 직전의 구매 수요 증폭)

## 4. 모델링 타겟 설정
타겟 변수는 수량이며, 예측의 정확성을 높이기 위해 물류센터와 카테고리별로 독립적인 모델을 구축해야 한다.
* A 물류센터: '생수/음료/건강' 매입/매출, '신선식품' 매입/매출
* B 물류센터: '탄산음료' 매입/매출, '봉지라면' 매입/매출