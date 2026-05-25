---
created: 2025-10-11
revised: 2025-10-11 13:24
tags:
  - salesforce
  - permission_set_groups
  - permission_sets
  - profiles
  - license
  - security_analysis
reference:
  - "[[salesforce - hub]]"
---
# Salesforce 권한 집합 그룹 생성
## 실습 단계: Permission Set Group 구성
VP of Sales인 E.J. Agarwal의 요청에 따라 Sales Processing 직무 기능을 위한 권한 그룹을 생성하고 사용자에게 할당했습니다.
### 1. 개별 Permission Set 생성
권한 재사용성을 위해 작업 단위(Task)에 초점을 맞춘 두 개의 Permission Set을 생성했습니다.

| Permission Set  | 설정된 권한                                                               |
| --------------- | -------------------------------------------------------------------- |
| Sales Orders    | Orders 객체에 대한 Read, Create, Edit, Delete 권한 및 Activate Orders 사용자 권한 |
| Sales Contracts | Contracts 객체에 대한 Read, Create, Edit, Delete 권한                       |
### 2. Permission Set Group 생성 및 할당
|항목|설정 내용|
|---|---|
|그룹 이름|Sales Processing|
|포함된 Permission Sets|Sales Orders 및 Sales Contracts|
|할당된 사용자|Max Jackson|
|라이선스 유효성|Max Jackson은 Salesforce 라이선스로 할당 성공. Anuj Singh은 Force.com - Free 라이선스로 인해 Contracts 권한 할당 시도 시 오류 발생. (라이선스 요구 사항은 Permission Set Group 할당 시에도 동일하게 적용됨)|
## 💡 기존 권한 구조 분석 및 모델링
Permission Set Group은 권한 구조를 Profile 중심에서 Permission Set 중심으로 전환하는 데 핵심적인 역할을 합니다.
### 권한 구조 요소의 역할 재정립
|요소|역할|권장 사항|
|---|---|---|
|Profile|사용자의 기본 설정 제공 (기본 레코드 유형, IP 범위 등)|Minimum Access - Salesforce 프로필을 베이스라인으로 사용하는 것을 권장합니다. (사용자당 하나)|
|Permission Set|Profile에 없는 추가적인 작업(Task) 권한 부여|몇 가지 관련 작업으로 한정하여 작게 만들고 재사용성을 높입니다.|
|Permission Set Group|직무 기능(Job Function)에 따라 Permission Set을 묶는 번들|사용자에게 직무 기능에 맞는 권한을 쉽게 부여합니다. (Least Privilege 원칙 유지)|
### 모델링 전략
|단계|설명|
|---|---|
|1. 직무 분석|특정 직무 기능에 필요한 모든 작업 목록을 정의합니다.|
|2. Permission Set 설계|정의된 작업을 기반으로 재사용성이 높은 Permission Set을 생성합니다. (Order 권한과 Contract 권한 분리 등)|
|3. 그룹 구성|이 Permission Set들을 묶어 직무 기능과 일치하는 Permission Set Group을 생성합니다.|
|4. 유연한 조정|직무 기능 변경 시, 그룹에 새 Permission Set을 추가하거나 기존 Permission Set을 수정하여 쉽게 권한을 업데이트할 수 있습니다.|
### 분석 도구
|도구|기능|
|---|---|
|User Access and Permissions Assistant 앱|기존 프로필 권한 분석, 프로필 권한을 Permission Set으로 변환하는 등 마이그레이션 지원|
|View Summary|Permission Set 또는 Permission Set Group에 포함된 객체, 사용자, 필드 권한 및 포함된 Permission Set 그룹/Permission Set을 빠르게 확인할 수 있습니다.|