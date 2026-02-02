---
created: 2025-12-22 Mon
tags: [comparison, decision_making]
reference:
  - "[[AWS WAF]]"
  - "[[API Gateway Usage Plans]]"
---
# Comparison - API Gateway Security Measures

## 비교 목적 (Objective)
서버리스 아키텍처에서 발생하는 비정상적인 트래픽(Botnet)을 차단하기 위한 최적의 방어 계층을 선정하기 위함입니다.

## 요소별 상세 비교 (Feature Matrix)

| 비교 기준 | [[AWS WAF]] | [[API Key & Usage Plan]] | [[Lambda Custom Logic]] |
| :--- | :--- | :--- | :--- |
| **방어 시점** | API Gateway 도달 전 (최전방) | API Gateway 처리 단계 | **이미 서버가 실행된 후 (최후방)** |
| **비용 최적화** | 비정상 요청을 입구에서 컷 (매우 우수) | 인증 실패 시 로직 실행 안 함 (우수) | **실행 횟수만큼 비용 발생 (나쁨)** |
| **봇 대응력** | 패턴/속도 기반 차단 가능 (강력) | 키가 없으면 차단 가능 (보통) | 수동 IP 등록 필요 (매우 비효율) |
| **운영 효율성** | 자동화된 규칙 적용 가능 | 사용자별 키 관리 필요 | **코드 수정 및 배포 필요** |

## 선택 기준 및 로직 (Selection Criteria)

### [[AWS WAF]]를 선택해야 하는 경우
* **조건:** 봇넷처럼 대규모 분산 공격이 들어올 때, 패턴이나 요청 속도로 자동 차단이 필요한 경우
    * *Ex:* 초당 100회 이상 호출하는 IP 자동 차단

### [[API Key & Usage Plan]]를 선택해야 하는 경우
* **조건:** 사전에 허가된 파트너나 앱 사용자에게만 할당된 쿼터(Quota)만큼 호출을 허용하고 싶은 경우
    * *Ex:* 유료 회원에게만 API 사용 권한 부여

---
**Conclusion:**
비용과 보안성을 모두 잡으려면 WAF로 1차 필터링을 하고, API Key로 2차 인증을 하는 것이 모범 사례입니다.