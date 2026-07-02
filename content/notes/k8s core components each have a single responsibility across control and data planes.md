---
created: 2026-06-09
updated: 2026-06-09
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - k3d
  - kubectl
publish: true
---
## Context
align-ai Service 타입을 이해하면서 kubectl, k3d, kube-proxy, kubelet이 혼동됐다. 네트워크 라우팅이 어느 컴포넌트의 역할인지 불분명했다.

## Insight

### 각 컴포넌트는 단일 책임을 가진다

| 컴포넌트       | 실행 위치        | 역할                               |
| ---------- | ------------ | -------------------------------- |
| k3d        | 로컬 호스트       | k8s 클러스터(노드)를 Docker 컨테이너로 생성/삭제 |
| kubectl    | 로컬 호스트       | 클러스터에 명령을 내리는 CLI — 조회, 배포, 삭제   |
| kubelet    | 각 노드 (상시 실행) | Pod 생성·상태 관리. 컨테이너 런타임과 통신       |
| kube-proxy | 각 노드 (상시 실행) | 네트워크 트래픽 라우팅. iptables 규칙 관리     |

### 외부 트래픽 흐름에서 kubectl은 관여하지 않는다

```
외부 요청 → 노드IP:30000
  → kube-proxy (iptables 규칙으로 라우팅)
  → Service ClusterIP:80
  → Pod:8000
```

kubectl은 클러스터 상태를 제어하는 도구이고, 실제 요청 트래픽은 kube-proxy가 처리한다.

### k3d와 kubectl은 로컬 도구, kubelet과 kube-proxy는 노드 내부 에이전트다

k3d가 노드를 만들면 그 안에 kubelet과 kube-proxy가 자동으로 실행된다. kubectl은 외부에서 k8s API 서버를 통해 명령을 보낼 뿐이다.

## Related
- [[k3d wraps k3s nodes in Docker containers enabling disposable local clusters]] — k3d와 노드 관계
- [[Kubernetes Service types layer on top of each other from ClusterIP to LoadBalancer]] — kube-proxy가 처리하는 네트워크 구조
