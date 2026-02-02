---
created: 2026-01-14
tags:
  - aws
  - connectivity
  - peering
  - privatelink
  - directconnect
  - vpn
  - transitgateway
---
# AWS Connectivity Ecosystem

## 본질 (Essence)
상대방이 누구냐에 따라 '직통 도로(Peering)', '비밀 빨대(PrivateLink)', '전용 열차(Direct Connect)' 중 최적의 경로를 선택하는 전략

## 구조 (Mechanism)
- **정의**: VPC 외부의 다양한 엔티티(다른 VPC, 사내 서버, 제3자 서비스)와 사설 또는 전용망으로 통신하기 위한 기술 집합입니다.
- **핵심**: 
    - **네트워크 대 네트워크**: VPC Peering(전체 공유), Transit Gateway(중앙 허브).
    - **서비스 대 서비스**: PrivateLink(특정 기능만 노출).
    - **온프레미스 연결**: VPN(가성비/인터넷), Direct Connect(고성능/전용선).

## 확장 (Connection)
- **연결**: 앞서 다룬 [[API Gateway VPC Link]]가 '관리형 서비스 전용 입구'라면, 이 서비스들은 '인프라 전체를 잇는 고속도로'에 해당합니다.
- **응용**: 대규모 엔터프라이즈 환경에서 여러 부서의 VPC를 하나로 묶거나, 사내 DB와 클라우드 앱을 연동할 때 필수적으로 조합하여 사용합니다.

---
See Also: 
- [[Transit Gateway]]
- [[Direct Connect]]
- [[API Gateway VPC Link]]