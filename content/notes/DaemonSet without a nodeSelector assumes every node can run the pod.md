---
created: 2026-07-10
updated: 2026-07-10
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Hosugator Web]]"
tags:
  - kubernetes
  - daemonset
  - argocd
  - gpu
publish: true
---
## Context
오라클을 Argo CD 허브로 전환한 뒤 `align-ai-laptop-gpu` Application이 계속 `Health: Progressing`으로 남아있어 원인을 추적했다.
`nvidia-device-plugin-daemonset`이 `DESIRED=2, READY=1`로 11일째 고정되어 있었다 — `lima-rancher-desktop`(맥북의 Rancher Desktop VM, 실제 NVIDIA GPU 없음)에서 파드가 `ContainerCreating`에 영원히 멈춰있었기 때문이다.

## Insight
### [[DaemonSet runs one pod per node for node-scoped infrastructure tasks]]의 "모든 노드에 1개씩"은 노드가 동질적이라는 전제를 깔고 있다

그 노트에서 정리했던 "노드가 추가되면 자동으로 그 노드에도 pod가 생긴다"는 맞는 설명이지만, 그 노드가 그 워크로드를 실제로 실행할 수 있는지는 별개 문제다.
`nodeSelector` 없는 DaemonSet은 "이 클러스터의 모든 노드가 GPU를 갖고 있다"를 암묵적으로 가정한다. 실제로는 회사 노트북(GPU 있음)과 집 맥북(GPU 없음)이 같은 클러스터에 섞여 있어서, 이 가정이 깨지는 순간 해당 노드의 파드는 영원히 뜨지 못한 채 남는다.

### Argo CD의 Application Health는 추적 리소스 중 최악의 상태로 수렴한다

DaemonSet 하나가 `Progressing`(또는 `Degraded`)이면, 나머지 Deployment·Service가 전부 `Healthy`여도 Application 전체가 계속 `Progressing`으로 보인다.
그래서 이번 문제는 실제로는 "align-ai 배포"와 무관한 사이드카성 인프라(GPU 노출용 DaemonSet) 문제였는데도, Application 대시보드만 보면 배포 자체에 문제가 있는 것처럼 보였다 — 리소스별 상태를 펼쳐봐야 진짜 원인이 드러난다.

### 이종(heterogeneous) 노드 클러스터에선 하드웨어 유무를 라벨로 명시해야 한다

GPU Operator나 Node Feature Discovery 없이 수동으로 구성한 클러스터라 자동 감지 라벨이 없었다. 
`nvidia.com/gpu.present=true`처럼 관례를 따르는 커스텀 라벨을 GPU 노드에 직접 붙이고, DaemonSet에 그 라벨을 `nodeSelector`로 지정하면 스케줄러가 애초에 GPU 없는 노드를 후보에서 제외한다 — "떠서 실패"가 아니라 "아예 안 뜸"으로 바뀐다.

## Decision
### 2026-07-10
`hosugator-gigabyte-aero-x16-2wh`(회사 노트북, 실제 GPU 보유)에 `nvidia.com/gpu.present=true` 라벨을 달고, `align-ai/k8s/nvidia-device-plugin-k3s.yaml`의 DaemonSet에 동일 `nodeSelector`를 추가해 git push. 
Argo가 자동 sync해 `lima-rancher-desktop`에서 파드가 스케줄되지 않게 됐고, DaemonSet은 `DESIRED=1, READY=1`로 정상화, Application 전체가 `Healthy`로 전환됨.

## Related
- [[DaemonSet runs one pod per node for node-scoped infrastructure tasks]] — 이 노트가 전제하던 "동질적 노드" 가정을 오늘 실제로 깨진 사례로 보완
- [[A cluster is the hard isolation boundary between domains while a namespace divides within one]] — 같은 클러스터 안에 이종 노드(GPU/비GPU)를 섞어 쓰는 맥락
- [[Migrating Argo CD to a new hub does not carry over TLS SAN, repo secrets, or Job exclusions automatically]] — 이 문제를 발견한 계기가 된 허브 전환 작업
