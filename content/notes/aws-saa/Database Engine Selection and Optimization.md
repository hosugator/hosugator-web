---
created: 2025-11-26
tags: [aws_saa, cost_optimization, database, engine_selection, nosql, relational, license_optimization, purpose_built_db]
reference:
  - "[[Cost-Optimized Database Solutions]]"
---
# Database Engine Selection and Optimization (DB 엔진 선택 및 최적화)
## 정의
데이터의 특성(스키마 유연성, 트랜잭션 복잡성)과 액세스 패턴에 기초하여 관계형(Relational), NoSQL, 또는 객체 스토어 중 가장 적합하고 라이선스 비용이 낮은 엔진을 선택하는 비용 최적화 설계 전략
## 요소
- Purpose-Built Databases (목적별 DB): 트랜잭션, 데이터 웨어하우징, NoSQL, 그래프 등 워크로드에 특화된 DB 서비스(예: [[RDS]], [[Redshift]], [[DynamoDB]])의 활용.
- Engine Choice: 고가의 상용 DB(Oracle, MS SQL) 대신 오픈 소스 DB(PostgreSQL, MySQL) 또는 [[Aurora]] 선택.
- Data Migration Target: 관계형 DB의 데이터를 [[S3]] (대용량 객체)나 [[DynamoDB]] (NoSQL 데이터)로 오프로드하는 전략.
## 원리
### Purpose-Built Optimization (목적별 최적화 원리)
모든 데이터를 단일 관계형 DB에 저장하여 성능 저하와 비용 증가를 초래하는 것을 방지하고, 데이터 액세스 패턴 및 스키마 요구 사항에 맞는 최적의 전문 데이터 스토어를 사용하여 비용 효율적인 성능을 달성하는 원칙.
### License Cost Reduction (라이선스 비용 절감 원리)
고가 라이선스가 필요한 상용 DB 엔진의 사용을 지양하고, 라이선스가 없는 AWS 관리형 엔진(예: [[Aurora]] PostgreSQL/MySQL 호환)으로 마이그레이션하여 총 소유 비용(TCO)을 절감하는 전략.
## 특징
### NoSQL Data Suitability (NoSQL 데이터 적합성)
[[DynamoDB]]와 같은 NoSQL 스토어는 고속 쓰기, 가변적인 필드 수(스키마리스), 개별 레코드 독립적 기록, 최종 일관성이 허용되는 데이터에 적합하며, 대규모에서 10밀리초 미만의 저지연을 제공.
### Performance Offloading (성능 오프로딩)
DB 인스턴스의 크기 증가(Scale Up) 없이 읽기 전용 복제본 추가 또는 [[ElastiCache]]를 사용하여 읽기 요청 부하를 흡수하고, 비용을 최적화하면서 성능 요구 사항을 충족하는 방법.
### Snapshot Retention (스냅샷 보존 관리)
RPO(복구 목표 시점) 요구 사항을 충족하는 백업 빈도를 유지하되, 유효 수명이 만료된 스냅샷을 삭제하도록 보존 정책을 설계하여 스토리지 비용을 최소화.