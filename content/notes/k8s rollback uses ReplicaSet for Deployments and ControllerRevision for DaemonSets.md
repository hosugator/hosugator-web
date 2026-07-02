---
created: 2026-06-12
updated: 2026-06-12
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - rollback
  - argocd
publish: true
---
## Context
Argo CD 대시보드에서 Deployment 옆에 ReplicaSet 7개, DaemonSet 옆에 ControllerRevision 11개가 붙어있는 걸 보고 각각의 역할과 health 표시 차이를 정리했다.

## Insight
### 리소스 종류마다 이력 추적 방식이 다르다

| 리소스 | 이력 단위 | health 표시 |
|---|---|---|
| Deployment | ReplicaSet | 있음 (초록 하트) |
| DaemonSet | ControllerRevision | 없음 |
| StatefulSet | ControllerRevision | 없음 |
| Service | 없음 | 있음 |

### ReplicaSet은 실제 리소스라 health가 있고, ControllerRevision은 데이터라 health가 없다

```
ReplicaSet        → pod를 관리하는 실제 리소스 → 동작 상태 있음 → health 측정 가능
ControllerRevision → 설정 스냅샷 JSON → 아무것도 실행 안 함 → health 개념 없음
```

이전 ReplicaSet들이 초록 하트인 이유: `replica=0`도 정상 상태다. 실제로 pod가 실행 중인 RS는 하나뿐이고 나머지는 롤백 대기 상태다.

### Argo CD에서 롤백하면 Git과 클러스터가 불일치한다

```
Argo CD 롤백 → 클러스터 = 이전 버전
Git manifest  = 최신 버전
→ OutOfSync 상태
```

임시 롤백이면 OutOfSync로 두어도 무방하다. 영구적으로 되돌리려면 Git manifest도 함께 수정해야 한다. Git이 SSOT이기 때문이다.

### revisionHistoryLimit으로 보존 개수를 제한할 수 있다

```yaml
spec:
  revisionHistoryLimit: 3  # 기본값 10
```

CI/CD가 자주 돌면 ReplicaSet이 무한정 쌓인다. 3-5개로 제한하는 게 일반적이다.

## Related
- [[Argo CD is a deployment coordinator not a runtime dependency, k3s self-heals without it]] — Argo CD rollback 후 OutOfSync 맥락
- [[DaemonSet runs one pod per node for node-scoped infrastructure tasks]] — DaemonSet ControllerRevision이 생기는 리소스
- [[Argo CD watches Git manifest and CI must update manifest to trigger deployment]] — Git SSOT 원칙
