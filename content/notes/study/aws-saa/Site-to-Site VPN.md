---
created: 2025-11-13
tags: [aws_saa, vpn, sitetosite, client, tunnel, bgp, hybrid]
reference:
  - https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html
---

# AWS Site-to-Site VPN

## 정의
온프레미스 네트워크와 [[VPC]]를 인터넷 위에 암호화 터널로 연결하는 관리형 하이브리드 연결 서비스

## 비유
마을 집과 산장 사이에 뚜껑이 있는 투명 지하 터널을 파서,  
겉에서는 땅이 그대로지만, 안에서는 차가 다니는 도로가 따로 있는 형태

## 핵심 용어
- [[Virtual Private Gateway (VGW)]] : VPC 쪽 종단점, BGP 라우팅 지원
- [[Customer Gateway (CGW)]] : 온프레미스 쪽 라우터·방화벽 또는 소프트웨어
- [[VPN Connection]] : 두 지점 사이의 암호화 터널 2개(기본 이중화)
- [[Tunnel Mode]] : IPSec ESP, IKEv1/v2, AES-256·SHA-2·DH Group 14~21 지원

## 주요 기능
- 라우팅 방식 : 정적 경로 또는 BGP 다이나믹 라우팅
- 모니터링 : CloudWatch 지표(VPN 터널 상태, 패킷 손실률)
- 가속 옵션 : Global Accelerator 연결로 지연 시간 감소
- IPv4/IPv6 듀얼 스택 및 NAT-T 지원

## 특징
- 요금 : 연결 시간당 0.05USD + 데이터 이그레스 인터넷 요금(지역별)
- SLA 99.9% 단일 터널 기준, 이중화 시 자동 장애 조거
- 즉시 생성 가능, 대역폭은 인터넷 회선에 따라 결정(최대 1.25 Gbps per tunnel)
- Direct Connect와 함께 사용 시 백업 연결로 활용