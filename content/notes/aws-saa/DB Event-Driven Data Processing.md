---
created: 2026-01-21
tags:
  - aws
  - db
  - event_driven
  - dynamodb
  - rds
  - streams
  - das
  - lambda
  - sns
---
# 이벤트 기반 DB 데이터 처리 (Event-Driven Data Processing)

## 본질 (Essence)
데이터의 변경을 트리거로 삼아 후속 로직(알림, 분석, 동기화)을 비동기 실행하여, 원본 앱의 성능을 보존하고 시스템 간 결합도를 낮추는 설계

## 서비스별 메커니즘 비교 (Comparison)

### DynamoDB (Native & Seamless)
- **도구**: DynamoDB Streams
- **방식**: 비동기 로그 추출 (Push 방식)
- **특징**: 
    - O(1)의 빠른 쓰기 성능에 전혀 영향을 주지 않는 완전 독립된 비동기 통로
    - 설정이 매우 간단하며, Lambda/SNS와 연동하여 무한한 'Fan-out(다중 전파)' 가능
- **적합**: 실시간 다중 알림, 마이크로서비스 간 데이터 동기화.

### RDS (Structured & Managed)
- **도구**: Database Activity Streams(DAS) 또는 Stored Procedure + Lambda
- **방식**: DB 엔진 로그 모니터링 또는 트리거 기반 호출
- **특징**: 
    - 정합성(Consistency)이 중요한 트랜잭션 환경에서 변경 이력을 추적.
    - DynamoDB에 비해 설정이 복잡할 수 있으나, 정교한 SQL 데이터 변화를 감지
- **적합**: 보안 감사, 관계형 데이터 기반의 복잡한 비즈니스 로직 트리거

## 설계 핵심 전략 (Key Strategy)
- **비동기성(Asynchrony)**: "데이터 저장"과 "후속 처리"를 분리하여 사용자 응답 속도를 극대화
- **단일 접점 관리**: DB에서 나온 하나의 스트림을 SNS/EventBridge 등 '허브'에 연결하여 관리 포인트를 최소화

## 비유 (Analogy)
- **DynamoDB 방식**: 고속도로 옆에 자동으로 찍히는 CCTV. 차들은 멈출 필요 없이 달리고, 사고(이벤트)가 나면 관제 센터에서 보고를 받음.
- **RDS 방식**: 톨게이트 영수증 수거함. 모든 차가 영수증을 남기며, 필요 시 이 수거함을 분석하거나 특정 차량 통과 시 알람을 울림.

---
See Also: 
- 