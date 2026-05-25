---
created: 2025-11-20
tags:
  - aws_saa
  - global_accelerator
  - anycast
  - static_ip
  - network_optimization
reference:
  - "[[Global Accelerator]]"
---
# Global Accelerator Static Anycast IP 및 라우팅
## 정의
AWS 글로벌 네트워크를 사용하여 애플리케이션에 대한 고정된 진입점(Entry Point) 역할을 하며, 전 세계에서 가장 가까운 AWS 엣지 로케이션으로 트래픽을 라우팅하는 단일 IP 주소
## 요소
### Anycast IP
단일 IP 주소가 전 세계의 여러 지점(엣지 로케이션)에서 동시에 발표(Advertise)된다. 클라이언트의 요청은 BGP(Border Gateway Protocol)에 의해 네트워크적으로 가장 가까운 엣지 로케이션으로 라우팅된다.
### Static IP
한 번 할당되면 변경되지 않는 고정된 IP 주소이다. 이를 통해 클라이언트나 방화벽 설정의 복잡도를 줄인다.
### Listener (리스너)
Global Accelerator가 특정 포트와 프로토콜 (TCP 또는 UDP)로 들어오는 트래픽을 수신하도록 구성하는 객체이다.
### Endpoint Group (엔드포인트 그룹)
하나의 리전 내에 있는 최종 애플리케이션 엔드포인트(예: ALB, NLB)들의 논리적 집합이다.
## 원리
### 고정 진입점 (Static Entry Point)
사용자의 요청은 전 세계 어디에서든 Global Accelerator가 제공하는 단 하나의 Static Anycast IP 주소로 향한다. 이 요청은 Anycast 원리에 따라 가장 가까운 AWS 엣지 로케이션에서 수신된다.
### AWS 백본 네트워크 최적화
엣지 로케이션에 진입한 트래픽은 공용 인터넷을 통하지 않고, AWS의 고속 글로벌 백본 네트워크를 통해 최종 목적지 리전으로 전송된다. 이로써 네트워크 경로의 혼잡과 불안정성을 회피하고 성능을 개선한다.
### 포트 및 프로토콜 기반 라우팅
Global Accelerator는 리스너(Listener)를 통해 들어온 트래픽을 포트 번호와 프로토콜에 따라 사전에 정의된 엔드포인트 그룹으로 전달한다. 이는 L4 계층(전송 계층)의 역할이다.
## 특징
### 엔드포인트 독립성
Global Accelerator의 Static IP는 엔드포인트의 리전이나 가용성에 관계없이 고정되어 있으므로, 백엔드에서 Failover가 발생하거나 엔드포인트가 변경되어도 클라이언트가 사용하는 IP 주소는 변하지 않는다.
### TCP 및 UDP 지원
ALB(Application Load Balancer)가 HTTP/S(L7) 트래픽에 초점을 맞추는 반면, Global Accelerator는 TCP 및 UDP 기반 트래픽(예: 게임, VoIP)의 성능 최적화에 특히 강력하다.
## 예시
### 멀티 리전 재해 복구 시스템
1. Primary IP: Global Accelerator의 Static Anycast IP 1.2.3.4가 Primary 리전(서울)과 Secondary 리전(도쿄)의 로드 밸런서(ALB)에 연결된다.
2. 트래픽 흐름: 평상시에는 서울의 엔드포인트에 가중치(Weight)를 높게 설정하여 서울로 트래픽이 흐른다.
3. 재해 발생: 서울 리전 장애 시, Global Accelerator는 장애를 감지하고 트래픽을 자동으로 도쿄 리전의 엔드포인트로 우회(Failover)시키며, 클라이언트는 여전히 동일한 IP 주소(1.2.3.4)를 사용한다.