---
created: 2025-12-22 Mon
tags:
  - comparison
  - decision_making
reference:
  - "[[S3 Object Lock - Governance Mode]]"
  - "[[S3 Object Lock - Legal Hold]]"
  - "[[S3 Object Lock Pre-requisite - Versioning]]"
---
# Comparison - S3 Object Lock Modes

## 비교 목적 (Objective)
보관 기간의 확정 여부와 관리자 권한 허용 범위에 따라 최적의 데이터 보호 방식을 선정하기 위함입니다.

## 요소별 상세 비교 (Feature Matrix)

| 비교 기준 | [[Governance Mode]] | [[Legal Hold]] |
| :--- | :--- | :--- |
| **보관 기간 설정** | **필수 (특정 날짜까지)** | **없음 (무기한 보호)** |
| **해제 방식** | 기간 만료 시 자동 해제 | **수동으로 해제해야 함** |
| **권한자 우회** | 특정 권한(Bypass) 보유 시 삭제 가능 | 특정 권한(LegalHold) 보유 시 해제 가능 |
| **주요 용도** | 규정에 따른 일정 기간 보관 | **법적 조사 등 기한 없는 데이터 보호** |

## 선택 기준 및 로직 (Selection Criteria)

### [[Governance Mode]]를 선택해야 하는 경우
* **조건:** 5년, 10년 등 법적으로 정해진 보관 주기가 있으며, 관리자가 실수로 삭제하는 것을 방지하고 싶은 경우
    * *Ex:* 금융 거래 기록 5년 의무 보관

### [[Legal Hold]]를 선택해야 하는 경우
* **조건:** **언제까지 보관할지 알 수 없으며**, 특정 권한을 가진 사람만 필요할 때 보호를 해제하고 삭제하게 하려는 경우
    * *Ex:* 소송 진행 중인 관련 문서의 무기한 삭제 방지

---
**Conclusion:**
기간이 정해져 있으면 Governance Mode, 기간 없이 무기한이면 Legal Hold를 사용합니다.