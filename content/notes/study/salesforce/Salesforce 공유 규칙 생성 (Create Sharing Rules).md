---
created: 2025-10-11
revised: 2025-10-11 12:16
tags: [salesforce, sharing_rules, criteria_based_sharing, owner_based_sharing, public_groups, opportunities, applicant, position]
reference:
  - "[[salesforce - hub]]"
---
# Salesforce 공유 규칙 생성 (Create Sharing Rules)
## 개요
현재 레코드 접근이 소유자 및 상위 역할로 제한되어 있으므로, **Sharing Rules**를 생성하여 **Accounts Receivable**, **Recruiters**, **VPs**에게 필요한 레코드 접근 권한을 **자동으로 확대**합니다.
## 1. Opportunities 공유 규칙 (Criteria-Based)
**Won**으로 마감된 **Opportunity** 레코드를 **Accounts Receivable** 역할에 공유하여 후속 작업을 가능하게 합니다.
### Share Won Opportunities with Accounts Receivable
|필드|값|
|---|---|
|**Label**|`Share Won Opportunities with Account Receivable`|
|**Rule Type**|**Based on criteria**|
|**Criteria**|**Field**: `Won` **Operator**: `Equals` **Value**: `True`|
|**Share with**|**Roles**: `Accounts Receivable`|
|**Access Level**|**Read/Write**|
## 2. Recruiter 간 레코드 공유 규칙 (Owner-Based)
Recruiting 팀원들이 서로의 **Applicant**, **Interviewer**, **Position** 레코드에 협업할 수 있도록 소유자 기반 공유 규칙을 생성합니다.
### Applicant 및 Interviewer 공유 (Read Only)
|Label|Object|Rule Type|Owned by|Share with|Access Level|
|---|---|---|---|---|---|
|**Share Applicants Between Recruiters**|Applicant|**Based on record owner**|**Roles**: `Recruiter`|**Roles**: `Recruiter`|**Read Only**|
|**Share Interviewers Between Recruiters**|Interviewer|**Based on record owner**|**Roles**: `Recruiter`|**Roles**: `Recruiter`|**Read Only**|
### Position 공유 (Read/Write)
|Label|Object|Rule Type|Owned by|Share with|Access Level|
|---|---|---|---|---|---|
|**Share Positions Between Recruiters**|Position|**Based on record owner**|**Roles**: `Recruiter`|**Roles**: `Recruiter`|**Read/Write**|
## 3. VPs를 위한 Public Group 및 공유 규칙
모든 **VPs (Vice Presidents)**를 포함하는 **Public Group**을 생성하고, 이를 사용하여 모든 **Open Position** 레코드에 대한 읽기 권한을 부여합니다.
### Public Group 생성
* **Label**: `VPs`
* **Group Name**: `VPs`
* **Members**: 목록에서 모든 **VPs** (Vice Presidents) 역할을 찾아 추가합니다.
### Share Open Positions with VPs (Criteria-Based)
|필드|값|
|---|---|
|**Label**|`Share Open Positions with VPs`|
|**Rule Type**|**Based on criteria**|
|**Criteria**|**Field**: `Status` **Operator**: `equals` **Value**: `Open`|
|**Share with**|**Public Groups**: `VPs`|
|**Access Level**|**Read Only**|