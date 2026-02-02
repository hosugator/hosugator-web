---
# 템플릿 변수가 자동으로 값을 채웁니다.
created: 2025-10-09 
revised: 2025-10-09 22:47

# 사용자가 직접 입력해야 하는 항목입니다.
tags: [org_access, user_management, password_policy, login_ip_ranges, login_hours]
reference: 
---

# 조직 접근 통제 (Control Access to the Org)

조직(Org) 접근 통제는 데이터 보호의 **가장 넓은 범위**에서 이루어지며, 승인된 사용자 관리, 암호 정책 설정, 그리고 로그인 시간 및 장소 제한을 통해 구현됩니다.

### 1. 사용자 관리 (Manage Users)

모든 Salesforce 사용자는 고유의 **Username**, **Password**, 그리고 단 하나의 **Profile (프로필)**로 식별됩니다.
프로필은 기본 설정을 정의하며, **Permission Sets (권한 집합)**과 **Permission Set Groups (권한 집합 그룹)**이 추가 권한을 결정합니다.

* **사용자 생성:** Setup에서 **Users**를 검색하여 **New User** 또는 **Add Multiple Users**를 통해 생성합니다. **User License**, **Profile**을 필수로 선택해야 합니다.
* **사용자 비활성화 (Deactivate):** 사용자는 **삭제할 수 없으며**, **Edit** $\rightarrow$ **Active** 체크박스 해제를 통해 계정을 **비활성화**합니다. 비활성화된 사용자는 접근 권한을 잃지만 데이터는 유지됩니다.
* **사용자 동결 (Freeze):** 즉시 비활성화가 불가능할 때, **Freeze**를 통해 사용자의 로그인을 일시적으로 차단할 수 있습니다.

### 2. 암호 정책 설정 (Set Password Policy)

**Password Policies (암호 정책)**는 사용자 암호가 강력하고 안전하도록 보장합니다.

* **설정 경로:** Setup에서 **Password Policies**를 검색하여 설정합니다.
* **주요 설정:** 암호의 **최소 길이**, **복잡성** (문자, 숫자, 대소문자, 특수 문자), **유효 기간**, 그리고 **실패한 로그인 시도 횟수** 및 **잠금 기간**을 설정합니다.
* **우선순위:** **프로필 수준**의 암호 정책 설정은 조직 전체의 암호 정책 설정을 **재정의(override)**합니다.

### 3. IP 주소로 로그인 접근 제한

특정 IP 범위 설정은 추가 인증 절차를 생략하거나, 아예 로그인 자체를 차단하는 데 사용됩니다.

|제한 방식|설정 경로|효과|
|---|---|---|
|**조직 전체 (Organization-Wide)**|Setup에서 **Network Access**를 검색하여 **Trusted IP Ranges**를 지정합니다.|이 범위 내에서 로그인하면 **본인 확인 코드** 입력 절차가 **우회**됩니다. 범위 밖에서는 코드를 입력해야 합니다.|
|**프로필별 제한 (Profile-Specific)**|Setup에서 **Profiles** $\rightarrow$ 해당 프로필 $\rightarrow$ **Login IP Ranges**를 설정합니다.|이 범위 **밖의 IP 주소**에서는 **로그인 자체가 거부**됩니다. (가장 엄격한 통제)|

### 4. 시간대별 로그인 접근 제한 (Restrict Login Access by Time)

각 프로필에 대해 사용자가 로그인할 수 있는 **특정 시간(Login Hours)**을 지정할 수 있습니다.

* **설정 경로:** Setup에서 **Profiles** $\rightarrow$ 해당 프로필 $\rightarrow$ **Login Hours**를 편집합니다.
* **제한 효과:** 로그인 가능 시간이 **끝나면**, 사용자는 **현재 페이지는 계속 볼 수 있지만**, **추가적인 작업은 수행할 수 없습니다.**