---
created: 2025-11-26
tags: [aws_saa, cost_optimization, network, cdn, cloudfront, s3, data_transfer, caching, edge_location]
reference:
  - "[[Cost-Optimized Network Architecture]]"
---
# Content Delivery Network (CDN) Optimization (콘텐츠 전송 네트워크(CDN) 최적화)
## 정의
[[CloudFront]]와 같은 콘텐츠 전송 네트워크(CDN)를 활용하여 사용자에게 가장 가까운 엣지 로케이션(Edge Location)에서 콘텐츠를 제공함으로써, 오리진(Origin)으로의 요청 및 오리진에서 외부로 나가는 데이터 전송 비용을 획기적으로 절감하는 전략
## 요소
- [[CloudFront]]: AWS의 CDN 서비스로, 전 세계 엣지 로케이션에 콘텐츠를 캐싱하여 최종 사용자에게 빠르게 전달.
- Caching Strategy: [[S3]]나 [[EC2]] 오리진으로부터 데이터가 전송되는 횟수를 줄이기 위해 효과적인 캐싱 정책(TTL, 캐시 키 등) 구현.
- Origin Shield: 오리진 서버의 부하와 운영 비용을 줄이기 위해 추가 비용 없이 제공되는 중간 계층 캐시.
## 원리
### Data Egress Cost Reduction (데이터 송신 비용 절감 원리)
AWS 오리진(예: [[S3]], [[EC2]], [[ELB]])에서 CloudFront 엣지 로케이션으로 전송되는 데이터에 대해서는 데이터 전송 요금이 면제된다. 따라서 CloudFront를 사용하면 외부 사용자에게 직접 데이터를 제공할 때 발생하는 높은 인터넷 송신 비용(Internet Egress)을 CDN 요금으로 대체하여 비용을 최적화한다.
### Origin Offloading (오리진 부하 분산 원리)
대부분의 사용자 요청을 엣지 로케이션의 캐시가 처리하면서, 오리진 서버(예: [[EC2]] 또는 DB)로 도달하는 요청 수가 줄어든다. 이는 컴퓨팅 집약적인 오리진의 운영 부담을 줄여 다운사이징 가능성을 높이고 컴퓨팅 비용을 절감한다.
## 특징
### Regional Edge Cache (리전 엣지 캐시)
CloudFront는 엣지 로케이션보다 중앙에 위치한 리전 엣지 캐시를 추가 비용 없이 제공하여, 엣지 캐시에 없는 데이터를 오리진까지 요청하기 전에 한 번 더 캐싱하여 오리진 운영 부담을 줄인다.
### API Call Reduction (API 호출 감소)
[[S3]]를 오리진으로 사용할 경우, CloudFront의 캐싱은 S3로의 API 호출 횟수를 줄여 S3의 `GET` 요청 요금을 낮추는 효과가 있다.
## 예시
### 자주 접근하는 S3 콘텐츠 배포
1. 문제: [[S3]]에 저장된 이미지 파일이 전 세계 사용자에게 자주 제공되어 높은 S3 아웃바운드 데이터 전송 비용 발생.
2. 솔루션: CloudFront 배포를 [[S3]] 버킷 전면에 배치.
3. 결과: 사용자 요청의 95% 이상을 엣지 캐시에서 처리하여 S3 외부 데이터 전송 요금을 대폭 절감하고, 사용자 응답 속도를 향상.