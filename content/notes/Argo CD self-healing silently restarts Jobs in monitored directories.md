---
created: 2026-06-11
updated: 2026-06-11
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - argocd
  - gitops
  - kubernetes
publish: true
---
## Context
align-ai 파이프라인에서 학습이 끝난 후 Job을 삭제해도 수초 후 자꾸 재생성됐다. `kubectl delete job`을 해도 돌아왔다. 한참 원인을 찾다가 Argo CD self-healing 때문임을 발견했다. 이것이 반복 학습의 근본 원인이었다.

## Insight
### Argo CD는 Git에 있는 모든 리소스를 desired state로 간주하고 삭제된 것을 즉시 복구한다

`k8s/job-train.yaml`이 Git에 있는 한, 클러스터에서 Job을 삭제하면 Argo CD self-healing이 즉시 재생성한다. Job이 완료된 상태여도 재생성되면 다시 실행된다.

### batch/Job은 argocd-cm의 resource.exclusions로 관리 제외해야 한다

Deployment와 달리 Job은 일회성 실행 리소스다. GitOps에서 "desired state = Job이 존재함"을 적용하면 항상 재생성된다.

```yaml
# argocd-cm ConfigMap
data:
  resource.exclusions: |
    - apiGroups: ["batch"]
      kinds: ["Job"]
      clusters: ["*"]
```

이 설정으로 Argo CD가 batch/Job 리소스를 관리 대상에서 제외한다.

## Related
- [[Argo CD watches Git manifest and CI must update manifest to trigger deployment]] — Argo CD 기본 self-healing 원리
- [[ML training skip logic using image layer fingerprint avoids redundant training]] — Job 재생성이 유발한 반복 학습 문제
