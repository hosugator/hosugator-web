---
created: 2026-07-20
updated: 2026-07-22
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Hosugator Web]]"
tags:
  - argocd
  - kubernetes
  - iam
  - rbac
  - architecture
publish: true
---
## Context
[[hosugator-infra hosts the App of Apps registry until a second Argo CD instance exists]] 작업 중, 오라클 hub가 노트북(align-ai-laptop-gpu) 클러스터에 등록한 `argocd-manager` ServiceAccount의 ClusterRole을 열어보니 `apiGroups: [""], resources: [""], verbs: [""]` — 사실상 cluster-admin이었다.
"클러스터를 분리한 목적을 Argo CD가 hub-스포크로 다시 결합시키는 것 아닌가"라는 질문에서 시작해, Argo CD가 실제로 가진 권한 레이어를 하나씩 파고들었고, 이미 알고 있던 [[AWS Hierarchical Privilege Model (SCP, Boundary, IAM)]]과 위상까지 동일하다는 걸 확인했다.

## Insight
### Argo CD의 권한은 세 레이어로 나뉘고, 각 레이어는 안쪽으로만 좁힐 수 있다

| 레이어                               | 질문                                           | 강제 주체                   | 강도  |
| --------------------------------- | -------------------------------------------- | ----------------------- | --- |
| ① K8s ClusterRole                 | Argo CD의 서비스어카운트가 대상 클러스터에서 실제로 뭘 할 수 있나     | 대상 클러스터의 kube-apiserver | 하드  |
| ② AppProject                      | 이 Application이 어느 repo/클러스터/리소스 종류를 참조할 수 있나 | Argo CD 자신의 컨트롤러 코드     | 소프트 |
| ③ Argo CD RBAC (`argocd-rbac-cm`) | 로그인한 사람이 Argo CD UI/CLI에서 뭘 할 수 있나           | Argo CD 자신의 API 서버      | 소프트 |

①은 클러스터마다 별도로 존재한다(관리 대상이 N개면 문도 N개). 최종적으로 실행 가능한 범위는 세 레이어의 교집합(①∩②∩③)이고, 안쪽 레이어가 아무리 넓게 허용해도 바깥 레이어가 막아놓은 건 넘을 수 없다.

### ①은 사람이 아니라 "기계 계정 하나"에 걸리는 단일 천장이라, ②③의 사람별 차등을 대신할 수 없다

①(ClusterRole)이 제한하는 대상은 사람이 아니라, 등록된 대상 클러스터 하나당 딱 하나 존재하는 ServiceAccount(`argocd-manager` 등)다. Alice가 로그인해서 sync를 누르든 Bob이 누르든, 실제로 클러스터에 도달하는 요청은 항상 같은 이 하나의 신원으로 실행된다 — 대상 클러스터는 "누가 시켰는지" 자체를 알 방법이 없다.

반면 ②③이 다루는 "계정"은 Argo CD 자신에 로그인하는 사람(휴먼 계정)이다. 즉 ①과 ②③은 애초에 서로 다른 종류의 "누구"를 제한하는, 완전히 독립된 두 시스템이고 서로의 존재를 모른다.

이 불일치가 바로 ②③이 구조적으로 "소프트"일 수밖에 없는 이유다 — 사람별 최소 권한("이 사람은 이 프로젝트만")은 전적으로 Argo CD 자신의 규칙 준수에 의존할 뿐, 실행 시점엔 그 차등이 물리적으로 강제되지 않는다. ①이 처음부터 좁게 scoped 되어 있었다면 ②③이 뚫려도 클러스터 자체가 마지막 안전망이 되어주지만, 지금처럼 ①이 cluster-admin급이면 그 안전망 자체가 없다.

### 이 구조가 AWS의 SCP/Permissions Boundary/IAM Policy와 위상까지 동일하다

[[AWS Hierarchical Privilege Model (SCP, Boundary, IAM)]]의 공식 "최종 권한 = SCP ∩ Boundary ∩ IAM Policy"이 정확히 그대로 대응된다:

| Argo CD | AWS |
|---|---|
| ① K8s ClusterRole | SCP — 조직 전체의 절대 상한 |
| ② AppProject | Permissions Boundary — 엔티티가 가질 수 있는 최대 범위 |
| ③ Argo CD RBAC | IAM Policy — 실제 사용자에게 부여된 세부 권한 |

k8s는 이걸 "네임스페이스 경계를 넘는 클러스터 스코프 리소스(CRD, ClusterRole 자체, admission webhook)"라는 물리적으로 다른 표현으로 갖고 있을 뿐, 논리 구조(상위 계층이 먼저 천장을 정하고 하위 계층이 그 안에서 세부를 허용)는 동형이다.

### 그럼에도 계층적 권한 관리는 인스턴스(계정) 분리를 완전히 대체하지 못한다

①②③을 아무리 정교하게 짜도, 그 전부는 "Argo CD 자신의 컨트롤러 코드가 이 규칙들을 정직하게 지킨다"는 단일 신뢰 전제 위에서만 유효하다 — AppProject/RBAC는 소프트 경계라 Argo CD 자체의 버그나 설정 실수로 우회될 수 있다.
AWS도 SCP/Boundary/Policy를 아무리 잘 짜는 것과 별개로, 진짜 강한 격리(컴플라이언스, 제3자 소유)가 필요하면 여전히 Organizations로 계정 자체를 분리한다.
	Argo CD도 이 신뢰 전제가 깨지는 지점(다른 조직 소유 클러스터, 물리적 분리가 계약 조건, Argo CD 자체 CVE 리스크를 감내 못 하는 신뢰 수준)에서는 레이어를 더 정교히 짜는 게 아니라 인스턴스 자체를 분리하는 쪽으로 넘어간다.

## Related
- [[hosugator-infra hosts the App of Apps registry until a second Argo CD instance exists]] — 이 구조 이해가 뒷받침하는 실제 전환 조건(두 번째 Argo CD 인스턴스 등장 시 재검토)
- [[AWS Hierarchical Privilege Model (SCP, Boundary, IAM)]] — 위상 동일한 AWS 쪽 원 모델
- [[Migrating Argo CD to a new hub does not carry over TLS SAN, repo secrets, or Job exclusions automatically]] — 지금의 hub-스포크 구조 자체
- [[Cluster separation is justified by blast radius and trust boundaries, not by validation needs]] — 같은 blast radius 논리의 클러스터 계층 버전
