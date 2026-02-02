---
created: 2026-01-23
tags:
  - aws
  - architecture
  - security
  - networking
---
# 3-Tier Security Architecture

## 본질 (Essence)
보안과 고가용성을 위해 각 계층을 분리하고, 인터넷 노출을 최소화하여 데이터와 로직을 보호하는 설계 전략

## 구조 (Mechanism)
- **Public Subnet**: 인터넷 게이트웨이(IGW)와 연결됨. ALB, NAT Gateway 등 외부 접점 리소스 배치.
- **Private Subnet**: IGW와 직접 연결되지 않음. EC2(App), RDS(DB)를 배치하여 외부 직접 공격 차단.
- **Traffic Flow**: User -> CloudFront (Edge) -> ALB (Public) -> EC2 (Private) -> RDS (Private).
- **Security Group**: ALB는 80/443 허용, EC2는 오직 ALB의 보안 그룹으로부터 오는 트래픽만 허용하도록 체이닝(Chaining).

## 확장 (Connection)
- **연결**: "가장 보안이 뛰어난(MOST secure)" 조건이 붙으면 무조건 데이터와 서버는 Private 서브넷으로 보냄.
- **응용**: ALB는 VPC 내부 라우팅을 통해 Private 서브넷의 EC2와 자유롭게 통신 가능함.

---
See Also: 
- [[Network Access Restriction]]