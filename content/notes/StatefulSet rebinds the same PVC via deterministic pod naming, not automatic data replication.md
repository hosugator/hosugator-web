---
created: 2026-07-13
updated: 2026-07-13
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - statefulset
  - pvc
  - storage
publish: true
---
## Context
ADR-012(추론 결과 영속화)로 PostgreSQL을 k3s에 배포하며 StatefulSet을 처음 직접 작성했다.
Deployment/Job만 다뤄봤던 터라 "Pod이 죽어도 데이터가 남는다"는 것과 "replicas를 올리면 데이터가 복제되는 것 아니냐"는 오해가 자연스럽게 따라왔다.

## Insight
### PVC는 스토리지 자체가 아니라 스토리지에 대한 요청 객체다

```
Pod ──mount──> PVC ──bind──> PV ──실제 위치──> 노드 디스크의 디렉토리
```

Pod이 죽어도 사라지지 않는 건 PVC(와 그것이 바인딩된 PV)다. Pod은 "이 PVC를 마운트해달라"고 참조할 뿐이다.

### StatefulSet은 Pod 이름 → PVC 이름을 결정론적으로 생성해 재바인딩한다

`volumeClaimTemplates`가 Pod 이름(`postgres-0`)으로부터 PVC 이름(`data-postgres-0`)을 자동 생성한다.
Pod이 재생성되어도 이름이 같으니 항상 같은 PVC를 다시 찾아가고, 그 PVC는 이미 같은 PV(같은 데이터)에 바인딩되어 있다.
Deployment로는 이게 불가능하다 — Pod 이름이 매번 랜덤 해시라 "이 PVC는 항상 이 Pod과 짝지어진다"는 결정론적 매칭을 만들 수 없다.
replicas가 여러 개면 모든 Pod이 스펙에 박힌 동일 PVC 하나를 마운트하려 시도해 충돌한다(RWO 기준).

### replicas를 올려도 데이터가 복제되지 않는다 — 중요한 오해

`replicas: 2`로 설정하면 `postgres-0`, `postgres-1`이 생기는데, 각각 완전히 독립적인 빈 PVC(`data-postgres-0`, `data-postgres-1`)를 갖는다. 
서로 동기화되지 않는 별개의 Postgres 인스턴스 두 개가 생길 뿐이다.
StatefulSet이 보장하는 건 "안정적 이름과 순서 있는 생성"뿐이지, 실제 데이터 복제(스트리밍 replication)는 Postgres 자체의 replication 설정이나 Patroni 같은 별도 도구가 담당하는 애플리케이션 레벨 관심사다.
그래서 이 이미지 그대로 replicas만 올리면 유용한 HA가 전혀 되지 않는다.

### hostPath는 "지연" 때문이 아니라 "접근 가능 범위" 때문에 노드에 결속된다

hostPath/local-path PV는 특정 노드의 로컬 디스크에 물리적으로 존재해 다른 노드에서는 네트워크 경로 자체가 없다 — 그래서 k8s가 PV 생성 시 자동으로 `nodeAffinity`를 걸어 그 노드에만 스케줄되도록 강제한다. 
반대로 네트워크 스토리지(NFS, Ceph, 클라우드 블록스토리지)는 어느 노드에서든 도달 가능해 노드 고정 제약이 없는 대신, 그 대가로 로컬 디스크보다 느린 지연을 감수한다.
즉, 지연이 제약을 만드는 게 아니라, 접근 범위가 제약의 유무를 결정한다.

## Related
- [[Kubernetes replicas are active-active concurrent pods not standby]] — 같은 "replica 오해" 계열이지만 층위가 다름: 그 노트는 Deployment/Service의 트래픽 분산 오해, 이 노트는 StatefulSet의 데이터 비복제 오해
- [[Stateless design makes any instance interchangeable by externalizing state]] — Deployment가 애초에 이 문제와 무관한 이유(상태를 안 가지므로)
- [[Docker image contains only code and packages, runtime data mounts via hostPath volumes]] — 같은 hostPath 개념을 모델 파일 마운트 사례로 먼저 다룸
