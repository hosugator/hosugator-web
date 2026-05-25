---
created: 2024-12-24
tags:
  - Security
  - Access_Control
  - Storage
reference:
  - "[[SMB]]"
  - "[[AD]]"
---
# ACL (Access Control List)

## 정의 (Definition)
특정 리소스(파일, 폴더 등)에 대해 어떤 사용자나 그룹이 어떤 권한(읽기, 쓰기, 실행 등)을 가졌는지 명시한 상세 제어 목록

## 핵심 맥락 (Context & Why)
### Problem
파일 서버에 접속할 수 있다고 해서 모든 사용자가 모든 기밀 문서를 다 볼 수 있다면 정보 유출을 막을 수 없음 
### Solution
개별 파일이나 폴더마다 "홍길동은 읽기만 가능", "인사팀 그룹은 수정 가능"과 같이 세밀한 권한 명단을 붙여두어 허가된 범위 내에서만 데이터를 다루게 함

## 작동 원리 (Mechanism) 
### ACE(Access Control Entry) 구성
목록은 여러 개의 항목(ACE)으로 구성됨. [대상(Who) + 작업(What) + 허용/거부(Allow/Deny)]
### 권한 검사 로직
사용자가 파일 접근 요청 -> 운영체제가 해당 파일의 ACL을 위에서부터 확인 -> 사용자의 신원(AD 토큰)과 일치하는 항목을 찾아 권한 승인 또는 거부

## 유비 및 비교 (Analogy & Comparison)
### It's like
건물 입구는 통과했더라도, 각 사무실 문 앞에 붙어 있는 '출입 허용 명단'과 같음. 명단에 이름이 있어야만 해당 방에 들어갈 수 있음
### vs (Security Group): 
 - ACL: 파일 시스템 내부의 '데이터' 접근 권한을 제어 (L7/OS 레벨) 
 - Security Group: 인스턴스로 들어오는 '네트워크 패킷'을 제어 (L4 레벨)

## 예시 및 구조 (Example/Structure)
윈도우 폴더 우클릭 -> 속성 -> 보안 탭에서 'Users' 그룹에는 '읽기' 권한만 주고, 'Administrators' 그룹에는 '모든 권한'을 부여하는 설정이 ACL 관리임

---
See Also:
- [[NTFS Permissions]]
- [[Resource-based Policy]]