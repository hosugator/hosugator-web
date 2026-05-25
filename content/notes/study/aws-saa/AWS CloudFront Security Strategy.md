---
created: 2026-02-02
tags:
  - aws
  - cloudfront
  - security
  - encryption
---
# CloudFront Advanced Security Strategy

## 본질 (Essence)
단순한 전송 보안(HTTPS)을 넘어, 콘텐츠 접근 제어와 데이터 자체의 보안을 강화하는 계층적 방어 전략

## 구조 (Mechanism)
### 1. 데이터 자체 보호: Field-Level Encryption
- **특징**: Edge에서 특정 필드(민감 정보)를 암호화하여 백엔드 스택 전체에서 데이터 비노출 유지.
- **용도**: 결제 정보, 개인 식별 정보(PII) 보호.

### 2. 접근 제어: Signed URL & Cookie
- **Signed URL**: 단일 리소스 접근 권한 부여. (RTMP 프로토콜 등 특정 환경 필수)
- **Signed Cookie**: 다수 리소스 또는 현재 브라우저 세션에 대한 권한 부여. 애플리케이션 URL 변경 없이 사용 가능.

## 확장 (Connection)
- **연결**: 
    - "전송 구간 보안" = **HTTPS**.
    - "파일 접근 권한" = **Signed URL/Cookie**.
    - "데이터 내용 보호(End-to-End)" = **Field-Level Encryption**.
- **응용**: 문제에서 "sensitive information", "entire application stack", "restricted access" 키워드가 조합되면 **Field-Level Encryption**이 정답.

---
See Also: 
- [[CloudFront]]
- [[AWS Security Strategy]]