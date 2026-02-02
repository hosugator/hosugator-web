---
created: 2025-12-19
tags:
  - aws
  - security
  - ddos
reference:
  - "[[AWS Shield]]"
  - "[[Amazon CloudFront]]"
  - "[[AWS WAF]]"
---

# AWS DDoS Defense Comparison

## 정의 (Definition)
DDoS 공격의 계층(L3/L4/L7)과 목적에 따라 최적의 방어 수단을 선택하기 위한 가이드라인입니다.

## 서비스별 핵심 역할 (Core Roles)
### AWS Shield (Advanced)
- 전문성: 전담 대응팀(DRT) 지원 및 자동화된 L3/L4 방어 제공
- 비용: 공격으로 인한 인프라 확장 비용 환불 (Cost Protection)
### Amazon CloudFront
- 구조적 방어: 전 세계 엣지로 트래픽 분산 및 오리진 IP 은닉
- 시너지: 엣지 단에서 Shield와 WAF가 작동할 수 있는 기반 제공
### AWS WAF
- 세밀한 제어: 특정 IP 차단, 국가별 차단, 웹 취약점(SQLi, XSS) 필터링

## 판단 로직 (Decision Logic)
1. 인프라 전체의 가용성과 비용 보호가 목적이면 -> Shield Advanced
2. 공격 대상을 숨기고 입구를 분산하고 싶으면 -> CloudFront
3. 특정 공격 패턴을 정교하게 막고 싶으면 -> WAF

---
See Also:
- [[Best Practices for DDoS Resiliency]]