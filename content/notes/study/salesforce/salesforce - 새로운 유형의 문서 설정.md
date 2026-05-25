---
created: 2025-10-11
revised: 2025-10-11 14:22
tags:
  - salesforce
  - lightning_knowledge
  - article_type
  - page_layout
  - service_cloud
reference:
  - "[[salesforce - hub]]"
---
# 새로운 유형의 문서 설정
## 📝 절차(Procedure) 문서 추가의 필요성
|항목|FAQ 문서 (기존)|Procedure 문서 (신규)|
|---|---|---|
|목적|고객의 일반적인 질문에 대한 답변 제공|고객 및 설치자가 특정 작업을 수행하는 방법 안내 (단계별 지침)|
|내용 특징|자주 묻는 질문 및 답변|단계별 지침(Step-by-step instructions) 및 안전 경고(Safety warnings)|
|접근 권한|모든 사용자 접근 가능|인증된 고객 및 직원만 접근 가능|
|필요성|설치와 같은 복잡한 작업 지침 제공을 위해 새로운 문서 유형이 필요함|Procedure 문서는 특정 역할을 위한 상세한 작업 지침 제공을 위해 필수적임|
## 📄 절차 문서의 페이지 레이아웃 정의
Maria는 절차 문서를 위해 필요한 정보 유형과 액션을 정의했습니다.
### 1. 포함할 정보 (필드)
|섹션|포함할 정보|FAQ와 차이점|
|---|---|---|
|기본 정보|문서 이름, URL, 요약 정보|FAQ와 동일|
|대상 및 목적|문서의 대상 독자(예: 설치자) 및 목적(예: 작업 완료 돕기) 명시|FAQ는 대상이 '모두'였음|
|경고 (Warnings)|상해 방지 및 장비 손상 방지를 위한 경고 포함|FAQ에는 없던 절차 문서의 핵심 요소|
|단계 (Steps)|작업 수행을 위한 핵심 단계별 지침|FAQ와 달리 순차적인 명령이 주어짐|
|속성 (Properties)|문서 게시일, 작성자, 접근 가능한 사용자 등 관리 정보|FAQ와 동일|
|내부 노트 (Internal Notes)|직원만 볼 수 있는 케이스 관련 메모 필드|상담원을 위한 내부 전용 필드|
### 2. 독자 액션 및 저자 액션
|대상|액션|
|---|---|
|독자 (Reader Actions)|문서를 읽은 후 게시(Post)하거나 투표(Poll) 설정 가능|
|저자 (Author Actions)|Edit, Delete, Publish, Change Record Type, Edit as Draft, Submit for Approval, Assign, Archive, Restore, Post 등|
## ⚙️ Lightning Knowledge의 정의 및 설정 확인
### Lightning Knowledge 정의 및 특징
|항목|설명|
|---|---|
|정의|Salesforce Service Cloud의 기능으로, 지식 기반(Knowledge Base)을 구축하고 문서를 관리하는 중앙 집중식 시스템입니다.|
|목적|셀프 서비스 촉진 및 상담원의 효율성 증대를 통한 고객 만족도 개선입니다.|
|문서 유형 관리|Classic의 Article Types가 Lightning에서는 **표준 레코드 유형(Standard Record Types)**으로 대체되어, 문서 종류별로 필드와 페이지 레이아웃을 다르게 설정할 수 있습니다.|
|접근성|내부 사용자, 고객 커뮤니티, 파트너 포털 등 다양한 채널을 통해 배포되며, 접근 권한은 프로필이나 권한 집합으로 통제됩니다.|
### Knowledge 활성화 및 설정 상태 확인
| 확인 절차  | 내용                                                                           |
| ------ | ---------------------------------------------------------------------------- |
| 활성화 단계 | Setup에서 Service Setup을 통해 Knowledge Author를 지정하고 활성화를 시작합니다.                 |
| 최종 확인  | Setup의 Knowledge Settings에서 **Enable Lightning Knowledge** 옵션이 선택되었는지 확인합니다. |