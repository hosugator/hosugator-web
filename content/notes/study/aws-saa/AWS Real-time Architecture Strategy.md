---
created: 2026-01-28
tags:
  - aws
  - real-time
  - streaming
  - caching
  - strategy
---
# Real-time Architecture Strategy

## 본질 (Essence)
흐르는 강물을 즉시 정수해서 보내느냐(Streaming), 아니면 자주 마시는 물을 미리 컵에 따라 내 책상 위에 두느냐(Caching)의 차이

## 구조 (Mechanism)
### 1. 스트리밍 계층 (Data in Motion: 흐르는 데이터)
- **Kinesis Data Streams**: 1초 미만의 실시간 분석 및 다중 처리용 엔진.
- **Kinesis Data Firehose**: 데이터 저장소(S3, Redshift)로의 'Near Real-time' 배달 서비스.
- **CloudWatch Logs Subscription**: 로그 전용 실시간 지름길 (내부적으로 스트리밍 원리 활용).
- **MSK (Managed Streaming for Kafka)**: 오픈소스 카프카 표준을 사용하는 대규모 실시간 스트리밍.

### 2. 캐싱 계층 (Data at Rest: 멈춘 데이터의 빠른 접근)
- **CloudFront**: 전 세계 사용자 근처(Edge)에 정적/동적 콘텐츠를 복제하여 지연 시간 최소화.
- **ElastiCache (Redis/Memcached)**: DB 앞에 위치하여 자주 묻는 데이터를 메모리에 저장, 밀리초 단위 응답 제공.
- **DAX (DynamoDB Accelerator)**: DynamoDB 전용 인-메모리 캐시.

## 확장 (Connection)
- **연결**: TV 생중계(Streaming)를 보느냐, 아니면 보고 싶은 영화를 미리 다운로드(Caching)해 두느냐의 차이
- **응용**: "로그/이벤트를 즉시 분석하라"면 스트리밍 계층을, "웹사이트 응답 속도나 DB 부하를 줄이라"면 캐싱 계층을 선택

---
See Also: 
- [[AWS Network Connectivity Strategy]]
- [[AWS Data Bridge Strategy]]