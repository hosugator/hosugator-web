---
created: 2025-11-21
tags: [aws_saa, networking, route53, transit_gateway, direct_connect, vpn, high_availability, disaster_recovery]
reference:
---
# AWS Networking and Routing (HA/DR을 위한 네트워크 기반)
## 정의
고가용성(HA) 및 내결함성(FT) 아키텍처를 보장하기 위해 트래픽 관리, 전용 연결 및 가용 영역 간 통신을 지원하는 기본 네트워크 인프라 서비스
## 요소
### Amazon Route 53
클라우드 확장형의 가용성이 높은 DNS (Domain Name System) 웹 서비스이다.
### AWS Global Accelerator
AWS 글로벌 네트워크를 사용하여 애플리케이션 가용성 및 성능을 향상하는 서비스로, 고정된 Static Anycast IP를 제공한다.
### AWS Transit Gateway (TGW)
중앙 집중식 허브를 통해 수많은 VPC, 온프레미스 네트워크, AWS Direct Connect를 연결하는 네트워크 라우팅 서비스이다.
### AWS Direct Connect (DX)
고정된 사설 네트워크 연결을 통해 온프레미스와 AWS 간의 전용 연결을 설정하는 서비스이다.
### AWS Site-to-Site VPN
암호화된 터널을 통해 온프레미스와 AWS VPC를 인터넷으로 연결하는 서비스이다.
## 원리
### Global Traffic Management (글로벌 트래픽 관리)
Route 53은 Health Check 기능을 통해 엔드포인트의 상태를 확인하고, 장애 발생 시 Failover Routing (장애 조치 라우팅)을 포함한 다양한 DNS 라우팅 기능을 사용하여 트래픽을 정상적인 리전이나 AZ로 자동 전환하여 DR을 지원한다.
### Network Consolidation (네트워크 통합)
Transit Gateway는 여러 VPC를 중앙 집중식으로 연결하고 라우팅함으로써, 대규모 환경에서 VPC 피어링 연결의 복잡성을 해결하고 네트워크 아키텍처를 단순화한다.
### Hybrid Connectivity (하이브리드 연결)
Direct Connect와 Site-to-Site VPN은 온프레미스 데이터 센터와 AWS 환경 간에 안전하고 복원력 있는 연결을 제공한다. DR 전략에서 Direct Connect는 주 연결로, VPN은 백업 연결로 사용되어 복원력을 높인다.
## 특징
### Route 53 Failover Routing (장애 조치 라우팅)
Primary 엔드포인트에 장애가 발생하면 트래픽을 Secondary 엔드포인트로 자동으로 라우팅하여 Multi-Region DR을 구현하는 핵심 메커니즘이다.
### Global Accelerator Static IP
클라이언트는 단일 Anycast IP를 통해 항상 가장 가까운 AWS 엣지 로케이션으로 연결되며, AWS 백본 네트워크를 통해 트래픽이 최종 목적지까지 이동하여 성능과 가용성을 향상한다.
### DX Gateway (Direct Connect 게이트웨이)
전 세계 어느 AWS 리전에서든 VPC와 DX 연결을 중앙에서 연결할 수 있게 하여, 글로벌 아키텍처에서 Direct Connect를 유연하게 활용할 수 있도록 한다.
## 비교
| 구분 | Route 53 (DNS) | Global Accelerator |
| :--- | :--- | :--- |
| 작동 계층 | Application (L7, DNS) | Network (L3, IP) |
| 목적 | 엔드포인트 Health Check 기반 트래픽 전환 | 성능 및 가용성 향상, 고정 IP 제공 |
| 사용 사례 | Multi-Region DR, Failover Routing | 게임/미디어, TCP/UDP 기반 애플리케이션 |
## 예시
### Multi-Region Failover 아키텍처
1. DR 구성: Primary Region(서울)과 Secondary Region(도쿄)에 웹 애플리케이션을 Warm Standby 형태로 구축한다.
2. 라우팅 설정: Amazon Route 53에 Failover Routing 정책을 설정하고, Primary Region의 로드 밸런서(ALB)를 Primary 레코드로, Secondary Region의 ALB를 Secondary 레코드로 지정한다.
3. 장애 감지: Route 53 Health Check가 서울 리전의 ALB에서 Fail 신호를 감지한다.
4. 자동 전환: Route 53은 자동으로 Primary 레코드를 비활성화하고, 모든 사용자 트래픽(DNS 쿼리)을 도쿄 리전의 Secondary 레코드로 전환하여 서비스 연속성(HA/DR)을 확보한다.