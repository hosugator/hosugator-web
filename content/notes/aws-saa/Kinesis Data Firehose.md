---
created: 2025-11-14
tags: [aws_saa, kinesis, firehose, delivery, s3, redshift, elasticsearch, nearrealtime]
reference:
  - https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html
---
# Amazon Kinesis Data Firehose
## 정의
스트리밍 데이터를 별도 코드 작성 없이 near-real-time(초 단위)으로 S3, Redshift, Elasticsearch 등에 전달·변환해 주는 완전 관리형 스트림 배달 서비스
## 원리
- 소스 : Kinesis Data Streams, Direct PUT, CloudWatch Logs, IoT Analytics
- [[Buffer]] : 크기(1-128 MB) 또는 시간(60-900초) 조건 만족 시 한꺼번에 대상으로 전송
- [[Transformation]] : 선택적 Lambda 함수로 레코드 변환(압축, 필터, 포맷 변경)
- [[Destination]] : S3, Redshift, Elasticsearch Service, Splunk, HTTP 엔드포인트
## 특징
- 자동 확장·관리 : 샤드, 컨슈머, 오프셋 관리 필요 없음
- 압축·포맷 변환 : GZIP, ZIP, Snappy, JSON→Parquet/ORC 지원
-  near-real-time : 보통 60초 이내 도착, 실시간은 아니지만 준실시간
- 비용 : 전송된 데이터 GB당 요금, Lambda 변환은 별도 과금
## 비교
[[Kinesis Data Streams]] 는 직접 처리·오프셋 관리 필요,  
Firehose는 코드 없이 바로 저장·분석에 적합
## 예시
1. 웹 애플리케이션에서 로그를 Firehose PUT API 로 전송
2. 60초/64MB 버퍼 → Lambda 변환(불필요 필드 제거) → GZIP 압축
3. S3 버킷/year=/month=/day=/hour= 구조로 Parquet 저장 → Athena 직접 쿼리
## 해설
- direct put : 별도 스트림 없이 HTTPS API로 Firehose에 바로 레코드 밀어 넣기  
- redshift : AWS의 대규모 데이터 웨어하우스로 TB~PB급 분석용  
- elasticsearch service : 오픈소스 검색·로그 엔진을 관리형으로 제공하는 Amazon OpenSearch Service의 전신  
- splunk : 상업용 로그·보고·분석 플랫폼, Firehose가 직접 전송 가능  
- gzip : 압축 포맷, 용량 줄여 S3 요금 절감  
- parquet : 컬럼 기반 이진 포맷, 압축률·쿼리 속도 뛰어난 빅데이터 표준  
- orc : 컬럼 기반 이진 포맷, parquet와 유사하며 Hive·Spark에서 널리 쓰임
- 레코드 : Firehose가 전달하는 한 줄(한 건)의 데이터 (JSON, CSV 등)  
- Athena : 서버리스 SQL 쿼리 엔진, S3에 있는 파일을 표처럼 즉시 조회  
- Hive : 데이터 웨어하우스 소프트웨어, SQL-like 문법으로 S3 파일을 테이블처럼 다룸  
- Spark : 대규모 분산 처리 엔진, 메모리 기반으로 빠른 데이터 처리·분석 수행
- 서버리스 : 서버를 직접 만들거나 관리하지 않고 코드나 쿼리만 던지면 AWS가 즉시 실행·종료·청구하는 방식  
- 웨어하우스 : 분석용으로 정리·적재해둔 대량 데이터 저장소, 보고·BI·통계 쿼리에 최적화된 구조