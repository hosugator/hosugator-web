---
created: 2025-11-13
tags: [aws_saa, eventbridge, eventbus, rule, target, serverless, scheduling]
reference:
  - https://docs.aws.amazon.com/eventbridge/latest/userguide/what-is-amazon-eventbridge.html
---

# Amazon EventBridge

## 정의
애플리케이션, AWS 서비스, SaaS에서 발생하는 이벤트를 실시간으로 수집·라우팅·반응할 수 있는 서버리스 이벤트 버스 서비스

## 원리
- 이벤트 발생 → Event Bus(기본 또는 사용자 지정) 도착
- [[Rule]] : JSON 패턴 매칭(출처, 상세 내용, 리전 등)으로 필터
- [[Target]] : Lambda, Step Functions, SNS, SQS, Kinesis, API Gateway, Inspector 등 20+ 대상 호출
- 실패 시 재시도·Dead Letter Queue(DLQ) 제공

## 특징
- 스케줄 표현식(Cron·Rate)으로 주기적 작업 대체 가능(CloudWatch Events 역할)
- SaaS 연동 : Datadog, Zendesk, MongoDB Atlas 등에서 직접 이벤트 수신
- 리전 내 기본 버스 무료, 사용자 지정 버스·이벤트 건수 과금
- 이벤트 크기 최대 256 KB, 24시간 보관 후 자동 삭제
- 조직 단위 이벤트 버스로 멀티 계정 중앙 집중 라우팅 가능

## 비교
[[CloudWatch Events]] 는 기본 버스·스케줄만 제공,  
EventBridge는 사용자 지정 버스·SaaS·고급 필터·DLQ 등 고급 기능 추가

## 예시
1. [[ECR]] 이미지 푸시 이벤트 → EventBridge 규칙 → Lambda → Inspector 스캔 API 호출
2. 매일 03:00 Cron 규칙 → Step Functions → EC2 스냅샷 생성 → 성공 시 SNS 알림