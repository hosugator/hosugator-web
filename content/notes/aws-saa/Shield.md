---
created: 2025-11-13
tags:
  - aws_saa
  - shield
  - ddos
  - layer3
  - layer4
  - standard_advanced
reference:
  - https://docs.aws.amazon.com/waf/latest/developerguide/shield.html
---

# AWS Shield
## 정의
AWS 리소스에 대한 [[DDoS]] 공격을 자동으로 탐지·완화하는 관리형 보안 서비스

## 등급 비교
- Shield Standard : 모든 AWS 고객 무료, Layer 3·4 기본 보호
- Shield Advanced : 유료(3,000 USD/월), Layer 3·4·7 대형·정교 공격 대응, 24×7 DRT(DDoS Response Team) 지원

## 보호 대상
- Standard : [[CloudFront]], [[ELB]](ALB/NLB), [[Route 53]], Global Accelerator
- Advanced : 위 항목 + [[EC2]] Elastic IP, [[EIP]] 뒤 ELB, AWS Transit Gateway

## 주요 기능
- 실시간 트래픽 모니터링, Baseline 학습
- Advanced는 자동 완화 외 Attack 알림(SNS), 비용 보호(Credits)
- Shield Advanced 활성 시 [[WAF]] [[WebACL]] 무료 제공

## 특징
- 가입 절차 없이 Standard 자동 적용
- Advanced는 계정당 1회 활성화, 리전별 종량 요금 없음
- CloudWatch 지표, AWS Firewall Manager 연동