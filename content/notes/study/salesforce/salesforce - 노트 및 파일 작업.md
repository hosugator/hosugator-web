---
created: 2025-10-09
revised: 2025-10-09 15:15
tags:
  - salesforce
  - lightning_experience
  - enhanced_notes
  - salesforce_files
  - file_management
  - content_collaboration
reference:
  - "[[salesforce - hub]]"
---
# 노트 및 파일 작업 (Work with Notes and Files)
## Enhanced Notes로 노트 작성 기능 향상
**Lightning Experience**의 **Enhanced Notes**는 더 빠르고, 더 풍부하며, 더 조직적인 노트 작성을 지원합니다.
### Enhanced Notes의 주요 특징
* **자동 저장:** 아이디어를 입력하는 즉시 자동으로 저장됩니다.
* **서식 기능:** 텍스트에 **굵은 글씨**나 기울임꼴 서식을 추가하여 중요한 세부 사항을 강조할 수 있습니다.
* **구성:** 글머리 기호 및 번호가 매겨진 단계를 사용하여 정보를 체계적으로 구성할 수 있습니다.
* **이미지 포함:** 사진이나 이미지를 노트에 삽입하여 명확성과 기억력을 높일 수 있습니다.
* **다중 레코드 연결:** 하나의 노트를 여러 레코드(기회, 계정, 연락처 등)와 연결하여 정보의 가시성과 영향을 확장할 수 있습니다.
* **공유:** 그룹이나 팀원들과 노트를 공유할 수 있습니다.
### 노트 생성 위치
**Enhanced Notes**는 **Lightning Experience**의 여러 위치에서 생성할 수 있습니다.
* **Global Actions 메뉴:** 어디서든 새 노트를 바로 시작할 수 있습니다.
* **Utility Bar:** 유틸리티 바에 Notes가 추가되어 있다면 빠르게 접근 가능합니다.
* **Navigation Bar:** Notes 홈 페이지가 있는 경우 탐색 모음에서 생성할 수 있습니다.
* **레코드 관련:** 작업 중인 레코드의 작업 메뉴에서 **New Note**를 사용하거나 Notes 관련 목록의 **New** 버튼을 사용하면 해당 레코드와 자동으로 연결됩니다.
### Notes 관련 목록의 차이점
| 관련 목록 | 포함된 노트 유형 | 설명 |
| --- | --- | --- |
| **Notes** | **Enhanced Notes**만 포함합니다. | **Lightning Experience**에서 새로 생성된 노트입니다. |
| **Notes & Attachments** | **Classic Notes** 및 첨부 파일만 포함합니다. | 이전에 **Salesforce Classic** 도구로 생성된 노트입니다. |
## 파일 관리 (Salesforce Files)
**Salesforce Files**는 여러 파일 관리 시스템에 분산되어 있던 파일, 문서, 라이브러리를 하나의 장소로 통합하여 관리를 간소화합니다.
### Files Home (파일 허브)
**Files home**은 탐색 모음의 Files 항목을 통해 접근할 수 있으며, 모든 파일을 관리하는 중앙 집중식 허브입니다.
* **접근:** 소유하거나 접근 권한이 있는 모든 파일을 필터링하여 볼 수 있습니다.
* **라이브러리:** 콘텐츠를 구성하고 동료와 공유하기 위한 **Libraries** 및 그 안에 포함된 파일에 접근할 수 있습니다.
* **업로드:** 새 파일을 **Salesforce Files**에 업로드할 수 있습니다. (모든 파일 형식 지원)
* **미리 보기:** 파일 미리 보기 플레이어에서 파일을 볼 수 있으며 다운로드, 공유, 새 버전 업로드 등의 작업을 수행할 수 있습니다.
### 레코드에 파일 첨부
레코드에 파일을 첨부하려면 **Files** 관련 목록을 사용합니다. **Notes & Attachments** 관련 목록은 사용하지 않습니다.
* **드래그 앤 드롭:** 컴퓨터의 파일을 **Files** 관련 목록 카드에 드래그하여 업로드하면 **Salesforce Files**에도 자동으로 추가됩니다.
* **Add Files:** **Salesforce Files**에 접근 권한이 있는 라이브러리, 외부 저장소(Google Drive, Box 등)의 파일을 첨부할 수 있습니다.
### 파일 공유 옵션
**Salesforce Files**는 다양한 채널을 통해 파일 공유 기능을 내장하고 있습니다.
* **특정 사용자 또는 그룹:** **Share** 기능을 통해 **Viewer** (보기, 다운로드, 재공유) 또는 **Collaborator** (권한 변경, 편집, 새 버전 업로드 가능) 권한을 지정할 수 있습니다.
* **외부 대상 (Public Link):** **Public Link** 기능을 통해 암호화된 URL을 생성하여 고객, 파트너 등 회사 외부의 대상과 안전하게 공유할 수 있습니다. 이 링크는 언제든지 삭제할 수 있습니다.
### 기타 콘텐츠 유형 고려 사항
* **Attachments:** 레코드의 기존 첨부 파일은 **Salesforce Files**에서 자동으로 사용할 수 없으며, **Notes & Attachments** 관련 목록을 통해 계속 볼 수 있습니다. **Lightning Experience**에서는 새 첨부 파일을 생성할 수 없습니다.
* **Documents Tab:** **Documents** 탭은 **Lightning Experience**에서 지원되지 않습니다. 해당 파일은 **Asset Library**에 업로드하는 것이 권장됩니다.
* **Salesforce CRM Content:** 라이브러리의 폴더와 파일은 **Salesforce Files**에서 접근 가능하지만, **Content deliveries**와 같은 일부 기능은 지원되지 않습니다.