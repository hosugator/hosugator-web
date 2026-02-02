---
created: 2025-11-20
tags:
  - aws_saa
  - database_comparison
  - rds
  - dynamodb
  - redshift
  - aurora
  - nosql
  - relational
reference:
  - "[[RDS]]"
  - "[[Aurora]]"
  - "[[DynamoDB]]"
  - "[[Redshift]]"
  - "[[RDS Proxy]]"
---
# AWS Purpose-Built Database Comparison
## 정의
다양한 워크로드 요구 사항(확장성, 지연 시간, 구조)에 최적화된 여러 종류의 AWS 관리형 데이터베이스 서비스 포트폴리오
## 요소
### Amazon RDS (Relational Database Service)
운영, 백업, 패치 등 복잡한 관리 작업을 자동화하여 관계형 데이터베이스(RDBMS)를 클라우드에서 쉽게 설정, 운영 및 확장하도록 지원하는 서비스이다. (MySQL, PostgreSQL, Oracle, SQL Server 등 포함)
### Amazon Aurora
AWS에서 설계한 클라우드 네이티브 관계형 데이터베이스이다. 표준 MySQL 및 PostgreSQL과 호환되면서도 뛰어난 성능과 고가용성을 제공한다.
### Amazon DynamoDB (NoSQL)
완전 관리형의 키-값(Key-Value) 및 문서(Document) NoSQL 데이터베이스이다. 규모에 상관없이 10밀리초 미만의 낮은 지연 시간 성능을 제공하도록 설계되었다.
### Amazon Redshift
페타바이트 규모의 데이터를 분석할 수 있는 클라우드 데이터 웨어하우스이다. 대량의 구조화된 데이터에 대해 복잡한 분석 쿼리를 빠르게 실행하도록 최적화되어 있다.
## 원리
### 목적별 선택 (Purpose-Built Selection)
단일 데이터베이스 엔진이 모든 데이터 요구 사항을 충족할 수 없다는 전제하에, 워크로드의 특성(트랜잭션, 분석, 키-값 조회 등)에 따라 가장 적합한 DB를 선택하여 성능 효율성과 비용 최적화를 달성한다.
### 확장성 차별화 (Differentiated Scaling)
각 데이터베이스는 워크로드 유형에 맞춰 고유한 방식으로 확장된다. DynamoDB는 [[Horizontal Scaling]]을 기본으로 하며, RDS는 읽기 부하에 대해 Read Replicas를 통한 [[Database Horizontal Scaling]]을, 쓰기 부하에 대해 [[Vertical Scaling]]을 주로 사용한다.
## 특징
### Aurora의 성능 이점
일반적인 RDS(MySQL, PostgreSQL) 대비 최대 5배 더 빠른 성능을 제공하며, Multi-AZ 복제 메커니즘을 사용하고 장애 복구 시간이 매우 빠르다.
### DynamoDB의 규모 및 지연 시간
거의 무한한 수평적 확장이 가능하며, 초당 수백만 건의 요청을 처리하면서도 일관되게 짧은 낮은 지연 시간을 유지한다. 서버리스 모델로 운영된다.
### Redshift의 분석 능력
데이터 분석 및 비즈니스 인텔리전스(BI) 보고서 생성을 위한 대규모 조인 및 집계 쿼리에 최적화되어 있으며, OLTP(온라인 트랜잭션 처리)에는 부적합하다.
## 비교
| 구분 | DynamoDB | RDS / Aurora | Redshift |
| :--- | :--- | :--- | :--- |
| 데이터 모델 | NoSQL (키-값, 문서) | 관계형 (테이블) | 관계형 (컬럼 기반 데이터 웨어하우스) |
| 주요 워크로드 | OLAP 아님 (Online Transaction Processing) | OLTP (Online Transaction Processing) | OLAP (Online Analytical Processing) |
| 확장 방식 | Horizontal Scaling (자동, 무제한) | Read Replicas (읽기 수평), Scale-up (쓰기 수직) | Scale-out (노드 추가), Scale-up (노드 사양 변경) |
| 지연 시간 | 낮음 (10ms 미만 보장) | 중간 (인스턴스 사양에 따라 다름) | 높음 (복잡한 쿼리 처리) |
| 비용 모델 | 서버리스, 사용량 기반 | 인스턴스 시간당 요금 | 노드 시간당 요금 |
## 예시
### 마이크로서비스 데이터 저장소 선택
1. 사용자 세션 및 장바구니: 매우 빠른 조회와 높은 확장성이 필요하므로 DynamoDB를 사용한다.
2. 거래 기록 및 회계 데이터: 데이터 정합성 및 복잡한 조인 관계가 필수적이므로 Amazon Aurora를 사용한다.
3. 지난 1년간의 고객 행동 분석: 대량의 데이터를 수집하고 복잡한 보고서를 생성하기 위해 Amazon Redshift를 사용한다.