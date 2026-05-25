---
created: 2025-10-10
revised: 2025-10-10 13:53
tags:
  - data_security
  - object_permissions
  - field_level_security
  - permission_sets
  - permission_set_groups
  - profiles
  - recruiting_app
  - salesforce
reference:
  - "[[salesforce - hub]]"
---
# Salesforce 데이터 접근 및 보안 통제 (Control Access)
## 데이터 보안 통제의 4단계
Salesforce의 데이터 보안은 다음 네 가지 계층으로 통제됩니다.

|레벨|통제 대상|권장 설정 위치|
|---|---|---|
|**Organization** (조직)|전체 조직 로그인 (IP 범위, 시간, 비밀번호 정책)|Network Access, **Profiles**|
|**Objects** (개체)|개체 레코드에 대한 CRUD (**Create**, **Read**, **Update**, **Delete**) 권한|**Permission Sets** 또는 **Permission Set Groups**|
|**Fields** (필드)|개체 내 개별 필드의 가시성 및 편집 권한 (**FLS**)|**Permission Sets** 또는 **Permission Set Groups**|
|**Records** (레코드)|개별 레코드에 대한 접근 (누가 어떤 레코드를 볼 수 있는가)|Sharing Settings, **Role Hierarchy**, Sharing Rules|
## 권한 관리 도구의 역할
**보안 모범 사례**는 **최소 접근 권한**을 부여하는 것이며, **Profiles**로 **기본 설정**을 정의하고 **Permission Sets**로 **추가 권한**을 부여합니다.

|도구|역할 및 특징|
|---|---|
|**Profiles** (프로필)|사용자당 **단 하나의** 프로필 할당. 로그인 제한, 기본 앱/레코드 유형/페이지 레이아웃 등 **기본 설정** 정의.|
|**Permission Sets** (권한 집합)|사용자에게 **추가 권한**을 부여하는 데 사용. **Object Permissions** 및 **Field Permissions**를 관리하는 주요 수단.|
|**Permission Set Groups**|여러 권한 집합을 묶어 **역할** 기반으로 쉽게 관리. 쉬운 할당 및 Muting Permission Set으로 권한 제한 가능.|
## 핸즈온 챌린지 수행 단계
### Manage Positions 권한 설정 및 그룹 추가
**Recruiters** 그룹에 **Position** 개체에 대한 **Read**, **Create**, **Edit** 권한을 부여하는 권한 집합을 생성하고 추가합니다.

|설정 항목|값|
|---|---|
|**권한 집합 Label**|`Manage Positions`|
|**개체 권한 (Position)**|**Read**, **Create**, **Edit** 활성화|
|**할당**|`Recruiters` 권한 집합 그룹에 추가|
**수행 경로:**
1. **Setup** $\rightarrow$ **Permission Sets** $\rightarrow$ **New** (`Manage Positions`).
2. **Manage Positions** $\rightarrow$ **Object Settings** $\rightarrow$ **Position** 개체 선택.
3. **Edit**을 클릭하고 **Read, Create, Edit** 권한을 활성화한 후 **Save**.
4. **Setup** $\rightarrow$ **Permission Set Groups** $\rightarrow$ **Recruiters** 그룹 선택.
5. **Permission Sets in Group** $\rightarrow$ **Add Permission Set** $\rightarrow$ **Manage Positions**를 선택하여 추가.
### Manage Job Applications 필드 접근 통제
**Hiring Managers**가 **Job Application** 레코드를 편집할 수 있도록 허용하되, 연결된 `Position` 및 `Candidate` **Lookup 필드**는 **읽기 전용**으로 설정합니다.

|설정 항목|값|
|---|---|
|**권한 집합 Label**|`Manage Job Applications`|
|**개체 권한 (Job Application)**|**Read**, **Edit** 활성화|
|**필드 권한 제어**|모든 필드에 **Read/Edit** 부여 후, **Position**과 **Candidate** 필드의 **Edit Access만 비활성화**하여 **읽기 전용**으로 설정.|
**수행 경로:**
1. **Setup** $\rightarrow$ **Permission Sets** $\rightarrow$ **New** (`Manage Job Applications`).
2. **Manage Job Applications** $\rightarrow$ **Object Settings** $\rightarrow$ **Job Application** 개체 선택.
3. **Edit**을 클릭하고 **Object Permissions**에서 **Read, Edit**을 활성화합니다.
4. **Field Permissions**에서 **모든 필드의 Edit Access**를 먼저 활성화합니다.
5. `Position` 필드와 `Candidate` 필드의 **Edit Access** 체크박스를 **해제**합니다.
6. **Save**를 클릭합니다.