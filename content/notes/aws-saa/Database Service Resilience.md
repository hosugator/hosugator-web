---
created: 2025-11-21
tags: [aws_saa, database_resilience, rds_multi_az, aurora_global_database, dynamodb_global_table, high_availability, disaster_recovery]
reference:
---
# AWS Database Service Resilience (DB 복원력 기능)
## 정의
AWS가 제공하는 관리형 데이터베이스 서비스 내에 내장된 고가용성(High Availability) 및 재해 복구(Disaster Recovery) 기능으로, 데이터베이스 장애 시 자동으로 복구하거나 교차 리전 장애 조치를 지원하여 비즈니스 연속성을 보장하는 기능
## 요소
### Amazon RDS Multi-AZ Deployments
프라이머리 데이터베이스 인스턴스와 데이터가 동기적으로 복제되는 스탠바이(Standby) 인스턴스를 서로 다른 Availability Zone에 배포하는 구성 요소이다.
### Amazon Aurora Global Database
Primary Region의 쓰기 인스턴스와 최대 5개의 Secondary Region에 있는 읽기 전용 클러스터로 구성되어, 빠르고 낮은 지연 시간의 글로벌 읽기와 교차 리전 재해 복구를 제공하는 구성 요소이다.
### Amazon DynamoDB Global Tables
DynamoDB 테이블을 여러 AWS Region에 걸쳐 Multi-Master 방식으로 자동 복제하여, 리전 장애 시 중단 없는 읽기/쓰기 기능과 내결함성을 제공하는 NoSQL 데이터베이스 구성 요소이다.
## 원리
### RDS Multi-AZ Failover Principle (RDS Multi-AZ 장애 조치 원리)
프라이머리 인스턴스에 장애가 발생할 경우, RDS는 스탠바이 인스턴스로 CNAME을 자동으로 전환하며 장애 조치한다. 데이터는 동기적 복제되어 RPO 손실이 최소화된다.
### Aurora Global Database Replication Principle (Aurora 글로벌 DB 복제 원리)
데이터베이스의 스토리지 계층(Storage Layer)에서 거의 실시간으로 데이터를 비동기적으로 복제한다. Secondary Region으로의 Failover 시 RTO가 일반적으로 1분 미만으로 매우 짧다.
### DynamoDB Global Table Synchronization Principle (DynamoDB 글로벌 테이블 동기화 원리)
데이터는 자동으로 선택된 모든 복제본 Region에 전파되며, 이는 Active/Active DR 전략을 구현하여 리전 장애 발생 시에도 애플리케이션 중단이 발생하지 않는다.
## 특징
### RDS Proxy Integration (RDS 프록시 통합)
RDS Proxy는 Aurora 및 RDS 데이터베이스의 Failover 시간을 최대 66%까지 단축하며, 데이터베이스 연결 풀링 및 공유를 통해 애플리케이션 확장성을 향상한다.
### Low RTO for Aurora (Aurora의 낮은 RTO)
Aurora Global Database는 교차 리전 장애 조치(Cross-Region Failover) 시간이 매우 빨라, 미션 크리티컬 애플리케이션의 낮은 RTO 요구 사항을 충족하는 데 적합하다.
### Fault Tolerance with DynamoDB (DynamoDB의 내결함성)
Global Tables는 Multi-Master 복제 방식 덕분에 리전 장애 시에도 다른 활성(Active) 리전에서 읽기/쓰기 작업이 즉시 가능하여 높은 내결함성을 제공한다.
## 비교
| 구분 | RDS Multi-AZ | Aurora Global Database | DynamoDB Global Tables |
| :--- | :--- | :--- | :--- |
| DB 타입 | Relational (관계형) | Relational (관계형) | NoSQL (Key-Value/Document) |
| HA/DR 방식 | High Availability (HA) | Disaster Recovery (DR) | Fault Tolerance & DR (내결함성 및 DR) |
| 복제 방식 | Synchronous (동기식) | Asynchronous (비동기식) | Asynchronous (비동기식) |
| Failover 시간 | Slower (비교적 느림, 수 분) | Very Fast (매우 빠름, 1분 미만) | Immediate (즉시, Failover 불필요) |
## 예시
### 글로벌 금융 거래 시스템의 Multi-Region DR
1. 아키텍처 구성: Primary Region(예: US-East-1)과 Secondary Region(예: EU-West-1)에 Aurora Global Database를 구성한다.
2. 복제: Primary Region의 쓰기 인스턴스에 기록되는 모든 거래 데이터는 Secondary Region의 읽기 전용 클러스터로 거의 실시간(RPO 수 초 이내)으로 복제된다.
3. 재해 발생: Primary Region에 광범위한 재해가 발생하면, 관리자는 Amazon Route 53을 통해 트래픽을 Secondary Region으로 전환한다.
4. 복구: Secondary Region의 Aurora 클러스터를 Primary 역할로 승격(Promote)하는 작업이 1분 미만의 RTO로 완료된다. 이로써 금융 시스템의 연속성을 보장한다.