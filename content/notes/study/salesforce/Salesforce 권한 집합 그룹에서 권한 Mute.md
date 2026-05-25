---
created: 2025-10-11
revised: 2025-10-11 13:46
tags: [salesforce, permission_set_groups, muting, permission_sets, dependencies]
reference:
  - "[[salesforce - hub]]"
---
# Salesforce 권한 집합 그룹에서 권한 Mute
## 📝 Muting의 정의 및 필요성
### Muting 정의
|항목|설명|
|---|---|
|Muting|Permission Set Group에 포함된 **Permission Set의 특정 권한**을 **비활성화(Mute)**할 수 있도록 허용하는 기능입니다.|
|Muting Permission Set|특정 Permission Set Group 내에서 권한을 Mute하기 위해 **사용자 정의로 생성**하는 특별한 Permission Set입니다. 그룹당 **하나만** 존재할 수 있습니다.|
|Muting 대상|객체, 필드, 사용자 권한 및 기타 접근 설정이 Mute 대상입니다.|
### Muting의 필요성 (Use Case)
|필요성|설명|
|---|---|
|권한 재사용성 극대화|하나의 Permission Set이 여러 직무 기능에 사용될 때, Permission Set을 수정하지 않고도 **그룹별로 권한을 맞춤 설정**할 수 있습니다.|
|기존 Permission Set 보호|기존 Permission Set에 변경 사항을 추가할 때, 해당 권한을 원치 않는 다른 그룹의 사용자들에게 영향을 미치지 않도록 방지합니다.|
|Managed Package 관리|설치된 Managed Package의 Permission Set이 업데이트될 때, 조직이 준비될 때까지 **특정 신규 권한**을 일시적으로 Mute할 수 있습니다.|
## 💻 Muting의 작동 방식 및 고려 사항
### Muting의 상호 작용
|고려 사항|설명|
|---|---|
|영향 범위|Muting은 오직 해당 **Permission Set Group에 할당된 사용자**에게만 영향을 미칩니다.|
|권한 우위|사용자가 프로필, 다른 Permission Set, 또는 다른 Permission Set Group을 통해 **동일한 권한**을 부여받은 경우, Muting Permission Set이 있더라도 **해당 권한은 유지**됩니다.|
|요약 확인|User Access Summary 및 Permission Set Group Summary는 Muting Permission Set을 고려하여 최종적으로 활성화된 권한을 정확하게 보여줍니다.|
### 권한 종속성 (Dependencies)
|항목|설명|
|---|---|
|종속성|권한을 Mute할 때 **종속된 하위 권한**도 함께 Mute됩니다.|
|예시|객체에 대한 **Read 권한**을 Mute하면, Create, Edit, Delete, View All Records, Modify All Records 등 Read 권한이 필요한 모든 작업도 **자동으로 Mute**됩니다.|
|주의 사항|Muting 시 변경 확인 메시지(Confirmation Message)를 주의 깊게 확인하여, 필요한 권한이 실수로 제거되지 않도록 해야 합니다.|
## 🛠️ 실습: Muting을 통한 권한 분리
### 목표
Sales Contracts Permission Set에 Alyssa 팀이 요구하는 광범위한 권한을 추가하되, 기존 Sales Processing 그룹의 사용자(Max)에게는 해당 권한이 부여되지 않도록 합니다.
### 단계 요약
|단계|내용|
|---|---|
|1. Muting PS 생성|Sales Processing 그룹 내에 **Contracts Permissions Muted**라는 Muting Permission Set을 생성합니다.|
|2. 권한 Mute|Contracts Permissions Muted PS에서 **View All Records**, **Modify All Records**, **Activate Contracts**, **Delete Activated Contracts** 권한을 Mute 처리합니다.|
|3. Sales Contracts 업데이트|Sales Contracts Permission Set에 Alyssa 팀이 필요로 하는 **광범위한 새 권한**을 추가합니다.|
|결과|Sales Processing 그룹의 사용자(Max)는 2단계의 Muting 덕분에 3단계에서 추가된 광범위한 권한을 받지 않으며, Sales Contracts Permission Set은 Alyssa 팀을 위한 새로운 Contracts Processing 그룹에서 재사용될 수 있습니다.|