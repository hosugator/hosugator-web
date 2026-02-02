---
created: 2025-11-12
tags: [aws_saa, kms, encryption, cmk, envelope, hsm]
reference:
  - https://docs.aws.amazon.com/kms/latest/developerguide/overview.html
---
# AWS Key Management Service (KMS)
## 정의
[[AES]]-256 기반 대칭키 및 ECC/RSA 비대칭키를 생성·관리·폐기하며 AWS 리소스와 애플리케이션 데이터를 암호화하는 관리형 키 관리 서비스
## 핵심 용어
- [[Customer Master Key (CMK)]] : KMS 내부 또는 직접 생성 키, 256-bit 대칭 기본
- [[Envelope Encryption]] : 데이터 키로 콘텐츠 암호화, CMK로 데이터 키 재암호화
- [[Grant]] : 특정 주체에게 키 사용 권한 임시 위임
- [[Key Alias]] : CMK 대신 사용하는 읽기 쉬운 이름
## 관리 모드
- AWS 관리 CMK : 리소스당 1개, 자동 순환(365일), 삭제 불가
- 고객 관리 CMK : 사용자 생성, rotation(1년), disable·삭제 스케줄 가능
- 고객 제공 키(BYOKE) : 온프레미스 HSM에서 생성 후 KMS 가져오기
## 특징
- FIPS 140-2 레벨 3 인증 HSM 기반, 요청당 10ms 내 처리
- CloudTrail 통합, 키 정책·IAM·Grant 세 방식으로 권한 제어
- 비용 : CMK 당 월 1USD + 암호화·복호화 요청 건수
- 리전 단위 서비스, 리전 간 키 공유 불가(Cross-region 복제 별도)