---
created: 2025-12-22 Mon
tags: [comparison, decision_making]
reference:
  - "[[Security Group]]"
  - "[[Network ACL]]"
---
# Comparison - Security Group vs Network ACL

## 비교 목적 (Objective)
VPC 내 인프라 보호를 위해 인스턴스 단위의 보안(SG)과 서브넷 단위의 보안(ACL)을 언제 어떻게 조합하여 사용할지 결정하기 위함입니다.

## 요소별 상세 비교 (Feature Matrix)

| 비교 기준 | [[Security Group (SG)]] | [[Network ACL (ACL)]] |
| :--- | :--- | :--- |
| **보호 대상** | **인스턴스(ENI) 단위** | **서브넷(Subnet) 단위** |
| **상태 유지** | **Stateful** (응답 트래픽 자동 허용) | **Stateless** (나가는 규칙도 직접 설정) |
| **규칙 성격** | 오직 '허용(Allow)'만 설정 가능 | '허용'과 **'거부(Deny)'** 모두 가능 |
| **적용 시점** | 트래픽이 인스턴스에 도달할 때 | 트래픽이 서브넷 경계를 넘을 때 |

## 선택 기준 및 로직 (Selection Criteria)

### [[Security Group (SG)]]를 선택해야 하는 경우
* **조건:** 특정 서버(웹 서버, DB 서버 등)의 역할에 따라 필요한 포트만 정교하게 열어주고 싶은 경우
    * *Ex:* "웹 서버 SG"를 가진 인스턴스들로부터 오는 3306 포트 트래픽만 DB 서버가 받도록 허용

### [[Network ACL (ACL)]]를 선택해야 하는 경우
* **조건:** 특정 IP 대역 전체를 서브넷 차원에서 원천 차단(Deny)하거나, 서브넷 전체에 대한 1차 방어벽이 필요한 경우
    * *Ex:* 특정 악성 해커의 IP 대역(CIDR)이 우리 서브넷 근처에도 못 오도록 입구에서 거부(Deny) 처리

---
**Conclusion:**
SG는 인스턴스마다 입히는 '개인 방탄복'이고, ACL은 서브넷 입구를 지키는 '성문'입니다.