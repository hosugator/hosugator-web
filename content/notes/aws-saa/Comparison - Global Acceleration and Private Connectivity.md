---
created: 2025-12-18
tags: [comparison, decision_making, networking]
reference:
  - "[[AWS Global Accelerator]]"
  - "[[Amazon CloudFront]]"
  - "[[AWS Site-to-Site VPN]]"
  - "[[AWS Direct Connect]]"
---
# Comparison - Global Acceleration and Private Connectivity

## 비교 목적 (Objective)
사용자 환경과 비즈니스 요구사항에 따라 최적의 외부 연결 방식을 선택하여 네트워크 성능, 비용, 보안성을 최적화하기 위함.

## 요소별 상세 비교 (Feature Matrix)

| 비교 기준 | [[Amazon CloudFront]] | [[AWS Global Accelerator]] | [[AWS Site-to-Site VPN]] | [[AWS Direct Connect]] |
| :--- | :--- | :--- | :--- | :--- |
| **핵심 목적** | 콘텐츠 캐싱 및 API 전송 가속 | 전역 경로 최적화 및 고정 IP | 인터넷 기반 보안 터널 연결 | 물리적 전용선 사설 연결 |
| **주요 프로토콜** | HTTP, HTTPS, gRPC | TCP, UDP | IPsec 기반 암호화 통신 | 모든 프로토콜 (물리 계층) |
| **사용 대상** | 전 세계 불특정 웹 사용자 | 지연 시간에 민감한 게임/앱 | 사내망과 VPC 간 연결 | 대규모 데이터 전송 기업 |
| **비용 모델** | 데이터 전송량 기반 (저렴) | 시간당 고정비 + 전송료 | 시간당 고정비 + 전송료 | 포트 시간당 비용 + 전송료 (고가) |
| **구축 기간** | 즉시 적용 가능 | 즉시 적용 가능 | 수 분 이내 구성 가능 | 수 주 ~ 수 개월 소요 |

## 선택 기준 및 로직 (Selection Criteria)

### 가속화가 우선인 경우 (Public Access)
- **[[Amazon CloudFront]]:** 웹 기반 콘텐츠(이미지, 영상)나 API를 가장 비용 효율적으로 전 세계에 배포하고 싶을 때 선택함.
- **[[AWS Global Accelerator]]:** 비웹 프로토콜(UDP 등)을 사용하거나, 화이트리스트 등록을 위한 고정 IP가 반드시 필요할 때 선택함.

### 보안 연결이 우선인 경우 (Private Access)
- **[[AWS Site-to-Site VPN]]:** 인터넷망을 이용해 빠르게 사무실과 AWS 사이의 암호화된 통로를 뚫어야 할 때 선택함.
- **[[AWS Direct Connect]]:** 인터넷 정체와 상관없이 일정한 성능이 필요하거나, 강력한 보안 규정 준수가 필수일 때 선택함.

---
**Conclusion:**
일반 고객 대상 서비스는 CloudFront/Global Accelerator를 통해 '밖으로' 가속하고, 사내 인프라 연결은 VPN/Direct Connect를 통해 '안으로' 연결함.