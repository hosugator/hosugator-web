---
created: 2025-10-11
tags: [salesforce, lookup_filter, lookup_relationship, case_management, data_validation]
reference:
  - "[[salesforce - hub]]"
---
> **Last revised:** `= dateformat(this.file.mtime, "yyyy-MM-dd HH:mm")`

# 조회 필터 생성 (Create Lookup Filters)

## 핵심 용어 정의

| 용어 | 정의 | 역할 및 컨텍스트 |
| :--- | :--- | :--- |
| **Lookup Filter** (조회 필터) | 조회 (Lookup) 필드에서 사용자가 선택할 수 있는 레코드의 목록을 제한하는 기능입니다. | 데이터 입력 시 정확도를 높이고 사용자가 관련 없는 레코드를 선택하는 것을 방지합니다. |
| **Lookup Relationship** (조회 관계) | 한 객체의 필드를 다른 객체 또는 사용자에게 연결하여 데이터에 쉽게 접근할 수 있도록 하는 관계 필드 유형입니다. | **Case** $\rightarrow$ **User** (Backup Agent)와 같이 객체 간의 약한 연결을 생성합니다. |
| **Source Record** (소스 레코드) | 필터가 적용되는 현재 레코드 (예: Case). | 필터 조건을 설정할 때 현재 레코드의 필드 값을 참조하는 데 사용됩니다. |
| **Target Record** (대상 레코드) | 조회 필드에서 선택하려는 레코드 (예: User, Contact). | 필터 조건을 설정할 때 대상 레코드의 필드 값을 참조하는 데 사용됩니다. |
| **Required** (필수) 필터 | 필터 조건을 충족하는 레코드만 선택하도록 **강제**하는 필터 유형입니다. | 필터 조건에 맞지 않는 레코드는 선택이 불가능합니다. |

## 1. Backup Agent 조회 관계 필드 생성

### 조회 필드 생성 (Case $\rightarrow$ User)
**Case** 객체에 **Backup Agent**라는 새로운 조회 필드를 생성하여 **User** 객체와 연결합니다.

1.  Object Manager $\rightarrow$ **Case** $\rightarrow$ **Fields & Relationships** $\rightarrow$ **New**를 클릭하고 Data Type으로 **Lookup Relationship**을 선택합니다.
2.  Related To (관련 대상) 목록에서 **User**를 선택합니다.
3.  Field Label: **Backup Agent**, Field Name: **Backup_Agent**를 입력합니다.
4.  Description과 Help Text를 입력합니다.

### Backup Agent 조회 필터 설정
조회 필터를 설정하여 **Support User** 프로필을 가진 사용자만 Backup Agent로 선택할 수 있도록 제한합니다.

1.  Lookup Filter 섹션에서 **Show Filter Settings**를 클릭합니다.
2.  필터 세부 정보를 다음과 같이 설정합니다.
    * Field: $\text{User: Profile: Name}$
    * Operator: $\text{equals}$
    * Value/Field: $\text{Value}$ / $\text{Support User}$
3.  **Next**를 클릭합니다.

### Backup Agent 필드 보안 설정
**Support User** 프로필만 Backup Agent 필드를 편집할 수 있도록 설정합니다.
1.  Read-Only 열 헤더의 체크박스를 선택하여 모든 프로필을 읽기 전용으로 설정합니다.
2.  **Support User** 프로필의 Read-Only 체크박스를 **선택 해제**합니다.
3.  **Next**를 클릭합니다.
4.  Close Case Layout의 체크박스를 선택 해제하고 **Save**를 클릭합니다.

## 2. Contact Name 필드에 필터 추가

### Contact Name 필드 필터링
**Case**의 **Contact Name** 필드에 필터를 추가하여, 사용자가 **Case** 레코드의 **Account Name** 필드에 지정된 계정과 **연관된 연락처**만 선택할 수 있도록 강제합니다.

1.  Case 객체의 Fields & Relationships에서 **Contact Name** 필드를 선택하고 **Edit**을 클릭합니다.
2.  Lookup Filter 섹션에서 **Show Filter Settings**를 클릭합니다.
3.  필터 세부 정보를 다음과 같이 설정합니다.
    * Field: $\text{Contact Name: Account ID}$ (대상 필드)
    * Operator: $\text{equals}$
    * Value/Field: $\text{Field}$ / $\text{Case: Account ID}$ (소스 필드)
    * 이는 **연락처의 계정 ID**가 **현재 사례의 계정 ID**와 같아야 함을 의미합니다.
4.  Filter Type 옆에 **Required**가 선택되어 있는지 확인합니다.
5.  **Save**를 클릭합니다.