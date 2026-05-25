---
created: 2025-12-19
tags:
  - comparison
  - networking
  - vpc_endpoint
  - privatelink
reference:
  - "[[AWS PrivateLink]]"
  - "[[VPC Endpoint]]"
  - "[[Network Load Balancer]]"
---

# Comparison - Optimized Private Connectivity for Third-party Services

## 비교 목적 (Objective)
외부 제공자(Third-party)의 서비스를 인터넷 노출 없이 프라이빗하게 연결하면서도 보안 정책과 네트워크 독립성을 동시에 충족하는 최적의 아키텍처를 결정하기 위함

## 연결 방식별 상세 비교 (Connectivity Options)

| 구분 | VPC Peering | NAT Gateway | VPC Endpoint (PrivateLink) |
| :--- | :--- | :--- | :--- |
| **연결 범위** | 상대 VPC 전체 네트워크 | 외부 인터넷 전체 | **특정 대상 서비스(API 등)로 한정** |
| **보안성** | 중간 (전체 노출 위험) | 낮음 (인터넷망 경유) | **최상 (AWS 백본망 사용)** |
| **IP 중복 문제** | 연결 불가 (대역 중복 시) | 무관 (NAT 변환) | **무관 (NLB를 통한 주소 추상화)** |
| **연결 방향** | 양방향 통신 가능 | 내부에서 외부로 시작 | **내부에서 외부로 시작 (소비자 중심)** |

## 핵심 기술 요소: 왜 NLB가 필수인가? (Role of NLB)
서비스가 단 하나뿐이라도 제공자 측에서 NLB를 전면에 두어야 하는 이유는 다음과 같음
* **고정된 문 (Static Entrance)**: 가변적인 ALB와 달리 고정된 사설 IP를 제공하여 신뢰할 수 있는 접점을 형성함
* **네트워크 격리**: 소비자 쪽 IP 대역이 제공자와 겹치더라도 NLB가 이를 중계하여 통신 오류를 방지함
* **투명성**: 4계층(TCP)에서 작동하여 원본 패킷을 가공 없이 전달하므로 보안 및 성능상 유리함

## 의사결정 로직 (Decision Logic)
1. **Private 연결인가?**: Yes인 경우 NAT Gateway 제외
2. **특정 서비스로만 제한하는가?**: Yes인 경우 VPC Peering 제외
3. **상대방의 서비스를 내 VPC 내부처럼 쓸 것인가?**: **VPC Endpoint (PrivateLink)가 최적의 선택**

---
**Conclusion:**
외부 업체의 서비스를 연결할 때 'Private'과 'Restricted' 조건이 붙는다면 NLB를 출입구로 삼는 PrivateLink 기반의 VPC Endpoint가 가장 보안이 뛰어나고 표준화된 정답임