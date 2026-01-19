---
created: 2025-12-19
tags:
  - comparison
  - database
  - aurora
  - optimization
reference:
  - "[[Amazon Aurora]]"
  - "[[Amazon Redshift]]"
  - "[[Aurora Replica]]"
  - "[[High-Performing and Scalable Storage Solutions]]"
---
# Comparison - Cost-Effective Solutions for DB Performance Spikes

## 비교 목적 (Objective)
데이터베이스의 Read IOPS 및 CPU 사용량이 급증하는 상황(리포트 작업 등)에서 가장 비용 효율적으로 성능 문제를 해결하기 위한 기준 정립

## 솔루션별 상세 비교 (Feature Matrix)

| 구분 | Aurora Replica (B) | Redshift (A) | Larger Instance (C) |
| :--- | :--- | :--- | :--- |
| **핵심 목적** | **읽기 부하 분산 (Offloading)** | 대규모 데이터 분석 (DW) | 전체적인 처리 능력 향상 |
| **적합한 상황** | **주기적인 리포트 조회** | 수년간의 방대한 트렌드 분석 | 상시 트래픽 과부하 |
| **비용 효율성** | **최상 (필요 시 추가/삭제 용이)** | 낮음 (별도 클러스터/ETL 비용) | 낮음 (24시간 높은 비용 발생) |
| **데이터 동기화** | 자동 (밀리초 단위 지연) | 복잡 (데이터 추출/로드 필요) | 해당 없음 (동일 인스턴스) |

## 선택 기준 및 오답 분석 (Decision Logic)

### 1. 왜 Aurora Replica가 가장 가성비 정답인가?
- **부하 격리**: 리포트용 읽기 전용 복제본을 만들면, 메인 DB(Writer)는 사용자 주문 처리에만 집중할 수 있음
- **저렴한 비용**: 리포트를 돌릴 때만 복제본 사양을 조절하거나 추가하는 것이 인스턴스 자체를 키우는 것보다 훨씬 경제적임

### 2. 왜 Redshift는 오답인가?
- **체급 차이**: Redshift는 '리포트' 수준이 아니라 '빅데이터 분석'을 위한 무거운 도구임. 단순 조회를 위해 도입하기엔 운영 복잡도와 비용이 너무 높음

### 3. 왜 인스턴스 상향(Larger)이나 IOPS 추가(Provisioned)는 피해야 하는가?
- **낭비되는 자원**: 한 달에 한 번 발생하는 스파이크 때문에 한 달 내내 고사양 장비를 유지하는 것은 비용 최적화 원칙에 어긋남

---
**Conclusion:**
단순히 '읽기 작업(리포트)' 때문에 DB가 힘들어한다면, 무조건 **읽기 복제본(Replica)**을 통해 부하를 나누는 것이 가장 똑똑하고 저렴한 해결책임