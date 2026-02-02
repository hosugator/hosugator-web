---
created: 2025-11-20
tags:
  - aws_saa
  - edge_services
  - cloudfront
  - route53
  - global_accelerator
  - cdn
  - dns
reference:
  - "[[CloudFront]]"
  - "[[Route 53]]"
  - "[[Global Accelerator]]"
---
# AWS Edge Services (CloudFront, Route 53, Global Accelerator)
## 정의
전 세계에 분산된 AWS의 엣지 로케이션(Edge Location) 및 리전(Region) 인프라를 활용하여 최종 사용자에게 가장 가까운 곳에서 콘텐츠를 전송하고 트래픽을 라우팅하여 성능과 가용성을 향상하는 서비스
## 요소
### Edge Location (엣지 로케이션)
AWS 리전 외부에 위치한 전 세계적으로 분산된 데이터 센터로, CloudFront 캐싱과 Route 53 DNS 조회가 이루어지는 지점이다.
### Amazon CloudFront
웹 콘텐츠(이미지, 영상, 정적 파일)를 최종 사용자에게 가장 가까운 엣지 로케이션에 캐싱하여 전송하는 콘텐츠 전송 네트워크(CDN) 서비스이다.
### Amazon Route 53
클라우드 기반의 DNS(Domain Name System) 웹 서비스로, 도메인 이름을 IP 주소로 변환하여 트래픽을 최종 AWS 리소스로 효율적으로 라우팅한다.
### AWS Global Accelerator
AWS 글로벌 네트워크의 이점을 활용하여 최종 사용자와 애플리케이션 엔드포인트(로드 밸런서, EC2 인스턴스 등) 간의 네트워크 경로를 최적화하여 성능을 향상하는 서비스이다.
## 원리
### Latency Reduction (지연 시간 감소)
CloudFront는 콘텐츠를 엣지 로케이션에 캐싱하여, 사용자가 요청 시 원본 서버(Origin)까지 가지 않고 가장 가까운 엣지 로케이션에서 즉시 데이터를 수신하도록 하여 지연 시간을 최소화한다.
### DNS Routing (DNS 라우팅)
Route 53은 지연 시간 기반 라우팅(Latency-Based Routing), 지리적 근접성 기반 라우팅(Geolocation Routing) 등의 정책을 사용하여 최종 사용자의 위치와 가장 가까운 리소스(혹은 가장 빠른 리소스)로 요청을 연결한다.
### Network Path Optimization (네트워크 경로 최적화)
Global Accelerator는 AWS 글로벌 네트워크를 사용자의 진입점(Entry Point)과 최종 엔드포인트 간의 연결 경로로 활용한다. 이는 공용 인터넷 경로의 혼잡(Congestion) 및 불안정성을 회피하여 트래픽 전송 성능을 극적으로 개선한다.
## 특징
### CloudFront의 보안 이점
AWS WAF(Web Application Firewall)와의 통합을 통해 콘텐츠 전송 계층에서 DDoS 공격, SQL Injection 등으로부터 애플리케이션을 보호한다.
### Global Accelerator의 Static IP
Global Accelerator는 애플리케이션의 엔드포인트에 관계없이 두 개의 고정된(Static) 애니캐스트 IP 주소를 제공한다. 이는 방화벽 규칙을 단순화하고 멀티 리전 아키텍처에서 엔드포인트 관리의 복잡도를 낮춘다.
### Route 53의 복원력
Health Check 기능을 제공하여 엔드포인트의 상태를 모니터링하고, 장애 발생 시 자동으로 정상적인 다른 엔드포인트로 트래픽을 우회(Failover)시켜 고가용성을 확보한다.
## 비교
| 구분 | CloudFront | Route 53 | Global Accelerator |
| :--- | :--- | :--- | :--- |
| 주요 기능 | 콘텐츠 캐싱 및 전송(CDN) | DNS 해석 및 라우팅 | 네트워크 트래픽 최적화 |
| 개선 목표 | 지연 시간 및 부하 분산 | 가용성 및 트래픽 제어 | 글로벌 성능 및 복원력 |
| 사용 대상 | 정적/동적 웹 콘텐츠, 영상 스트리밍 | 모든 AWS/외부 리소스의 도메인 관리 | TCP/UDP 기반의 애플리케이션 트래픽 |
| 제공 IP | 엣지 로케이션의 동적 IP | IP 주소로 해석되는 DNS 이름 | 고정된(Static) 애니캐스트 IP 2개 |
## 예시
### 글로벌 웹 서비스 성능 개선
1. Route 53의 지연 시간 기반 라우팅을 사용하여 사용자가 가장 가까운 AWS 리전으로 연결되도록 한다.
2. CloudFront를 사용하여 이미지, CSS, JS 파일과 같은 정적 콘텐츠를 엣지 로케이션에 캐싱하여 첫 번째 액세스 지연 시간을 줄인다.
3. API 호출과 같은 동적 트래픽은 Global Accelerator를 통해 AWS 글로벌 백본 네트워크로 연결하여 공용 인터넷을 통과할 때 발생하는 병목 현상을 회피하고 안정적인 성능을 유지한다.