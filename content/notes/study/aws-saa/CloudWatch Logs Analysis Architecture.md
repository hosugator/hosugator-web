---
created: 2025-12-29
tags: [Monitoring, Logging, CloudWatch]
---
# CloudWatch Logs Analysis Architecture

## 요약 (Summary)
CloudWatch Logs는 로그의 수집과 보관을 담당하며, 실제 정밀 분석을 위해서는 구독 필터(Subscription Filter)를 통해 외부 분석 도구로 데이터를 실시간 전송하는 파이프라인 구성이 필요하다.

## 배경 (Background)
- 탄생 배경: CloudWatch Logs 콘솔에서도 기본 검색은 가능하지만, 대용량 로그의 복잡한 상관관계 분석이나 실시간 대시보드 시각화에는 기능적 한계가 있음
- 핵심 과제: 보관 중인 로그 데이터를 데이터 분석에 최적화된 엔진(OpenSearch, Athena 등)으로 오버헤드 없이 신속하게 전달해야 함

## 솔루션 (Solution)
- 핵심 설계: **구독 필터(Subscription Filter)**를 활용한 데이터 스트리밍
- 작동 메커니즘:
    1. **수집**: 애플리케이션 로그가 CloudWatch Logs로 유입됨
    2. **전송(Subscription)**: 설정된 필터 조건에 맞는 로그를 즉시 목적지로 쏨 (저장 단계의 일종)
    3. **저장/분석**: OpenSearch(실시간 검색), S3(장기 보관), Lambda(가공), Kinesis(대규모 처리) 등에서 데이터 소비

## 변별점 (Distinction)
- 비유: CloudWatch Logs가 물을 모아두는 '저수지'라면, Subscription은 필요한 곳으로 물을 끌어다 쓰는 '수로'이며, OpenSearch는 그 물을 정수하고 분석하는 '정수장'과 같음
- 대안과의 차이: 
    - [[CloudWatch Logs Insights]]: 별도 전송 없이 로그 그룹 내에서 직접 쿼리하여 분석함. 간단한 분석엔 빠르나 대규모 시각화에는 [[OpenSearch]] 연동이 유리함
    - [[Kinesis Data Firehose]]: 매우 복잡한 데이터 변환이 필요할 때 중간 단계로 사용하나, 단순 전송 시에는 [[Subscription Filter]]가 운영 오버헤드가 더 낮음

---
See Also:
- [[AWS Transfer Family]]
- [[Amazon OpenSearch Service]]
- [[Kinesis Data Streams]]