---
created: 2025-10-09
revised: 2025-10-09 12:25
tags:
  - salesforce
  - path
  - kanban
  - opportunity_management
  - pipeline_tracking
  - key_field
  - kanban_view
reference:
  - "[[salesforce - hub]]"
---
# Path와 Kanban으로 성공 시각화 (Visualize Success with Path and Kanban)
## Path를 통한 거래 추적
**Path**는 레코드가 영업 프로세스의 어느 단계에 있는지 시각적으로 보여주는 간단하지만 강력한 도구입니다. 
레코드의 현재 위치와 다음 목표를 한눈에 파악할 수 있도록 돕습니다.
### Path의 주요 구성 요소
* **Key Fields (주요 필드):** 레코드를 열었을 때 가장 필요한 정보를 강조하여 탭을 전환하거나 스크롤할 필요 없이 중요한 데이터를 볼 수 있습니다.
* **Guidance for Success (성공을 위한 안내):** Path의 각 단계에서 제공되는 안내로, 중요한 활동을 놓치지 않도록 돕습니다.
* **상태 업데이트:**
    * 다음 단계로 이동: **Mark Status as Complete**를 클릭합니다.
    * 단계 건너뛰기/되돌아가기: 원하는 단계를 클릭한 후 **Mark Current Status**를 클릭합니다.
### Path 생성 단계
1.  Setup에서 **Path Settings**로 이동하여 Path를 활성화합니다.
2.  **New Path**를 선택하고 Path 이름, 기반 객체, 레코드 유형, 기준 픽리스트를 입력합니다.
3.  각 단계에 대해 **Key Fields (최대 5개)** 를 선택하고 **Success Guidance (최대 1,000자)** 를 입력합니다.
4.  Path를 **활성화(Activate)** 합니다.
5.  픽리스트 값과 함께 **축하 애니메이션**을 트리거할 빈도(Celebration Animation frequency)를 선택하고 **Finish**를 클릭합니다.
## Kanban View를 통한 레코드 관리
**Kanban View**는 모든 작업에 대한 전체적인 그림을 제공하는 시각적 작업 공간입니다. 
기회를 파이프라인을 따라 쉽게 정렬, 요약, 필터링하고 이동시킬 수 있습니다.
### Kanban View의 기본 사용법
* **보기 전환:** 레코드 목록 보기에서 **Select list display** 드롭다운을 통해 **Kanban**을 선택합니다.
* **단계 이동:** 기회 카드를 마우스로 클릭하고 다른 **Stage (단계)** 를 나타내는 열로 드래그하여 놓습니다.
* **레코드 편집:** Kanban 카드 하단의 아래쪽 화살표를 클릭하여 **Edit**를 선택하면 Kanban View 내에서 레코드를 수정할 수 있습니다.
### Kanban View 사용자 정의
**List View Controls**와 **Kanban Settings**를 통해 표시되는 정보와 구성을 변경할 수 있습니다.
* **Group By (그룹화 기준) 변경:** 레코드를 분류하는 열의 기준을 Stage 외의 다른 필드(예: Type)로 바꿀 수 있습니다.
* **Summarize By (요약 기준) 변경:** 각 열 상단의 요약 숫자를 Amount (금액) 외의 다른 필드(예: **Expected Revenue**)의 합계로 변경할 수 있습니다.
### Kanban View 필터링 및 차트 활용
* **필터 사용:** 
	* **Show filters**를 클릭하여 특정 조건(예: Account Name이 'United Oil'을 포함)에 맞는 레코드만 빠르게 검토할 수 있습니다. 
	* 필터 사용 후에는 반드시 **Remove All**을 클릭하여 필터를 해제해야 합니다.
* **차트 보기:** 
	* **Show charts**를 클릭하면 목록 보기 데이터가 요약된 차트나 그래프를 표시합니다.
    * **Pipeline by Account:** 가장 많은 거래를 진행한 **Account**를 기준으로 파이프라인을 보여줍니다.
    * **Pipeline by Stage:** 각 거래의 **Stage**를 기준으로 파이프라인을 보여줍니다.
Path와 **Kanban View**를 통해 레코드를 추적하고 관리하는 것이 훨씬 쉬워집니다. 
Kanban View는 Leads, Tasks 등 대부분의 객체에서 사용 가능하며, Path는 관리자에 의해 설정되어야 합니다.