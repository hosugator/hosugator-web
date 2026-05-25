---
created: 2025-10-11
tags: [salesforce, custom_field, field_level_security, profile_management, data_quality]
reference:
  - "[[salesforce - hub]]"
---
> **Last revised:** `= dateformat(this.file.mtime, "yyyy-MM-dd HH:mm")`

# 표준 및 사용자 정의 필드 작업 (Work with Standard and Custom Fields)

## 핵심 용어 정의

| 용어 | 정의 | 역할 및 컨텍스트 |
| :--- | :--- | :--- |
| **Profile** (프로필) | 사용자 그룹의 설정 및 권한 집합을 정의하는 요소입니다. | **Sales User**와 **Support User**와 같이 특정 직무별로 권한을 관리하는 데 사용됩니다. |
| **Field Label** (필드 레이블) | 사용자 인터페이스(UI)에 표시되는 필드의 이름입니다. | 사용자 이해를 돕기 위해 **Rating** $\rightarrow$ **Prospect Rating**으로 변경됩니다. |
| **Help Text** (도움말 텍스트) | 필드 이름 옆에 표시되어 사용자가 필드 사용 목적을 이해하도록 돕는 안내 문구입니다. | 데이터 입력의 정확성을 높입니다. |
| **Field-Level Security** (필드 수준 보안) | 특정 프로필에 대해 필드의 가시성 (Visible) 및 접근성 (Read-Only)을 제어하는 설정입니다. | 데이터의 기밀성을 유지하고 데이터 입력 권한을 통제합니다. |
| **Custom Field** (사용자 정의 필드) | 조직의 특정 요구사항을 충족시키기 위해 생성하는 필드입니다. | **Has Support Plan** (체크박스), **Support Plan Expiration Date** (날짜) 등 |

## 프로필 사용자 정의 및 필드 설정

### 새로운 프로필 생성
**Standard User** 프로필을 복제하여 **Sales User** 및 **Support User** 프로필을 생성합니다.
* Setup 메뉴에서 **Profiles**를 선택합니다.
* **Standard User** 옆의 **Clone**을 클릭하여 **Sales User**를 생성하고 저장합니다.
* **Standard User** 옆의 **Clone**을 다시 클릭하여 **Support User**를 생성하고 저장합니다.

### 표준 필드 레이블 변경 (Account Rating)
**Account** 객체의 표준 필드 `Rating`의 레이블을 **Prospect Rating**으로 변경하여 사용자의 이해를 돕습니다.
* Setup 메뉴에서 **Rename Tabs and Labels**를 선택합니다.
* Accounts 옆의 **Edit**을 클릭합니다.
* Rating 필드의 Singular 열에서 **Prospect Rating**으로 변경하고 저장합니다.

## Prospect Rating 필드 업데이트 및 보안 설정

### 도움말 텍스트 및 픽리스트 값 추가
**Prospect Rating** 필드에 **Help Text**를 추가하여 사용 지침을 제공하고, 새로운 픽리스트 값 **Not Known**을 추가합니다.
* Object Manager $\rightarrow$ **Account** $\rightarrow$ **Fields & Relationships**를 클릭합니다.
* **Prospect Rating**을 클릭하고 **Edit**을 클릭합니다.
* Help Text를 입력하고 저장합니다.
* Account Rating Picklist Values 섹션에서 **New**를 클릭하여 **Not Known**을 추가하고 저장합니다.

### 필드 수준 보안 설정
**Prospect Rating** 필드에 대해 **Sales User**를 제외한 모든 프로필을 **읽기 전용**으로 설정합니다.
1. Prospect Rating 필드 세부 정보 페이지에서 **Set Field-Level Security**를 클릭합니다.
2. Read-Only 열 헤더의 체크박스를 **선택**하여 모든 프로필을 읽기 전용으로 설정합니다.
3. **Sales User** 프로필의 Read-Only 체크박스를 **선택 해제**하여 **Sales User**만 편집 가능하게 합니다.
4. 저장합니다.

## 사용자 정의 필드 생성 (Checkbox 및 Date)

### 1. Has Support Plan (체크박스) 필드 생성
영업 및 지원 사용자만 편집할 수 있는 **Has Support Plan** 체크박스 필드를 생성합니다.
1. Object Manager $\rightarrow$ **Account** $\rightarrow$ **Fields & Relationships** $\rightarrow$ **New**를 클릭하고 **Checkbox**를 선택합니다.
2. Field Label: **Has Support Plan**
3. Default Value: **unchecked**
4. Description과 Help Text를 입력합니다.
5. **Field-Level Security** 설정 시, Read-Only 열 헤더를 선택한 후, **Sales User**와 **Support User**의 Read-Only 체크박스를 **선택 해제**하여 편집 가능하게 설정합니다.
6. 페이지 레이아웃을 선택하고 **Save & New**를 클릭합니다.

### 2. Support Plan Expiration Date (날짜) 필드 생성
영업 및 지원 사용자만 편집할 수 있는 **Support Plan Expiration Date** 날짜 필드를 생성합니다.
1. Data Type으로 **Date**를 선택합니다.
2. Field Label: **Support Plan Expiration Date**
3. Description과 Help Text를 입력합니다.
4. **Field-Level Security** 설정 시, Read-Only 열 헤더를 선택한 후, **Sales User**와 **Support User**의 Read-Only 체크박스를 **선택 해제**하여 편집 가능하게 설정합니다.
5. 페이지 레이아웃을 선택하고 **Save**를 클릭합니다.