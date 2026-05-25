---
created: 2025-11-14
tags: [aws_saa, kinesis, streaming, shard, retention, analytics]
reference:
  - https://docs.aws.amazon.com/kinesis/latest/streams/what-is-amazon-kinesis.html
---
# Amazon Kinesis Data Streams
## 정의

대량 실시간 스트리밍 데이터를 지속적으로 수집·저장·처리할 수 있는 관리형 스트림 플랫폼 서비스

## 원리
- 프로듀서가 레코드를 [[Shard]] 에 순차적으로 기록
- 각 샤드는 1초에 1,000건 또는 1MB 까지 쓰기, 2MB 읽기 가능
- 컨슈머는 [[Polling]] 또는 [[Enhanced Fan-Out]] 로 실시간 레코드 가져가 처리
- 데이터는 기본 24시간 보관, 최대 365일 연장 가능
## 특징
- [[Shard]] 수로 처리량 수평 확장, 증가·감소 실시간 적용
- [[Sequence Number]] 로 샤드 내 순서 보장, 키 기반 파티셔닝
- 암호화 : 서버-사이드 KMS, 전송 중 TLS
- KCL(Kinesis Client Library), Lambda, Flink, Spark Streaming 등 다양한 컨슈머 지원
## 비교
[[SQS]] 는 단순 메시지 큐,  
Kinesis는 실시간 스트림·순서 보장·재처리에 최적