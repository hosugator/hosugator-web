---
created: 2026-01-07
tags:
  - comparison
  - system_performance
  - computing_term
  - throughput
  - latency
  - transaction
---
# Comparison - Throughput vs Latency vs Transaction

## 비교 목적 (Objective)
시스템의 인프라적 운반 능력(Throughput), 개별 작업의 응답 속도(Latency), 그리고 비즈니스 가치를 창출하는 완결된 작업 단위(Transaction)의 차이

## 요소별 상세 비교 (Feature Matrix)
| 비교 기준 | [[Throughput]] | [[Latency]] | [[Transaction]] |
| :--- | :--- | :--- | :--- |
| **핵심 본질** | 단위 시간당 시스템이 처리하는 전체 데이터/작업의 양 | 요청부터 결과 완료까지 소요되는 순수 시간 (응답성) | 성공적으로 완료된 하나의 논리적 업무 단위 |
| **장점 (Pros)** | 시스템의 대역폭과 최대 수용량을 직관적으로 보여줌 | 사용자 경험(UX)과 직결되며 시스템의 기민함을 나타냄 | 실제 비즈니스 성과와 데이터 정합성을 측정하는 기준임 |
| **단점 (Cons)** | 개별 작업이 얼마나 빨리 끝나는지는 알 수 없음 | 시스템 전체가 얼마나 많은 일을 하는지는 알 수 없음 | 로직이 복잡할수록 인프라 성능(Throughput)의 영향을 크게 받음 |
| **비용/관리** | 하드웨어 자원(네트워크 대역폭 등) 확장에 비례함 | 물리적 거리(Placement Group) 및 알고리즘 최적화에 의존함 | DB 부하 관리 및 원자성(Atomicity) 보장을 위한 비용 발생 |

## 선택 기준 및 로직 (Selection Logic)

 - **Throughput이 최우선인 경우**
	- 조건 (IF): 대규모 데이터를 백업하거나 배치 작업을 처리하는 환경일 때
	- 이유 (THEN): 개별 작업의 시간보다는 '정해진 시간 내에 얼마나 많은 양을 옮겼는가'가 중요하기 때문임

- **Latency가 최우선인 경우**
	- 조건 (IF): 실시간 주식 거래, 온라인 게임, 초저지연 API 호출 환경일 때
	- 이유 (THEN): 처리량이 아무리 많아도 응답이 늦어지면 비즈니스 가치가 상실되기 때문임

- **Transaction이 최우선인 경우**
	- 조건 (IF): 금융 결제, 이커머스 주문 처리 등 데이터 결함이 없어야 하는 환경일 때
	- 이유 (THEN): 단순한 흐름보다는 '완결된 작업'의 성공 여부가 서비스 신뢰도의 핵심이기 때문임

## Conclusion
인프라의 용량(Throughput)이 확보되어야 대량의 업무(Transaction)를 처리할 수 있으며, 이 과정에서 물리적 거리 단축 등을 통해 개별 응답성(Latency)을 확보하는 것이 고성능 설계의 완성입니다.

---
See Also:
- [[SQS]]
- [[Service Quotas & Decoupling]]