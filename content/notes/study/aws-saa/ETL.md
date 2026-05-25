---
created: 2025-11-26
tags: [aws_saa, etl, data_transformation, data_integration, data_pipeline, data_lake, big_data]
reference:
  - "[[High-Performing Data Ingestion and Transformation Solutions]]"
  - "[[Glue]]"
  - "[[EMR]]"
---
# ETL (Extract, Transform, Load)
## 정의
분석 및 보고를 위해 다양한 소스 시스템에서 데이터를 추출(Extract) · 원하는 형식으로 변환(Transform) · 최종 대상 스토리지에 로드(Load)하는 일련의 데이터 통합 프로세스
## 요소
- E (Extract - 추출): 원본 데이터베이스 · 파일 · 스트림 등 다양한 소스에서 데이터를 읽어오는 단계.
- T (Transform - 변환): 추출된 데이터를 대상 스토리지의 스키마와 요구 사항에 맞게 정제 · 결합 · 집계 · 형식 변경하는 단계. (예: JSON $\to$ Parquet)
- L (Load - 로드): 변환된 데이터를 [[S3]] 기반 데이터 레이크 · [[Redshift]] 등의 대상 시스템에 쓰는 단계.
## 원리
### Data Consistency (데이터 일관성 원리)
ETL 프로세스는 원본 데이터의 형식을 표준화하고 오류를 정제하여, 분석 사용자가 일관되고 신뢰할 수 있는 데이터를 소비할 수 있도록 보장한다.
### Decoupling Processing (처리 분리)
대규모 데이터 처리 환경에서는 ETL 프로세스를 병렬 분산 처리에 최적화하여야 한다. AWS에서는 [[Glue]]나 [[EMR]]과 같은 확장 가능한 서비스를 사용하여 컴퓨팅과 스토리지([[S3]])를 분리함으로써 고성능 처리를 달성한다.
### Performance and Cost (성능 및 비용)
데이터를 대상 시스템에 로드하기 전에 변환을 수행하여, 대상 시스템(예: [[Data Warehouse]])의 처리 부하를 줄이고 리소스를 효율적으로 사용할 수 있다.
### Batch vs Streaming (배치 vs 스트리밍)
- 배치 ETL: 정기적인 간격(예: 일별)으로 대량의 데이터를 처리한다. ([[Glue]], [[EMR]] 활용)
- 스트리밍 ETL: 데이터가 생성되는 즉시 변환을 수행하여 낮은 지연 시간을 유지한다. ([[Kinesis Data Analytics]] 활용)
## 예시
### 레거시 데이터베이스를 데이터 레이크로 마이그레이션
1. E: [[Database Migration Service]] (DMS)를 사용하여 온프레미스 RDB에서 데이터를 추출한다.
2. T: [[Glue]]의 ETL 작업을 사용하여 데이터를 정규화하고, 분석에 최적화된 Parquet 형식으로 변환한다.
3. L: 변환된 Parquet 파일을 [[S3]] 기반 데이터 레이크에 로드한다.
4. 결과: 데이터는 클라우드로 안전하게 마이그레이션되었으며, 분석 성능이 최적화된 형식으로 준비되어 [[Athena]] 등의 분석 도구에서 즉시 쿼리할 수 있게 된다.