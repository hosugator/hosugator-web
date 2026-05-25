---
created: 2025-10-10
revised: 2025-10-10 14:33
tags:
  - record_level_security
  - organization_wide_defaults
  - role_hierarchies
  - sharing_rules
  - manual_sharing
  - owd
  - referral_object
  - salesforce
reference:
  - "[[salesforce - hub]]"
---
# Salesforce - 레코드 접근 통제
## 데이터 보안 통제의 4단계 개요
Salesforce 보안은 **조직**, **개체**, **필드**, **레코드**의 네 가지 계층으로 통제됩니다.
### 레코드 접근 통제 계층
|통제 방법|접근 수준|설명|
|---|---|---|
|**Organization-Wide Defaults** (OWD)|**제한**|사용자가 소유하지 않은 레코드에 대한 **가장 엄격한 기본 접근 수준**을 정의합니다.|
|**Role Hierarchies**|**확대**|관리자가 자동으로 자신의 하위 역할이 소유한 레코드에 접근할 수 있도록 보장합니다.|
|**Sharing Rules**|**확대**|OWD에 대한 자동 예외 규칙을 정의하여 특정 **그룹**에 추가 접근 권한을 부여합니다. 제한 목적으로는 사용 불가합니다.|
|**Manual Sharing**|**확대**|레코드 소유자가 개별 레코드를 선택적으로 다른 사용자에게 공유합니다.|
## Organization-Wide Defaults (OWD) 설정
OWD는 개체별로 설정되며, 해당 개체를 사용하는 **가장 제한적인 사용자**를 기준으로 접근 수준을 설정해야 합니다.
### OWD 설정 옵션
|설정 값|설명|
|---|---|
|**Private**|소유자 및 계층 구조 상위 사용자만 보기, 편집, 보고 가능합니다.|
|**Public Read Only**|모든 사용자가 보기 및 보고는 가능하지만, 편집은 소유자 및 계층 구조 상위 사용자만 가능합니다.|
|**Public Read/Write**|모든 사용자가 보기, 편집, 보고 가능합니다.|
|**Controlled by Parent**|상위 개체의 공유 설정을 상속받습니다. (Master-Detail 관계의 Detail 개체에 적용)|
## 핸즈온 챌린지 수행 단계 요약
### 권한 집합 설정 요약
|권한 집합 Label|개체 권한|필드 접근 통제|
|---|---|---|
|`Manage Positions`|Position: **Read**, **Create**, **Edit** 활성화|해당 없음|
|`Manage Job Applications`|Job Application: **Read**, **Edit** 활성화|**Position**과 **Candidate** 필드의 **Edit Access**만 **비활성화** (읽기 전용)|
### Referral 개체 생성 및 OWD 설정
1.  **Referral** Custom Object을 생성합니다.
2.  **Sharing Settings**에서 **Referral** 개체의 **Default Internal Access**를 **Private**으로 설정합니다.
3.  **Referral** 개체의 **Grant Access Using Hierarchies** 체크박스를 **해제**하여 역할 계층을 통한 접근을 차단합니다.