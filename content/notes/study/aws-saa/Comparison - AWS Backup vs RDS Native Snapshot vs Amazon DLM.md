---
created: 2025-12-30
tags: [comparison, storage, backup]
---
# Comparison: AWS Backup vs RDS Native Snapshot vs Amazon DLM

## 비교 목적 (Objective)
데이터 보존 정책(Retention)의 기간과 관리 대상 리소스의 범위에 따른 최적의 백업 솔루션 선정

## 요소별 상세 비교 (Feature Matrix)
| 비교 기준 | [[AWS Backup]] | [[RDS Native Snapshot]] | [[Amazon DLM]] |
| :--- | :--- | :--- | :--- |
| 핵심 본질 | 중앙 집중형 멀티 서비스 백업 관리 | RDS 전용 기본 백업 기능 | EBS/RDS 스냅샷 생명 주기 자동화 |
| 장점 (Pros) | 35일 이상의 장기 보관 및 통합 정책 관리 가능 | 별도 설정 없이 즉시 사용 가능한 단순함 | EBS 스냅샷 관리에 특화되어 비용 효율적임 |
| 단점 (Cons) | 설정 및 권한(IAM) 관리가 추가로 필요함 | 보존 기간이 최대 35일로 제한적임 | 관리 대상 리소스가 특정 서비스로 제한됨 |
| 비용/관리 | 백업 저장소 및 데이터 크기 기반 / 매우 효율적 | 기본 제공 기능 / 관리 포인트 거의 없음 | 무료 서비스(스냅샷 저장비 별도) / 중간 |

## 선택 기준 및 로직 (Selection Logic)

### AWS Backup이 적합한 경우
- 조건 (IF): 규정 준수(Compliance)를 위해 2년 이상의 장기 백업이 필요하거나 여러 서비스의 백업을 통합 관리해야 할 때
- 이유 (THEN): RDS 기본 백업의 35일 제한을 극복할 수 있으며, 백업 계획(Backup Plan)을 통해 전사적 백업 거버넌스를 구축할 수 있음

### RDS Native Snapshot이 적합한 경우
- 조건 (IF): 운영 중인 단일 RDS 인스턴스의 실수 방지를 위해 한 달 이내의 단기 복구 지점이 필요할 때
- 이유 (THEN): 추가 서비스 학습이나 비용 없이 콘솔에서 즉시 시점 복구(PITR) 기능을 사용할 수 있음

### Amazon DLM이 적합한 경우
- 조건 (IF): 수많은 EBS 볼륨의 스냅샷 생성 및 삭제 주기를 태그 기반으로 자동화하고 싶을 때
- 이유 (THEN): 별도의 백업 솔루션 없이도 EBS 볼륨의 데이터 가용성을 보장하는 가장 가벼운 방법임

---
Conclusion: 35일 이상의 장기 보존과 통합 관리가 최우선이면 AWS Backup, 단기 복구가 목적이면 Native Snapshot, EBS 전용 자동화는 DLM이 적합함