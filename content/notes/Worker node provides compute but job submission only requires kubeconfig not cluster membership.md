---
created: 2026-06-28
updated: 2026-06-28
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - k3s
  - rbac
  - mlops
publish: true
---
## Context
ML 팀원 PC를 k3s 클러스터에 연결하는 방법을 논의하다가, worker node join과 job 제출이 별개의 독립적인 능력임을 이해했다. 팀원 PC에 학습용 GPU가 없어도 회사 PC의 GPU를 활용한 학습 job을 제출할 수 있다.

## Insight
### Worker node와 kubectl client는 독립적인 두 가지 역할이다

```
Worker Node: 클러스터에 컴퓨팅 자원(CPU/GPU/메모리)을 제공
kubectl client: kubeconfig + RBAC 권한만 있으면 job 제출 가능
```

팀원 PC가 자원이 부족해도 job을 제출하고 결과를 받을 수 있다. join 없이 kubeconfig만으로 충분하다.

```
팀원 PC (worker node join 없음)
  └── kubectl + kubeconfig (RBAC 제한)
        └── Job 제출 → GPU 노드(회사 PC)에서 실행 → 결과 PVC에 저장
```

SSH 전체 권한이나 화면 공유 없이 job 제출·조회·로그 확인만 허용하는 구조를 만들 수 있다.

### RBAC으로 job 제출 권한만 격리할 수 있다

```yaml
kind: Role
metadata:
  namespace: ml-training
rules:
- apiGroups: ["batch"]
  resources: ["jobs"]
  verbs: ["create", "get", "list", "delete"]
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list"]
```

노드 접근, 다른 네임스페이스 접근, 시크릿 조회 없이 학습 job 관련 작업만 허용한다.

### worker node로 join하면 자원 기여가 추가된다

팀원 PC에 GPU가 생기거나 CPU 자원을 기여하고 싶다면 그때 join하면 된다. join 여부와 관계없이 job 제출 권한은 유지된다.

## Related
- [[Kubernetes resource limits prevent resource exhaustion on shared nodes]] — 여러 팀원이 job 제출 시 자원 보호를 위한 ResourceQuota 필요
- [[Argo CD self-healing silently restarts Jobs in monitored directories]] — ml-training 네임스페이스를 ArgoCD 관리 밖으로 분리해야 충돌 없음
