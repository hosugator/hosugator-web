---
created: 2025-10-11
tags: [salesforce, picklist, global_value_set, field_dependency, sales_operations]
reference:
  - "[[salesforce - hub]]"
---
> **Last revised:** `= dateformat(this.file.mtime, "yyyy-MM-dd HH:mm")`

# 선택 목록 및 필드 종속성 생성 (Create Picklists and Field Dependencies)

## 핵심 용어 정의

| 용어 | 정의 | 역할 및 컨텍스트 |
| :--- | :--- | :--- |
| **Picklist** (선택 목록) | 특정 필드에 대해 미리 정의된 옵션 목록을 제공하여, 사용자가 직접 입력하는 대신 값을 선택하게 합니다. | 데이터 입력 오류를 줄이고 데이터의 일관성을 유지합니다. |
| **Global Picklist Value Set** (전역 선택 목록 값 집합) | 여러 객체의 선택 목록 필드에서 공통으로 사용할 수 있도록 값을 중앙에서 관리하는 집합입니다. | **Region**과 같이 조직 전반에서 표준화된 값 목록이 필요한 경우 사용됩니다. |
| **Field Dependency** (필드 종속성) | 하나의 필드 (제어 필드)의 값에 따라 다른 필드 (종속 필드)에 표시되는 선택 목록 값을 필터링하는 기능입니다. | **Region** 값에 따라 **Zone** 목록이 바뀌는 등 사용자 인터페이스를 간소화합니다. |
| **Controlling Field** (제어 필드) | 종속 필드의 값 목록을 결정하는 필드입니다 (예: Region, Stage). | |
| **Dependent Field** (종속 필드) | 제어 필드의 선택에 따라 표시되는 값 목록이 달라지는 필드입니다 (예: Zone, Close Reason). | |

## 1. 전역 선택 목록 (Region) 생성 및 할당

### Region 전역 값 집합 생성
Sales Operations의 요구에 맞춰 Region 값 목록을 정의하는 **전역 선택 목록 값 집합**을 생성합니다.

1.  Setup $\rightarrow$ **Picklist Value Sets**를 선택하고 **New**를 클릭합니다.
2.  Label: **Region**, Name: **Region**
3.  Description: *For use in region fields throughout AW’s org.*
4.  Regions 값 (APAC, EMEA, LATAM, US, Canada)을 한 줄씩 입력하고 **Save**를 클릭합니다.

### Lead 및 Account 객체에 Region 필드 생성
전역 값 집합 **Region**을 사용하여 **Lead** 객체와 **Account** 객체에 **Region** 픽리스트 필드를 생성합니다.

1.  Object Manager $\rightarrow$ **Lead** $\rightarrow$ **Fields & Relationships** $\rightarrow$ **New**를 클릭하고 Data Type으로 **Picklist**를 선택합니다.
2.  Field Label: **Region**
3.  **Use global picklist value set**을 선택하고 **Region**을 할당합니다.
4.  Field-Level Security 설정 시, Read-Only 열 헤더를 선택하고 **Sales User**의 Read-Only 체크박스를 **선택 해제**합니다.
5.  저장합니다.
6.  **Account** 객체로 돌아가 위 단계를 반복하여 동일한 **Region** 필드를 생성합니다.

## 2. Zone 필드 및 지역 종속성 생성

### Account 객체에 Zone 필드 생성
Account 객체에 **Zone** 픽리스트 필드를 생성합니다. 이 필드는 전역이 아닌 **개별 값**을 입력합니다.

1.  Object Manager $\rightarrow$ **Account** $\rightarrow$ **Fields & Relationships** $\rightarrow$ **New**를 클릭하고 **Picklist**를 선택합니다.
2.  Field Label: **Zone**
3.  **Enter values**를 선택하고 제공된 Zone 목록 값들을 한 줄씩 입력합니다.
4.  Field-Level Security 설정 시, Read-Only 열 헤더를 선택하고 **Sales User**의 Read-Only 체크박스를 **선택 해제**합니다.
5.  저장합니다.

### Region-Zone 필드 종속성 생성
**Region**의 선택에 따라 **Zone** 값이 필터링되도록 종속성을 생성합니다.

1.  Account 객체의 Fields & Relationships에서 **Field Dependencies** $\rightarrow$ **New**를 클릭합니다.
2.  Controlling Field: **Region**, Dependent Field: **Zone**을 선택하고 **Continue**를 클릭합니다.
3.  **Region** 값 열에 맞춰 해당 **Zone** 값들을 선택하고 **Include Values**를 클릭하여 매핑합니다. (예: APAC 열에 East Asia, Oceania, Southeast Asia 선택)
4.  **Save**를 클릭합니다.

## 3. Opportunity 객체에 Close Reason 필드 생성

### Close Reason 다중 선택 픽리스트 생성
Opportunity의 승리 또는 패배 이유를 추적하기 위해 **Close Reason** 다중 선택 픽리스트 필드를 생성합니다.

1.  Object Manager $\rightarrow$ **Opportunity** $\rightarrow$ **Fields & Relationships** $\rightarrow$ **New**를 클릭하고 **Picklist (Multi-Select)**를 선택합니다.
2.  Field Label: **Close Reason**
3.  **Enter values**를 선택하고 제공된 Won/Lost 이유 값들을 한 줄씩 입력합니다.
4.  # Visible Lines를 **6**으로 설정합니다.
5.  Field-Level Security 설정 시, Read-Only 열 헤더를 선택하고 **Sales User**의 Read-Only 체크박스를 **선택 해제**합니다.
6.  저장합니다.

### Stage-Close Reason 필드 종속성 생성
Opportunity의 **Stage** 값에 따라 **Close Reason** 필드에 표시되는 값이 필터링되도록 종속성을 생성합니다.

1.  Opportunity 객체의 Fields & Relationships에서 **Field Dependencies** $\rightarrow$ **New**를 클릭합니다.
2.  Controlling Field: **Stage**, Dependent Field: **Close Reason**을 선택하고 **Continue**를 클릭합니다.
3.  테이블 상단에서 Closed Won 및 Closed Lost 열을 찾습니다.
4.  **Closed Won** 열에 대해 "Won"으로 시작하는 모든 **Close Reason** 값들을 선택합니다.
5.  **Closed Lost** 열에 대해 "Lost"로 시작하는 모든 **Close Reason** 값들을 선택합니다.
6.  **Save**를 클릭하고, 모든 종속 값이 포함되지 않았다는 경고를 **OK**로 수락합니다.