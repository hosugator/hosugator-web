---
created: 2025-10-09
revised: 2025-10-09 20:31
tags:
  - salesforce
  - roll_up_summary
  - master_detail_relationship
  - field_creation
  - data_aggregation
reference:
  - "[[salesforce - hub]]"
---
# 요약 필드 구현 (Implement Roll-Up Summary Fields)
## 요약 필드 소개 (Roll-Up Summary Fields)
**Roll-Up Summary Fields**는 **Master-Detail Relationship (마스터-디테일 관계)** 을 통해 연결된 **관련 레코드 세트**의 값을 계산하여 **마스터 레코드**에 자동으로 표시하는 필드입니다.
* **Formula Fields**가 단일 레코드 내 필드를 계산하는 반면, **Roll-Up Summary Fields**는 관련 목록에 있는 **디테일 레코드**의 값을 집계합니다.
* **필수 조건:** 요약 필드는 **Master-Detail Relationship**의 **마스터(Master)** 객체에만 정의할 수 있습니다.
### 요약 필드의 활용
* **COUNT:** 관련 보류 중인 **기회(Opportunity)**의 총 개수를 계산하는 사용자 정의 계정 필드.
* **SUM:** 특정 설명이 포함된 제품의 **단위 가격 합계**를 계산하는 사용자 정의 주문 필드.
* **MIN / MAX:** 관련 레코드의 최소 또는 최대 값을 표시합니다.
## 요약 필드 정의 및 생성
### Master-Detail Relationship
**Master-Detail Relationship**은 마스터 레코드가 디테일 레코드의 특정 동작을 제어하도록 객체를 긴밀하게 연결합니다. 
요약 필드는 이 관계의 **마스터 측 객체**에 정의됩니다. (예: Account 객체에 관련 Opportunity를 요약하는 필드 생성)
### 요약 유형 (Summary Types)
| 유형 | 설명 | 사용 가능 필드 유형 |
| --- | --- | --- |
| **COUNT** | 관련 레코드의 **총 개수**를 계산합니다. | 모든 필드 |
| **SUM** | **Field to Aggregate**에서 선택한 필드의 **총합**을 계산합니다. | Number, Currency, Percent |
| **MIN** | **Field to Aggregate**에서 선택한 필드의 **최저값**을 표시합니다. | Number, Currency, Percent, Date, Date/Time |
| **MAX** | **Field to Aggregate**에서 선택한 필드의 **최고값**을 표시합니다. | Number, Currency, Percent, Date, Date/Time |
### 요약 필드 생성 단계
1.  **Setup**에서 **Object Manager**를 열고 마스터 객체 (**Account** 등)를 클릭합니다.
2.  **Fields & Relationships**를 클릭하고 **New**를 선택합니다.
3.  필드 유형으로 **Roll-Up Summary**를 선택하고 **Next**를 클릭합니다.
4.  **Summarized Object** (요약할 디테일 객체)를 선택합니다. (예: Opportunities)
5.  **Roll-up Type** (SUM, COUNT, MIN, MAX)을 선택하고 **Field to Aggregate** (집계할 필드)를 선택합니다.
6.  다음 단계를 진행하여 **Field-Level Security**를 설정하고 저장합니다.
## 요약 필드 활용 예시
| 마스터 객체            | 요약 필드 기능                                                  | 요약 유형   | 디테일 객체 및 필드                            |
| ----------------- | --------------------------------------------------------- | ------- | -------------------------------------- |
| **Accounts**      | **Date Opportunity First Created** (가장 먼저 생성된 기회 날짜)      | **MIN** | Opportunities 객체의 Created Date 필드      |
| **Opportunities** | **Total Price of All Products** (모든 제품의 총 가격)             | **SUM** | Opportunity Product 객체의 Total Price 필드 |
| **Opportunities** | **Minimum List Price of An Opportunity** (가장 낮은 제품 목록 가격) | **MIN** | Opportunity Product 객체의 List Price 필드  |