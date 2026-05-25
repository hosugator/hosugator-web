---
created: 2025-11-12
tags: [aws_saa, cloudfront, elasticache, caching, difference, usecase]
reference:
  - https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cache-behavior-settings.html
  - https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Strategies.html
---
# CloudFront vs ElastiCache 차이
## 캐싱 위치
- CloudFront : 전 세계 400+ 엣지 로케이션, 최종 사용자 근처
- ElastiCache : 단일 리전 내 AZ별 인메모리 클러스터, 애플리케이션 근처
## 캐싱 대상
- CloudFront : HTTP/HTTPS 정적·동적 콘텐츠(CSS, JS, API 응답, 스트림)
- ElastiCache : 애플리케이션 메모리 데이터베이스 조회 결과, 세션, 카운터 등 임의 객체
## 프로토콜 계층
- CloudFront : Layer 7 CDN, DNS 기반 라우팅
- ElastiCache : Layer 7 인메모리 키-값 저장소(Redis, Memcached)
## 지속성·용량
- CloudFront : 디스크 캐시, 객체당 최대 40GB, TTL 0초~1년
- ElastiCache : RAM 캐시, Redis 500GB, 수백만 초당 OPS, TTL 제한 없음
## 장애 범위
- CloudFront : 엣지 장애 시 자동 인근 엣지 히트
- ElastiCache : 노드 장애 시 복제본 장애 조치 또는 캐시 미스 발생
## 대표 사용 패턴
- CloudFront : 웹 사이트 정적 asset, 글로벌 API 가속, 소프트웨어 다운로드
- ElastiCache : 데이터베이스 부하 경감, 실시간 순위표, 세션 저장소, Pub/Sub
## 요약
CloudFront는 **최종 사용자에게 가까운 네트워크 캐싱**,  
ElastiCache는 **애플리케이션 뒤의 인메모리 데이터 캐싱**으로 목적이 다름