---
created: 2025-10-11
tags: [salesforce, picklist_management, field_dependency, dynamic_default_value]
reference:
  - "[[salesforce - hub]]"
---
> **Last revised:** `= dateformat(this.file.mtime, "yyyy-MM-dd HH:mm")`

# 선택 목록 값 관리 (Manage Your Picklist Values)

## 핵심 용어 정의

### 선택 목록 값 관리 용어
**선택 목록 값 관리**는 데이터 일관성을 유지하고 데이터 입력 속도를 높이며, 사용자 경험을 개선하기 위해 선택 목록의 항목(Values)을 제어하는 모든 작업을 포함합니다.

| 용어 | 정의 | 역할 및 컨텍스트 |
| :--- | :--- | :--- |
| **Indexed Field** | 데이터베이스에서 빠른 검색을 지원하도록 저장된 필드. | 보고서 생성, 목록 보기 등 검색 성능을 최적화합니다. Salesforce가 자동으로 분석하여 할당합니다. |
| **Active Value** | 선택 목록 옵션으로 사용자 인터페이스(UI)에 **표시되는** 값입니다. | 사용자가 레코드 생성/편집 시 선택할 수 있습니다. |
| **Inactive Value** | 선택 목록 옵션으로 UI에 표시되지 않지만 **조직에서 완전히 제거되지 않은** 값입니다. | 기존 레코드의 데이터는 유지하며, 필요에 따라 다시 활성화할 수 있는 임시 제거 방법입니다. |
| **Controlling Field** | 종속 선택 목록의 표시 값을 결정하는 **제어 필드**입니다. | 사용자 정의/표준 선택 목록 또는 체크박스가 될 수 있습니다. |
| **Dependent Picklist** | 제어 필드의 선택 값에 따라 표시되는 값 목록이 필터링되는 **종속 선택 목록**입니다. | 데이터 무결성을 향상시키고 UI 공간을 절약합니다. |
| **Dynamic Default Value** | 특정 조건(예: 사용자 프로필, 현재 월 등)이나 다른 필드의 값에 따라 **자동으로 변경**되는 선택 목록의 기본값입니다. | 데이터 입력 속도를 높이는 데 사용됩니다. |

## 선택 목록 값 관리 및 상태

### 선택 목록 값 관리 위치
선택 목록 값은 해당 객체의 **Fields & Relationships** (필드 및 관계) 페이지에서 관리할 수 있습니다. 필드의 **Field Label** (필드 레이블)을 클릭하면 값 목록을 볼 수 있습니다.

### 값 관리 옵션

| 옵션 | 기능 | 참고 사항 |
| :--- | :--- | :--- |
| **Replace** | 기존 값을 새로운 값, 다른 값 또는 공백 값으로 대체합니다. | 기존 표준 선택 목록 값을 변경할 때는 공유하는 다른 표준 필드에도 영향이 가므로 주의해야 합니다. |
| **Delete** | 값을 완전히 삭제합니다. | 삭제 시 기존 레코드의 해당 값은 공백이 되며, 값을 유지하려면 **Deactivate**를 사용해야 합니다. |

### 활성, 비활성 및 삭제된 값

* **비활성** (Inactive) 값: UI에서 옵션으로 표시되지 않지만, **기존 레코드의 데이터는 유지**됩니다. 임시 제거에 유용합니다.
* 활성 및 비활성 값의 **총 합계**에는 제한이 있으므로, 제한에 도달하면 일부 값을 삭제해야 합니다.

### 값 편집 시 API 이름의 중요성

* **API Name**: 값의 **고유 식별자**로, 수식(Formulas) 및 프로그래밍 참조에 사용됩니다.
* Label이 변경되더라도 유효성을 유지하므로, 수식이나 사용자 정의 앱이 중단되는 것을 방지하기 위해 **API Name**은 일반적으로 변경하지 않습니다.

## 종속 선택 목록 설정 (Setting Dependent Picklists)

### 종속성 설정 단계
**Dependent Picklist** (종속 선택 목록)는 **Controlling Field** (제어 필드)의 값에 따라 선택 가능한 옵션을 좁혀 사용자 안내와 데이터 무결성을 향상시킵니다.

1.  객체의 관리 설정에서 **Fields & Relationships** $\rightarrow$ **Field Dependencies** $\rightarrow$ **New**를 클릭합니다.
2.  **Controlling Field**와 **Dependent Field**를 선택합니다.
3.  **Field Dependency Matrix**를 사용하여 제어 필드 값별로 어떤 종속 선택 목록 값이 유효한지 지정합니다.
4.  **Save**를 클릭합니다.

### 종속 선택 목록의 제약 사항
| 필드 유형 | 제어 필드 가능 | 종속 필드 가능 |
| :--- | :--- | :--- |
| **Custom Picklist** | Yes | Yes |
| **Standard Picklist** | Yes | No |
| **Multi-select Picklist** | No | Yes |

* **기본값 설정**: 종속 선택 목록에는 기본값을 설정할 수 없습니다. 제어 필드에만 기본값 설정이 가능합니다.

## 수식을 이용한 기본값 설정 (Dynamic Default Values)

### 동적 기본값 할당
수식(Formula)을 사용하여 특정 조건(예: 사용자 프로필, 현재 월)에 따라 선택 목록의 기본값을 동적으로 할당할 수 있습니다.

1.  해당 선택 목록 필드 옆의 **Edit**을 클릭합니다.
2.  General Options 아래에 수식을 추가합니다. (예: $\text{\$Profile.Name}$ 또는 $\text{MONTH(TODAY())}$ 함수 사용)
3.  수식이 활성 값으로 해석되지 않을 경우를 대비하여 **null** 또는 안전한 기본값을 정의해야 합니다.

## 필드 유형 변경 (Changing Field Type)

### 선택 목록 유형 변환
필요에 따라 **Custom Picklist** $\leftrightarrow$ **Multi-Select Picklist**로 상호 변환이 가능합니다.

* **주의**: **Multi-Select Picklist**를 **단일 선택 목록**으로 변환할 경우, 기존 레코드에 저장된 **모든 값은 지워집니다**. (단일 값만 허용하도록 변경되었기 때문입니다.)