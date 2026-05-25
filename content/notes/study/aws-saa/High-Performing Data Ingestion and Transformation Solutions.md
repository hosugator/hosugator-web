---
created: 2025-11-25
tags:
  - aws_saa
  - data_ingestion
  - etl
  - streaming
  - batch
  - data_lake
  - kinesis
  - glue
  - emr
  - performance
reference:
  - "[[Streaming Data Ingestion]]"
  - "[[Batch ETL and Transformation Solutions]]"
  - "[[Comparison - Kinesis Data Streams vs Kinesis Data Firehose]]"
  - "[[Data Lake Architecture and Analysis]]"
  - "[[Data Lake Security and Governance]]"
---
# High-Performing Data Ingestion and Transformation Solutions (고성능 데이터 수집 및 변환 솔루션)
## 정의
소스 시스템에서 AWS로 데이터를 수집·큐레이션·준비하는 프로세스에서 성능·지연 시간·규모·보안·거버넌스 요구 사항을 충족하는 최적의 솔루션을 선택하는 설계 원칙

## 요소
### Ingestion Services (수집 서비스)
- 스트리밍: [[Kinesis Data Streams]] · [[Kinesis Data Firehose]] · [[MSK]]
- 배치/대용량: [[DataSync]] · [[Snow Family]] · [[Direct Connect]] · [[DMS]]
### Transformation Services (변환 서비스)
- [[ETL]]: [[Glue]] · [[EMR]].
- 실시간: [[Kinesis Data Analytics]].
### Storage and Analysis (스토리지 및 분석)
- 데이터 레이크: [[S3]].
- 분석/쿼리: [[Athena]] · [[QuickSight]].

## 원리
### Ingestion Pattern Matching (수집 패턴 일치 원리)
솔루션은 데이터의 형식(정형/비정형) · 수집 속도(배치/스트리밍) · 지연 시간 요구 사항에 따라 선택되어야 한다.
- 실시간: [[Kinesis]] 또는 MSK를 통해 수집·처리 및 분석.
- 대규모 배치: S3에 저장 후 Glue 또는 EMR을 사용하여 변환.
### Homogeneous vs Heterogeneous (동종 vs 이종 수집)
- 동종 수집: 소스와 동일 형식/엔진으로 대상 이동. 전송 속도 · 데이터 무결성 · 지속적인 수집 자동화에 초점을 맞춘다.
- 이종 수집: 대상 요구 사항 또는 [[기계 학습]]을 위해 데이터 유형이나 형식을 변경하는 변환 작업이 필수적이다.
### Performance Optimization (성능 최적화)
S3 기반 데이터 레이크의 경우, EMR 및 Glue를 사용할 때 Parquet과 같은 칼럼형(Columnar) 형식으로 데이터를 변환하고, 동시 S3 요청 수 · 재시도 전략 등을 조정하여 대규모 분산 처리 성능을 극대화한다.
### Data Lake Core Value (데이터 레이크의 핵심 가치)
데이터 레이크(S3)는 네이티브 형식에 관계없이 모든 데이터 자산에 대한 중앙 집중식 리포지토리로서, 빠른 수집 · 데이터 중복 제거 · 중앙 집중식 거버넌스 및 관리를 가능하게 한다.
### Security and Governance (보안 및 거버넌스)
데이터 레이크의 보안은 S3 버킷 정책 · [[IAM]] 사용자 정책 · [[KMS]] 암호화 키 관리 · 태깅 등을 사용하여 구현된다.

## 하위 학습 주제 (Sub-Topics)

- Streaming Data Ingestion (Kinesis Family, MSK)
- Comparison - Kinesis Data Streams vs Kinesis Data Firehose
- Batch ETL and Transformation Solutions (Glue, EMR, Lake Formation)
- Data Lake Architecture and Analysis (S3, Athena, QuickSight)
- Data Lake Security and Governance (KMS, IAM, S3 Policies)