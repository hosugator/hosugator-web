---
created: 2025-11-12
tags: [aws_saa, dynamodb, nosql, partition, rcu, wcu]
reference:
  - https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html
---
# Amazon DynamoDB (NoSQL Database)
## 정의
AWS가 제공하는 모든 규모에서 한 자릿수 밀리초 미만의 낮은 지연 시간 성능을 보장하는 완전 관리형 키-값 및 문서 NoSQL 데이터베이스

## 요소
### Key-Value Store (키-값 저장소)
기본 데이터 모델로, 고유한 기본 키(Primary Key)를 사용하여 항목(Item)을 저장하고 검색한다.

### Partition Key (파티션 키)
데이터가 DynamoDB의 내부 저장소에 수평적으로 분산(Partitioning)되는 기준이 되는 필수 요소이다. 성능과 확장성을 결정하는 핵심 설계 요소이다.

### Global Secondary Index (GSI)
기본 키 외의 속성으로 쿼리를 수행할 수 있도록 지원하는 보조 인덱스이다. 데이터를 다른 파티션 키로 복제하여 유연한 조회를 가능하게 한다.

### DynamoDB Accelerator (DAX)
DynamoDB를 위한 인 메모리 캐시 서비스이다. DynamoDB의 응답 시간을 마이크로초 단위까지 줄여 읽기 성능을 극적으로 향상한다.

## 원리
### Horizontal Scaling (무한 수평 확장)
데이터베이스 인스턴스를 수직 확장하는 대신, 데이터가 저장되는 파티션(Partition)의 개수를 늘려 수평적으로 확장한다. 사용량 증가 시 용량이 자동으로 조정되어, 수천만 TPS(초당 트랜잭션 수)까지 지원한다.

### Serverless Operation (서버리스 운영)
서버를 프로비저닝하거나 패치, 관리할 필요가 없다. 용량은 수요에 따라 자동으로 확장 및 축소되며, 사용자는 온디맨드(On-Demand) 또는 프로비저닝된 용량(Provisioned Capacity) 모델 중 하나를 선택할 수 있다.

### Consistent Performance (일관된 성능)
내부적으로 SSD 기반 스토리지와 빠른 복제 메커니즘을 사용하여 규모에 상관없이 일관된 낮은 지연 시간을 보장한다.

## 특징
### Low Latency at Scale (대규모에서의 낮은 지연 시간)
10ms 미만의 응답 시간을 보장하며, 이는 트래픽이 수백만 건에 달할 때도 유지된다. 대규모의 실시간 웹 서비스, 게임, 광고 기술 워크로드에 필수적이다.

### Flexible Schema (유연한 스키마)
관계형 데이터베이스와 달리 사전에 정의된 스키마가 없으므로, 데이터 구조가 자주 변경되는 애플리케이션이나 문서 기반 데이터에 유연하게 대응한다.

### High Availability and Durability (고가용성 및 내구성)
데이터는 기본적으로 최소 3개의 가용 영역(AZ)에 자동으로 복제되어 저장된다. 이는 99.999999999%의 내구성을 제공한다.

## 비교
| 구분 | DynamoDB (NoSQL) | RDS / Aurora (Relational) |
| :--- | :--- | :--- |
| 데이터 구조 | 비정형(Schemaless), 키-값, 문서 | 정형(Schema-defined), 테이블, 조인 |
| 확장성 | 무제한 Horizontal Scaling (자동 분산) | Vertical Scaling (쓰기), Read Replica (읽기) |
| 지연 시간 | 낮음 (극단적 성능) | 중간 (일반적인 트랜잭션 처리) |
| 적합 워크로드 | 대규모 트래픽, 짧은 지연 시간, 단순 조회 (세션, 장바구니, IoT) | 복잡한 쿼리, 데이터 정합성이 중요한 트랜잭션 (금융, 재고) |

## 예시
### 모바일 게임 리더보드 구축
1. 수백만 명의 사용자가 실시간으로 점수를 업데이트하고 순위를 조회해야 하는 극단적인 쓰기 및 읽기 부하가 발생한다.
2. DynamoDB에 사용자 ID를 기본 키로 사용하여 점수를 저장하고, GSI를 사용하여 점수 순으로 정렬된 리더보드를 효율적으로 조회한다.
3. DynamoDB의 무제한 확장성 덕분에 서비스 중단 없이 모든 규모의 트래픽을 처리하며 낮은 지연 시간을 유지한다.