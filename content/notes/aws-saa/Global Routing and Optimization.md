---
created: 2025-11-25
tags: [aws_saa, route53, global_accelerator, cloudfront, global_architecture, latency, edge_location, optimization, cdn]
reference:
  - "[[High-Performing and Scalable Network Solutions]]"
---
# Global Routing and Optimization (Route 53, Global Accelerator, CloudFront)
## 정의
AWS의 글로벌 네트워크(Global Network)와 엣지 로케이션(Edge Location)을 활용하여 전 세계 사용자에게 애플리케이션의 지연 시간(Latency)을 최소화하고, 최적의 경로를 제공하며, 캐싱을 통한 성능 최적화를 구현하는 설계 원리
## 원리
### Edge Caching and Performance (엣지 캐싱 및 성능)
[[CloudFront]]는 콘텐츠를 최종 사용자 가까이에 저장(캐싱)함으로써, 원본 서버([[S3]] 또는 [[EC2]])까지 트래픽이 왕복하는 시간과 거리를 줄여 지연 시간을 획기적으로 줄인다.
### Deterministic Routing (결정적 라우팅)
[[Global Accelerator]]는 Anycast IP를 사용하여 트래픽을 사용자와 가장 가까운 엣지 로케이션으로 유입시킨다. 이후 트래픽은 혼잡도가 낮은 AWS의 사설 백본을 통해 전송되어 일관된 성능과 낮은 [[Jitter]]를 보장한다.
### Intelligent Failover (지능적 장애 조치)
[[Route 53]]와 [[Global Accelerator]]는 모두 엔드포인트 상태 확인(Health Check)을 수행한다. 장애가 감지되면 트래픽을 자동으로 다른 리전이나 정상적인 엔드포인트로 리라우팅하여 글로벌 가용성을 높인다.
## 예시
### 글로벌 금융 서비스의 고성능 API
1. 요구 사항: 전 세계 고객에게 낮은 [[Jitter]]와 일관된 지연 시간으로 API 서비스를 제공해야 한다.
2. 솔루션: [[Global Accelerator]]를 사용하여 고객 트래픽을 AWS 백본으로 신속하게 유입시키고, 내부적으로는 [[Route 53]]의 상태 확인을 통해 각 리전의 API 서버로 트래픽을 전달한다.
3. 결과: 공용 인터넷의 혼잡을 피하고, 엔드포인트 장애 시 즉각적인 Failover가 가능하여 99.99% 이상의 가용성을 달성한다.