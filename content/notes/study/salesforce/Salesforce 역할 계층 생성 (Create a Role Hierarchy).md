---
created: 2025-10-10
revised: 2025-10-10 14:50
tags:
  - role_hierarchies
  - roles
  - record_access
  - org_chart
  - data_access
  - recruiting_app
  - salesforce
reference:
  - "[[salesforce - hub]]"
---
# Salesforce 역할 계층 생성 (Create a Role Hierarchy)
## 역할 계층과 레코드 접근
**Role Hierarchies**는 조직도와 다르게 **데이터 접근 수준**을 기준으로 정의됩니다. 
역할 계층은 **Organization-Wide Defaults (OWD)**가 Public Read/Write 미만일 때 작동하여 **레코드 접근 권한**을 **확대**하는 데 사용됩니다.
* **접근 원칙**: 계층 구조상 상위에 있는 사용자는 **자신 아래**의 모든 사용자가 소유하거나 공유받은 데이터에 접근할 수 있습니다.
* **조직도와 차이**: 역할 계층은 반드시 회사의 조직도와 일치할 필요는 없습니다. 데이터 접근 필요성이 동일한 직무는 하나의 역할로 통합될 수 있습니다.
* **Custom Object 예외**: 커스텀 개체의 OWD 설정에서 **Grant Access Using Hierarchies** 옵션을 **비활성화**하면 역할 계층을 통한 접근 확대를 막을 수 있습니다.
## 핸즈온 챌린지 수행 단계 요약
챌린지의 목표는 **VP Human Resources** 아래에 **Recruiting Manager** 역할과 그 아래 **Recruiter** 역할을 계층적으로 생성하는 것입니다.
### 역할 계층 생성
|역할 Label|Reports to|
|---|---|
|**Recruiting Manager**|`VP Human Resources`|
|**Recruiter**|`Recruiting Manager`|
**수행 경로:**
1. **Setup** $\rightarrow$ Quick Find에서 `Roles`를 검색하여 선택합니다.
2. `VP Human Resources` 역할 아래의 **Add Role**을 클릭하고 **Recruiting Manager** 역할을 생성합니다.
3. 새로 생성된 `Recruiting Manager` 역할 아래의 **Add Role**을 클릭하고 **Recruiter** 역할을 생성합니다.
4. **Recruiter** 역할 생성 시, **Reports to** 필드에 `Recruiting Manager`가 올바르게 지정되었는지 확인합니다.