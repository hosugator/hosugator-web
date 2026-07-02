---
created: 2025-12-29 15:46
tags:
  - comparison
  - DR
  - Architecture
  - Resilience
  - 
updated: 2026-02-14 23:45
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[MOC - AWS SAA]]"
publish: true
---
# Comparison: Disaster Recovery (DR) Strategies

## 비교 목적 (Objective)
재해 발생 시 비즈니스 연속성을 확보하기 위해, 복구 목표 시간(RTO)과 비용 간의 최적의 균형점을 가진 DR 선정 기준

## 요소별 상세 비교 (Feature Matrix)
| 전략 | 복구 수준 | [[RTO]] (복구 시간) | [[RPO]] (복구 시점) | 비용 | 특징 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Backup & Restore | Cold | 수 시간 ~ 수 일 | 수십 분 ~ 수 시간 | 최저 | 데이터만 백업하고 인프라는 재해 후 새로 구축함 |
| Pilot Light | Warm-ish | 수십 분 | 실시간(DB만) | 낮음 | DB는 실시간 복제, 서버는 중지 또는 템플릿 상태로 대기함 |
| Warm Standby | Warm | 수 분 | 실시간 | 중간 | 최소 사양의 서버와 DB가 항상 켜져 있어 즉시 투입 가능함 |
| Multi-site (Active-Active) | Hot | 즉시 (초 단위) | 실시간 | 최고 | 두 리전에서 모든 자원이 풀 사양으로 가동 중임 |

## 선택 기준 및 로직 (Selection Logic)

### Backup & Restore가 적합한 경우
- 조건 (IF): 복구 시간이 오래 걸려도 서비스에 치명적이지 않고 비용 절감이 최우선일 때
- 이유 (THEN): 평소 유지비가 거의 없으며 가장 단순한 구성임

### Pilot Light가 적합한 경우
- 조건 (IF): 데이터 유실은 절대 안 되지만(실시간 DB 복제), 서버 복구에 드는 수십 분의 시간은 허용 가능할 때
- 이유 (THEN): 서버 비용을 아끼면서도 핵심 데이터의 안전성을 보장함

### Warm Standby가 적합한 경우
- 조건 (IF): 장애 시 서비스 중단 시간을 최소화해야 하며, 낮은 사양으로라도 서비스를 즉시 재개해야 할 때
- 이유 (THEN): 이미 인프라가 '최소 사양'으로 가동 중이라 Scale-up만으로 빠른 복구가 가능함

### Multi-site가 적합한 경우
- 조건 (IF): 1초의 중단도 허용되지 않는 미션 크리티컬한 서비스일 때
- 이유 (THEN): 트래픽이 양쪽 리전으로 분산되며 한쪽이 무너져도 즉각 대응 가능함

---
 Conclusion: 비용과 복구 속도는 반비례하며, 비즈니스 영향도에 따라 적절한 '온도'를 선택해야 함