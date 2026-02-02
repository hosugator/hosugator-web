---
created: 2025-11-13
tags: [aws_saa, transitgateway, tgw, hubspoke, peering, vpc, vpn]
reference:
  - https://docs.aws.amazon.com/transit-gateway/latest/userguide/what-is-transit-gateway.html
---
# AWS Transit Gateway
## 정의
하나의 게이트웨이로 수백 개 [[VPC]], 온프레미스 VPN/[[Direct Connect]], 타 [[Region]]을 연결해 주는 중앙 집중식 클라우드 라우팅 허브 서비스
## 핵심 용어
- [[Transit Gateway]]: 리전 단위 허브, 최대 5,000 개 연결 지원
- [[Attachment]] : VPC, VPN, DX 게이트웨이, 피어링 등 연결 단위
- [[Route Table]] : 허브 내 별도 라우팅 테이블로 트래픽 격리(isolation) 가능
- [[Peering Attachment]] : 리전 간 TGW 끼리 연결, 글로벌 라우팅
## 주요 기능
- Hub-and-Spoke : 복잡한 메시 VPC peering 대신 단일 연결로 해결
- multicast : IPTV·금융 마켓 데이터 중계(선택 리전)
- VPN/Direct Connect 통합 : 하나의 VIF로 모든 VPC 도달
- 타사 방화벽·IPS 삽입 : 트래픽을 특정 VPC(보안 어플라이언스)로 리디렉션
## 특징
- 요금 : Attachment 시간당 0.05USD + 처리 데이터 0.02USD/GB(리전 내)
- 전이 라우팅(transitive routing) 기본 제공, BGP VPN 지원
- 리전당 1개 이상 생성 가능, 피어링으로 타 리전 연결
- 기존 VPC Peering 대비 관리 포인트 감소, 라우팅 정책 중앙 집중