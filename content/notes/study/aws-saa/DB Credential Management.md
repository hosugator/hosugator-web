---
created: 2026-01-22
tags:
  - AWS
  - Security
  - Database
  - Governance
---
# DB 인증 정보 관리 (Credential Management)

## 본질 (Essence)
현관 키를 우체통에 넣어두지 않고, 가족에게만 열어주는 지문 인식 시스템 

## 구조 (Mechanism)
- **정의**: 애플리케이션 코드와 데이터베이스 접속 정보(ID/PW, Endpoint)를 분리하여 중앙 집중식으로 관리하는 보안 아키텍처
- **핵심**: 
  - **분리(Decoupling)**: 코드 유출 시에도 DB 접속 정보는 안전
  - **권한 제어(IAM)**: EC2나 Lambda에 적절한 IAM Role을 부여하여, 지정된 금고(SSM/Secrets Manager) 및 암호키(KMS)에 접근 허용
  - **자동화**: Secrets Manager 사용 시 주기적으로 비밀번호를 자동 교체(Rotation)하여 보안성을 극대화

## 확장 (Connection)
- **응용**: 실제 개발 시 `.env` 파일에 비밀번호를 적어 Git에 올리는 실수를 방지하기 위해 반드시 도입해야 할 설계 패턴임.

---
See Also: 
- [[SSM]]
- [[KMS]]
- [[IAM Role]]