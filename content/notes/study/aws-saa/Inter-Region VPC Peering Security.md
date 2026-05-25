---
created: 2026-01-14
tags:
  - aws
  - vpc
  - inter_region
  - peering
  - security
  - cidr
  - ip
---
# Inter-Region VPC Peering Security

## 본질 (Essence)
먼 타국(다른 리전)의 신분증(SG ID)은 우리 성벽(VPC) 경비원이 알아볼 수 없기에, 주소(IP)를 직접 적어서 출입을 허가하는 방식

## 구조 (Mechanism)
- **정의**: 서로 다른 AWS 리전에 위치한 두 VPC를 사설망으로 연결하는 기술입니다.
- **핵심**: 
    - **라우팅**: 양쪽 VPC의 라우팅 테이블에 상대방 CIDR로 향하는 경로를 추가해야 합니다.
    - **제약**: 동일 리전 피어링과 달리, 보안 그룹 규칙에서 상대방의 보안 그룹 ID를 소스(Source)로 지정할 수 없습니다. 오직 IP 대역(CIDR)만 지정 가능합니다.

## 확장 (Connection)
- **연결**: 로컬 피어링이 '사내 메신저로 신원 확인'이라면, 리전 간 피어링은 메신저 연동이 안 되어 '여권 사본(IP)을 팩스로 받는 것'과 같습니다.
- **응용**: 글로벌 서비스 설계 시 보안 그룹 관리의 복잡성을 줄이기 위해, IP 대역 관리를 철저히 하거나 Transit Gateway를 통한 해결책을 검토할 때 이 제약 조건을 고려합니다.

---
See Also: 
- [[VPC CIDR Design Rules]]
- [[IP]]