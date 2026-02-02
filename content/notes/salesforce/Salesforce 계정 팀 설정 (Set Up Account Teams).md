---
created: 2025-10-11
revised: 2025-10-11 12:34
tags:
  - salesforce
  - account_teams
  - team_roles
  - default_account_team
  - collaboration
  - record_access
reference:
  - "[[salesforce - hub]]"
---
# Salesforce 계정 팀 설정 (Set Up Account Teams)
## 개요 및 목적
**Account Teams**는 판매 담당자 외에 고객 지원 담당자, 엔지니어 등 다양한 팀원들이 특정 고객 **Account**, **Opportunity**, **Case** 레코드에 대해 **협업 접근 권한**을 가질 수 있도록 설정하는 기능입니다.
### Account Teams 활성화 단계
1.  **Setup** $\rightarrow$ **Account Teams**로 이동하여 기능을 **활성화**합니다.
2.  **Account Teams Enabled** 체크박스를 선택하고 **Save**를 클릭합니다.
3.  **Account Layout** 체크박스를 선택하여 **Account Team** 관련 목록을 페이지 레이아웃에 추가합니다.
## Team Roles 정의
Account Team에 할당할 수 있는 **새로운 팀 역할**을 정의합니다.
### 신규 팀 역할 목록
1.  **Customer Support Rep**
2.  **Sales Engineer**
## Default Account Team 생성 및 할당
사용자가 생성하는 모든 새 계정에 자동으로 추가되도록 **Default Account Team**을 설정합니다.
### Default Account Team 멤버 설정 (Advanced User Details에서 설정)
|팀 멤버|Account Access|Opportunity Access|Case Access|Team Role|
|---|---|---|---|---|
|**Your Name (본인)**|Read/Write|Read/Write|Read/Write|Customer Support Rep|
|**Amy Daniels**|Read/Write|Read/Write|Read/Write|Sales Engineer|
### Default Team Account에 할당
1.  **App Launcher** $\rightarrow$ **Sales** 앱 $\rightarrow$ **Accounts** 탭으로 이동합니다.
2.  `All Accounts` 목록 보기에서 **Edge Communications** 계정을 선택합니다.
3.  **Account Team** 관련 목록에서 **Add Default Team**을 클릭하여 기본 팀을 해당 계정에 추가합니다.
4.  관련 목록에서 팀원이 올바르게 추가되었는지 확인합니다.
## 최종 프로젝트 요약
이 프로젝트를 통해 다음과 같은 **보안 및 접근 통제**를 구현했습니다.
* **프로필**: **Login Hours** 및 **IP Ranges**를 제한하여 로그인 접근을 통제하고, **Permission Sets**을 사용하여 **계정 삭제**와 같은 특정 권한을 예외적으로 부여했습니다.
* **OWD**: **Private**으로 설정하여 레코드 접근의 가장 제한적인 기준을 마련했습니다.
* **Role Hierarchy**: 구축된 계층 구조를 통해 관리자에게 레코드 접근 권한을 자동으로 확대했습니다.
* **Sharing Rules**: **Criteria-Based** 및 **Owner-Based** 규칙을 사용하여 팀과 역할 간의 협업 접근을 자동화했습니다.
* **Account Teams**: 계정 관련 개체에 대한 팀 기반 협업 접근을 가능하게 했습니다.