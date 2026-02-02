---
created: 2025-12-23 Tue
tags: [comparison, decision_making]
reference:
  - "[[Amazon Aurora]]"
  - "[[Amazon DynamoDB]]"
---
# Comparison - Amazon Aurora vs Amazon DynamoDB

## 비교 목적 (Objective)
읽기/쓰기 트래픽의 확장 속도 요구치와 데이터 규모에 따른 비용 효율적 데이터베이스 선정

## 요소별 상세 비교 (Feature Matrix)
| 비교 기준 | [[Amazon Aurora]] | [[Amazon DynamoDB]] |
| :--- | :--- | :--- |
| **핵심 철학** | 고성능 관계형 DB (고정형 인프라 중심) | 무한 확장 NoSQL (이벤트 기반/서버리스 중심) |
| **읽기 확장** | 복제본 추가 방식 (수 분 소요 가능) | 온디맨드 시 즉각 대응 (초 단위) |
| **쓰기 확장** | 수직 확장(Scale-up) 위주로 중단 발생 가능 | 수평 분산(Scale-out)으로 즉각적 무중단 확장 |
| **비용 구조** | 인스턴스 시간당 고정 비용 + 스토리지 | 요청 수 기반(온디맨드) 또는 예약 처리량 기반 |

## 선택 기준 및 로직 (Selection Criteria)

### [[Amazon Aurora]]를 선택해야 하는 경우
* 트래픽 변화가 완만하여 읽기 복제본 추가 시간(Provisioning time)을 감내할 수 있는 경우
* 데이터 관계가 복잡하여 SQL의 강력한 조인과 트랜잭션 기능이 비용 대비 운영 효율을 높여주는 경우
* 일정한 수준의 기본 트래픽이 보장되어 인스턴스 예약 비용이 온디맨드 요청 비용보다 저렴한 경우

### [[Amazon DynamoDB]]를 선택해야 하는 경우
* 쓰기 트래픽이 읽기만큼 빈번하게 급증하여 쓰기 용량의 즉각적인 수평 확장이 필수적인 경우
* 트래픽이 0에 가깝다가 특정 시점에만 폭발하는 경우 (온디맨드 결제로 유휴 비용 차단)
* 데이터 규모가 수백 TB 이상으로 커져서 관계형 DB로는 스토리지 및 인덱스 관리 비용이 감당 안 되는 경우

---
**Conclusion:**
Aurora는 관계 중심의 안정적 확장에, DynamoDB는 쓰기 중심의 즉각적 확장과 사용량 기반 비용 최적화에 특화됨