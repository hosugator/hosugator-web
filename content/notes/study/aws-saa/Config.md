---
created: 2025-11-13
tags: [aws_saa, config, compliance, rule, recorder, remediation]
reference:
  - https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html
---
# AWS Config
## 정의
AWS 리소스 이력을 기록하고 규칙 기반 평가하는 관리형 감사 서비스
## 핵심 구성요소
- [[Configuration Recorder]] : 리소스 속성을 발견하면 즉시 [[Configuration Item]]으로 저장
- [[Config Rule]] : 원하는 상태를 정의한 [[Lambda]] 함수(사용자 작성 또는 관리형)
- [[Configuration Timeline]] : 리전 단위로 리소스별 변경 이력 조회
- [[Remediation]] : 규칙 불합격 시 자동 수정 작업 실행
## 주요 기능
- 리소스 관계 매핑(보안 그룹 → EC2 연결 등)
- 다중 계정·다중 리전 통합([[Aggregator]])
- [[S3]] 버킷에 구성 스냅샷 보관, 15개월 기본 보관
- [[CloudTrail]], [[Security Hub]], [[SSM]] 와 연동
## 특징
- 요금 : 구성 항목당 0.003USD, 규칙 평가 0.001USD
- 규칙 25개까지는 평가 무료(초과 시 과금)
- 실시간 이벤트는 [[EventBridge]] 규칙으로 외부 전파 가능