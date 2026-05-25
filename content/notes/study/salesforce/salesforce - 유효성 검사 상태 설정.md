---
created: 2025-10-11
tags:
  - salesforce
  - knowledge_setup
  - validation_status
  - compact_layout
  - page_layout
reference:
  - "[[salesforce - hub]]"
---
> Last revised: `= dateformat(this.file.mtime, "yyyy-MM-dd HH:mm")`
# 유효성 검사 상태 설정 (Set Up the Validation Status)
## 유효성 검사 상태 활성화 (Enable the Validation Status)
유효성 검사 상태 (Validation Status)는 지식 기사(knowledge article)의 검토 및 유효성 검사 상태를 나타냅니다. 
현재 상태는 검토가 필요한 Not validated와 검증이 완료된 Validated가 있습니다. 
에이전트가 이 필드를 사용하기 전에 이 기능을 활성화해야 합니다.
* Setup에서 Quick Find 상자에 Knowledge Settings를 입력하고 클릭합니다.
* Knowledge Settings 페이지에서 Edit을 클릭합니다.
* Activate Validation Status field를 선택하고 저장합니다.

| 용어 | 정의 |
| :--- | :--- |
| Validation Status | 지식 기사가 검토 및 유효성 검사 과정을 거쳤는지 나타내는 상태. |
| Not validated | 검토 및 유효성 검사를 거쳐야 하는 기사 상태. |
| Validated | 검토 및 유효성 검사가 완료되어 준비가 된 기사 상태. |
## 컴팩트 레이아웃에 필드 추가 (Add Fields to the Compact Layout)
### 에이전트용 컴팩트 레이아웃 생성
레코드 상단에 주요 필드를 요약하여 보여주는 컴팩트 레이아웃 (Compact Layout)을 설정하여 에이전트가 기사 상단에서 유효성 검사 상태를 즉시 확인할 수 있도록 합니다.
1.  Setup에서 Object Manager를 클릭하고 Knowledge를 선택합니다.
2.  Compact Layouts를 클릭하고 New를 클릭합니다.
3.  Label에 Knowledge Compact Layout for Agents를 입력합니다.
4.  Selected Fields (선택된 필드)로 원하는 항목들을 이동시키고 Save를 클릭합니다.
### 컴팩트 레이아웃 할당
생성된 컴팩트 레이아웃을 특정 레코드 유형을 사용하는 사용자들에게 할당하여 적용합니다.
1.  Compact Layout Assignment를 클릭하고 Edit Assignment를 클릭합니다.
2.  FAQ와 Procedure 레코드 유형을 선택합니다.
3.  Compact Layout to Use에서 Knowledge Compact Layout for Agents를 선택하고 Save를 클릭합니다.
## 유효성 검사 상태 변경 (Edit the Validation Status)
### 페이지 레이아웃에 유효성 검사 상태 필드 추가
에이전트가 기사의 Validation Status를 직접 변경할 수 있도록 페이지 레이아웃에 해당 필드를 추가합니다.
1.  Setup에서 Object Manager를 클릭하고 Knowledge를 선택합니다.
2.  Page Layouts를 선택하고 Procedure - Author와 같은 페이지 레이아웃을 선택합니다.
3.  Fields 팔레트에서 Validation Status를 Article Details 섹션으로 드래그하여 추가하고 작업을 저장합니다. 유효성 검사 상태 변경이 필요한 다른 모든 기사 페이지 레이아웃에 대해서도 이 작업을 반복합니다.
### 유효성 검사 상태 변경 테스트
App Launcher에서 Service를 찾아 선택하고, 내비게이션 바에서 Knowledge를 클릭합니다. 
Draft Articles 목록 보기를 선택합니다. 
기사의 드롭다운 메뉴에서 Edit을 선택한 후, Validation Status 선택 목록에서 새 상태를 선택하고 작업을 저장합니다. 
초안(draft) 및 게시된(published) 기사 모두 상태 변경이 가능합니다.
## 새로운 유효성 검사 상태 생성 (Create a Validation Status)
### Work in Progress 상태 추가
에이전트가 작업 중인 기사를 추적할 수 있도록 Work in Progress (작업 진행 중) 상태를 유효성 검사 상태 선택 목록에 추가합니다.
1.  Setup에서 Quick Find 상자에 Validation Statuses를 입력하고 Validation Statuses를 클릭합니다.
2.  New를 클릭합니다.
3.  Picklist Item으로 Work in Progress를 입력합니다.
4.  이 선택 목록 값을 사용할 레코드 유형을 모두 선택하고 Save를 클릭합니다.
5.  Work in Progress를 기본값으로 설정하려면 Default를 체크합니다.
* 유효성 검사 상태는 유효성 규칙, 승인 프로세스 등과 함께 사용하여 데이터 입력 및 게시 작업을 제어할 수 있습니다.