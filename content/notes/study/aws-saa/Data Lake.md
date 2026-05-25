---
created: 2025-11-25
tags:
  - aws_saa
  - data_lake
  - s3
  - big_data
  - schema_on_read
  - central_repository
  - analysis
reference:
  - "[[High-Performing Data Ingestion and Transformation Solutions]]"
  - "[[S3]]"
  - "[[Glue]]"
  - "[[Lake Formation]]"
---
# Data Lake (데이터 레이크)

## 정의 (Definition)
정형, 비정형, 반정형 데이터를 규모에 관계없이 네이티브 형식 그대로 저장하고, 다양한 분석 도구를 사용하여 통합적인 통찰력을 얻을 수 있도록 구축된 중앙 집중식 저장소

## 핵심 맥락 (Context & Why)
 Problem: 전통적인 데이터 웨어하우스는 데이터를 저장하기 전에 엄격한 스키마(Schema-on-Write)를 강제하여 유연성이 떨어지고, 비정형 데이터 분석에 한계가 있다.
 Solution: 데이터를 원시 형식 그대로 저장하고 읽을 때 스키마를 적용(Schema-on-Read)함으로써, 유연성과 민첩성(Agility)을 확보하며, [[S3]]의 무제한 확장성 및 저비용을 기반으로 구축되어 대규모 데이터 처리에 적합하다.

## 작동 원리 (Mechanism)
 Decoupling Compute and Storage (컴퓨팅·스토리지 분리): 저장소([[S3]])와 분석 도구([[Athena]] · [[EMR]])를 분리하여, 독립적인 확장을 가능하게 하고 분석 도구와 관계없이 모든 데이터에 대한 접근을 보장한다.
 Schema-on-Read (읽을 때 스키마 적용): 데이터를 네이티브 형식 그대로 저장하며, 스키마는 분석 시점에 정의하고 적용하여 유연성과 민첩성을 확보한다.
 구성 요소: 저장소 계층([[S3]]), 메타데이터/카탈로그([[Glue]] Data Catalog), 거버넌스/보안([[Lake Formation]])를 포함한다.

## 유비 및 비교 (Analogy & Comparison)
 It's like: 모든 종류의 원료(광물, 목재, 플라스틱, 메모)를 분류 없이 한 창고에 쌓아두고, 필요할 때마다 분석가(분석 도구)가 원하는 방식으로 가공하여 사용하는 유연한 창고 시스템이다.
 vs [Data Warehouse (데이터 웨어하우스)]:
     Data Lake: 유연한 Schema-on-Read를 사용하며, 원시 데이터를 포함한 모든 종류의 데이터를 저장한다.
     [Data Warehouse]: 엄격한 Schema-on-Write를 사용하며, 주로 정형 데이터를 정제하여 저장한다.

## 예시 및 구조 (Example/Structure)
### 통합 분석 플랫폼 구축
1. 수집: [[Kinesis Data Firehose]]를 통해 웹 로그(비정형 JSON)와 [[DMS]]를 통해 RDB 데이터(정형)를 [[S3]]에 원시 형태로 저장한다.
2. 카탈로그화: [[Glue]] Crawler가 이 원시 데이터의 스키마를 추론하여 Data Catalog에 등록한다.
3. 분석: [[Athena]]를 사용하여 JSON 데이터와 RDB 데이터를 조인(Join)하는 통합 쿼리를 실행하여 비즈니스 통찰력을 얻는다.