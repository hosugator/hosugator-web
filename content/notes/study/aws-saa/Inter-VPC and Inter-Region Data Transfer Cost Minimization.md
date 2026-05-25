---
created: 2025-11-26
tags: [aws_saa, cost_optimization, network, data_transfer, vpc_endpoint, az_locality, peering, transit_gateway]
reference:
  - "[[Cost-Optimized Network Architecture]]"
---
# Inter-VPC and Inter-Region Data Transfer Cost Minimization (VPC 간 및 리전 간 데이터 전송 비용 최소화)
## 정의
AWS 환경 내에서 AZ · Region 경계를 통과하는 트래픽, 또는 VPC 간 통신에 발생하는 높은 데이터 전송 비용을 줄이는 설계 전략
## 원리
### Data Egress Cost Principle (데이터 송신 비용 원리)
AWS 내에서 나가는 트래픽(Egress)은 리전 간 또는 인터넷으로 나갈 때 가장 높은 비용이 발생한다. 따라서 모든 설계는 리전 간 및 인터넷 Egress 트래픽을 최소화하는 방향으로 이루어져야 한다.
### Locality Optimization (지역성 최적화 원리)
네트워크 트래픽이 가용 영역 경계를 통과할 때마다 요금이 발생한다. 따라서 애플리케이션 계층과 데이터 계l층 리소스를 같은 AZ에 배치하는 것이 비용 최적화의 기본 단계.
## 비교
### Peering vs Transit Gateway (피어링 대 TGW)
- VPC Peering은 중앙 관리가 필요 없고 소수의 VPC를 연결할 때 Transit Gateway보다 비용 효율적이다.
- Transit Gateway는 연결 수에 따라 피어링보다 비용이 많이 들지만, 수많은 VPC 및 온프레미스 네트워크를 중앙에서 관리하여 복잡성을 줄인다.
### VPC Endpoint Strategy
게이트웨이 엔드포인트(VPC-GE)는 데이터 전송 비용이 0이므로 비용 효율적이지만, 인터페이스 엔드포인트(VPC-IE)는 엔드포인트 시간당 요금과 PrivateLink 기반의 데이터 처리 요금이 발생한다. 따라서 S3 및 DynamoDB 연결 시 VPC-GE를 우선 고려한다.