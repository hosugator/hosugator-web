---
created: 2025-11-12
tags: [aws_saa, elastiCache, redis, memcached, inmemory, cache]
reference:
  - https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html
---

# Amazon ElastiCache
## 정의
고성능 인메모리 데이터 저장소로 Redis 또는 Memcached 엔진을 사용해 데이터베이스 및 애플리케이션 지연 시간을 줄이는 관리형 캐싱 서비스

## 엔진 비교
- [[Redis]] : 싱글 스레드, 자체 지속성, 복제, 512MB~500GB, 트랜잭션·Pub/Sub·Lua 스크립트
- [[Memcached]] : 멀티 스레드, 단순 키-값, 1MB 값 제한, 1~20 노드 수평 확장, 재시작 시 데이터 휘발

## 구성 옵션
- 단일 노드 : 개발·테스트용
- Multi-AZ 복제 그룹(Redis) : 자동 장애 조치, 0~5 읽기 복제본
- 클러스터 모드 : 샤딩 지원, 최대 500 shards, 온라인 스케일 아웃

## 특징
- 최대 250K~1M ops/sec, 마이크로초 단위 지연
- 백업·스냅샷, 암호화 전송/휴지, SASL 인증(Redis)
- 파라미터 그룹으로 세부 설정, Scale-up은 10초 내 완료
- CloudWatch 지표, Redis용 MemoryDB보다 저렴한 캐싱 전용