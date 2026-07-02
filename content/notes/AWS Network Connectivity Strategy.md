---
created: 2026-01-27 11:55
tags:
  - aws
  - network
  - connectivity
  - architecture-strategy
  - 
updated: 2026-02-14 20:25
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[MOC - AWS SAA]]"
publish: true
---
# Network Connectivity Strategy

## 본질 (Essence)
성 안의 복도(Endpoint)를 다닐 것인가, 성끼리 구름다리(Peering)를 놓을 것인가, 아니면 성 바깥 세상과 연결되는 고속도로(DX/VPN)와 중앙 터미널(TGW)을 건설할 것인가의 결정.

## 구조 (Mechanism)
- **정의**: 트래픽의 출발지와 목적지, 확장성 요구사항에 따라 사설 및 공용 망을 설계하는 통합 연결 전략.
- **핵심 서비스 비교**:
    1. **VPC Peering**: 두 성 사이의 직결 통로. 중간 장비가 없어 병목(Bandwidth issue)과 장애점(SPOF)이 없는 최상의 성능을 제공하나 1:1 연결만 가능.
    2. **Transit Gateway (TGW)**: 모든 성(VPC)과 외부 도로(VPN/DX)가 모이는 '중앙 터미널'. 수천 개의 연결을 하나의 허브에서 관리하여 복잡성을 해결.
    3. **Gateway/Interface Endpoint**: 성 안에서 성 밖의 공용 자원(S3, API 등)을 사설 통로로 이용하게 하는 개별 통로.
    4. **Direct Connect (DX) & VIF**: 온프레미스와의 물리적 전용 고속도로. Private VIF는 성(VPC)으로, Public VIF는 공용 서비스로 향하는 전용 차선 역할을 함.
    5. **Site-to-Site VPN**: 공용 도로(인터넷) 밑으로 파놓은 암호화된 비밀 터널. 빠르고 저렴하지만 도로 상황(인터넷 품질)에 영향을 받음.
    6. **Virtual Private Gateway (VGW)**: 단일 성(VPC)으로 들어오는 전용 도로의 정문(입구) 역할.

## 확장 (Connection)
- **연결**: 두 건물을 직접 잇는 복도(Peering)와 도시 전체의 교통을 통제하는 중앙 로터리(TGW)의 관리 범위 차이.
- **응용**: 'SPOF 없는 VPC 간 직결'은 Peering, '수십 개의 VPC와 온프레미스의 통합 관리'는 Transit Gateway, '물리적 전용선을 통한 VPC 진입'은 DX + Private VIF를 선택.

---
See Also: 
- [[Access Control with VPC Boundary]]