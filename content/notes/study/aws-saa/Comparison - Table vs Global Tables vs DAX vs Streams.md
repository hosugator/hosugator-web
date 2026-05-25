---
created: 2026-01-02
tags: [comparison, dynamodb, database]
---
# Comparison: Table vs Global Tables vs DAX vs Streams

## 비교 목적 (Objective)
비즈니스 요구사항(가용성, 성능, 이벤트 처리)에 따른 DynamoDB 하위 서비스 및 확장 기능의 최적 선택

## 요소별 상세 비교 (Feature Matrix)
| 비교 기준 | [[DynamoDB Table]] | [[DynamoDB Global Tables]] | [[DynamoDB DAX]] | [[DynamoDB Streams]] |
| :--- | :--- | :--- | :--- | :--- |
| 핵심 본질 | 리전 내 기본 데이터 저장소 | 멀티 리전 간 자동 복제 솔루션 | 인메모리 기반 읽기 가속 캐시 | 데이터 변경 이력 실시간 추적기 |
| 장점 (Pros) | 한 자릿수 밀리초(ms) 지연 시간 보장 | 99.999% 가용성 및 리전 장애 복원력 | 응답 속도를 ms에서 μs 단위로 단축 | Lambda 연동을 통한 이벤트 기반 설계 가능 |
| 단점 (Cons) | 단일 리전 장애 시 가용성 확보 불가 | 리전 간 복제 비용 및 데이터 전송비 발생 | 별도 클러스터 유지비 및 관리 오버헤드 | 데이터 보존 기간이 24시간으로 제한됨 |
| 비용/관리 | 온디맨드 또는 프로비저닝 선택 / 낮음 | 복제 쓰기 단위(rWCU) 기반 / 중간 | 노드 유형 및 개수 기반 / 높음 | 스트림 읽기 요청당 비용 / 매우 낮음 |

## 선택 기준 및 로직 (Selection Logic)

### DynamoDB Table이 적합한 경우
- 조건 (IF): 단일 리전 내에서 표준적인 NoSQL 데이터 저장 및 관리가 필요할 때
- 이유 (THEN): 별도 확장 기능 없이도 높은 성능과 확장성을 제공하며 가장 경제적으로 운영 가능함

### DynamoDB Global Tables가 적합한 경우
- 조건 (IF): 전 세계 사용자에게 낮은 지연 시간을 제공하거나, 특정 리전 장애 시에도 서비스 중단이 없어야 할 때
- 이유 (THEN): AWS 관리형 복제 기능을 통해 데이터 일관성을 유지하며 "Seamless(매끄러운)" 리전 장애 극복이 가능함

### DynamoDB DAX가 적합한 경우
- 조건 (IF): 특정 데이터에 읽기 요청이 극도로 집중(Hot Key)되어 응답 속도 최적화가 최우선일 때
- 이유 (THEN): 인메모리 캐싱을 통해 DB 본체의 읽기 부하(RCU)를 줄이고 애플리케이션의 체감 속도를 비약적으로 향상함

### DynamoDB Streams가 적합한 경우
- 조건 (IF): 데이터 변경(추가/삭제 등)이 발생할 때 실시간 알림을 보내거나 다른 DB와 동기화가 필요할 때
- 이유 (THEN): 변경 이력을 순차적으로 캡처하여 Lambda 등의 컴퓨팅 서비스와 연동한 실시간 이벤트 처리에 최적화됨

---
Conclusion: 표준 저장은 Table, 글로벌 고가용성은 Global Tables, 읽기 성능 극한 최적화는 DAX, 변경에 따른 후속 처리는 Streams를 선택함