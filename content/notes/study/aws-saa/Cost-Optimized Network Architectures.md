---
created: 2025-11-26
tags: [aws_saa, cost_optimization, network, data_transfer, hybrid_networking, cloudfront, vpn, direct_connect]
reference:
  - "[[Cost-Optimized Architectural Design]]"
---
# Cost-Optimized Network Architecture (비용이 최적화된 네트워크 아키텍처 설계)
## 정의
네트워크 리소스의 효율적인 사용을 목표로, Data Transfer · 네트워킹 서비스 요금을 최소화하는 방식으로 AWS · 온프레미스 연결 및 리전 · AZ 간 트래픽 흐름을 설계하는 전략
## 핵심 원칙
- Data Transfer Minimization (데이터 전송 최소화): 리전 경계 및 인터넷으로 나가는 데이터 전송(Egress) 비용이 높다는 점을 인지하고, VPC 엔드포인트 · AZ 지역성 확보 · 캐싱 전략을 통해 전송량을 줄이는 전략
- Cost-Effective Connectivity (비용 효율적 연결): 전용선 연결(Direct Connect) 대신 VPN 연결과 같이 처리량과 보안 요구 사항에 맞는 최저 비용의 연결 옵션 선택
## 요소
- AZ Locality: 가용 영역(AZ) 경계를 넘는 데이터 전송 요금을 피하기 위해 로컬 AZ의 리소스를 우선 사용하는 전략.
- VPC Endpoint Gateway: 동일 리전 내에서 [[S3]] 및 [[DynamoDB]]와 통신할 때 데이터 전송 요금 없이 프라이빗 연결을 제공하는 서비스.
- CloudFront Caching: [[CloudFront]]를 사용하여 [[S3]] 외부로 나가는 데이터 전송량을 줄이고, AWS 오리진에서 엣지 로케이션으로의 데이터 전송 요금 면제를 활용하는 전략.
- Network Service Right-Sizing: NAT Gateway · [[Transit Gateway]] · API Gateway와 같은 네트워킹 서비스의 구성을 워크로드에 맞게 최적화.
## 원리
### Cost-Driven Connection Selection (비용 기반 연결 선택 원리)
고비용의 전용선 솔루션([[Direct Connect]])이 필수적이지 않다면, AWS Site-to-Site [[Site-to-Site VPN]]과 같은 저비용 암호화 연결 옵션을 우선 고려하여 비용을 최적화.
### Scaling and Throttling (확장 및 제한 원리)
[[API Gateway]]의 사용량 계획 및 API 키를 통해 고객별 트랜잭션 수 및 속도를 제어(Throttling)하여 서비스 인프라에 불필요한 부하가 걸리는 것을 방지하고, 리소스 비용을 통제.
## 하위 학습 주제 (Sub-Topics)
이 주제를 완전히 이해하기 위해 다음 순서로 원자성 노트를 작성합니다.
1.  [[Hybrid Network Connectivity Cost Optimization]] (하이브리드 네트워크 연결 비용 최적화)
2.  [[Inter-VPC and Inter-Region Data Transfer Cost Minimization]] (VPC 간 및 리전 간 데이터 전송 비용 최소화)
3.  [[Network Service Configuration Cost Optimization]] (네트워크 서비스 구성 비용 최적화)
4.  [[Content Delivery Network (CDN) Optimization]] (콘텐츠 전송 네트워크(CDN) 최적화)