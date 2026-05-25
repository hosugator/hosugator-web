---
created: 2026-02-02
tags:
  - aws
  - analytics
  - strategy
  - athena
  - redshift
  - opensearch
  - rds
  - aurora
---
# AWS Analytics Strategy

## 본질 (Essence)
저장된 데이터(Data at Rest)에서 비즈니스 인사이트를 추출하기 위해, 운영 부담을 최소화하면서 SQL 또는 분석 툴을 적용하는 전략

## 구조 (Mechanism)
### 1. 전용 분석 서비스 (The Right Tools)
- **Amazon Athena (Serverless)**: 
    - S3에 저장된 데이터에 즉시 SQL 실행.
    - 데이터 로딩(ETL) 과정 없이 바로 분석하므로 운영 오버헤드 최저.
- **Amazon Redshift (Data Warehouse)**:
    - 대규모 정형 데이터의 복잡한 OLAP(분석용 연산) 수행.
    - 상시 가동 클러스터로 성능은 최상이나 비용 및 운영 부담 높음.
- **Amazon OpenSearch**: 로그 데이터의 실시간 검색 및 시각화.

### 2. 비교: DB 서비스를 분석에 쓸 때의 한계 (The Trap)
- **RDS / Aurora**: 
    - 본질은 **OLTP**(실시간 거래 처리)용.
    - 분석을 하려면 데이터를 S3에서 DB로 다시 옮겨야 함 (운영 오버헤드 발생).
    - 대규모 집계 쿼리 실행 시 운영 중인 서비스 성능에 영향을 줄 수 있음.

## 확장 (Connection)
- **연결**: 
    - "S3 데이터 + 최소 운영 + SQL" = **Athena**.
    - "고성능 + 복잡한 BI 보고서" = **Redshift**.
- **응용**: 문제 옵션에 RDS가 나오는 이유는 **"분석 서비스(Athena) 대신 익숙한 DB(RDS)를 골라보겠어?"**라는 오답 유도임. SAA 시험에서 S3 데이터 분석의 정석은 항상 Athena로 시작함.

---
See Also: 
- [[OLTP]]