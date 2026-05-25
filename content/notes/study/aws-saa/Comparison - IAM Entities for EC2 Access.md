---
created: 2025-12-22 Mon
tags: [comparison, iam, security]
reference:
  - "[[IAM Roles for Amazon EC2]]"
  - "[[IAM Policies]]"
---
# Comparison - IAM Entities for EC2 Access

## 비교 목적 (Objective)
EC2 인스턴스가 AWS 서비스에 접근할 때 보안을 유지하면서 권한을 부여하는 최적의 구성 요소를 선정합니다.

## 요소별 상세 비교 (Feature Matrix)

| 비교 기준 | [[IAM Policy]] (B) | [[IAM Role]] (A) | [[IAM User]] (D) |
| :--- | :--- | :--- | :--- |
| **정의** | 허용/거부할 작업의 목록 | 특정 권한을 가진 '페르소나' | 실제 사람이나 앱을 위한 계정 |
| **EC2 연결** | **직접 연결 불가** | **인스턴스 프로파일을 통해 연결** | 하드코딩된 키(Key)로 연결 |
| **보안성** | 해당 없음 | **매우 높음 (임시 자격 증명)** | 낮음 (키 유출 위험) |
| **관리 편의성** | 내용 수정 용이 | **교체 및 회전 자동화** | 키 관리 부담 발생 |

## 선택 기준 및 로직 (Selection Criteria)

### [[IAM Role]]을 선택해야 하는 경우
* **조건:** EC2 인스턴스나 Lambda 함수 같은 AWS 자원이 다른 AWS 서비스(S3 등)에 접근해야 할 때 (표준 방식)
    * *Ex:* "EC2가 S3에서 파일을 읽어와야 한다."

---
**Conclusion:**
Policy는 '무엇을 할지' 적은 문서이고, Role은 그 문서를 들고 '인스턴스 대신 행동하는 대리인'입니다.