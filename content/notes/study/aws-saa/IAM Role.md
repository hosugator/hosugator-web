---
created: 2026-01-16
tags:
  - AWS
  - IAM
  - Security
  - role
---
# IAM Role vs User

## 본질 (Essence)
영구적인 개인 신분증(User)과 특정 업무를 위해 잠시 빌려 입는 작업복(Role)의 차이

## 구조 (Mechanism)
- **IAM User**: 고유한 자격 증명을 가진 장기적 엔티티입니다. 사람이나 특정 애플리케이션에 할당됩니다.
- **IAM Role**: 암호가 없으며, 신뢰할 수 있는 대상(서비스나 타 계정 유저)이 일시적으로 권한을 가질 수 있게 해주는 가상의 정체성입니다. STS(Security Token Service)를 통해 만료 시간이 있는 임시 키를 발급합니다.

## 확장 (Connection)
- **연결**: 집 주인의 마스터키가 User라면, 특정 시간에만 열리는 방문객용 일회용 비밀번호는 Role과 유사함
- **응용**: 서버가 다른 서비스에 접근할 때(EC2 to S3), 또는 운영 계정에 임시로 접속할 때 보안 강화를 위해 Role 사용이 권장됨

---
See Also: 
- [[IAM]]