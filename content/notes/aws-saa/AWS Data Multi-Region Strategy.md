---
created: 2026-01-28
tags:
  - aws
  - multi-region
  - data
  - strategy
---
# AWS Data Multi-Region Strategy

## 본질 (Essence)
리전 장애 시에도 데이터 유실을 최소화(RPO)하고, 전 세계 사용자에게 물리적 거리의 제약이 없는 데이터 접근성을 제공하는 전략

## 구조 (Mechanism)
### 1. 관계형 데이터 (Structured / SQL)
- **Amazon Aurora Global Database**: 
    - 주 리전(Write)에서 보조 리전(Read-only)으로 밀리초 단위 복제.
    - 장애 시 보조 리전을 즉시 쓰기 가능 상태로 승격(Promote).
- **RDS Cross-Region Read Replicas**: 
    - 비동기 복제 방식. 재해 복구(DR) 및 읽기 부하 분산용.

### 2. 비관계형 데이터 (NoSQL / Key-Value)
- **DynamoDB Global Tables**: 
    - **Active-Active** 구성. 모든 리전에서 동시에 읽기/쓰기 가능.
    - 가장 낮은 지연 시간과 높은 가용성 제공 (Multi-master).

### 3. 비정형 및 파일 데이터 (Unstructured / File)
- **S3 Cross-Region Replication (CRR)**: 
    - 객체 단위 자동 복제. 버전 관리(Versioning) 활성화 필수.
- **EFS Replication**: 
    - 지역 간 파일 시스템 자동 동기화. 관리형 서비스로 설정 간소화.
- **EBS Snapshot Copy**: 
    - **수동/비동기**. 리전 간 직접 동기화가 불가하므로 스냅샷 전송 후 볼륨 재생성.

### 4. 캐싱 데이터 (In-Memory / Delivery)
- **CloudFront**: 전 세계 엣지에 정적/동적 데이터 캐싱.
- **ElastiCache**: 글로벌 복제 그룹(Global Datastore)을 통해 리전 간 Redis 데이터 동기화 지원.

## 확장 (Connection)
- **연결**: 
    - **실시간 비즈니스 데이터**는 DynamoDB Global Tables.
    - **대규모 트랜잭션 데이터**는 Aurora Global Database.
    - **정적 자산 및 백업**은 S3 CRR.
- **응용**: 비용 효율을 고려할 때, 모든 데이터를 실시간 복제하기보다 데이터의 중요도와 RPO(복구 지점 목표)에 따라 위 계층 중 적절한 솔루션을 혼합 설계.

---
See Also: 
- 