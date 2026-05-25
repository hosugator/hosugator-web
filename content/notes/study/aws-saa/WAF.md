---
created: 2025-11-13
tags:
  - aws_saa
  - waf
  - webacl
  - rule
  - rate_limit
  - layer7
reference:
  - https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html
---
# AWS WAF(web application firewal)
## 정의
웹 애플리케이션에 대한 공격을 차단하거나 허용하는 Layer 7 웹 애플리케이션 방화벽 서비스
## 핵심 구성
- [[Web ACL]] : 규칙 집합을 대상(ALB, CloudFront, API Gateway, App Runner)에 연결
- [[Rule]] : IPSet, SQLi/XSS 시그니처, 지리적 위치, rate-limit 등 조건
- [[Rate-based Rule]] : 5분간 동일 IP 요청 수 임계값(최소 100/5분) 초과 시 차단
## 동작 흐름
요청 → WAF 규칙 평가(우선순위 낮은 숫자 순) → 액션(Allow, Block, Count, CAPTCHA, Challenge) → 대상
## 특징
- 실시간 CloudWatch 메트릭, sampled request 로그
- 관리형 규칙 그룹(OWASP Top10, Bot Control, IP reputation) 추가 가능
- 요금 : Web ACL 1개월당 5USD + 규칙 1개월당 1USD + 요청 0.6USD/백만건
- Terraform, CloudFormation, API로 자동 배포
- 지역별 리소스 생성, CloudFront 연결 시 글로벌