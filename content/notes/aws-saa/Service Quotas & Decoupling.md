---
created: "2026-01-06"
tags: [AWS, Cloud_Computing, Architecture]
---
# Service Quotas & Decoupling

## 요약 (Summary)
시스템이 수용 가능한 물리적 한계(Quotas)를 인지하고, 이를 초과하는 압력을 중간 완충 지대를 통해 조절하여 시스템 붕괴를 막는 설계 전략

## 배경 (Background)
- 탄생 배경: 클라우드 환경에서 특정 리소스(Lambda 동시성, DB 커넥션 등)를 무한정 점유하려는 시도가 발생할 경우, 자원 고갈로 인해 전체 서비스가 마비되거나 예상치 못한 비용 폭탄이 발생함
- 핵심 과제: 유입되는 데이터의 양(수도꼭지)이 처리 가능한 그릇의 크기(쿼터)를 넘어설 때, 데이터를 유실하지 않으면서도 시스템 안정성을 유지해야 함

## 솔루션 (Solution)
- 핵심 설계: 생산자(Producer)와 소비자(Consumer) 사이에 메시지 큐(SQS)와 같은 완충 계층을 도입하는 '디커플링(Decoupling)' 구조 채택
- 작동 메커니즘: 유입량이 쿼터를 초과하면 SQS가 데이터를 일단 보관(Buffering)하고, 소비자 측은 자신이 처리 가능한 쿼터 범위 내에서만 데이터를 일정하게 꺼내와 처리(Throttling 제어)함

## 변별점 (Distinction)
- 비유: 손님이 몰리는 맛집(DB/Lambda) 앞에 대기 명단과 대기석(SQS)을 마련하여, 식당 내부가 아수라장이 되지 않도록 입장 인원을 조절하는 것
- 대안과의 차이: 
	 - [Direct Integration (직렬 연결)]: 유입량 증가 시 즉시 쿼터 한계에 도달하여 시스템 에러(Throttling)를 발생시키지만, 디커플링 구조는 처리 속도가 늦어질지언정 시스템은 중단되지 않음

---
See Also:
- [[Amazon SQS]]
- [[AWS Lambda Concurrency]]
- [[Throttling]]