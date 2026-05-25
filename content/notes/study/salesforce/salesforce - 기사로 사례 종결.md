---
created: 2025-10-11
tags: [salesforce, knowledge, service_console, lightning_app_builder, case_integration, data_category_mapping]
reference:
  - "[[salesforce - hub]]"
---
> **Last revised:** `= dateformat(this.file.mtime, "yyyy-MM-dd HH:mm")`

# 기사로 사례 종결 (Close Cases with Articles)

## 핵심 용어 정의

### Knowledge - Case 통합 용어 정의
이 유닛은 **Knowledge (지식)** 시스템을 **Case (사례)** 관리 워크플로우에 통합하는 데 사용되는 주요 구성 요소와 설정을 다룹니다.

| 용어 | 정의 | 역할 및 컨텍스트 |
| :--- | :--- | :--- |
| **Knowledge Component** | Lightning App Builder를 사용하여 Case Record Page에 추가되는 표준 구성 요소. | 에이전트가 사례를 보는 동안 관련 기사를 검색하고 볼 수 있는 패널을 제공합니다. |
| **Data Category Mapping** | 사례 객체의 특정 필드(예: Product) 값을 Knowledge의 Data Categories에 연결하는 설정. | 에이전트가 사례를 열 때 Knowledge 검색 결과가 자동으로 필터링되도록 설정하여 검색 효율성을 높입니다. |
| **Articles Related List** | 사례 객체의 페이지 레이아웃에 추가되는 관련 목록. | 해당 사례를 해결하는 데 사용되거나 고객에게 첨부된 기사(Article) 목록을 추적합니다. |
| **Communication Channel Mappings** | 기사 레코드 유형별로 이메일과 같은 통신 채널에 포함될 필드(예: FAQ의 Question/Answer)를 정의하는 설정. | 에이전트가 기사 내용을 이메일로 보낼 때, 깔끔한 형식으로 발송되도록 필드를 매핑합니다. |
| **Knowledge One** | Salesforce Lightning Experience에서 Knowledge 검색 및 상호 작용을 위한 기능 모음. | 검색 결과 하이라이트, 자동 완성, 사례에 기반한 기사 제안 등을 활성화하여 검색 경험을 향상시킵니다. |

## 지식 구성 요소 설정 (Knowledge Component Setup)

### 서비스 콘솔에 지식 구성 요소 추가
에이전트가 사례 레코드 페이지에서 **Knowledge**를 보고 사용할 수 있도록 해당 구성 요소를 추가해야 합니다.

* 사례 레코드 페이지에서 **Edit Page (페이지 편집)**를 선택합니다.
* Standard Components 목록에서 **Knowledge** 구성 요소를 사례 레코드 페이지의 원하는 위치로 드래그합니다.
* **Save**를 클릭한 후 **Activate**를 클릭하여 페이지를 활성화합니다.

### 기사를 사례에 첨부하도록 설정
에이전트가 사례에 기사를 첨부하여 참고 자료로 활용할 수 있도록 관련 목록과 도구 설정을 활성화합니다.

1.  Setup에서 **Object Manager** $\rightarrow$ **Case** $\rightarrow$ **Case Page Layouts**로 이동합니다.
2.  페이지 레이아웃 편집 모드에서 **Related Lists**를 클릭하고 **Articles** 관련 목록을 페이지로 드래그하여 추가합니다.
3.  페이지 상단의 **Feed View**를 클릭합니다.
4.  Article Tool Settings로 스크롤하여 **Enable attaching Articles inline**을 선택하고 Save를 클릭합니다.

## 통신 및 검색 설정 (Communication and Search Configuration)

### 통신 채널 매핑 활성화
에이전트가 기사를 이메일로 발송할 수 있도록 레코드 유형별로 이메일에 포함할 필드를 매핑합니다.

1.  Setup $\rightarrow$ **Object Manager** $\rightarrow$ **Knowledge** $\rightarrow$ **Communication Channel Mappings**로 이동합니다.
2.  **New**를 클릭하고 Label과 Record Type을 지정합니다 (예: FAQ).
3.  Selected channels로 **Email**을 이동시키고, Selected Fields로 **Question**과 **Answer** 필드를 이동하고 Save를 클릭합니다.

### 지식 검색 설정 구성
검색 결과의 효율성과 관련성 높은 기사 제안을 위해 **Knowledge One** 설정을 활성화합니다.

1.  Setup에서 Quick Find 상자에 **Knowledge**를 입력하고 **Knowledge Settings**를 클릭합니다.
2.  Edit을 클릭합니다.
3.  **Knowledge One** 섹션에서 다음 네 가지 옵션을 모두 활성화합니다.
    * Highlight relevant article text within search results
    * Auto-complete keyword search
    * Auto-complete title search
    * Suggest related articles on cases
4.  **Case Fields Used to Find Selected Articles** 아래에서 기사 제안에 유용한 필드를 선택하고 순서를 조정합니다 (예: Case Reason, Case Type 추가).
5.  **Enable Case Data Category Mapping**을 선택하고 Save를 클릭합니다.

### 데이터 범주를 사례에 매핑
사례의 필드(예: Product)를 기사의 데이터 범주(예: Solar Hot Water Heater Installation)에 매핑하여 사례 기반의 검색 필터를 자동 적용합니다.

1.  Setup에서 Quick Find 상자에 **Data Categories**를 입력하고 **Data Category Mappings**를 클릭합니다.
2.  Case Field (사례 필드)를 선택합니다 (예: **Product**).
3.  Data Category Group을 선택하고 Default Data Category를 선택한 후 **Add**를 클릭합니다.