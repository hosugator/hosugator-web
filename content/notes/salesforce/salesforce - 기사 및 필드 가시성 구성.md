---
created: 2025-10-11
tags: [salesforce, article_visibility, field_level_security, knowledge_setup]
reference:
  - "[[salesforce - hub]]"
---
> **Last revised:** `= dateformat(this.file.mtime, "yyyy-MM-dd HH:mm")`
# 기사 및 필드 가시성 구성 (Configure Article and Field Visibility)

## 핵심 용어 정의

### 기사 가시성 (Article Visibility)
**기사 가시성** 설정은 특정 지식 기사를 누가 볼 수 있는지 결정합니다. 이 설정은 기사의 대상 독자층을 정의하는 데 사용되며, Salesforce Classic에서는 **채널 (channels)**이라고 불렸습니다.

| 가시성 설정 | 대상 독자 | 설명 |
| :--- | :--- | :--- |
| **Visible in Internal App** | 내부 사용자 | 모든 게시된 기사는 기본적으로 에이전트 및 관리자가 볼 수 있도록 내부 앱에 표시됩니다. |
| **Visible to Customer** | 인증된 고객 | Customer 프로필이 할당된 인증된 사용자가 셀프 서비스 사이트(Experience Cloud)를 통해 기사를 볼 수 있습니다. |
| **Visible to Partner** | 인증된 파트너 | Partner 프로필이 할당된 인증된 사용자가 파트너 사이트를 통해 기사를 볼 수 있습니다. 고객은 볼 수 없습니다. |
| **Visible in Public Knowledge Base** | 모든 독자 (인증 불필요) | 인증 없이 모든 독자가 볼 수 있는 기사입니다. |

## 기사 가시성 설정 관리

### 내부 앱 가시성 체크박스 제거
모든 기사는 기본적으로 내부 앱에 표시되므로, 에이전트와 작성자가 해당 체크박스를 항상 체크해야 하는 불필요한 작업을 줄이기 위해 페이지 레이아웃에서 **Visible in Internal App** 체크박스를 제거할 수 있습니다.

1.  Setup에서 **Object Manager**를 클릭하고 **Knowledge**를 선택합니다.
2.  **Page Layouts**를 클릭하고 **Procedure - Reader** 페이지 레이아웃을 클릭합니다.
3.  Properties 섹션으로 스크롤합니다.
4.  Visible in Internal App 필드 위에 마우스를 올린 후, 제거 버튼을 클릭하여 페이지 레이아웃에서 해당 필드를 제거합니다.
5.  Save를 클릭합니다.
6.  Procedure - Author, FAQ - Reader, FAQ - Author 페이지 레이아웃에 대해 이 과정을 반복하여 에이전트와 팀이 사용하는 모든 레이아웃에서 필드를 제거합니다.

## 특정 필드 가시성 제어

### 필드 수준 보안을 사용한 가시성 제어
필드 수준 보안 (Field-Level Security)을 사용하여 기사 내 개별 필드에 누가 접근하거나 상호작용할 수 있는지 제어할 수 있습니다. 
이는 사용자 프로필을 기반으로 필드를 숨기거나 표시하는 데 사용됩니다.

* 필드를 모두에게 표시하되 특정 프로필의 사용자에게만 상호작용을 허용하도록 제한할 수도 있습니다.
* 기밀 정보나 고객에게 혼란을 줄 수 있는 내부 전용 주석 등을 추적할 때 유용합니다.

### 내부 주석 필드에 대한 가시성 설정 예시
Maria는 내부 전용 주석을 추적하는 사용자 정의 필드인 **Internal Comments**를 **Custom:Support** 프로필을 사용하는 사용자에게만 보이도록 설정합니다.

1.  Setup에서 **Object Manager**를 클릭하고 **Knowledge**를 선택합니다.
2.  **Fields & Relationships**를 클릭하고 **New**를 클릭합니다.
3.  데이터 유형으로 **Text Area (Rich)**를 선택하고 Next를 클릭합니다.
4.  필드 레이블로 **Internal Comments**를 입력하고 Next를 클릭합니다.
5.  **필드 수준 보안 (Field-Level Security)** 설정 단계에서 **Custom:Support** 프로필에 대해서만 **Visible**을 선택하고, 다른 프로필에 대해서는 Visible을 선택 해제합니다.
6.  Next를 클릭합니다.
7.  필드를 모든 페이지 레이아웃에 추가하고 **Save**를 클릭합니다.