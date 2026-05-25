---
created: 2025-11-26
tags: [aws_saa, cost_optimization, database, rds, aurora_serverless, dynamodb, license_optimization, caching, purpose_built_db]
reference:
  - "[[Cost-Optimized Architectural Design]]"
---
# Cost-Optimized Database Solutions (비용이 최적화된 데이터베이스 솔루션 설계)
## 정의
워크로드의 성능 · 확장성 · 가용성 요구 사항을 충족하는 최적의 목적별 데이터 스토어를 선택하고, 라이선스 · 유휴 컴퓨팅 · 스토리지 비용을 최소화하는 설계 전략
## 핵심 원칙
- Purpose-Built Data Stores (목적별 데이터 스토어): 모든 데이터를 단일 시스템에 보관하는 대신, 트랜잭션에는 [[RDS]], 데이터 웨어하우스에는 [[Redshift]], 대규모 저지연 NoSQL에는 [[DynamoDB]]를 사용하는 방식.
- Managed Services First: 서버 관리, 패치, 복제 등의 운영 부담을 AWS 관리형 서비스에 맡겨 TCO(총 소유 비용)를 절감.
## 요소
- Engine Selection: 고가의 상용 DB(Oracle, MS SQL) 대신 오픈 소스 DB 또는 라이선스 비용이 없는 [[Amazon Aurora]] 선택.
- Serverless Options: 간헐적이거나 예측 불가능한 워크로드에 [[Aurora Serverless]] 또는 DynamoDB On-Demand를 사용하여 유휴 컴퓨팅 비용 제거.
- Purchasing Options: 장기적으로 안정적인 관계형 DB 인스턴스 비용을 절감하는 모델.
- Read Scaling: DB 인스턴스 확장을 대체하거나 보완하는 읽기 전용 복제본 및 [[ElastiCache]]를 이용한 캐싱 계층.
## 원리
### License and Engine Optimization (라이선스 및 엔진 최적화 원리)
상용 데이터베이스 라이선스 비용을 회피하고 성능 요구 사항을 충족하는 가장 비용 효율적인 엔진(예: Amazon Aurora PostgreSQL/MySQL 호환)으로 전환하는 전략.
### Scaling Optimization (확장 최적화 원리)
성능 문제가 발생할 때, 비용이 증가하는 수직적 확장(Scale Up) 대신 읽기 전용 복제본 추가 또는 캐싱 도입을 통한 수평적 확장(Scale Out)으로 읽기 부하를 분산하는 원칙.
### Data Migration and Tiering (데이터 마이그레이션 및 계층화)
- 대용량 객체 또는 미디어 파일을 관계형 DB에서 [[S3]]로 오프로드.
- 고속 쓰기 · 스키마리스 · 최종 일관성이 허용되는 데이터의 하위 집합을 DynamoDB와 같은 NoSQL 스토어로 마이그레이션하여 성능 향상 및 비용 절감.
## 특징
### Serverless Database (서버리스 데이터베이스)
Aurora Serverless v2는 용량을 매우 세밀하고 즉각적(Fine-Grained)으로 조정하여, 피크 타임 이후에도 불필요하게 높은 용량을 유지할 필요가 없어 비용 효율적이다.
### Storage and Snapshot Management (스토리지 및 스냅샷 관리)
- [[RDS Storage Auto Scaling]]을 사용하여 스토리지 용량을 적정하게 조정하고 과도한 프로비저닝 방지.
- RPO 요구 사항을 충족하도록 백업 계획을 설계하되, 유용한 수명을 초과하는 불필요한 스냅샷을 주기적으로 삭제하는 보존 정책.
- 비용 최적화를 위해 가용성이 덜 중요한 환경에서는 Multi-AZ 대신 Single-AZ 배포 선택.
## 하위 학습 주제 (Sub-Topics)
이 주제를 완전히 이해하기 위해 다음 순서로 원자성 노트를 작성합니다.
1.  [[Database Purchasing Options]] (DB 구매 옵션)
2.  [[Serverless Database Cost Benefits]] (서버리스 데이터베이스 비용 이점)
3.  [[Database Engine Selection and Optimization]] (DB 엔진 선택 및 최적화)