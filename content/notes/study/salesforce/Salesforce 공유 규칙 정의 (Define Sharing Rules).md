---
created: 2025-10-10
revised: 2025-10-10 15:13
tags:
  - salesforce
  - sharing_rules
  - public_groups
  - criteria_based_sharing
  - record_access
  - role_hierarchies
  - owd
reference:
  - "[[salesforce - hub]]"
---
# Salesforce 공유 규칙 정의 (Define Sharing Rules)
## 공유 규칙을 통한 접근 확대
**Sharing Rules**는 **Organization-Wide Defaults (OWD)**가 **Public Read Only** 또는 **Private**일 경우에 특정 사용자 그룹에 대한 자동 예외 규칙을 만들어 레코드 접근을 **확대**하는 데 사용됩니다. 
공유 규칙은 OWD보다 더 엄격하게 접근을 제한할 수 없습니다.
### 공유 규칙의 3가지 구성 요소
|요소|설명|
|---|---|
|**공유할 레코드**|특정 사용자 소유 레코드 또는 특정 **Criteria** (기준)를 만족하는 레코드.|
|**공유 대상 사용자**|**Role** (역할), **Territory** (영역) 또는 **Public Group** (공개 그룹)으로 정의됩니다.|
|**접근 유형**|**Read-Only** 또는 **Read/Write** 접근 권한을 부여합니다.|
### Public Groups (공개 그룹)
**Public Groups**는 공유 규칙 생성을 단순화하기 위해 관리자가 정의하는 사용자 그룹입니다. 
**개별 사용자**, **역할**, **역할 및 부하 직원**, **다른 공개 그룹** 등의 조합으로 구성될 수 있습니다.
## 핸즈온 챌린지 수행 단계 요약
챌린지의 목표는 **Program** 개체에 **Type** 필드를 추가하고, `Type`이 `Campus Outreach`인 레코드를 **Recruiter** 역할에게 **Read/Write** 권한으로 자동 공유하는 **Criteria-Based Sharing Rule**을 생성하는 것입니다.
### 1. Program 개체에 Custom Field 생성
|필드 유형|Label|Name|값 (Picklist Values)|
|---|---|---|---|
|**Picklist**|`Type`|`Type`|`Campus Outreach`, `Development`, `Research`|
* **Field-Level Security**: 모든 프로필에 **Visible** 또는 모든 권한 집합에 **Read Access**로 설정합니다.
### 2. Program 개체에 Criteria-Based Sharing Rule 생성
**Program** 개체의 OWD가 **Private**이므로, 이 공유 규칙이 접근을 확대합니다.

|설정 항목|값|
|---|---|
|**Label**|`Campus Outreach Programs`|
|**Rule Type**|**Based on criteria**|
|**기준 필터**|**Field**: `Type` **Operator**: `equals` **Value**: `Campus Outreach`|
|**Share with (대상)**|**Role**: `Recruiter`|
|**Access level**|**Read/Write**|