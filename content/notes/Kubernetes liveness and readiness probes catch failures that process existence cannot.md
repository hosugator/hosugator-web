---
created: 2026-06-09
updated: 2026-06-29
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - k8s
  - probe
  - self-healing
publish: true
---
## Context
align-ai k3s 클러스터에 inference pod를 배포하면서 self-healing 개념을 구체화했다. Docker의 restart 정책과 무엇이 다른지 명확히 이해했다.

## Insight
### probe가 없으면 k8s는 프로세스 생존만 본다

k8s 기본 동작은 컨테이너 프로세스가 종료됐는지만 감지한다. hang(응답 없이 프로세스는 살아있는 상태)은 감지하지 못한다. probe를 명시해야 비로소 self-healing이 동작한다.

```
probe 없음
  → 컨테이너 프로세스 살아있음 → Running (hang이어도 재시작 안 함)

probe 있음
  → /health 응답 없음 → liveness 실패 → 재시작
  → /health 응답 없음 → readiness 실패 → 트래픽 차단 (재시작 X)
```

### initialDelaySeconds가 없으면 재시작 루프에 빠진다

모델 로딩처럼 시작 시 시간이 걸리는 앱은 로딩 완료 전에 probe가 실패한다. `initialDelaySeconds`로 첫 체크 시점을 늦춰야 한다.

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 10   # 모델 로딩 여유 시간
  periodSeconds: 30         # 이후 30초마다 체크

readinessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 10
  periodSeconds: 10         # readiness는 더 자주 체크
```

### probe는 Service(NodePort)를 거치지 않고 Pod에 직접 접근한다

```
kubelet → Pod:8000/health  (직접)
외부    → 노드:30000 → Service:80 → Pod:8000  (Service 경유)
```

Service를 거치지 않는 이유: Pod 자체 상태와 Service 경로 문제를 분리하기 위해서다. probe가 NodePort를 통하면 "Pod이 문제인지 Service가 문제인지" 구분이 불가능하다.

### liveness와 readiness는 다른 엔드포인트를 전제로 설계됐다

같은 `/health`로 두 probe를 연결하면 체크 내용은 동일하고 실패 시 행동만 다르다. 이 경우 중복에 가깝다.
두 probe의 역할이 완전히 분리되려면 앱이 엔드포인트를 목적에 따라 다르게 준비해야 한다.

```
/health (liveness):  프로세스가 deadlock 없이 살아있냐
/ready  (readiness): DB 연결·모델 로딩 등 트래픽 받을 준비가 됐냐
```

엔드포인트가 분리됐을 때 시나리오가 달라진다:

```
시작 중:     liveness OK(/health 응답), readiness FAIL(/ready 미준비) → 트래픽 차단, 재시작 없음
완전 기동:   둘 다 OK → 트래픽 허용
데드락:      liveness FAIL → 재시작
일시 과부하: liveness OK, readiness FAIL → 트래픽만 차단
```

## Verification
align-ai k3s 클러스터에서 실측 확인 (2026-06-22):

```bash
kubectl logs align-ai-inference-68fcfcd67b-dbsmp --tail=30
# INFO: 10.42.0.1:47900 - "GET /health HTTP/1.1" 200 OK
# INFO: 10.42.0.1:60210 - "GET /health HTTP/1.1" 200 OK
```

`10.42.0.1` = kubelet이 보내는 probe 요청. liveness(30s) + readiness(10s) 주기가 합산되어 로그에 빈번히 찍힌다.


## Related
- [[Kubernetes assigns pod health, traffic readiness, and auto-scaling to separate independent mechanisms]] — 상위 개요: liveness·readiness·HPA 세 메커니즘의 분리 원칙
- [[Kubernetes Deployment causes crash loop for batch workloads that exit on completion]] — 프로세스 종료와 재시작의 관계
- [[k8s core components each have a single responsibility across control and data planes]] — k8s 구성 요소
- [[Kubernetes resource limits prevent resource exhaustion on shared nodes]] — 같이 deployment.yaml에 추가하는 설정