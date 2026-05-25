---
created: 2025-10-10
revised: 2025-10-10 17:57
tags:
  - salesforce
  - custom_objects
  - owd
  - role_hierarchies
  - private_sharing
  - record_access
  - profiles
reference:
  - "[[salesforce - hub]]"
---
# OWD 및 역할 계층 설정 (Set Organization-Wide Defaults and Role Hierarchy)
## Custom Object 생성 및 필드 추가
프로젝트의 레코드 접근 통제 기반을 마련하기 위해 세 개의 **Custom Object**를 생성하고, **Position** 개체에 **Picklist 필드**를 추가합니다.
### Custom Object 목록
|Label|Plural Label|Object Name|
|---|---|---|
|**Applicant**|Applicants|Applicant|
|**Interviewer**|Interviewers|Interviewer|
|**Position**|Positions|Position|
* **기본 설정**: 세 개 개체 모두 **Allow Reports**와 **Allow Search** 체크박스를 활성화합니다.
### Position 개체에 Custom Field 추가
* **Field Label**: `Status`
* **Data Type**: **Picklist**
* **Values**: `New`, `Open`, `Closed` (각 값은 새 줄로 구분)
## Organization-Wide Defaults (OWD) 설정
OWD는 레코드 접근의 **가장 엄격한 기본 수준**을 설정합니다.
### OWD 설정 (Private)
1. **Setup** $\rightarrow$ **Sharing Settings**로 이동합니다.
2. 다음 Custom Object들의 **Default Internal Access**를 **Private**으로 설정합니다.
* **Applicant**
* **Interviewer**
* **Position**
## 역할 계층 생성 및 사용자 할당
OWD가 **Private**으로 설정되었으므로, **Role Hierarchy**를 구축하여 상위 관리자들에게 하위 사용자 레코드에 대한 접근 권한을 **자동으로 확대**합니다.

|Role Label|Reports to|
|---|---|
|**VP of Services**|CEO|
|**Accounts Receivable**|VP of Services|
|**Customer Support Director**|VP of Services|
|**Customer Support Rep**|Customer Support Director|
|**Sales Engineer**|Director, Direct Sales|
|**Recruiter**|SVP, Human Resources|
### 사용자 역할 할당 목록
|사용자 이름|할당된 Role|
|---|---|
|**Noah Larkin**|VP of Services|
|**Maya Lorrette**|Accounts Receivable|
|**Amy Daniels**|Sales Engineer|
|**Ted Kim**|Recruiter|
|**Your Name (본인)**|Customer Support Rep|