---
created: 2025-12-18 Thu
tags: [comparison, decision_making]
reference:
  - "[[AWS Network Firewall]]"
  - "[[AWS Firewall Manager]]"
---
# Comparison - Network Security & Management

## 비교 목적 (Objective)
VPC 트래픽 보호를 위해 실제 검사 장치(Firewall)를 도입할 것인지, 아니면 여러 보안 정책을 통합 관리(Manager)할 것인지 결정하기 위함.

## 요소별 상세 비교 (Feature Matrix)

| 비교 기준 | [[AWS Network Firewall]] | [[AWS Firewall Manager]] |
| :--- | :--- | :--- |
| **핵심 철학** | 실제 패킷을 검사하고 차단하는 보안 실행 장치 | 여러 계정과 VPC의 보안 규칙을 배포하는 관리 계층 |
| **장점 (Pros)** | 패킷 내부까지 들여다보는 정교한 필터링(DPI) 가능 | 조직 전체에 일관된 보안 정책을 단 한 번에 적용 가능 |
| **단점 (Cons)** | 인프라 비용 및 데이터 처리 비용 발생 | 실제 트래픽 검사 기능은 없으며 다른 서비스에 의존함 |
| **비용/관리** | 검사 트래픽 용량에 비례하여 과금 | 계정당/정책당 관리 비용 발생 |

## 선택 기준 및 로직 (Selection Criteria)

### [[AWS Network Firewall]]를 선택해야 하는 경우
* **조건:** 온프레미스의 침입 방지 시스템(IPS)처럼 실제 트래픽을 검사하고 필터링하는 기능이 필요한 경우
    * *Ex:* 외부 인터넷으로 나가는 트래픽 중 특정 도메인(FQDN)만 허용하거나 패킷 분석이 필요한 운영 VPC 환경

### [[AWS Firewall Manager]]를 선택해야 하는 경우
* **조건:** 여러 AWS 계정이나 VPC에 걸쳐 WAF, Shield, Network Firewall 규칙을 중앙에서 관리하고 강제하고 싶은 경우
    * *Ex:* 수백 개의 VPC에 동일한 보안 그룹(Security Group) 규칙을 일괄 배포하여 규정 준수를 유지해야 할 때

---
**Conclusion:**
Network Firewall은 트래픽을 직접 검사하는 '현장 요원'이며, Firewall Manager는 정책을 하달하고 관리하는 '지휘 본부'임.