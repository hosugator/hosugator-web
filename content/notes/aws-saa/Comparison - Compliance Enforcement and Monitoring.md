---
created: 2025-12-18
tags: [comparison, decision_making]
reference:
  - "[[AWS Organizations]]"
  - "[[AWS Config]]"
---
# Comparison - Compliance Enforcement and Monitoring

## 비교 목적 (Objective)
특정 리전 사용 제한 및 인터넷 연결 금지와 같은 강력한 컴플라이언스 규정을 전사적으로 강제하고 상시 준수 여부를 확인하기 위함.

## 요소별 상세 비교 (Feature Matrix)

| 비교 기준 | [[AWS Organizations]] (SCP) | [[AWS Config]] |
| :--- | :--- | :--- |
| **핵심 철학** | 예방적 통제 (권한 자체를 원천 차단) | 발견적 통제 (설정 변경을 감지하고 기록) |
| **장점 (Pros)** | 루트 사용자도 어길 수 없는 절대적 가드레일 제공 | 규정 위반 리소스를 실시간 탐지하고 대시보드로 시각화 |
| **단점 (Cons)** | 이미 생성된 자원의 규정 준수 여부를 알 수 없음 | 차단 권한이 없으므로 위반 발생 자체를 막지는 못함 |
| **비용/관리** | 추가 비용 없음 (중앙 집중 관리) | 기록되는 리소스 및 규칙 실행 횟수에 비례하여 과금 |

## 선택 기준 및 로직 (Selection Criteria)

### [[AWS Organizations]] (SCP)를 선택해야 하는 경우
* **조건:** 특정 행동(예: 인터넷 게이트웨이 생성, 리전 외 자원 생성)을 절대로 허용하지 않아야 하는 경우
    * *Ex:* 보안 규정에 따라 서울 리전 외의 모든 API 호출을 원천 봉쇄해야 하는 금융 프로젝트

### [[AWS Config]]를 선택해야 하는 경우
* **조건:** 현재 리소스들이 규정을 지키고 있는지 상시 모니터링하고 위반 시 즉시 알림을 받아야 하는 경우
    * *Ex:* 누군가 실수로 퍼블릭 S3 버킷을 생성하거나 비인가 리전에 자원을 배포했을 때 이를 즉시 탐지하여 보고해야 할 때

---
**Conclusion:**
AWS Organizations는 사고를 막는 문잠금 장치이며, AWS Config는 침입을 기록하고 알리는 CCTV 시스템임.