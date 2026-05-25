---
created: 2025-12-26
tags:
  - Security
  - Encryption
  - S3
  - Data_Protection
reference:
  - "[[SSE vs CSE Comparison]]"
---
# 클라이언트 측 암호화 (Client-Side Encryption, CSE)

## 정의 (Definition)
데이터를 AWS 서비스(예: S3)로 전송하기 전에 사용자의 애플리케이션이나 로컬 환경(Client)에서 직접 암호화를 수행하는 방식

## 핵심 맥락 (Context & Why)
### Problem
서버 측 암호화(SSE)는 데이터가 전송되는 도중(In-transit)이나 서버에 도달하기 전까지는 평문 상태일 수 있으며, 클라우드 제공업체가 암호화 프로세스를 제어한다는 점에서 극도의 보안 규정을 준수해야 하는 기업에는 부족할 수 있음
### Solution
데이터가 생성되거나 가공되는 시점(Origin)에서 즉시 암호화하여, 전송 중에는 물론 클라우드 저장소 내에서도 항상 암호화된 상태를 유지함. 암호화 키에 대한 완전한 통제권을 클라이언트가 가짐

## 작동 원리 (Mechanism) 
### 1. 암호화 시점
* 데이터가 S3 등으로 업로드되기 전, 애플리케이션 메모리 내에서 암호화 완료
### 2. 키 관리 방식
* **CSE-KMS**: AWS KMS에 저장된 고객 마스터 키(CMK)를 사용하여 암호화 수행
* **CSE-Custom**: 사용자가 직접 관리하는 로컬 키(Master Key)를 사용하여 암호화 수행

## 유비 및 비교 (Analogy & Comparison)
### It's like
SSE가 '우체국(S3)에 가서 물건을 주면 우체국 직원이 상자에 넣어 잠그는 것'이라면, CSE는 '집(Glue/App)에서 이미 금고에 물건을 넣어 잠근 뒤 우체국에는 금고 통째로 맡기는 것'과 같음. 우체국 직원은 내용물을 절대 볼 수 없음
### vs (SSE - Server Side Encryption): 
 - SSE: 편리함, AWS가 암복호화 부하를 처리함, 저장 시점에 보호됨
 - CSE: 최고 수준의 보안, 클라이언트가 암복호화 부하를 부담함, 처리 중(In-process) 시점부터 보호됨

## 예시 및 구조 (Example/Structure)
- AWS Glue Job에서 데이터 변환 직후 KMS 키를 호출하여 암호화 -> S3로 저장
- 의료 데이터나 금융 데이터처럼 규제가 엄격하여 "전송 전 반드시 암호화"가 조건일 때 사용함

---
See Also:
- [[AWS Key Management Service (KMS)]]
- [[Amazon S3 Security Best Practices]]