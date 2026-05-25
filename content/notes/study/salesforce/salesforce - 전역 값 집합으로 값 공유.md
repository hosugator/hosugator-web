---
created: 2025-10-11
tags: [salesforce, global_value_set, picklist_management, data_consistency]
reference:
  - "[[salesforce - hub]]"
---
> **Last revised:** `= dateformat(this.file.mtime, "yyyy-MM-dd HH:mm")`

# 전역 값 집합으로 값 공유 (Share Values with Global Value Sets)

## 핵심 용어 정의

### 전역 값 집합 (Global Value Set)
**전역 값 집합**은 둘 이상의 선택 목록 필드에서 **동일한 값 목록**을 공유할 수 있도록 생성하는 사용자 정의 값 집합입니다.

| 용어 | 정의 | 특징 |
| :--- | :--- | :--- |
| **Global Value Set** | 여러 사용자 정의 선택 목록 필드에서 공유하는 **표준화된 값 목록**입니다. | 값의 일관성을 보장하며, 이 값 집합에서 값을 변경하면 이를 참조하는 **모든** 선택 목록 필드에 즉시 반영됩니다. |
| **Restricted** | **제한된 상태**. 관리자가 정의한 값 외에 **API**나 외부 앱을 통해 새로운 값이 추가되는 것을 **차단**하는 필드 속성입니다. | 전역 값 집합은 항상 이 상태이며, 데이터 무결성을 유지합니다. |

## 전역 값 집합 생성 및 사용

### 전역 값 집합 생성 단계
전역 값 집합을 생성하면 나중에 사용자 정의 선택 목록을 생성할 때 이 값을 사용할 수 있습니다.

1.  Setup에서 Quick Find 상자에 **Picklist**를 입력하고 **Picklist Value Sets**를 선택합니다.
2.  Global Value Sets 섹션 옆의 **New**를 클릭합니다.
3.  전역 값 집합의 **Label**과 **Description**을 입력합니다.
4.  값을 한 줄에 하나씩 입력하고 **Save**를 클릭합니다.

### 선택 목록 필드에서 전역 값 집합 사용
새 사용자 정의 선택 목록 필드를 생성할 때, 해당 필드의 값으로 전역 값 집합을 선택하여 사용합니다.

1.  객체의 Fields & Relationships 페이지에서 **New**를 클릭하고 **Picklist**를 선택합니다.
2.  **Use a global value set** (전역 값 집합 사용) 옵션을 유지한 후, 드롭다운 목록에서 사용할 전역 값 집합을 선택합니다.
3.  필드 수준 보안 및 페이지 레이아웃 설정을 완료하고 **Save**를 클릭합니다.

## 전역 값 집합 관리

### 전역 값 집합 값 관리
전역 값 집합에 대한 변경 사항은 이를 사용하는 **모든 선택 목록 필드**에 영향을 미치므로 신중하게 관리해야 합니다.

* **관리 위치**: Setup $\rightarrow$ **Picklist Value Sets** $\rightarrow$ 해당 전역 값 집합의 Label 클릭.
* **값 대체**: 값을 대체할 때, **Replace all blank values** 옵션을 선택하면 현재 공백인 필드에 새로운 값이 할당됩니다.

### 기본값 설정
* 전역 값 집합 자체에 **기본값**을 정의할 수 있습니다.
* 전역 값 집합을 사용하는 **개별 필드**는 전역 값 집합의 기본값과 **별개로 자체 기본값**을 가질 수 있으며, 이는 수식 기본값에도 적용됩니다.

## 기존 값 집합을 전역 값 집합으로 승격 (Promote Existing Values)

### 기존 필드의 값 승격 단계
이미 사용 중인 사용자 정의 선택 목록 필드의 값 집합을 다른 필드와 공유하기 위해 **전역 값 집합**으로 승격할 수 있습니다.

1.  승격할 선택 목록을 포함하는 객체의 Fields & Relationships 섹션으로 이동합니다.
2.  해당 선택 목록의 **Field Label**을 클릭하고 **Edit**을 클릭합니다.
3.  **Promote to Global Value Set**을 클릭합니다.
4.  새로운 전역 값 집합의 Label을 입력하고, Field Name 및 Description을 확인합니다.
5.  **Promote to Global Value Set**을 다시 클릭하여 승격합니다.