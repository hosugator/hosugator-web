---
created: 2026-07-22
updated: 2026-07-22
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - postgresql
  - architecture
  - decision
publish: true
---
## Context
Align-AI를 포트폴리오 E2E 프로젝트로 완결시키려면 데이터 계층(스토리지+DB)이 빠져있다는 문제의식에서 ADR-012를 결정했다. architect 에이전트로 초안을 받은 뒤 범위를 "추론 결과 DB부터"로 좁히고, 세 갈림길에서 결정을 내렸다.

## Insight

### Deployment+수동 PVC가 아니라 StatefulSet으로 배포한다

Pod 이름(`postgres-0`)에서 PVC 이름(`data-postgres-0`)이 결정론적으로 생성되어, Pod이 재생성되어도 항상 같은 데이터에 재바인딩된다. Deployment는 Pod 이름이 랜덤이라 이 매칭이 불가능하고, replica를 늘리면 모든 Pod이 같은 PVC를 마운트하려다 충돌한다(RWO 기준).

### DB를 3개로 쪼개지 않고 1개 + 테이블 3개(`images`/`inference_results`/`process_metadata`)로 구성한다

엣지 규모(게이트웨이 PC 1대)에서 DB 3개 분리는 운영 오버헤드(백업·배포 3배)만 늘리고, 조인이 애플리케이션 레벨로 떠넘겨진다. FK로 묶을 수 있는 관계형 데이터를 굳이 물리적으로 분리할 이유가 없었다.

### 게이트웨이 PC 네이티브 설치가 아니라 k3s 안에 둔다

네이티브 설치는 k8s 매니페스트 밖에서 별도로 배포·백업·버전관리해야 해서 기존 ArgoCD GitOps 운영 모델과 어긋난다. StatefulSet으로 두면 Deployment·Job과 동일하게 Git 상태 하나로 관리된다.

## Decision
StatefulSet + 단일 PostgreSQL(3테이블) + k3s 내부 배포를 채택한다.

**전환 조건**:
- 노드가 여러 대로 늘어나 진짜 고가용성(데이터 복제)이 필요해지면, StatefulSet의 replica는 데이터를 복제해주지 않으므로 Patroni 등 별도 replication 도구 도입을 재검토한다.
- k3s 자체가 게이트웨이 PC의 표준 배포 방식에서 제외되면, 네이티브 설치 + ExternalName Service 방식을 재검토한다.

## Related
- [[StatefulSet rebinds the same PVC via deterministic pod naming, not automatic data replication]] — 이 결정을 가능하게 하는 메커니즘
- [[Writing a schema.sql file is physical data modeling between infra provisioning and application code]] — 이 결정 이후 실제 스키마를 작성하며 나온 개념
- [[Docker image contains only code and packages, runtime data mounts via hostPath volumes]] — GitOps 일관성을 우선한 이전 결정(ADR-010)과 같은 축
- [[Table-driven product config eliminates scattered conditionals in ML pipelines]] — 같은 "결정을 insight로 기록"하는 형식의 선례(ADR-011)
