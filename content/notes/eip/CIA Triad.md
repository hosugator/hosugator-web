---
created: 2025-10-29
tags:
  - security
  - cia_triad
  - confidentiality
  - integrity
  - availability
reference:
---
# 정보보안의 3요소 (CIA Triad)
## 정의
정보 자산을 보호하기 위한 가장 기본적인 목표이자 원칙으로, 기밀성(Confidentiality), 무결성(Integrity), 가용성(Availability) 세 가지 특성으로 구성
## 분류
### 기밀성 (Confidentiality)
-   정보가 오직 인가된 사용자만 접근할 수 있도록 보장하는 것을 목표로 한다.
-   개인 정보 보호, 영업 비밀 보호 등 정보의 민감성을 유지하는 것과 직결된다.
-   구현 방법: 데이터 암호화, 접근 통제(ACL), 사용자 인증 강화 등이 있다.
### 무결성 (Integrity)
-   정보가 정당한 권한을 가진 사용자나 시스템에 의해서만 변경될 수 있으며, 비정상적인 방법으로 훼손, 변경 또는 파괴되지 않았음을 보장한다.
-   데이터의 정확성과 신뢰성을 유지하는 것을 목표로 한다.
-   구현 방법: 해시 검증(checksum), 디지털 서명, 트랜잭션 처리(Rollback), 로그 기록 관리 등이 있다.
### 가용성 (Availability)
-   시스템이 중단 없이 정상적으로 작동하여, 필요한 시점에 서비스를 사용할 수 있도록 보장하는 특성이다.
-   서비스의 연속성 및 접근성을 보장하는 것을 목표로 한다.
-   구현 방법: 시스템 이중화(Redundancy), 백업 및 복구 체계(Backup & Recovery), 부하 분산(Load Balancing), 서비스 거부 공격(DoS/DDoS) 방어 등이 있다.
