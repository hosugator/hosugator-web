---
created: 2025-12-22 Mon
tags: [comparison, decision_making]
reference:
  - "[[AWS Global Accelerator]]"
  - "[[Availability Zone]]"
---
# Comparison - Network Zone vs Availability Zone

## 비교 목적 (Objective)
AWS Global Accelerator의 Network Zone이 기존 인프라 격리 단위(AZ)와 어떻게 다르며, 왜 두 개의 고정 IP를 제공하는지 그 기술적 이유를 파악하기 위함입니다.

## 요소별 상세 비교 (Feature Matrix)

| 비교 기준 | [[Availability Zone (AZ)]] | [[Network Zone (Global Accelerator)]] |
| :--- | :--- | :--- |
| **격리 초점** | 물리적 서버, 전력, 냉각 시스템의 독립성 | **네트워크 장비, IP 경로, 광고(Advertisement)의 독립성** |
| **물리적 위치** | 리전 내의 분리된 데이터 센터 랙/건물 | AWS 글로벌 네트워크 상의 분리된 인프라 및 경로 |
| **제공 자원** | 서브넷, 인스턴스, 스토리지 등 | **고유한 Anycast 고정 IP 주소** |
| **장애 대응** | 특정 데이터 센터 화재/정전 시 보호 | 특정 네트워크 경로 차단이나 장비 장애 시 보호 |

## 선택 기준 및 로직 (Selection Criteria)

### [[Network Zone (Global Accelerator)]]의 특징을 이해해야 하는 경우
* **조건:** 물리적 서버뿐만 아니라 클라이언트에서 서버까지 오는 **'길(Path)'** 자체의 중단 없는 연결이 필수적인 경우
    * *Ex:* 전 세계 사용자가 특정 IP로 접속할 때, 한쪽 ISP 경로에 문제가 생겨도 즉시 다른 IP로 우회하여 접속해야 하는 시나리오

### [[Availability Zone (AZ)]]를 선택해야 하는 경우
* **조건:** 애플리케이션의 연산 자원(EC2)이나 데이터베이스를 물리적 재해로부터 보호하고 고가용성을 유지해야 하는 경우
    * *Ex:* 리전 내 한 데이터 센터의 전원이 차단되어도 다른 데이터 센터에서 서비스가 가동되어야 하는 상황

---
**Conclusion:**
Network Zone은 물리적 위치의 분리를 포함하여 **서로 다른 네트워크 장비와 경로**를 사용함으로써, 한쪽 IP의 통신이 불가능해도 나머지 IP로 통신을 보장하는 격리 단위입니다.