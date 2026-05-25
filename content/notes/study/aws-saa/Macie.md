---
created: 2025-11-13
tags: [aws_saa, macie, ml, s3, pii, dataclassification]
reference:
  - https://docs.aws.amazon.com/macie/latest/userguide/what-is-macie.html
---
# Amazon Macie
## 정의
ML·NLP 활용 S3 버킷의 대량 데이터에서 개인 식별 정보(PII)와 민감 데이터를 자동으로 발견·분류·보호하는 관리형 데이터 보안 서비스
## 원리
- [[S3]] 인벤터리 및 메타데이터 수집
- ML 모델이 키워드·패턴·컨텍스트 분석(예: 주민등록번호, 운전면허, 이메일)
- 발견 시 [[Finding]] 생성, 심각도(Low·High) 및 데이터 카테고리 표시
- 결과를 [[Security Hub]], [[EventBridge]] 로 전파
## 특징
- 대량 객체 스캔(수십 TB) 가능, 지속적 모니터링 옵션
- 100가지 이상 기본 탐지기, 커스텀 탐지기(정규식·키워드) 추가 가능
- 조직 전체 S3 데이터 보기, 버킷 수준 위험 점수 제공
- 발견된 PII 은닉(마스킹) 기능, 조사용 리포트 내보내기
## 비교
[[GuardDuty]]는 침입 탐지, [[Inspector]]는 취약성 스캔,  
Macie는 데이터 자체의 민감도를 ML 기반으로 판단하는 전문 서비스
## 예시
1. 고객 응답 CSV 1TB 버킷에 Macie 실행
2. 위험 점수 95점, High 42건 → 주민등록번호 노출 3만 건 발견
3. 결과를 EventBridge → Lambda → Slack 전송 후 민감 컬럼 암호화 및 공개 차단