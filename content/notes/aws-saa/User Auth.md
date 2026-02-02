---
created: 2026-01-23
tags:
  - aws
  - security
  - serverless
  - api
  - authorization
  - authentication
---
# User Authentication

## 본질 (Essence)
사용자가 누구인지 확인(Authentication)하고, 그 신분에 맞는 권한(Authorization)을 부여하여 리소스 접근을 제어하는 체계.

## 구조 (Mechanism)
- **Amazon Cognito**: AWS 전용 사용자 관리 서비스. 
  - **User Pool**: 회원가입, 로그인, 비밀번호 찾기 등 '사용자 디렉토리' 역할.
  - **Identity Pool**: 로그인한 사용자에게 임시 AWS 자격 증명(IAM Role)을 부여.
- **API Key & Usage Plan**: API 수준의 접근 제어.
  - **API Key**: 각 사용자나 서비스 등급을 식별하기 위한 고유 문자열.
  - **Usage Plan**: 특정 API Key에 대해 요청 속도(Throttling)와 총 요청 횟수(Quota)를 정의한 명세서.
- **IAM (Identity and Access Management)**: AWS 내부 리소스 관리자용 권한 제어. 일반 서비스 사용자에게는 직접 부여하지 않는 것이 원칙.

## 확장 (Connection)
- **연결**: Cognito로 '신분'을 확인하고, API Key와 Usage Plan으로 '입장권 등급'을 관리함.
- **응용**: 프리미엄 콘텐츠 서비스에서 유료 결제 여부에 따라 서로 다른 API Key를 매핑하여 호출 횟수와 접근 범위를 차별화하는 파이프라인 구축.

---
See Also: 
- 