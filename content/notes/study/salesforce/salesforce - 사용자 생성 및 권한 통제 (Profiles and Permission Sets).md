---
created: 2025-10-10
revised: 2025-10-10 16:10
tags:
  - salesforce
  - profiles
  - permission_sets
  - object_permissions
  - delete_accounts
  - user_management
  - security
reference:
  - "[[salesforce - hub]]"
---
# 사용자 생성 및 권한 통제 (Profiles and Permission Sets)
## 개요 및 목표
CEO의 보안 우려에 따라, **Executive Users**와 **Support Team**을 제외한 일반 사용자들의 레코드 삭제 권한을 제한합니다. 
**Noah Larkin**에게는 예외적으로 **Account 삭제 권한**을 **Permission Set**을 통해 부여합니다.
## 1. 기본 프로필 생성 및 권한 제한
**Account Delete** 권한이 제거된 **새로운 프로필**을 생성하여 일반 사용자에게 할당하고, **최소 권한**을 설정합니다.
### Custom Profile 생성 및 Account 권한 제한
|설정 항목|값|
|---|---|
|**기반 프로필**|`Standard Platform User`|
|**새 프로필 이름**|`Standard Profile - No Acct Delete`|
|**Accounts Object Permissions**|**Delete** 권한 **비활성화** (Read, Create, Edit만 활성화)|
### 로그인 접근 정책 활성화
* **Administrators Can Log in as Any User** 체크박스를 **Enabled**로 설정합니다. (관리자가 권한 테스트를 위해 다른 사용자로 로그인할 수 있도록 허용)
## 2. 신규 사용자 생성 및 라이선스 관리
**Salesforce Platform** 라이선스를 사용하여 네 명의 신규 사용자를 생성하고, 모두 **Standard Profile - No Acct Delete**를 할당합니다.
### 신규 사용자 목록
|이름|User License|Profile|Role|
|---|---|---|---|
|**Maya Lorrette**|Salesforce Platform|Standard Profile - No Acct Delete|Western Sales Team|
|**Ted Kim**|Salesforce Platform|Standard Profile - No Acct Delete|Western Sales Team|
|**Noah Larkin**|Salesforce Platform|Standard Profile - No Acct Delete|Customer Support, International|
|**Amy Daniels**|Salesforce Platform|Standard Profile - No Acct Delete|Western Sales Team|
* **참고**: 라이선스 부족 문제를 해결하기 위해 **Maya Lorrette**와 **Ted Kim**은 사용자 생성 후 **Active** 체크박스를 해제하여 **비활성화**합니다.
## 3. Permission Set을 통한 삭제 권한 부여 (예외 적용)
**Permission Set**을 생성하여 **Noah Larkin**에게만 **Account 삭제 권한**을 예외적으로 부여합니다.
### Delete Accounts Permission Set 설정
|설정 항목|값|
|---|---|
|**Label**|`Delete Accounts`|
|**User License**|`Salesforce Platform`|
|**Object Settings** (Accounts)|**Delete** 체크박스 **활성화** (Read, Edit 자동 활성화)|
|**할당 대상**|`Noah Larkin`|
* **테스트**: Noah Larkin으로 로그인하여 **GenePoint** Account 페이지에서 **Delete** 버튼이 활성화되었는지 확인합니다.