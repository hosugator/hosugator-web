---
created: 2025-11-25
tags:
  - aws_saa
  - database
  - high_performance
  - rds
  - aurora
  - dynamodb
  - elasticache
  - dax
reference:
---
# High-Performing Database Solution Decision (고성능 데이터베이스 솔루션 결정)
## 정의
애플리케이션의 가용성, 일관성, 확장성, 지연 시간 및 쿼리 기능 요구 사항을 충족하기 위해 AWS의 목적별 데이터베이스 엔진 중에서 최적의 솔루션을 구성하고 구현하는 활동
## 요소
### Purpose-Built Databases (목적별 데이터베이스)
AWS는 단일 엔진이 아닌 다양한 데이터 유형에 최적화된 엔진을 제공한다.
- 관계형: Amazon [[RDS]] (MySQL, PostgreSQL 등), Amazon [[Aurora]]
- 키-값/문서: Amazon [[DynamoDB]]
- 인 메모리: Amazon [[ElastiCache]] (Redis, Memcached)
- 기타: 그래프, 시계열, 원장 데이터베이스 등
### Performance Factors (성능 결정 요소)
- 가용성 (Availability) 및 내구성 (Durability)
- 일관성 (Consistency) 및 지연 시간 (Latency)
- 확장성 (Scalability) 및 쿼리 기능 (Query capability)
- 파티션 내결함성 (Partition Tolerance)
### Read/Write Separation (읽기/쓰기 분리)
대부분의 트래픽이 읽기(Read) 작업에서 발생하는 경우, 읽기 전용 복제본(Read Replica)을 구성하여 읽기 워크로드를 분산함으로써 기본 인스턴스(Primary Instance)의 부하를 줄이고 성능을 극대화한다.
## 하위 학습 주제 (Sub-Topics)
1.  Purpose-Built Databases and Selection Criteria (목적별 DB 및 선택 기준)
2.  RDS vs. Aurora Architecture and Scaling (RDS vs. Aurora 아키텍처 및 확장)
3.  Database Caching Solutions (ElastiCache, DAX)
4.  Connection Management and Optimization (RDS Proxy)
5.  Aurora Serverless and Storage Auto Scaling