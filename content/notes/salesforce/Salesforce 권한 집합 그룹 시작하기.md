---
created: 2025-10-11
revised: 2025-10-11 13:10
tags:
  - salesforce
  - permission_set_groups
  - security_management
  - least_privilege
  - muting
  - package_management
  - managed_package
  - unmanaged_package
reference:
  - "[[salesforce - hub]]"
---
# Salesforce 권한 집합 그룹 시작하기
## 📝 Permission Set Group의 정의 및 이점
### 학습 목표 및 정의
|항목|설명|
|---|---|
|정의|직무 기능(Job Function)을 기준으로 여러 Permission Set을 하나로 묶어 관리하는 단위입니다.|
|권한 부여|그룹 내 포함된 모든 Permission Set의 권한을 합산하여 사용자에게 부여합니다.|
### 사용 사례 및 이점
|항목|설명|
|---|---|
|관리 단순화|복잡한 직무에 필요한 여러 Permission Set을 하나의 그룹으로 묶어, 사용자에게 단 한 번의 할당으로 모든 권한을 부여합니다.|
|최소 권한 유지|Permission Set을 제한된 작업 단위로 유지하고, 이를 그룹으로 묶어 할당함으로써 최소 권한의 원칙을 효과적으로 유지할 수 있습니다.|
|팀 변화 대응|팀의 변화(신규 채용, 계약직 교체 등)가 잦을 때, 개별 Permission Set이 아닌 그룹만 할당/제거하여 관리 시간을 절약합니다.|
|패키지 개발|Managed Package의 Permission Set을 그룹에 추가하여, 패키지 업그레이드 시 중요한 권한 업데이트를 쉽게 적용할 수 있습니다.|
## 📦 패키지 (Package)의 개념 및 유형
### 패키지 정의 및 유형
|유형|Managed Package (관리형 패키지)|Unmanaged Package (비관리형 패키지)|
|---|---|---|
|**정의**|Salesforce 조직에 설치할 수 있는 애플리케이션이나 기능의 컨테이너입니다.|Salesforce 조직에 설치할 수 있는 애플리케이션이나 기능의 컨테이너입니다.|
|**목적**|상업용 앱 배포 및 판매(AppExchange)를 목적으로 하며, 개발자가 소스 코드를 보호합니다.|오픈 소스 프로젝트나 템플릿/샘플 코드 공유를 목적으로 합니다.|
|**수정 가능성**|제한적/불가능하며, 소스 코드가 잠겨 있습니다.|완벽하게 가능하며, 설치 후 코드를 자유롭게 수정할 수 있습니다.|
|**업데이트**|개발자가 새로운 버전을 배포하면 자동 업데이트가 제공됩니다.|업데이트가 제공되지 않으며, 새로운 버전을 받으려면 재설치해야 합니다.|
|**관련 기능**|Permission Set Group의 **Muting** 기능이 적용되는 대상입니다.|Muting 기능은 의미가 없으며, 설치 후 권한을 자유롭게 변경 가능합니다.|
## 💻 권한 계산 및 관리
### 권한 계산 원리
|항목|설명|
|---|---|
|권한 계산|그룹 내 포함된 모든 개별 Permission Set의 권한을 총합하여 최종 권한이 결정됩니다.|
|재계산 (Recalculation)|그룹 내 Permission Set의 권한 변경, Permission Set 추가, Permission Set 제거 시 권한 재계산이 시작됩니다.|
|재계산 중 상태|재계산이 진행되는 동안, 할당된 사용자는 마지막으로 완료된 재계산 시점의 권한을 유지합니다.|
|상태|Permission Set Groups 목록에서 Updated, Outdated, Updating, Failed 상태로 표시됩니다.|
### Muting 기능
|항목|설명|
|---|---|
|Muting|Permission Set Group 내에서 특정 권한을 일시적으로 비활성화(Mute)하는 기능입니다.|
|용도|주로 Managed Package의 Permission Set을 사용할 때, 해당 패키지가 부여하는 불필요한 권한을 차단하는 데 유용합니다.|