---
created: 2025-12-22 Mon
tags: [concept, cloudfront, security]
reference:
  - "[[Amazon CloudFront Features]]"
---
# Comparison - CloudFront vs Basic Caching

## 비교 목적 (Objective)
단순 캐시 시스템으로서의 인식에서 벗어나 CloudFront가 제공하는 통합 보안 및 가속 기능을 이해하기 위함입니다.

## 요소별 상세 비교 (Feature Matrix)

| 비교 기준 | 단순 캐시 (Local Cache) | Amazon CloudFront (CDN) |
| :--- | :--- | :--- |
| **주요 목적** | 서버 부하 감소 | **글로벌 가속 및 보안 강화** |
| **보안 처리** | 서버가 직접 SSL 처리 | **CloudFront가 Edge에서 SSL 처리** |
| **인증서 관리** | 서버에 직접 설치/갱신 | **ACM과 연동하여 자동 관리** |
| **공격 방어** | 별도 장비 필요 | **DDoS(Shield), WAF와 즉시 연동** |

## 선택 기준 및 로직 (Selection Criteria)

### [[CloudFront]]를 통해 HTTPS를 구현해야 하는 경우
* **조건:** S3 정적 호스팅을 사용하면서 개인 도메인(example.com)과 HTTPS를 적용하고 싶을 때
* **조건:** 전 세계 사용자에게 안전하고 빠르게 콘텐츠를 전달해야 할 때

---
**Conclusion:**
CloudFront는 데이터의 복사본을 저장하는 '창고'일 뿐만 아니라, 가장 먼저 손님을 맞이하고 신원을 확인하는 '보안 안내데스크'입니다.