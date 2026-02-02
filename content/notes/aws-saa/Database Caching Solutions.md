---
created: 2025-11-25
tags:
  - aws_saa
  - elasticache
  - dax
  - caching
  - performance
  - low_latency
  - redis
  - memcached
  - dynamodb
reference:
  - "[[High-Performing Database Solutions]]"
---
# Database Caching Solutions (데이터베이스 캐싱 솔루션)
## 정의
데이터베이스의 부하를 줄이고 애플리케이션의 응답 시간(Latency)을 마이크로초 단위로 단축하기 위해, 데이터베이스 앞에 인 메모리(In-Memory) 데이터 스토어를 배치하여 자주 액세스하는 데이터를 임시로 저장하는 설계 패턴
## 요소
### ElastiCache
Redis 및 Memcached라는 두 가지 캐싱 엔진을 지원하는 관리형 인 메모리 캐시 서비스이다.
- Redis: 복잡한 데이터 구조(Set, Sorted Set, List), 영속성(Persistence), 클러스터링 및 보안(Encryption) 기능이 필요할 때 사용한다.
- Memcached: 멀티 스레딩, 단순성 및 대용량 캐시 객체 저장에 적합하다.
### DynamoDB Accelerator (DAX)
[[DynamoDB]]에 최적화된 인 메모리 캐시 서비스이다.
- 자동 통합: 애플리케이션 코드를 최소한으로 변경하거나 변경 없이 [[DynamoDB]] API 호출을 가로채 캐싱을 처리한다.
- 캐시 단위: 항목(Item) 및 쿼리(Query) 결과를 캐시한다.
## 원리
### Cache Hit Ratio (캐시 적중률)
애플리케이션이 데이터를 요청했을 때 데이터베이스에 도달하기 전에 캐시에서 데이터를 찾는 비율이다. 캐시 적중률을 높이는 것이 DB 부하 감소 및 성능 향상의 핵심 원리이다.
### Read Through vs Write Through (캐싱 전략)
- Lazy Loading (지연 로딩): 읽기 요청 시 데이터가 캐시에 없으면(Miss), DB에서 가져와 캐시에 저장한다. 읽기 성능을 우선하지만, 오래된 데이터(Stale Data) 문제가 발생할 수 있다. (가장 흔함)
- Write Through (쓰기 통과): 쓰기 요청 시 DB와 캐시에 동시에 데이터를 쓴다. 데이터 일관성을 높이지만, 쓰기 지연 시간이 약간 증가할 수 있다.
## 특징
### Low Latency (낮은 지연 시간)
ElastiCache와 DAX 모두 데이터를 메모리에 저장하므로, 디스크 기반의 데이터베이스보다 10배 이상 빠른, 마이크로초 단위의 응답 시간을 제공한다.
### Decoupling and Scale (데이터베이스 부하 감소)
캐싱 솔루션은 데이터베이스로 향하는 읽기 트래픽의 상당 부분을 흡수하여 [[RDS]] 또는 [[DynamoDB]]의 처리량(Throughput)을 늘리고, 컴퓨팅 및 I/O 리소스에 대한 스트레스를 줄인다.
### Service Specificity (서비스 특수성)
- ElastiCache: 범용 캐싱 솔루션으로 [[RDS]], [[EC2]] 기반 DB 등 다양한 소스에 대해 사용할 수 있다.
- DAX: 오직 [[DynamoDB]]를 위한 솔루션이며, 마이크로초 단위의 일관된 성능을 제공하며 운영 부담이 가장 적다.
## 예시
### ElastiCache를 사용한 세션 관리
1. 요구 사항: 웹 애플리케이션의 사용자 세션 상태를 저장하여 로그인을 유지해야 한다.
2. 솔루션: ElastiCache (Redis)를 사용하여 세션 데이터를 저장한다.
3. 결과: 사용자 요청 시 DB를 조회하지 않고 메모리에서 세션 정보를 빠르게 검색하여 인증 및 요청 처리 속도를 획기적으로 향상시킨다.