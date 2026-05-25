---
created: 2025-10-11
tags:
  - salesforce
  - lightning_knowledge
  - page_layout
  - record_type
  - profile
  - custom_fields
reference:
  - "[[salesforce - hub]]"
---
> **Last revised:** `= dateformat(this.file.mtime, "yyyy-MM-dd HH:mm")`

# 페이지 레이아웃 및 레코드 유형 구성
## 🛠️ 실습 1: 독자(Reader) 페이지 레이아웃 생성
문서 독자와 작성자는 다른 필드와 액션을 봐야 하므로, Maria는 독자용 페이지 레이아웃을 먼저 생성했습니다.
### Procedure - Reader 레이아웃 생성 및 구성
|단계|설정 내용|
|---|---|
|1. 레이아웃 생성|Object Manager > Knowledge > Page Layouts에서 **Procedure - Reader** 레이아웃을 생성합니다.|
|2. 독자 액션 추가|Mobile & Lightning Actions 섹션에 **Post** 및 **Poll** 액션을 추가합니다.|
|3. Knowledge Detail|Title, URL Name 필드 외에 **Summary** 필드를 추가합니다.|
|4. Properties 섹션|2단 레이아웃으로 설정하고, Article Created Date, Created by, Last Modified by, Last Published Date 및 Visible in [채널] 체크박스를 추가합니다.|
### Article Details 섹션을 위한 사용자 정의 필드 생성
Maria는 Procedure 문서에 필요한 고유 정보를 담기 위해 사용자 정의 필드(Custom Fields)를 생성했습니다.

|필드 레이블|데이터 타입|필드 레벨 보안 (FLS)|추가된 레이아웃|
|---|---|---|---|
|Procedure Audience|Text Area (Rich)|모든 프로필 Visible|Procedure - Reader|
|Procedure Warnings|Text Area (Rich)|모든 프로필 Visible|Procedure - Reader|
|Procedure Purpose|Text Area (Rich)|모든 프로필 Visible|Procedure - Reader|
|Procedure Steps|Text Area (Rich)|모든 프로필 Visible|Procedure - Reader|
## 🛠️ 실습 2: 저자(Author) 페이지 레이아웃 생성
저자 레이아웃은 독자 레이아웃과 유사하지만, 저자 전용 액션 및 내부 노트 필드를 포함합니다.
### Procedure - Author 레이아웃 구성
|항목|설정 내용|
|---|---|
|기반 레이아웃|기존 **Procedure - Reader** 레이아웃을 복제하여 생성합니다.|
|저자 액션|Edit, Publish, Delete Article, Change Record Type, Edit as Draft, Submit for Approval, Assign, Archive, Restore, Post 등으로 대체합니다. (Poll 및 Post는 제거)|
|Internal Notes 필드|Text Area (Rich) 타입으로 생성하고, FLS를 **Custom: Support Profile**에만 Visible하도록 설정합니다.|
|필드 추가|Internal Notes 필드를 레이아웃에 추가합니다.|
## 🛠️ 실습 3: 레코드 유형 생성 및 할당
레코드 유형을 통해 사용자 프로필에 따라 적절한 페이지 레이아웃이 표시되도록 연결합니다.
### Procedure 레코드 유형 생성 및 독자 할당
|단계|설정 내용|
|---|---|
|1. 레코드 유형 생성|Object Manager > Knowledge > Record Types에서 **Procedure** 레코드 유형을 생성합니다. Master를 템플릿으로 선택합니다.|
|2. 활성화|Active를 선택하여 즉시 사용 가능하도록 설정합니다.|
|3. 프로필 할당|Customer Profiles(독자)에 **Make Available**을 선택합니다.|
|4. 레이아웃 연결|Customer Profiles에 **Procedure - Reader** 레이아웃을 할당하고 저장합니다.|
### 저자(Agent)에게 Procedure 레코드 유형 및 레이아웃 할당
저자(에이전트)는 일반적인 프로필 사용자 인터페이스를 통해 레코드 유형 및 레이아웃을 할당받습니다.

|단계|설정 내용|
|---|---|
|1. 프로필 편집|Setup > Profiles에서 저자가 사용하는 프로필(예: Custom: Support Profile)을 선택합니다.|
|2. 레코드 유형 추가|Custom Record Type Settings에서 **FAQ** 및 **Procedure** 레코드 유형을 Selected Record Types에 추가합니다.|
|3. 기본 레코드 유형 설정|Default Record Type을 **FAQ**로 설정합니다.|
|4. 레이아웃 연결|이 프로필의 Procedure 레코드 유형에 **Procedure - Author** 레이아웃이 표시되도록 시스템이 구성됩니다.|