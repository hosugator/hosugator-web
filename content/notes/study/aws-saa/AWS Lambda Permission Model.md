---
created: 2025-12-19
tags:
  - aws
  - lambda
  - iam
  - security
reference:
  - "[[AWS IAM Role]]"
  - "[[Amazon EventBridge]]"
---
# AWS Lambda Permission Model

## 정의 (Definition)
Lambda 함수가 안전하게 실행되기 위해 필요한 '함수가 외부 서비스를 사용할 권한'과 '외부 서비스가 함수를 호출할 권한'을 정의하는 보안 체계

## 핵심 맥락 (Context & Why)
### Problem
클라우드 환경에서 권한이 너무 포괄적이면 보안 사고의 위험이 있고, 반대로 권한이 없으면 트리거가 발생해도 함수가 실행되지 않거나 필요한 데이터에 접근하지 못하는 문제
### Solution
권한의 방향에 따라 실행 역할(Execution Role)과 리소스 기반 정책(Resource-based Policy)으로 분리하여 관리함으로써 최소 권한 원칙을 실현하고 보안성 향상

## 작동 원리 (Mechanism) 
### Inside-Out (Execution Role)
함수 실행 시 지정된 IAM Role을 가정(Assume)하여 S3, DynamoDB 등 다른 AWS 리소스에 접근할 수 있는 토큰을 획득하고 작업을 수행
### Outside-In (Resource-based Policy)
EventBridge나 S3 같은 서비스가 함수를 호출하려고 할 때, Lambda 서비스는 함수에 부착된 정책을 확인하여 해당 서비스의 호출 권한(lambda:InvokeFunction)이 있는지 검증

## 유비 및 비교 (Analogy & Comparison)
### It's like
실행 역할은 직원이 업무를 위해 사용하는 '사원증'과 같고, 리소스 기반 정책은 사무실 문에 붙어 있는 '출입 허가 명단'
### vs (유사 개념)
- Execution Role: Lambda가 주체가 되어 외부 리소스를 사용할 때 필요한 권한입니다.
- Resource-based Policy: 외부 서비스가 주체가 되어 Lambda를 호출할 때 필요한 권한입니다.

## 예시 및 구조 (Example/Structure)
EventBridge 규칙이 5분마다 Lambda를 호출해야 하는 구조:
EventBridge(Principal: events.amazonaws.com)에게 Lambda의 `lambda:InvokeFunction` 액션을 허용하는 리소스 기반 정책을 함수에 추가합니다.

---
See Also:
- [[Principle of Least Privilege]]
- [[IAM Policy Types]]