---
created: 2026-01-14
tags:
  - AWS
  - API_Gateway
  - Networking
---
# API Gateway VPC Link

## 본질 (Essence)
성벽(VPC) 밖의 중개인(API Gateway)이 성안의 비밀 구역(Private Subnet)으로 바로 들어올 수 있게 뚫어놓은 '전용 비밀 통로'

## 구조 (Mechanism)
- **정의**: API Gateway가 VPC 내의 프라이빗 리소스(ECS, NLB 등)와 사설 네트워크로 통신할 수 있게 해주는 인터페이스 기반 연결 장치입니다.
- **핵심**: VPC 내부에 ENI(가상 랜카드)를 생성하여 외부 서비스인 API Gateway를 내 네트워크의 일부처럼 편입시킵니다. 이를 통해 인터넷 게이트웨이를 거치지 않고 AWS 백본망 내에서만 트래픽을 안전하게 전달합니다.

## 확장 (Connection)
- **연결**: 외부 손님이 전용 출입증을 찍고 들어오는 '비즈니스 센터 전용 엘리베이터'와 유사하며, 일반 출구인 'Interface Endpoint'와 대조되는 '전용 입구' 개념입니다.
- **응용**: 보안이 생명인 금융권이나 기업용 마이크로서비스 아키텍처에서 내부 컨테이너 서비스를 외부 REST API로 안전하게 노출할 때 필수적으로 사용합니다.

---
See Also: 
- [[Amazon_API_Gateway]]
- [[AWS_PrivateLink]]
- [[VPC_Endpoint]]