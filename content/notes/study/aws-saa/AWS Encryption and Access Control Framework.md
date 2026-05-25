---
created: 2025-12-29
tags: [Security, Encryption, AccessControl]
---
# AWS Encryption and Access Control Framework

## 요약 (Summary)
데이터를 암호화하여 가독성을 제어하고, KMS 키 정책을 최종 관문으로 설정하여 허가된 사용자만 복호화할 수 있게 하는 이중 보안 체계

## 배경 (Background)
- 탄생 배경: 단순한 서비스 접근 제어(IAM)만으로는 데이터 유출 시 가독성을 차단하기 어렵고, 권한 오남용을 방지하기 위한 직무 분리가 필요했다.
- 핵심 과제: 데이터 보관(At-rest) 및 전송(In-transit) 전 과정의 보안을 확보하고, 열쇠 사용 권한을 서비스 권한과 어떻게 분리할 것인가?

## 솔루션 (Solution)
- 핵심 설계: KMS 고객 관리형 키(CMK)를 활용한 SSE 암호화와 키 정책(Key Policy) 기반의 접근 제어를 결합한다.
- 작동 메커니즘: 
	 - 암호화: SSE-S3/SQS/SNS(기본), SSE-KMS(고객 관리 키), CSE(클라이언트 직접 암호화), TLS/SSL(전송 중 암호화).
	 - 제어: IAM Policy(서비스 이용권), KMS Key Policy(복호화 열쇠 권한), Queue/Bucket Policy(자원 접속권), aws:SecureTransport(전송 강제).

## 변별점 (Distinction)
- 비유: 건물의 모든 출입문(IAM)을 열 수 있는 마스터키를 가졌더라도, 개별 금고의 열쇠 주인(Key Policy)이 허락하지 않으면 금고 안의 내용물을 볼 수 없는 것과 같다.
- 대안과의 차이: 
	 - [IAM 전용 제어]: 설정이 단순하나 데이터 자체가 평문으로 노출될 위험이 있다. 본 체계는 KMS를 통해 데이터의 '내용 확인 권한'을 별도로 격리하여 보안성을 극대화한다.

---
See Also:
- [[AWS KMS]]
- [[KMS Key Policy]]
- [[SSE vs CSE]]
- [[Principle of Least Privilege]]