---
created: 2026-06-22
updated: 2026-06-22
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - k8s
  - networking
  - service
publish: true
---
## Context
align-ai service.yaml 작성 중 개발/운영 환경을 namespace로 격리할 때 port 충돌이 발생하는 이유를 파악했다. nodePort가 왜 namespace 경계를 넘는지가 출발점.

## Insight
### Service의 세 포트는 각기 다른 범위에서 동작한다

```
외부(설비 PC) → nodePort:30000 → port:80 → targetPort:8000(Pod uvicorn)
               ↑ 노드(하드웨어)   ↑ namespace   ↑ 컨테이너 내부
```

| 포트           | 범위        | 충돌 단위                        |
| ------------ | --------- | ---------------------------- |
| `nodePort`   | 노드(VM) 전체 | 클러스터 전체 유일해야 함               |
| `port`       | namespace | 같은 번호여도 namespace가 다르면 충돌 없음 |
| `targetPort` | 컨테이너 내부   | 독립                           |

### 진정한 네트워크 격리는 클러스터 분리가 필요하다

nodePort 충돌 외에도 namespace는 논리적 격리만 제공한다. 완전한 네트워크 격리가 필요하면 별도 클러스터가 필요하다.

```
namespace 분리 → 이름 충돌 방지 + RBAC 분리 (네트워크 공유)
클러스터 분리  → 완전한 네트워크 격리 (비용 증가)
```

## Related
- [[k8s namespace and node are orthogonal axes, pod exists at their intersection]] — namespace와 노드의 관계
- [[Kubernetes Service types layer on top of each other from ClusterIP to LoadBalancer]] — Service 타입 전체 구조