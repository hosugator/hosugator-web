---
created: 2025-10-09
revised: 2025-10-09 20:59
tags:
  - salesforce
  - validation_rules
  - data_quality
  - formula_syntax
  - data_validation
reference:
  - "[[salesforce - hub]]"
---
# 유효성 검사 규칙 생성 (Create Validation Rules)
## 유효성 검사 규칙 소개 (Validation Rules)
**Validation Rules**는 사용자가 레코드에 입력하는 데이터가 관리자가 지정한 **표준(Standards)** 을 충족하는지 **확인**하는 규칙입니다. 데이터의 저장 전에 실행되어 **데이터 품질**을 보장합니다.
* **동작 원리:** 규칙은 하나 이상의 필드 데이터를 평가하는 수식(Formula)이나 표현식을 포함하며, 결과로 **"True"** 또는 **"False"**를 반환합니다.
* **오류 발생:** 수식이 **"True"**를 반환할 때, 이는 사용자가 **유효하지 않은 값**을 입력했음을 의미하며, 레코드는 저장되지 않고 **오류 메시지**가 표시됩니다.
* **적용 대상:** 객체, 필드, 캠페인 멤버, 케이스 마일스톤 등에 생성할 수 있습니다.
## 유효성 검사 규칙 구성 요소
| 요소 | 설명 | 예시 |
| :--- | :--- | :--- |
| **Rule Name (규칙 이름)** | 규칙의 고유한 이름입니다. | **Account_Number_8_Characters** |
| **Error Condition Formula (오류 조건 수식)** | 데이터가 **유효하지 않을 때(저장을 막을 때)** **"True"**를 반환하는 수식입니다. | **LEN( AccountNumber) <> 8** |
| **Error Message (오류 메시지)** | 유효성 검사 실패 시 사용자에게 표시되는 메시지입니다. | **Account number must be 8 characters long.** |
| **Error Location (오류 위치)** | 오류 메시지를 표시할 위치(필드 또는 페이지 상단)를 지정합니다. | **Account Number** |
## 유효성 검사 규칙 예시
| 사용 사례 | 핵심 함수/연산자 | 오류 조건 수식 |
| :--- | :--- | :--- |
| **Account Number**의 **숫자** 확인 (공백이 아닐 경우) | **AND, NOT, ISBLANK, ISNUMBER** | **AND( NOT(ISBLANK(AccountNumber)), NOT(ISNUMBER(AccountNumber)))** |
| **Date**가 **현재 연도**에 속하는지 확인 | **YEAR, TODAY, <> (Not Equal)** | **YEAR( My_Date__c ) <> YEAR ( TODAY() )** |
| **Salary Range**가 **$20,000**를 초과하는지 확인 | **> (Greater Than)** | **(Salary_Max__c - Salary_Min__c) > 20000** |
| **Website Extension**이 `.com, .org, .net` 중 하나인지 확인 | **AND, RIGHT, <> (Not Equal)** | **AND( RIGHT( Web_Site__c, 4) <> ".COM", ... RIGHT( Web_Site__c, 4) <> ".net" )** |
| **Billing Country** 코드가 유효한 2자리 ISO 코드인지 확인 | **OR, LEN, NOT, CONTAINS** | **OR(LEN(BillingCountry) = 1, NOT(CONTAINS("...유효 코드 목록...",BillingCountry)))** |