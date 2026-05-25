---
created: 2025-11-26
tags: [aws_saa, data_lake, s3, athena, quicksight, analysis, serverless, bi, visualization]
reference:
  - "[[High-Performing Data Ingestion and Transformation Solutions]]"
  - "[[Data Lake]]"
  - "[[Athena]]"
  - "[[S3]]"
---
# Data Lake Architecture and Analysis (S3, Athena, QuickSight)

## 정의 (Definition)
[[S3]]를 기반으로 대규모의 정형/비정형 데이터를 저장하고, [[Athena]]와 같은 서버리스 분석 도구를 사용하여 민첩하고 비용 효율적인 분석 환경을 구현하는 아키텍처 패턴

## 핵심 맥락 (Context & Why)
- Problem: 기존 데이터 웨어하우스는 데이터를 로드하기 전에 스키마를 미리 정의해야 하므로, 다양한 형태의 대규모 데이터(비정형 데이터 포함)를 저장하고 분석하는 데 유연성이 부족하고 비용 효율성이 떨어진다.
- Solution: 컴퓨팅([[Athena]])과 스토리지([[S3]])를 분리하고 읽을 때 스키마를 적용(Schema-on-Read)하는 방식으로 유연성과 탄력적 확장을 보장하는 서버리스 분석 환경을 구축한다.

## 작동 원리 (Mechanism)
- 스토리지 분리: 모든 원시 데이터는 무제한의 확장성과 내구성을 가진 [[S3]]에 저장된다.
- Schema-on-Read: 분석 엔진([[Athena]])은 데이터 저장 시점이 아닌 쿼리 시점에 스키마를 적용하여 데이터의 유연한 분석을 가능하게 한다.
- 비용 최적화: [[Athena]]는 쿼리 시 스캔된 데이터 양에 따라 비용이 청구되므로, 데이터를 [[Parquet]] 등 칼럼형 형식으로 변환하고 파티셔닝하는 [[ETL]] 전략이 비용 절감의 핵심이다.
- 서버리스 확장성: [[S3]], [[Athena]], [[QuickSight]] 모두 완전 관리형 서버리스 서비스로, 인프라 관리가 필요 없으며 워크로드에 따라 자동으로 확장된다.

## 유비 및 비교 (Analogy & Comparison)
- It's like: 거대한 도서관([[S3]])에 모든 자료를 날것 그대로 보관하고, 필요할 때마다 특정 분류 기준(Schema-on-Read)을 적용하여 원하는 정보([[Athena]])만 검색하고 시각화([[QuickSight]])하는 방식.
- vs [[데이터 웨어하우스]]:
	- Data Lake: 유연한 비정형 데이터 저장, Schema-on-Read (읽을 때 스키마 적용) 방식.
	- 데이터 웨어하우스: 정형 데이터에 최적화, Schema-on-Write (쓸 때 스키마 적용) 방식.

## 예시 및 구조 (Example/Structure)
### 마케팅 성과 분석 시스템
1.  데이터 수집/저장: 로그 및 캠페인 데이터는 [[S3]]에 저장되며, [[Glue]]를 통해 데이터 카탈로그가 구축된다.
2.  분석: 마케팅 분석가는 [[Athena]]에서 SQL을 사용하여 S3의 원본 데이터에 대해 임시(Ad-hoc) 분석을 수행한다.
3.  시각화: [[QuickSight]]가 [[Athena]]의 쿼리 결과에 직접 연결되거나 SPICE 엔진을 사용하여 데이터를 캐싱하고, 성과를 시각화하는 대시보드를 생성한다.