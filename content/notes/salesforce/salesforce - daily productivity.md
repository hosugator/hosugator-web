---
created: 2025-10-09
revised: 2025-10-09 14:58
tags:
  - salesforce
  - lightning_experience
  - productivity
  - global_actions
  - utility_bar
  - keyboard_shortcuts
reference:
  - "[[salesforce - hub]]"
---
# 일일 생산성 향상 (Elevate Your Daily Productivity)
## 멀티태스킹 기능
**Lightning Experience**는 **Global Actions** 메뉴와 **Utility Bar**라는 두 가지 옵션을 통해 멀티태스킹을 지원하여, 작업 중에도 중단 없이 다른 작업을 시작할 수 있게 합니다.
### Global Actions 메뉴 활용
**Global Actions** 메뉴는 Lightning Experience 헤더에 항상 위치하며, 새로운 레코드를 생성할 수 있게 해줍니다.
* **접근성:** 헤더의 ➕ 아이콘을 클릭하여 언제든지 접근 가능합니다.
* **이름의 의미:** 메뉴의 모든 옵션은 다른 레코드나 현재 페이지와의 **자동 관계 없이** 레코드를 생성하는 **Global Actions**이기 때문에 붙여진 이름입니다.
* **Docked Composers (도킹된 작성기):** Global Action을 실행하면 화면 하단에 전용 작성기 창(예: 이메일, 새 기회)이 **도킹**되어 열립니다.
    * 이 창은 다른 페이지로 이동해도 계속 남아 있어 멀티태스킹을 지원합니다.
    * 창을 최소화하거나 키보드 단축키를 사용하여 여러 창을 탐색할 수 있습니다.
### Utility Bar 활용
**Utility Bar**는 화면 하단에 고정된 바이며, 메모, Quip, 플로우 실행기, 전화 기능 등 유용한 유틸리티에 빠르게 접근할 수 있도록 합니다.
* **도킹된 패널:** 유틸리티는 **도킹된 패널** 형태로 열리므로, 작성기 창과 동일하게 유틸리티를 사용하는 동시에 다른 페이지로 이동할 수 있는 유연성을 제공합니다.
* **앱별 설정:** 표준 앱과 콘솔 앱은 고유한 Utility Bar를 가질 수 있으며, 관리자가 이를 설정해야만 표시됩니다.
## 홈 페이지 (Home Page)
**Lightning Experience Home Page**는 사용자의 작업 기반으로 재설계되어, 하루 일과를 관리하고 중요한 일에 집중할 수 있도록 돕습니다.
* **Seller Home:** 영업 팀을 위한 기본 홈 페이지로, 기회, 계정, 리드, 연락처에 대한 개요와 오늘의 의제, 목표 추적, 할 일, Einstein의 연락처 제안 등을 표시합니다.
* **커스터마이징:** 관리자는 프로필별로 다른 **Custom Home pages**를 설계하여 조직의 필요에 맞는 기능을 포함시킬 수 있습니다.
## 키보드 단축키를 통한 작업 속도 향상
키보드 단축키는 레코드를 검색, 편집, 저장 및 닫는 등 일상적인 작업을 마우스 없이 수행하여 효율성을 높여줍니다.
### 주요 키보드 단축키
| 명령 (Command) | 설명 (Description) | 단축키 (Shortcut) |
| --- | --- | --- |
| Close or deselect | 창을 닫거나 선택을 해제합니다. | **Esc** |
| Edit | 레코드를 편집합니다. | **e** |
| Save | 레코드를 저장합니다. (필드에 포커스가 있어야 합니다.) | **Ctrl+s** 또는 **Cmd+s** |
| Search | 커서를 검색 상자에 놓습니다. | **/ (슬래시)** |
| Show shortcut menu | 사용 가능한 모든 단축키를 표시합니다. | **Ctrl+/ (슬래시)** 또는 **Cmd+/ (슬래시)** |
| Go to utility bar | Utility Bar로 이동합니다. | **g, then u** |
| Go to composer window | 도킹된 작성기 창으로 이동합니다. | **g, then d** |
### 단축키 사용 시 유의 사항
* **커스터마이징 불가:** **Lightning Experience**에서는 키보드 단축키를 사용자 정의할 수 없습니다.
* **대소문자 미구분:** 단축키는 대소문자를 구분하지 않습니다.
* **'then' 구문:** 'then'이 포함된 단축키는 첫 번째 키(또는 키 조합)를 누른 후 **반드시 손을 뗀 다음** 다음 키를 입력해야 합니다.
* **제한 사항:** Salesforce Classic 앱이나 Visualforce, iFramed 컴포넌트에서는 Lightning Experience 단축키가 작동하지 않습니다.