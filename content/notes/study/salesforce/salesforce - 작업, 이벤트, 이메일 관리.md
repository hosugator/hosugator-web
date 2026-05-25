---
created: 2025-10-09
revised: 2025-10-09 15:24
tags:
  - salesforce
  - lightning_experience
  - activity_timeline
  - task_management
  - calendar
  - email_composer
reference:
  - "[[salesforce - hub]]"
---
# 작업, 이벤트, 이메일 관리 (Manage Your Tasks, Events, and Email)
## 활동 타임라인 (Activity Timeline)
**Activity Timeline**은 **Lightning Experience**에서 레코드(연락처, 기회 등)와 관련된 모든 활동을 지능적으로 보여주는 컨트롤 센터입니다.
Salesforce Classic의 Open Activity 및 Activity History 관련 목록의 세부 정보가 통합되어 표시됩니다.
* **구분:** **Upcoming & Overdue** 활동과 **과거 월별** 활동으로 나뉘어 계획된 활동과 완료된 활동을 시각적으로 구분합니다.
* **상세 보기:** 활동 옆의 확장 버튼을 클릭하거나 **Expand All**을 클릭하여 활동에 대한 자세한 내용을 볼 수 있습니다.
* **필터링:** 설정의 필터를 사용하여 **활동 유형** 및 **날짜 범위**를 기준으로 검색 범위를 좁힐 수 있습니다.
* **빠른 업데이트:** 활동 행의 드롭다운 화살표를 통해 활동을 업데이트하거나, 체크박스를 클릭하여 작업을 완료로 표시할 수 있습니다.
## 작업 및 작업 목록 (Tasks and Task Lists)
**Lightning Experience**에는 별도의 **Tasks** 탭이 있어, 특정 레코드가 아닌 **전체 할 일 목록**을 관리할 수 있습니다.
* **접근:** **Tasks** 탭을 클릭하거나 홈 페이지의 Today's Tasks 목록에서 **View All**을 클릭하여 접근합니다.
* **효율적인 업데이트:** 작업 목록의 왼쪽에서 작업을 선택하면 오른쪽에 확장된 세부 정보가 표시됩니다. 드롭다운 화살표를 통해 상태 변경, 우선 순위 변경, 편집, 삭제 등의 빠른 작업을 수행할 수 있습니다.
* **완료 표시:** 목록 보기나 **Activity Timeline**에서 체크박스를 클릭하여 작업을 완료로 표시할 수 있습니다.
## 캘린더 (Calendar)
**Lightning Experience**의 캘린더는 효율적인 일정 관리를 위해 여러 기능이 향상되었습니다.
* **이벤트 생성:** **New Event**를 클릭하거나 캘린더에서 시작일과 종료 시간을 드래그하여 빠르게 이벤트를 생성할 수 있습니다.
* **사이드 패널 숨기기:** 버튼을 클릭하여 사이드 패널을 숨기고 다시 표시하여 화면 공간을 확보할 수 있습니다.
* **다른 캘린더 보기:** 동료가 공유한 캘린더를 보고 이벤트 중첩 여부를 확인할 수 있습니다.
    * **공유 수준 제어:** 캘린더 옆의 ⚙️ 아이콘을 클릭하여 **Share Calendar**를 통해 동료에게 보여줄 세부 정보 수준을 제어할 수 있습니다.
    * **User Lists:** **User Lists**를 사용하여 여러 캘린더를 한 번에 추가할 수 있습니다.
### Salesforce 데이터를 캘린더로 보기
캘린더에 Salesforce 데이터를 이벤트처럼 표시하여 볼 수 있습니다.
* **데이터 캘린더 생성:** 보고 싶은 객체를 선택하고, 추적하려는 데이터를 나타내는 **날짜 필드**를 선택하여 캘린더를 생성합니다. (예: 기회의 예상 마감일)
* **활용:** 다가오는 마감일 등을 조감하여 볼 수 있어 일정을 효과적으로 계획할 수 있습니다.
## 이메일 (Email)
**Lightning Experience**에서는 여러 위치에서 이메일을 작성하고 보낼 수 있습니다.
### 이메일 발송 위치
* **Activity Composer (활동 작성기):** 레코드 페이지에 있는 활동 작성기를 통해 이메일을 보내는 것이 일반적입니다.
* **Global Actions 메뉴:** **Global Actions** 메뉴를 통해 이메일을 보낼 수 있습니다.
### 이메일 작성기의 특징
* **자동 주소 채우기:** 레코드에서 이메일을 보낼 경우, To 주소가 자동으로 채워집니다. **Person Account**의 경우 **Lightning Experience**에서만 자동으로 채워집니다.
* **관련 레코드 연결:** 이메일을 작업 중인 **Opportunity** 등 다른 레코드와 연결하여, 해당 레코드의 **Activity Timeline**에서 이메일 내용을 확인할 수 있습니다.
* **추가 기능:** 첨부 파일 추가, 병합 필드 삽입, 템플릿 삽입 및 생성, 미리 보기, 작성기 확장 등의 기능을 제공합니다.
### 그룹 이메일 발송 (List Email)
Salesforce Classic의 **Mass Email**에 해당하는 기능입니다. **List Email** 기능을 사용하여 연락처와 리드 그룹에 한 번에 이메일을 보낼 수 있습니다.
* **시작:** 필터링되어 저장된 **List View (목록 보기)**에서 시작합니다.
* **효율성:** 템플릿, 병합 필드 및 첨부 파일 등을 포함하여 효율성을 높일 수 있습니다.
* **검토:** 발송 전에 **Review** 탭에서 수신자와 병합 필드가 올바르게 표시되는지 확인해야 합니다.
### 이메일 템플릿
**Lightning Experience**는 새로운 유형의 이메일 템플릿을 제공합니다.
* **Lightning Templates:** 리치 텍스트를 지원하며 파일 미리 보기 및 공유(첨부 파일을 링크로 전송)가 용이합니다.
* **Classic Templates:** Letterhead, Custom HTML, Visualforce 템플릿이 필요한 경우 **Classic Templates**를 계속 사용할 수 있으며, **All Classic Templates** 드롭다운 목록을 통해 접근 가능합니다. 편집은 Salesforce Classic에서 수행해야 합니다.