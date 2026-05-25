---
created: 2025-11-26
tags: [aws_saa, network, hybrid_networking, direct_connect, vpn, cost_optimization, high_availability]
reference:
  - "[[Cost-Optimized Network Architecture]]"
---
# Hybrid Network Connectivity Cost Optimization (하이브리드 네트워크 연결 비용 최적화)
## 정의
온프레미스 환경과 AWS 리소스 간의 연결 시, 요구되는 처리량 · 보안 · 가용성 수준에 따라 비용 효율적인 솔루션을 설계하는 전략
## 요소
- [[Site-to-Site VPN]]: 공용 인터넷을 통한 암호화된 터널링을 사용하여 원격 사무실이나 온프레미스와 [[VPC]]를 연결하는 비용 효율적인 옵션.
- [[Direct Connect]] (DX): AWS와 온프레미스 환경 간의 전용 프라이빗 네트워크 연결을 설정하여 일관된 고대역폭과 낮은 지연 시간을 제공하는 옵션.
- Dual Connection Strategy: 고가용성(High Availability) 확보를 위해 비용이 더 드는 두 번째 DX 연결 대신 DX + Site-to-Site VPN 조합을 사용하는 전략.
## 원리
### Cost-Performance Trade-off (비용-성능 트레이드오프 원리)
Direct Connect는 처리량 및 보안 수준이 높지만 VPN 연결보다 상대적으로 높은 비용이 발생한다. 따라서 전용선이 제공하는 처리량이나 보안이 필수적이지 않은 경우에는 비용 효율적인 VPN 연결을 우선 사용한다.
### High Availability Cost Optimization (고가용성 비용 최적화 원리)
1Gbps와 같은 낮은 대역폭 연결을 통해 최소한의 비용으로 장애 조치(Failover)를 구성하기 위해 Site-to-Site VPN 연결을 Direct Connect 연결의 백업 경로로 사용하는 것이 비용 효율적인 방법.
## 비교
### DX vs VPN
Direct Connect 연결은 전용선이며 일반적으로 더 비싸고 구성 시간이 더 걸리는 반면, VPN 연결은 더 비용 효율적이며 구성 및 구현이 더 빠르다.
### DX와 Transit Gateway
Direct Connect 연결은 [[Transit Gateway]]에 직접 연결될 수 있으며, 이를 통해 여러 VPC 및 온프레미스 네트워크 간의 중앙 집중식 연결을 허용한다.
## 예시
### 개발/테스트 환경과의 연결
1. 요구 사항: 개발 환경에서만 사용하는 온프레미스 네트워크와 AWS 간의 연결. 고대역폭보다는 보안과 비용 효율성이 중요.
2. 솔루션: Site-to-Site VPN 연결 설정.
3. 결과: 고가 DX 연결 비용 없이 인터넷을 통한 암호화된 채널을 확보하여 비용을 최소화.