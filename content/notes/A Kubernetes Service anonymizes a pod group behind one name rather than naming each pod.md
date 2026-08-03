---
created: 2026-07-16
updated: 2026-07-16
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Self-development in 2026]]"
tags:
  - kubernetes
  - service
  - networking
publish: true
---
## Context
"Service가 각 Pod에 이름을 붙여서 서로 통신하게 해준다"고 이해하고 있었는데, 실제로는 정반대에 가까웠다 — Service는 개별 Pod을 드러내는 게 아니라 감추는 역할이었다.

## Insight
### Service는 개별 Pod이 아니라 Pod 그룹 전체에 이름 하나를 붙인다
`fastapi-service`라는 이름 뒤에는 동일한 코드를 실행하는 Pod 여러 개(A, B, C)가 있지만, 호출하는 쪽은 물론 Pod 자신들도 서로의 개별 IP/이름을 알 필요가 없다. Service 하나의 이름 뒤에 여러 복제본이 완전히 익명으로 숨어있는 구조다.

### Pod이 아는 건 "다른 Service의 이름"이지 "형제 Pod의 정체"가 아니다
- 같은 Service 안의 다른 복제본(A가 B, C를 아는지): 모름 — 알 필요 없음, 교체 가능한 사본이라 구분할 이유가 없다.
- 다른 Service(다른 애플리케이션)의 이름: 앎 — 코드에서 명시적으로 그 이름을 호출한다.
- 그 다른 Service 뒤에 Pod이 몇 개인지, IP가 뭔지: 모름 — Service가 대신 처리한다.

### 예외: StatefulSet + Headless Service는 개별 Pod에 고정 이름을 준다
DB 클러스터처럼 "어느 복제본이 리더인지" 구분이 실제로 필요한 특수 상황에서만 `pod-0.service-name` 식으로 개별 이름을 노출한다. 무상태 애플리케이션(FastAPI 등)에서는 쓰지 않는 예외 케이스다.

## Related
- [[Communication requires crossing an independent address space, not separate physical hardware]] — Pod이 독립 주소공간을 갖는다는 전제 위에, Service가 그 주소공간들을 하나의 이름으로 묶는다는 후속 논의
- [[k8s namespace and node are orthogonal axes, pod exists at their intersection]] — Pod의 정체성이 namespace/node 축과는 별개로, Service 관점에서는 익명화된다는 대비
