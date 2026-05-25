---
created: 2025-12-26
tags:
  - Storage
  - Security
  - Hybrid_Cloud
reference:
  - "[[Amazon FSx for Windows File Server]]"
---
# FSx for Windows File Server와 AD 통합 (AD Integration)

## 정의 (Definition)
완전 관리형 Windows 파일 서버인 Amazon FSx를 온프레미스 또는 AWS 내의 Active Directory(AD)에 가입(Join)시켜 기존의 사용자 인증 및 권한 체계를 그대로 사용하는 구성 방식

## 핵심 맥락 (Context & Why)
### Problem
수천 명의 사용자가 사용하는 기존 Windows 파일 서버를 이전할 때, 각 폴더와 파일에 설정된 복잡한 권한(ACL)을 IAM 정책으로 일일이 재설정하는 것은 운영상 불가능에 가까우며 심각한 보안 오버헤드를 발생시킴
### Solution
FSx 파일 시스템 자체를 AD 도메인의 구성원으로 만듦으로써, 기존 AD 그룹과 사용자 계정을 그대로 인식하게 함. 이를 통해 윈도우 탐색기에서 설정하던 익숙한 방식(NTFS 권한)으로 보안을 유지함

## 작동 원리 (Mechanism) 
### 1. 도메인 조인 (Domain Join)
FSx 생성 시 또는 생성 후 온프레미스 AD나 AWS Managed AD의 정보를 입력하여 도메인 멤버로 등록함
### 2. 권한 검증 (Authentication & Authorization)
사용자가 파일 접근 요청 -> FSx가 조인된 AD에 사용자 그룹 정보 확인 -> AD가 승인 -> FSx가 파일 시스템 수준(SMB/NTFS)의 권한에 따라 접근 허용

## 유비 및 비교 (Analogy & Comparison)
### It's like
새로운 사무실(FSx)로 이사하면서 건물 입구 보안 업체(AD)를 예전 건물에서 쓰던 업체 그대로 고용하는 것과 같음. 직원들은 예전에 쓰던 사원증(AD 계정)을 그대로 찍고 들어올 수 있으며, 각 방(폴더)에 대한 출입 권한도 그대로 유지됨
### vs (IAM 기반 권한 제어): 
 - IAM: '누가 FSx 리소스 자체를 삭제/생성할 수 있는가'를 제어 (관리자 권한)
 - AD: '누가 FSx 내부의 특정 폴더를 읽거나 쓸 수 있는가'를 제어 (사용자 데이터 권한)

## 예시 및 구조 (Example/Structure)
- 온프레미스 AD 그룹: [Compliance-Team]
- FSx 폴더 권한 설정: [C:\Compliance-Shares] -> 보안 탭에서 [Compliance-Team] 읽기/쓰기 허용
- 결과: AD에 조인된 FSx는 추가 설정 없이 해당 그룹원들의 접근을 정확히 식별하고 차단함

---
See Also:
- [[AWS Directory Service]]
- [[SMB and NTFS Permissions Overview]]