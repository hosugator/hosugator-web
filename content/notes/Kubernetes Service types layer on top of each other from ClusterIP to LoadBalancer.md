---
created: 2026-06-09
updated: 2026-06-09
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - networking
  - service
publish: true
---
## Context
align-ai FastAPI 서버를 외부에서 HTTP로 접근하기 위해 Service 타입을 처음으로 구분해서 이해했다. port-forward와 Service의 차이가 헷갈렸고, NodePort와 LoadBalancer가 왜 별도로 존재하는지 물음표가 있었다.

## Insight
### Service 타입은 계층적으로 쌓인다

```
LoadBalancer  ← NodePort 위에 외부 IP 추가
  └── NodePort  ← ClusterIP 위에 노드 포트 추가
       └── ClusterIP  ← 클러스터 내부 고정 주소 (기본)
```

상위 타입이 하위 타입을 포함한다. LoadBalancer는 내부적으로 NodePort를 쓴다.

### NodePort는 노드(VM) IP와 포트에 직접 묶인다

```
외부 → 노드IP:30080 → ClusterIP → Pod
```

노드 IP = VM IP = 물리 서버 IP — 동일한 것의 다른 이름. 클라우드에서 오토스케일링으로 노드가 생기고 사라지면 IP가 바뀌어 진입점으로 쓰기 불안정하다.
포트 범위 30000-32767은 k8s가 시스템 포트와 충돌을 피하려고 예약한 범위.

### LoadBalancer는 노드 가변성을 흡수하는 안정적인 단일 진입점이다

```
클라이언트 → 외부IP:80 (고정)
               ├→ 노드1:30080
               ├→ 노드2:30080  ← 노드가 바뀌어도 외부 IP는 불변
               └→ 노드3:30080
```

외부 IP는 AWS ELB, GCP Load Balancer 같은 클라우드 인프라가 실제로 만들어준다. k3d 로컬에서는 `<pending>` 상태로 남는다.

### port-forward는 Service 없이 임시로 뚫는 터널이다

`kubectl port-forward`는 kubectl CLI가 로컬 포트와 Pod을 직접 연결하는 임시 방법. Service가 있어도 ClusterIP 타입이면 외부 접근 시 port-forward가 여전히 필요하다. Argo CD에 port-forward를 썼던 이유가 이것 — argocd-server는 ClusterIP Service만 있었다.

## Verification
2026-06-09: align-ai에 NodePort Service 적용. `172.19.0.2:30000`으로 curl 요청 → FastAPI 추론 응답 확인. port-forward 없이 외부 접근 성공. k3d에서는 `localhost:30000`이 안 되고 Docker 컨테이너 노드 IP(`docker inspect`로 확인)를 써야 함.

## Related
- [[k3d wraps k3s nodes in Docker containers enabling disposable local clusters]] — 노드 개념 기초
- [[Kubernetes Deployment causes crash loop for batch workloads that exit on completion]] — 같은 프로젝트에서 만난 k8s 이슈
- [[Argo CD watches Git manifest and CI must update manifest to trigger deployment]] — Service 없이 port-forward로 접근했던 맥락
