---
created: 2025-12-22 Mon
tags:
  - comparison
  - networking
  - endpoint
  - gateway
  - interface
---
# Comparison - Why Interface vs Gateway?

## 비교 목적 (Objective)
라우트 테이블 방식(Gateway)과 IP 부여 방식(Interface)의 존재 이유와 기술적 차이

## 요소별 상세 비교 (Feature Matrix)

| 비교 기준 | [[Gateway Endpoint]] (B) | [[Interface Endpoint]] (A) |
| :--- | :--- | :--- |
| **작동 원리** | 라우트 테이블에 경로 추가 | **서브넷에 사설 IP(ENI) 생성** |
| **보안 제어** | 엔드포인트 정책으로만 제어 | **보안 그룹(SG)으로 제어 가능** |
| **연결 범위** | VPC 내부에서만 가능 | **온프레미스(VPN/DX)에서도 접근 가능** |
| **비용** | **무료** | 유료 (시간당 비용 + 데이터 전송량) |
| **지원 서비스** | S3, DynamoDB 단 2개 | 거의 모든 AWS 서비스 (200개 이상) |

## 선택 기준 및 로직 (Selection Criteria)

### [[Gateway Endpoint]]를 사용해야 하는 경우 (B)
* **조건:** VPC 내부에서 S3에 접속하며, 가장 저렴하고 단순하게 관리하고 싶을 때

### [[Interface Endpoint]]를 사용해야 하는 경우 (A)
* **조건:** 회사 본사(온프레미스)에서 전용선(Direct Connect)을 타고 AWS S3에 사설로 접속해야 할 때
* **조건:** S3로 나가는 트래픽에 대해 **보안 그룹(SG)**으로 아주 미세한 통제를 하고 싶을 때

---
**Conclusion:**
Gateway는 '무료 지름길'이고, Interface는 '확장성 좋은 유료 전용선'입니다.