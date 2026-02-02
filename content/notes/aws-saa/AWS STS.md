---
created: 2026-01-16
tags:
  - aws
  - sts
  - assumerole
  - token
  - security
  - iam
  - role
  - mfa
---
# AWS STS (Security Token Service)

## 본질 (Essence)
사용자나 서비스의 신원을 확인하고, 특정 권한(Role)을 행사할 수 있는 짧은 유효 기간의 임시 출입증을 발급해 주는 중앙 발권 시스템

## 구조 (Mechanism)
- **임시 자격 증명**: Access Key ID, Secret Access Key와 더불어 Session Token이라는 세 번째 요소를 함께 발급하여 보안성을 강화합니다.
- **주요 API**: 
    - **AssumeRole**: IAM Role을 맡아 임시 권한을 얻을 때 사용합니다.
    - **GetSessionToken**: MFA(다요소 인증) 등을 거쳐 임시 키를 얻을 때 사용합니다.
    - **GetCallerIdentity**: 현재 내가 누구의 권한으로 접속해 있는지 확인할 때 사용합니다.
- **보안 이점**: 자격 증명이 로컬 환경이나 코드에 영구적으로 저장되지 않으며, 만료 시간이 지나면 자동으로 권한이 회수됩니다.

## 확장 (Connection)
- **연결**: 은행에서 본인 확인 후 특정 업무를 위해 잠시 발행해 주는 '번호표'나 '일회용 OTP'의 생성 원리와 유사함
- **응용**: 다계정 환경(Cross-Account) 접근, EC2 인스턴스 프로파일, 자격 증명 페더레이션(SAML/OIDC) 등 AWS의 모든 임시 권한 부여 체계의 근간이 됨

---
See Also: 
- [[IAM Role Internal Mechanism]]