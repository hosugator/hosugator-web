---
created: 2026-02-03 11:11
tags:
  - aws
  - lambda
  - serverless
  - performance
  - 
updated: 2026-02-14 20:15
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[MOC - AWS SAA]]"
publish: true
---
# Lambda Concurrency Strategy

## 본질 (Essence)
손님이 오기 전 미리 음식을 데워두는 예약석(Provisioned)과 한 테이블에 앉을 수 있는 인원수를 제한하는 규칙(Reserved).

## 구조 (Mechanism)
- 정의: Lambda 함수의 동시 실행 환경 개수를 사전에 확보하거나 최대치를 제한하여 성능과 자원을 관리하는 기술적 설정.
- 핵심: Provisioned Concurrency는 실행 환경을 미리 활성화(Pre-warm)하여 콜드 스타트 지연을 제거하고 저지연 응답을 보장하며, Reserved Concurrency는 함수별 실행 한도를 설정하여 특정 함수의 리소스 독점과 백엔드 과부하를 방지함.

## 확장 (Connection)
- 응용: 실시간 결제 API처럼 일관된 저지연 응답이 필수적인 서비스에는 Provisioned를 적용하고, 대량의 배치 작업이 백엔드 DB에 과부하를 줄 위험이 있을 때는 Reserved로 속도를 제어함.
- 비교: On-demand Scaling(기본 방식)은 요청에 따라 즉각 생성되나 첫 실행 시 지연(Cold Start)이 발생하는 반면, Concurrency 설정은 미리 자원을 점유하여 지연을 없애거나 실행 한도를 강제함.

---
See Also: 
- 