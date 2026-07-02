---
created: 2026-06-09
updated: 2026-06-22
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - k8s
  - deployment
  - manifest
publish: true
---
## Context
align-ai deployment.yaml을 직접 작성하면서 각 계층의 역할과 labels/selector 관계를 명확히 이해했다.

## Insight
### deployment.yaml은 3단 계층 구조다

```
apiVersion / kind        → 이 파일이 무엇인가 (리소스 종류 선언)

metadata                 → Deployment 자체의 이름표
  name, namespace

spec                     → Deployment의 동작 방식
  replicas               → pod를 몇 개 유지할 것인가
  selector               → 어떤 pod를 관리할 것인가 (필터)
  template               → pod 하나의 설계도
    metadata.labels      → pod에 붙이는 태그
    spec.containers      → 실제 컨테이너 설정
```

### labels가 태그를 붙이고, selector가 필터링한다

- `template.metadata.labels` → pod에 태그를 붙이는 것
- `selector.matchLabels` → 그 태그를 가진 pod를 찾는 것

둘이 반드시 일치해야 하는 이유: kubectl apply 후 파일은 사라지고 클러스터에 오브젝트만 남는다. Deployment가 자신이 만든 pod를 식별하려면 라벨이 유일한 기준이다.

### 노드 배치는 deployment.yaml에서 정의하지 않는다

```
replicas: 2 선언
  → 스케줄러가 노드 상태 보고 자동 배치
  → 직접 지정하려면 nodeSelector 추가
```

### selector와 labels가 분리된 이유는 생성과 소유권 인식을 분리하기 위해서다

k8s는 선언적 시스템이라 "어떻게 만들지"(template)와 "무엇이 내 것인지"(selector)를 같은 곳에 묶지 않는다. 덕분에 edge case를 유연하게 처리할 수 있다:

```
케이스 1: Pod 직접 생성 후 Deployment로 인수인계
  → kubectl apply -f pod.yaml로 만든 Pod을
  → 나중에 Deployment selector가 레이블 일치로 편입 가능

케이스 2: 같은 Deployment에서 레이블 여러 개 붙이기
  → template.labels: {app: x, version: v2, env: prod}
  → selector.matchLabels: {app: x}  (최소 조건만)
  → Service는 version: v2만 골라 트래픽 전환 가능 (Blue-Green)
```

둘을 같은 곳에 묶었다면 template이 생성한 Pod만 관리 가능하고, 위 유연성이 사라진다.

### labels + selector는 k8s 오브젝트 간 연결의 공통 메커니즘이다

```
Deployment → selector로 pod 관리
Service    → selector로 pod에 트래픽 라우팅
```

Blue-Green 배포도 이 메커니즘으로 구현:

```
v1 pod: app=align-ai-blue
v2 pod: app=align-ai-green
Service selector를 blue → green으로 전환 시 트래픽 이동
```

## Related
- [[Kubernetes liveness and readiness probes catch failures that process existence cannot]] — containers 하위에 추가하는 설정
- [[Kubernetes resource limits prevent resource exhaustion on shared nodes]] — containers 하위에 추가하는 설정
- [[Kubernetes Service types layer on top of each other from ClusterIP to LoadBalancer]] — Service도 동일한 selector 메커니즘 사용
