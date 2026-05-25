---
created: 2025-11-20
tags:
  - aws_saa
  - caching
  - elasticache
  - dax
  - latency
  - performance_optimization
  - in_memory
reference:
  - "[[ElastiCache]]"
  - "[[Redis]]"
  - "[[Memcached]]"
---
# Amazon ElastiCache and DAX (Caching Strategy)
## 정의
데이터베이스나 백엔드 서비스의 부하를 줄이고 애플리케이션의 응답 지연 시간을 최소화하기 위해 사용되는 완전 관리형 인 메모리(In-Memory) 데이터 스토어 서비스

## 요소
### Amazon ElastiCache
범용적인 고속 인 메모리 데이터 저장소 서비스이다. Redis 또는 Memcached 엔진을 사용하여 캐싱, 세션 저장소, 메시지 브로커 등으로 활용한다.

### Redis (ElastiCache Engine)
복잡한 데이터 구조(List, Set, Hash 등)를 지원하고, 데이터 영속성(Persistence) 및 복제(Replication) 기능을 제공하는 고성능의 인 메모리 데이터베이스이다.

### Memcached (ElastiCache Engine)
간단하고 스레드 안전한 키-값 저장소로, 대규모 객체 캐싱에 최적화되어 있다. 다중 코어 및 다중 스레딩을 활용하여 성능을 높인다.

### DynamoDB Accelerator (DAX)
DynamoDB를 위한 전용 인 메모리 캐싱 서비스이다. DynamoDB API와 완벽하게 호환되어 마이크로초 단위의 응답 시간을 제공하며, 애플리케이션 코드 변경이 거의 필요 없다.

## 원리
### Cache Hit vs. Cache Miss
- Cache Hit (캐시 적중): 요청한 데이터가 캐시 메모리에 존재하여 데이터베이스에 접근할 필요 없이 즉시 응답하는 경우이다.
- Cache Miss (캐시 미스): 요청한 데이터가 캐시에 없어 데이터베이스에서 데이터를 가져와야 하는 경우이다.

### Lazy Loading Pattern (Cache Aside)
애플리케이션이 데이터를 조회할 때, 먼저 캐시를 확인하고 데이터가 없으면(Cache Miss), 데이터베이스에서 가져와 캐시에 기록한 후 사용자에게 반환하는 캐싱 패턴이다.

### Write Through Pattern (쓰기 통과)
데이터를 기록할 때, 캐시와 데이터베이스에 동시에(또는 순차적으로) 기록하는 패턴이다. 데이터의 캐시-DB 일관성(Consistency)을 유지하는 데 유리하지만, 쓰기 지연 시간이 길어질 수 있다.

## 특징
### Low Latency (낮은 지연 시간)
데이터베이스(SSD/HDD 기반)보다 훨씬 빠른 RAM 기반 인 메모리 액세스를 통해 읽기 작업의 지연 시간을 극적으로 단축한다.

### DB Load Reduction (DB 부하 감소)
대부분의 읽기 트래픽을 캐시가 처리하여 데이터베이스의 CPU 및 IOPS 부하를 크게 줄인다.

### Use Cases (사용 사례)
- 세션 저장소: Redis를 사용하여 사용자 세션 정보를 고속으로 저장 및 관리한다.
- 자주 접근하는 데이터: 웹페이지의 인기 상품 목록, 자주 변경되지 않는 구성 데이터 등을 캐싱한다.
- 리더보드/순위: Redis의 복잡한 데이터 구조(Sorted Sets)를 사용하여 실시간 리더보드를 구현한다.

## 비교
| 구분 | ElastiCache (Redis/Memcached) | DAX |
| :--- | :--- | :--- |
| 적용 대상 | 범용적 (RDS, EC2, Lambda 등 모든 DB/백엔드) | DynamoDB 전용 |
| API 호환성 | 자체 클라이언트 라이브러리 필요 (Redis/Memcached) | DynamoDB API와 완벽 호환 |
| 설계 복잡도 | 높음 (캐싱 정책, 장애 조치 직접 관리) | 낮음 (완전 관리형, 클러스터 생성만 필요) |
| 데이터 모델 | Redis: 다양한 구조, Memcached: 단순 키-값 | 키-값 (DynamoDB 항목) |

## 예시
### Redis를 이용한 세션 저장소 구축
1. 사용자가 웹사이트에 로그인하면, 사용자 ID와 만료 시간을 포함한 세션 정보를 ElastiCache Redis에 저장한다.
2. 모든 후속 웹 요청은 데이터베이스가 아닌 고속의 Redis에서 세션 정보를 조회하여 인증 지연 시간을 최소화한다.
3. Redis의 복제 기능을 사용하여 세션 저장소 자체의 고가용성을 확보한다.