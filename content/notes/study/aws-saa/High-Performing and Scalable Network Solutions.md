---
created: 2025-11-25
tags:
  - aws_saa
  - networking
  - vpc
  - hybrid
  - global
  - performance
  - latency
  - throughput
reference:
  - "[[VPC Architecture for Performance and Security]]"
  - "[[Comparison - Direct Connect vs VPN Connectivity]]"
  - "[[Centralized Connectivity]]"
  - "[[Private and Endpoint Connectivity]]"
  - "[[Global Routing and Optimization]]"
  - "[[Data Transfer and Migration Services]]"
---
# Scalable Network Architecture Solutions (확장 가능한 네트워크 아키텍처 결정)
## 정의
워크로드의 대역폭, 지연 시간, 처리량 및 가용성 요구 사항을 충족하기 위해 [[VPC]] 설계, 온프레미스 연결, 글로벌 트래픽 최적화 및 보안을 통합하여 고성능 네트워킹 솔루션을 선택하고 구현하는 활동
## 요소
### VPC Components (VPC 구성 요소)
[[VPC]], 서브넷, 라우팅 테이블(RT), 인터넷 게이트웨이(IGW), 네트워크 ACL(NACL), [[보안 그룹]] (SG).
### Connectivity Services (연결 서비스)
[[Direct Connect]], [[Site-to-Site VPN]], [[Transit Gateway]], [[CloudHub]].
### Edge and Optimization Services (엣지 및 최적화 서비스)
[[CloudFront]], [[Global Accelerator]], [[Route 53]].
### Private Connection Services (프라이빗 연결 서비스)
[[PrivateLink]], [[VPC Endpoints]] (게이트웨이/인터페이스).
## 원리
### Networking Fundamentals (네트워킹 기본 원칙)
네트워크의 대역폭, 지연 시간(Latency), 지터([[Jitter]]), 처리량(Throughput) 요구 사항에 맞춰 네트워킹 방식을 일치시켜야 하며, 성능에 미치는 긍정적/부정적 영향을 이해해야 한다.
### Distance and Jitter Reduction (거리 및 지터 감소)
리소스를 사용자 위치 가까이에 배치(예: 리전, 배치 그룹, 엣지 서비스)하거나 [[Direct Connect]], [[Global Accelerator]] 등의 서비스를 사용하여 네트워크 거리(Distance) 및 변동(Jitter)을 줄여야 한다.
### Infrastructure as Code (코드형 인프라)
클라우드 기반 네트워크를 신속하게 재구축하거나 수정할 수 있도록 네트워크 구성을 코드형 인프라로 생성하여 성능 효율성을 유지하고 아키텍처를 발전시킨다.
## 특징
### Hybrid Architecture (하이브리드 아키텍처)
온프레미스 데이터 센터와 AWS [[VPC]] 간에 프라이빗 통신이 가능하도록 [[Site-to-Site VPN]] 또는 [[Direct Connect]]를 사용하여 연결하고, 이를 [[Transit Gateway]]로 중앙 집중화한다.
### Global Architecture (글로벌 아키텍처)
2개 이상의 리전에 걸친 글로벌 고객 기반을 위해 [[Route 53]]의 지리적 근접 라우팅, 지연 시간 라우팅 및 [[CloudFront]]를 활용하여 사용자에게 가장 가까운 리전으로 트래픽을 라우팅한다.
### High Availability (고가용성 설계)
- [[SPOF]] 제거를 위해 로드 밸런싱된 클러스터 또는 Active-Standby 페어를 사용한다.
- [[Route 53]]의 DNS 상태 확인(Health Check)을 구성하여 트래픽을 정상적인 엔드포인트로만 라우팅한다.
## 하위 학습 주제 (Sub-Topics)
이 주제를 완전히 이해하기 위해 다음 순서로 원자성 노트를 작성합니다.
1.  VPC Fundamentals and Security (VPC 기본 사항 및 보안)
2.  Direct Connect vs VPN Connectivity (Direct Connect vs VPN 연결)
3.  Centralized Connectivity (Transit Gateway, CloudHub)
4.  Private and Endpoint Connectivity (PrivateLink, VPC Endpoints)
5.  Global Routing and Optimization (Route 53, Global Accelerator, CloudFront)
6.  Data Transfer and Migration Services