---
created: 2025-12-17
tags:
  - aws_saa
  - data_lake
  - glue
  - athena
  - parquet
  - serverless
reference:
  - "[[Data Lake Architecture and Analysis]]"
  - "[[Athena]]"
  - "[[Glue]]"
---
# Data Lake Analysis Pipeline (Glue, Athena, Parquet 관계)

## 정의 (Definition)
[[S3]]를 스토리지로 사용하여 대규모 데이터를 저장하고, [[Glue]]를 통해 데이터를 최적화(ETL)한 후, [[Athena]]로 SQL 분석을 수행하는 서버리스 데이터 분석 파이프라인 아키텍처.

## 핵심 맥락 (Context & Why)
- Problem: 데이터 분석의 핵심은 비용 대비 성능이며, 원시 데이터(Raw CSV/JSON)를 그대로 분석하면 쿼리할 때마다 전체 데이터를 스캔하여 분석 비용이 높고 속도가 느리다.
- Solution: [[Glue]]를 사용하여 데이터를 [[Parquet]] 등 컬럼 기반 형식으로 미리 변환 및 파티셔닝하여 저장하고, [[Athena]]가 최적화된 데이터만 읽도록 유도함으로써 분석 비용을 극적으로 절감하고 성능을 향상시킨다.

## 작동 원리 (Mechanism)

데이터 레이크 파이프라인은 상호 독립적인 모듈들이 Glue Data Catalog를 매개체로 연결되어 순차적으로 작동한다.

1.  ETL/변환 ([[Glue]] Job):
     [[Glue]] ETL Job이 [[S3]]의 원시 데이터를 읽는다.
     데이터를 [[Parquet]] 등 컬럼 기반 형식으로 변환하고 파티셔닝을 적용하여 최적화된 데이터를 새로운 S3 경로에 저장한다.
     [[Parquet]]은 쓰기 시 오버헤드가 있지만, 분석(읽기) 시의 성능과 비용 효율을 극대화한다.
2.  메타데이터 관리 ([[Glue]] Data Catalog):
     [[Glue]] Crawler가 최적화된 데이터가 저장된 S3 경로를 스캔하여 데이터의 스키마와 위치 정보를 추출한다.
     추출된 메타데이터는 Glue Data Catalog에 등록되어, [[Athena]]가 테이블 구조를 파악할 수 있도록 한다.
3.  분석 ([[Athena]] Query):
     [[Athena]] 분석 엔진은 Glue Data Catalog에서 테이블 정보를 가져온다.
     사용자의 SQL 쿼리에 따라 S3의 [[Parquet]] 데이터 중 필요한 컬럼과 파티션만 선택적으로 스캔하여 쿼리를 실행한다.

## 유비 및 비교 (Analogy & Comparison)
- It's like:
     [[Glue]]는 식재료(Raw Data)를 받아서 효율적인 보관 방식([[Parquet]] 규격)에 맞춰 분류하고 정리하는 식품 가공 및 정리 전문가 역할을 한다.
     [[Athena]]는 정리된 카탈로그를 보고 원하는 재료가 있는 특정 서랍만 열어보는 요리사 역할을 한다.
- vs [Row-based Format (CSV/JSON)]:

| 특징 | Columnar (Parquet) | Row-based (CSV/JSON) |
| :--- | :--- | :--- |
| 목적 | 대규모 분석(OLAP)에 최적 | 데이터 수집 및 빠른 쓰기에 적합 |
| 쓰기 비용 (Write Cost) | 높음 (압축/변환 오버헤드) | 낮음 (단순 저장) |
| 읽기 비용 (Read Cost) | 낮음 (컬럼 및 파티션 선택적 스캔) | 높음 (레코드 전체 스캔) |
| 단점 | 잦은 행 단위 업데이트/삭제 및 소규모 데이터 처리에 비효율적이다. | 분석 쿼리 시 비효율적이고 비용 소모가 크다. |

## 예시 및 구조 (Example/Structure)
### 로그 데이터 분석 파이프라인
1.  Ingestion: 웹 서버 로그(JSON 형식)가 [[Kinesis Firehose]]를 통해 [[S3]]의 `raw/` 경로에 저장된다.
2.  Transformation: [[Glue]] Job이 `raw/` 데이터를 읽어, [[Parquet]] 형식으로 변환하고 날짜 기준으로 파티셔닝하여 `optimized/` 경로에 저장한다.
3.  Analysis: 분석가는 [[Athena]]에서 `SELECT COUNT() FROM optimized WHERE status_code = 500`과 같이 쿼리를 실행하며, [[Athena]]는 상태 코드 컬럼만 읽어 비용을 절감한다.