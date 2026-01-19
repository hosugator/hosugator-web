---
created: 2025-12-22 Mon
tags:
  - comparison
  - networking
  - cost_optimization
reference:
  - "[[VPC Endpoint]]"
  - "[[NAT Gateway]]"
  - "[[S3]]"
  - "[[DynamoDB]]"
  - "[[Route Table]]"
---
# Comparison - S3 Connectivity Options in VPC

## 비교 목적 (Objective)
보안(인터넷 비경유)과 비용 최적화 요구사항을 동시에 만족하는 S3 연결 방식을 결정하기 위함입니다.

## 요소별 상세 비교 (Feature Matrix)

| 비교 기준 | [[NAT Gateway]] | [[S3 Gateway Endpoint]] | [[S3 Interface Endpoint]] |
| :--- | :--- | :--- | :--- |
| **경로** | **공용 인터넷 경유** | **AWS 내부 네트워크** | AWS 내부 네트워크 |
| **비용** | 시간당 요금 + 데이터 요금(유료) | **무료 (Free)** | 시간당 요금 + 데이터 요금(유료) |
| **설정 방식** | Route Table (NAT 가리킴) | **Route Table (Endpoint 가리킴)** | DNS / Private IP 활용 |
| **지원 서비스** | 모든 외부 인터넷 서비스 | **S3, DynamoDB 전용** | 대부분의 AWS 서비스 |

## 선택 기준 및 로직 (Selection Criteria)

### [[S3 Gateway Endpoint]]를 선택해야 하는 경우
* **조건:** **S3나 DynamoDB**에 접속해야 하며, 비용을 0원으로 유지하고 인터넷을 절대 타지 않아야 할 때 (시험의 단골 정답)
    * *Ex:* "가장 저렴하게 인터넷 없이 S3에 백업하고 싶다."

### [[NAT Gateway]]를 선택해야 하는 경우
* **조건:** S3 외에 일반적인 인터넷 업데이트(yum install 등)나 외부 API 호출이 필요할 때
    * *Ex:* "프라이빗 서버에서 외부 날씨 API 정보를 가져와야 한다."

---
**Conclusion:**
S3와 인터넷 비경유라는 키워드가 합쳐지면 고민 없이 **Gateway Endpoint**가 정답입니다.