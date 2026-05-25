---
created: 2025-10-11
tags: [salesforce, record_type, page_layout, picklist_management, business_process]
reference:
  - "[[salesforce - hub]]"
---
> **Last revised:** `= dateformat(this.file.mtime, "yyyy-MM-dd HH:mm")`

# 레코드 유형 생성 (Create Record Types)

## 핵심 용어 정의

| 용어 | 정의 | 역할 및 컨텍스트 |
| :--- | :--- | :--- |
| **Record Type** (레코드 유형) | 객체 (Object) 내에서 다양한 비즈니스 프로세스, 페이지 레이아웃 및 픽리스트 값 목록을 정의하는 기능입니다. | 사용자 역할이나 레코드 유형에 따라 **Account** 객체에 **Customer Account**와 **Partner Account**처럼 다른 환경을 제공합니다. |
| **Business Process** (비즈니스 프로세스) | 리드, 사례, 판매 프로세스 등 레코드의 라이프사이클을 정의하는 요소입니다. | 레코드 유형과 결합하여 사용되며, 여기서는 기본 **Master** 프로세스를 사용합니다. |
| **Page Layout** (페이지 레이아웃) | 레코드의 세부 정보 및 편집 페이지에 표시되는 필드, 섹션 및 관련 목록의 배열을 제어합니다. | 레코드 유형별로 다른 레이아웃을 할당하여 사용자에게 필요한 필드만 보여줍니다. |

## Customer Account 레코드 유형 생성

### Customer Account 레코드 유형 생성
고객 및 잠재 고객을 위한 **Customer Account** 레코드 유형을 생성합니다.

1. Object Manager $\rightarrow$ **Account** $\rightarrow$ **Record Types** $\rightarrow$ **New**를 클릭합니다.
2. Existing Record Type: **Master**를 선택합니다.
3. Record Type Label: **Customer Account**, Record Type Name: **Customer_Account**를 입력합니다.
4. Description: *For customers and prospects*
5. **Active**를 선택합니다.
6. 프로필 가용성 설정 시, **Sales User**와 **System Administrator** 프로필만 **선택**합니다.
7. Page Layout 할당: **Account Layout**을 선택합니다.
8. 저장합니다.

### Industry 픽리스트 값 수정 (Customer Account)
**Customer Account** 레코드 유형에서 **Industry** 필드 값 중 **Consulting**과 **Education**을 **제거**합니다.

1. Industry 필드 옆의 Action 열에서 **Edit**을 클릭합니다.
2. Selected Values 목록에서 $\text{Ctrl/Command}$를 누른 채 **Consulting**과 **Education**을 선택합니다.
3. **Remove**를 클릭하여 값을 제거하고 저장합니다.

## Partner Account 레코드 유형 생성

### Partner Account 레코드 유형 생성
컨설팅 파트너를 위한 **Partner Account** 레코드 유형을 생성합니다.

1. Account 객체의 Record Types에서 **New**를 클릭합니다.
2. Record Type Label: **Partner Account**, Record Type Name: **Partner_Account**를 입력합니다.
3. Description: *For consulting partners*
4. **Active**를 선택합니다.
5. 프로필 가용성 설정 시, **Partner App Subscription User, Partner Community Login User, Partner Community User** 프로필만 **선택**합니다.
6. Page Layout 할당: **Account Layout**을 선택하고 저장합니다.

### Industry 픽리스트 값 수정 (Partner Account)
**Partner Account** 레코드 유형에서 **Industry** 필드에 **Consulting**과 **Education**만 **남겨둡니다**.

1. Industry 필드 옆의 Action 열에서 **Edit**을 클릭합니다.
2. Selected Values 목록의 모든 값을 선택합니다.
3. $\text{Ctrl/Command}$를 누른 채 **Consulting**과 **Education**을 **선택 해제**합니다.
4. **Remove**를 클릭하여 선택된 값들을 제거합니다. (남은 값: Consulting, Education)
5. 저장합니다.

### Type 픽리스트 값 수정 (Partner Account)
**Partner Account** 레코드 유형에서 **Type** 필드에 **Channel Partner/Reseller, Installation Partner, Technology Partner, Other**만 남깁니다.

1. Type 필드 옆의 Action 열에서 **Edit**을 클릭합니다.
2. Selected Values 목록에서 $\text{Ctrl/Command}$를 누른 채 **Prospect, Customer - Direct, Customer - Channel**을 선택합니다.
3. **Remove**를 클릭하여 해당 값들을 제거하고 저장합니다.