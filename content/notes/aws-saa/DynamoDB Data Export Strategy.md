---
created: 2026-01-22
tags:
  - aws
  - dynamodb
  - data
  - export
  - strategy
  - rcu
  - s3
  - pitr
  - streams
  - lambda
  - backup
---
# DynamoDB 데이터 추출 전략 (Data Export Strategy)

## 본질 (Essence)
운영 중인 애플리케이션의 성능(RCU)을 보호하면서, 분석이나 백업을 위해 데이터를 외부(S3 등)로 효율적으로 옮기는 전략

## 전략별 비교 (Comparison)

### 1. Export to Amazon S3 (추천: 최소 운영/성능 보존)
- **메커니즘**: **PITR(Point-in-Time Recovery)** 데이터를 활용하여 S3로 직접 전송
- **장점**: 
    - **딸깍 설정**: 코드 작성이 전혀 필요 없음 (Minimal coding)
    - **성능 영향 0**: 운영 테이블의 RCU를 소모하지 않음
- **적합**: 정기적인 전수 조사, 대규모 데이터 백업, 분석용 데이터 추출

### 2. DynamoDB Streams + Lambda (실시간 반응형)
- **메커니즘**: 데이터 변경 시 발생하는 **Stream**을 Lambda가 실시간으로 읽어 S3에 저장
- **장점**: 실시간성이 높음
- **단점**: Lambda 코드 작성이 필요하며, 트래픽 폭주 시 Lambda 호출 비용 및 관리 오버헤드 발생 가능
- **적합**: 실시간 대시보드 업데이트, 증분 데이터(Incremental)의 즉각적인 처리

### 3. Scan API (비추천: 운영 위험)
- **메커니즘**: 테이블 전체를 직접 훑어서 데이터를 가져옴
- **단점**: 운영 테이블의 **RCU를 직접 소모**. 대량 추출 시 실시간 서비스의 Throttling 유발 위험 매우 높음

## 설계 가이드 (Decision Tree)
- 성능 영향 없이 대량의 데이터를 옮기고 싶은가? → **Export to S3 (PITR 활용)**
- 코딩 없이 간편하게 처리하고 싶은가? → **Export to S3**
- 데이터가 바뀔 때마다 즉시 한 건씩 처리해야 하는가? → **DynamoDB Streams**

---
See Also: 
- [[RCU]]
- [[PITR]]
- [[DynamoDB]]