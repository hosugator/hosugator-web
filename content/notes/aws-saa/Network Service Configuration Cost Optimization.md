---
created: 2025-11-26
tags: [aws_saa, cost_optimization, network, nat_gateway, transit_gateway, api_gateway, monitoring]
reference:
  - "[[Cost-Optimized Network Architecture]]"
---
# Network Service Configuration Cost Optimization (네트워크 서비스 구성 비용 최적화)
## 정의
[[NAT Gateway]] · [[Transit Gateway]] · [[API Gateway]]와 같은 핵심 네트워킹 서비스의 배포 아키텍처 및 구성 설정을 워크로드의 성격에 맞게 조정하여 불필요한 비용을 최소화하는 전략
## 요소
- [[NAT Gateway]] Configuration: 가용 영역(AZ)별 전용 게이트웨이와 여러 AZ가 공유하는 게이트웨이 중 하나를 선택.
- [[Transit Gateway]] vs. [[VPC Peering]]: 중앙 집중식 관리의 이점과 비용 증가를 비교하여 연결 솔루션을 선택.
- [[API Gateway]] Usage Plans: API 사용량 제한 및 할당량을 설정하여 서비스 과부하와 그에 따른 컴퓨팅 비용 증가를 방지.
- Monitoring Tools: [[CloudWatch]] · [[VPC Reachability Analyzer]] · [[Config]] 등의 도구를 사용하여 네트워크 성능 및 비용 발생 패턴을 지속적으로 검토.
## 원리
### Environment-Specific Configuration (환경별 구성 원리)
높은 가용성이 필수적인 프로덕션 환경에서는 각 가용 영역(AZ)에 전용 NAT Gateway를 배포하여 안정성을 확보한다. 반면, 개발/테스트 환경에서는 여러 AZ의 서브넷이 공유 NAT Gateway를 사용하도록 구성하여 비용을 절감한다.
### Centralization | Cost Principle (중앙 집중화 대 비용 원리)
Transit Gateway는 복잡한 VPC 메시 네트워크를 중앙 집중식으로 관리하는 이점을 제공하지만, 연결 수와 데이터 처리량에 따라 VPC Peering보다 비용이 높으므로, 단순한 연결 구조에서는 피어링을 사용하여 비용을 절감하는 원칙.
## 특징
### NAT Gateway 비용
NAT Gateway는 게이트웨이 실행 시간당 요금과 게이트웨이를 통과하는 데이터 처리 요금이 발생한다. 따라서 트래픽이 통과하지 않도록 VPC Endpoint를 사용하거나, 환경에 맞지 않는 불필요한 게이트웨이 구성을 제거하여 비용을 최소화한다.
### API Gateway Throttling (API 게이트웨이 제한)
사용량 계획(Usage Plans) 및 API 키(API Keys)를 설정하여 고객 또는 애플리케이션별로 초당 및 주간 트랜잭션 제한(Throttling)을 정의한다. 이는 백엔드 [[EC2]] 또는 [[Lambda]]에 과도한 요청이 집중되어 리소스를 확장할 필요가 없도록 방지하여 비용을 통제한다.
### Management Tools for Review
CloudWatch 및 기타 모니터링 도구를 통해 과거 데이터 전송 비용 패턴을 분석하고, 불필요하게 비싼 경로로 트래픽이 라우팅되는지 확인하여 지속적인 비용 절감 기회를 찾는다.