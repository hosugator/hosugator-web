---
created: 2024-12-24
tags:
  - Security
  - Windows
  - Identity
reference:
  - "[[SMB]]"
  - "[[ACL]]"
---
# AD (Active Directory)

## 정의 (Definition)
윈도우 네트워크 환경에서 사용자, 컴퓨터, 그룹 등 모든 리소스의 정보를 중앙 집중화하여 관리하고 인증 및 인가를 수행하는 디렉터리 서비스

## 핵심 맥락 (Context & Why)
### Problem
수백 대의 서버와 수천 명의 직원이 있는 환경에서, 각 서버마다 사용자 계정을 일일이 생성하고 관리하는 것은 불가능하며 보안 사고의 위험이 매우 높음 
### Solution
중앙의 AD 서버(Domain Controller) 한 곳에서만 계정을 관리하고, 모든 서버가 이 정보를 공유하게 함으로써 '한 번의 로그인(SSO)'으로 허가된 모든 자원에 접근할 수 있게 함

## 작동 원리 (Mechanism) 
### 중앙 저장소 역할
조직 내의 모든 개체 정보를 계층 구조(Tree/Forest)로 저장하고 속성 값을 관리
### 인증 프로세스(Kerberos)
사용자가 로그인 시 AD에 인증 요청 -> AD가 신원 확인 후 '티켓(Token)' 발행 -> 사용자는 이 티켓을 사용하여 SMB 서버 등 다른 자원에 접근

## 유비 및 비교 (Analogy & Comparison)
### It's like
놀이공원의 '자유이용권 판매소'와 같음. 입구에서 신분 확인 후 팔찌(티켓)를 받으면, 공원 내 모든 놀이기구(서버)에서 매번 신분증을 보여줄 필요 없이 팔찌만 확인하고 탑승함
### vs (IAM): 
 - AD: 주로 온프레미스나 VPC 내부의 윈도우 인프라 및 사용자 계정 관리 중심 
 - IAM: AWS 클라우드 서비스 자체에 대한 접근 권한 및 리소스 제어 중심

## 예시 및 구조 (Example/Structure)
Amazon FSx for Windows를 생성할 때, 기존 회사의 Self-managed AD나 AWS Managed Microsoft AD에 가입(Join)시켜 사내 직원 계정으로 바로 로그인하게 설정함

---
See Also:
- [[AWS Managed Microsoft AD]]
- [[Single Sign-On (SSO)]]