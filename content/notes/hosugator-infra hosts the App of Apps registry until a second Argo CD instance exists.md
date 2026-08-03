---
created: 2026-07-20
updated: 2026-07-20
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Hosugator Web]]"
tags:
  - argocd
  - gitops
  - kubernetes
  - app-of-apps
  - architecture
publish: true
---
## Context
[[Argo CD treats every manifest in its watched path as desired state regardless of filename intent]]에서 완전 GitOps 전환을 마쳤다고 여겼는데, 오늘 다시 들여다보니 `cureat`·`align-ai-serving`·`align-ai-laptop-gpu` 세 Application CR 자체가 `argocd app create`로 클러스터에 직접 주입되어 있고 git 어디에도 없었다.
워크로드 매니페스트는 GitOps화됐지만, "무엇을 감시할지"를 정의하는 상위 레이어는 여전히 imperative했던 것 — 클러스터가 날아가면 이 세 등록 자체를 재현할 방법이 기억밖에 없는 상태였다.

## Insight
### Application 정의의 위치는 워크로드 위치가 아니라 Argo CD 컨트롤 플레인 인스턴스가 기준이다
`align-ai-laptop-gpu` Application은 워크로드 소스가 `align-ai.git`이고 destination도 노트북(`100.110.4.54:6443`)이라 오라클과 무관해 보이지만, 이 Application 오브젝트 자체는 항상 오라클의 `argocd` 네임스페이스 etcd에 존재한다 — Argo CD 컨트롤러가 오라클 하나에서만 돌기 때문이다. 
그래서 "이 Application 정의 파일을 어느 repo에 둘까"는 "워크로드가 어디 있나"가 아니라 "어느 Argo CD 인스턴스에 등록되나"로 결정해야 한다. 지금은 인스턴스가 오라클 하나뿐이라 세 정의 전부 `hosugator-infra` 한 곳에 모아도 정합성이 깨지지 않는다.

### root Application이 App of Apps의 닭-달걀 문제를 정확히 한 곳으로 좁힌다
`applications/` 폴더 밑의 YAML들은 그 자체로 `kind: Application`인 평범한 manifest라서, 이걸 감시하는 상위 Application(`root`)이 sync될 때 "이 파일들을 클러스터에 적용해라"라는 동일한 동작이 반복될 뿐이다 — 다만 그 결과물이 우연히 또 다른 Application 오브젝트라서 재귀적으로 하위 관리가 이어진다.
유일하게 git만으로 못 끝내는 지점은 `root` 자신인데, 이걸 `bootstrap/`으로 물리적으로 분리해두면 "예외는 파일 하나, 나머지는 전부 git"으로 범위가 명확해진다.

### 큰 변경 전 `syncPolicy: {}`로 먼저 diff를 보는 습관은 재현 작업에도 그대로 적용된다
`root` Application을 처음 만들 때도 automated로 바로 걸지 않고 수동으로 먼저 만들어 `argocd app diff root`를 확인했다.
결과는 `argocd.argoproj.io/tracking-id` annotation 추가뿐 — spec 자체(`source`/`destination`/`syncPolicy`)는 라이브 상태와 완전히 일치했다.
이 한 번의 확인이 "옮겨적으며 뭔가 빠뜨리지 않았는지"를 눈으로 검증하는 유일한 지점이었다.

### Argo CD 인스턴스 분리도 blast radius가 근거지만, 클러스터 분리와는 다른 층위다
[[Cluster separation is justified by blast radius and trust boundaries, not by validation needs]]에서 클러스터를 안 합치는 이유가 "API 서버/etcd 공유, 클러스터 스코프 리소스, 신뢰 경계"였다면, Argo CD 인스턴스 분리는 그 위 계층 얘기다.
지금 구조(오라클 hub 하나가 오라클+노트북 두 클러스터를 관리)에서는 클러스터가 나뉘어 있어도 그 둘로 가는 자격증명이 결국 오라클의 Argo CD 하나에 모여 있다. dev급 워크로드끼리는 이 정도 집중이 실용적이지만, 여기 prod급 민감 클러스터가 편입되면 "클러스터는 분리했는데 그걸 관리하는 컨트롤 플레인은 공유된다"는 blast radius가 남는다.
기능적으로는(sync/diff 매커니즘 자체는) 클러스터를 나누는 것과 큰 차이가 없고, 순수하게 자격증명·RBAC·업그레이드 리스크의 집중을 끊기 위한 조직적 결정이다.

## Decision
### 2026-07-20
`hosugator-infra`에 `applications/`(3개 Application 정의)와 `bootstrap/root-app.yaml`(root Application, 최초 1회만 수동 apply)을 추가해 App of Apps로 전환했다.
별도 repo로 분리하지 않고 기존 `hosugator-infra`에 유지하기로 결정 — 근거는 이 등록부의 스코프 기준이 "워크로드 위치"가 아니라 "Argo CD 인스턴스"이고, 지금 인스턴스가 오라클 하나뿐이라는 것. 
root Application은 `syncPolicy: {}`로 시작해 diff(무해한 tracking-id annotation만 확인) 검증 후 `automated(prune+selfHeal)`로 전환했다.
README에도 이 스코프 기준을 명시해 `hosugator-infra`라는 workload-지향적 이름과 실제 역할(Argo CD 등록부) 사이의 잠재적 혼선을 남겨뒀다.
- 전환 조건: 오라클과 완전히 독립된 두 번째 Argo CD 인스턴스(별도 컨트롤 플레인)가 생기면, 그 시점에 `applications/`를 `hosugator-infra`에서 분리해 별도 repo로 옮기는 걸 재검토한다.

## Related
- [[Kubernetes RBAC layers for Argo CD form the same nested ceiling structure as AWS SCP, Boundary, and IAM Policy]] — 이번 발견(노트북 클러스터의 cluster-admin급 등록)을 계기로 정리한 Argo CD의 3계층 권한 모델
- [[Argo CD treats every manifest in its watched path as desired state regardless of filename intent]] — Application CR 자체가 git에 없었다는 이번 발견도 같은 계열의 gap
- [[Migrating Argo CD to a new hub does not carry over TLS SAN, repo secrets, or Job exclusions automatically]] — 지금의 hub-스포크 구조 자체를 세운 결정
- [[Cluster separation is justified by blast radius and trust boundaries, not by validation needs]] — 클러스터 분리 근거였던 blast radius/신뢰 경계를 컨트롤 플레인 계층에 유비 적용
- [[Argo CD watches Git manifest and CI must update manifest to trigger deployment]] — "무엇이 desired state의 출처인가"를 다시 확인시켜준 CI/CD 역할 분리
