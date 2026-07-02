---
created: 2026-06-12
updated: 2026-06-12
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - daemonset
publish: true
---
## Context
Argo CD 대시보드에서 nvidia-device-plugin이 DaemonSet으로 배포된 걸 보고 Deployment와의 차이를 정리했다.

## Insight
### DaemonSet은 모든 노드에 정확히 1개씩 pod를 보장한다

```
Deployment  → 지정한 replica 수만큼 pod 실행 (어느 노드든 상관없음)
DaemonSet   → 모든 노드에 각각 1개씩 pod 실행
```

노드가 추가되면 자동으로 그 노드에도 pod가 생긴다. 노드가 제거되면 해당 pod도 사라진다.

### DaemonSet은 노드 수준에서 동작해야 하는 인프라성 작업에 쓴다

| 용도          | 예시                       |
| ----------- | ------------------------ |
| GPU 드라이버 노출 | nvidia-device-plugin     |
| 로그 수집       | Fluentd, Filebeat        |
| 모니터링 에이전트   | Prometheus node-exporter |
| 네트워크 플러그인   | CNI 에이전트                 |

nvidia-device-plugin이 DaemonSet인 이유: GPU는 노드에 물리적으로 장착되어 있어서 각 노드마다 별도로 k8s에 노출해줘야 한다.

## Related
- [[k3s NVIDIA device plugin requires nvml strategy and runtimeClassName for GPU access]] — nvidia-device-plugin 구체 설정
- [[k8s namespace and node are orthogonal axes, pod exists at their intersection]] — 노드 개념 정리
- [[k8s rollback uses ReplicaSet for Deployments and ControllerRevision for DaemonSets]] — DaemonSet의 이력 관리 방식
