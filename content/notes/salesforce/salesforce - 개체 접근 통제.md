---
created: 2025-10-10
revised: 2025-10-10 12:19
tags:
  - data_access
  - object_permissions
  - profiles
  - permission_sets
  - permission_set_groups
  - recruiting_app
  - salesforce
reference:
  - "[[salesforce - hub]]"
---
# 개체 접근 통제 (Control Access to Objects)
개체(Object) 접근 통제는 데이터 보안의 **가장 기본적인 수준**이며, 사용자가 특정 개체(예: Leads, Contacts)의 레코드에 대해 **Read, Create, Edit, Delete** 권한을 가질지 정의합니다.
## 1. 개체 접근 통제 구성 요소
Salesforce에서 개체 수준 접근 권한을 관리하는 주요 세 가지 도구입니다. **Permission Sets** 및 **Permission Set Groups** 사용이 권장됩니다.

|구성 요소|사용 목적|특징|
|---|---|---|
|**Profiles** (프로필)|사용자의 **기본 설정** 정의|사용자당 **하나**만 할당 가능. 할당된 앱, 페이지 레이아웃, 로그인 시간 등 기본 환경 설정|
|**Permission Sets** (권한 집합)|특정 **작업** 또는 **기능**에 필요한 권한 부여|사용자에게 **다수** 할당 가능. 개체, 필드, 사용자 권한 등 추가적인 권한을 부여하는 주된 방법|
|**Permission Set Groups** (권한 집합 그룹)|여러 **Permission Sets**를 묶어 관리 용이성 향상|특정 **Persona** (역할)를 대표하며, 관리 용이성과 권한 재사용성 증대|
## 2. Recruiting App 사용자별 개체 권한 요구사항
Recruiting 앱의 네 가지 주요 사용자 유형별 **최소 권한 원칙**에 따른 접근 권한 요구사항입니다.

|Custom Object|**Recruiter**|**Hiring Manager**|**Interviewer**|**Standard Employee**|
|---|---|---|---|---|
|**Position**|Read Create Edit|Read Create Edit (자신이 담당 매니저인 포지션만 편집)|Read (보너스 필드 제외)|Read (보너스 필드 제외)|
|**Candidate**|Read Create Edit|Read (SSN 필드 제외)|Read (SSN 필드 제외)|Not Applicable|
|**Job Application**|Read Create Edit|Read Edit (Lookup 필드 변경 금지)|Read (할당된 경우에만)|Not Applicable|
|**Review**|Read Create Edit|Read Create Edit|Read Create Edit (자신이 소유한 레코드만 편집 가능)|Not Applicable|
## 3. 권한 설정 구현 방법
개체 접근 권한은 **프로필**을 기본으로 설정하고, **권한 집합**과 **권한 집합 그룹**을 통해 추가 권한을 부여하는 것이 권장되는 방법입니다.
### 프로필 설정 및 활용
* **Standard Profiles:** 표준 프로필은 권한 편집이 불가능하므로, 복제(Clone)하여 **Custom Profile**을 생성해야 합니다.
* **Minimum Access - Salesforce:** **최소 권한 원칙**에 따라 이 프로필을 복제하여 모든 사용자에게 할당하고, 추가 권한은 **Permission Sets**으로 관리하는 것이 가장 권장됩니다.
* **프로필에 권장되는 설정:** Default Apps, Record Types, Login Hours, IP Ranges, Page Layout Assignment.
### 권한 집합 및 그룹 활용
* **권한 집합 (Permission Set):** 작은 단위의 **작업 기반** 권한 집합을 생성하고, 이를 **재사용**하여 관리 부담을 줄입니다 (예: `Access and Manage Reviews`).
* **권한 집합 그룹 (Permission Set Group):** **사용자 역할(Persona)** 기반의 그룹을 생성하여 여러 **Permission Sets**를 묶습니다 (예: **Recruiters**).
* **Muting Permission Set:** 사용자에게 부여된 권한을 일시적으로 **제거(Mute)**할 때 사용됩니다.
### 권한 확인 및 관리 (Review Access)
권한 설정 후에는 **View Summary** 기능을 통해 사용자의 최종 권한을 쉽게 확인할 수 있습니다.
* **개체별 권한 확인:** Object Manager $\rightarrow$ 해당 개체 $\rightarrow$ **Object Access** (개체에 접근하는 모든 프로필/권한 집합 목록 확인).
* **사용자별 권한 확인:** Setup $\rightarrow$ Users $\rightarrow$ 해당 사용자 $\rightarrow$ **View Summary** (사용자의 모든 개체, 필드, 사용자 권한 확인).
* **권한 집합별 확인:** Permission Sets/Groups $\rightarrow$ 해당 집합 $\rightarrow$ **View Summary** (집합에 포함된 모든 권한 확인).