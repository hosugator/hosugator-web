---
created: 2025-11-26
tags: [aws_saa, rds, purchasing_options, cost_optimization, reserved_instance, on_demand, aurora_serverless, dynamodb_billing]
reference:
  - "[[Cost-Optimized Database Solutions]]"
---
# Database Purchasing Options (DB 구매 옵션)
## 정의
관계형 · NoSQL 데이터베이스의 워크로드 지속성과 예측 가능성에 따라 온디맨드 · 예약 인스턴스 · 서버리스 · 용량 프로비저닝 모델 중 비용 최적 선택 전략
## 요소
- 온디맨드 (On-Demand): 최소 약정 없이 DB 인스턴스 실행 시간에 대해 시간당 요금을 지불하는 모델.
- [[RDS Reserved Instances]] (RI): 1년 또는 3년 약정으로 온디맨드 요금 대비 상당한 할인을 제공하는 모델.
- [[Aurora Serverless]]: 유휴 시 자동으로 용량이 축소되거나 0이 되어, 실제 사용량에 대해서만 비용을 지불하는 모델.
- [[DynamoDB On-Demand]]: 읽기/쓰기 용량을 사전에 지정하지 않고, 사용된 처리량에 대해서만 비용을 지불하는 모델.
- [[DynamoDB Provisioned Capacity]]: 읽기/쓰기 용량을 사전에 예측하여 할당하고, 해당 용량에 대해 낮은 비용으로 약정하는 모델.
## 원리
### Commitment-Discount Trade-off (약정-할인 트레이드오프 원리)
워크로드의 지속 기간과 예측 가능성이 높을수록(장기 약정) DB 인스턴스의 단위 시간당 비용은 낮아지지만, 유연성은 감소하는 원리.
- 안정적/장기 (최고 할인) $\to$ RDS RI / DynamoDB Provisioned Capacity
- 간헐적/비예측적 (최고 유연성) $\to$ Aurora Serverless / DynamoDB On-Demand
### Serverless vs. Provisioned (서버리스 대 프로비저닝 원리)
워크로드가 간헐적이거나 수요 변화가 극심한 경우 서버리스/On-Demand를 선택하여 유휴 비용을 제거하고, 워크로드가 꾸준히 높은 상태를 유지하는 경우 RI/Provisioned Capacity를 선택하여 기본 요율을 낮추는 원칙.
### Reserved Instance (RI)의 적용
[[EC2]]와 달리 [[RDS Reserved Instances]]는 가용 영역(AZ)에 종속되지 않고 리전(Region)에만 종속되므로 유연성이 높다.
### DynamoDB의 유연성
[[DynamoDB]]는 Provisioned Capacity와 On-Demand Capacity를 테이블당 언제든지 전환할 수 있어, 워크로드 패턴 변화에 따른 비용 최적화가 유연하다.
## 예시
### 비용 효율적인 개발/테스트 DB 선택
1. 요구 사항: 개발팀이 업무 시간에만 사용하고, 야간이나 주말에는 거의 사용하지 않는 관계형 데이터베이스.
2. 솔루션 선택: [[Aurora Serverless]] 클러스터.
3. 결과: 사용하지 않는 시간에는 컴퓨팅 용량이 자동으로 최소치(또는 0)로 축소되어 EC2나 RDS On-Demand 인스턴스를 24시간 켜두는 것에 비해 비용이 획기적으로 절감된다.