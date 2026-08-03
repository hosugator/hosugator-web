---
created: 2026-07-16
updated: 2026-07-16
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Self-development in 2026]]"
tags:
  - kubernetes
  - networking
  - mqtt
  - protocol
publish: true
---
## Context
"설비 3대→50대로 늘면 MQTT 없이 k8s만으로 해결되는 것 아니냐"는 질문에 답하다가, k8s와 MQTT가 같은 문제의 두 대안이 아니라 서로 다른 축의 문제를 푼다는 점을 정리했다.

## Insight
### k8s는 서버 쪽 capacity를, 프로토콜 선택은 통신 패턴 자체를 다룬다
|       | k8s (스케일링/로드밸런싱)               | MQTT/WebSocket/gRPC (프로토콜 선택)           |
| ----- | ------------------------------ | --------------------------------------- |
| 푸는 문제 | 서버가 늘어난 요청량을 감당하도록 복제본을 늘리고 분산 | 설비-서버 간 통신을 어떤 방식(경량/Pub-Sub/스트리밍)으로 할지 |
| 확장 대상 | 서버 쪽 capacity                  | 클라이언트-서버 간 통신 패턴 자체                     |

설비 증가의 원인이 "서버가 요청량을 못 버텨서"라면 k8s 복제본 증설+Service 로드밸런싱만으로 해결된다. 
하지만 애초에 MQTT를 고려한 이유가 설비의 저전력 제약이나 1:N 팬아웃(하나의 데이터를 여러 분석 서비스에 동시 배분) 구조였다면, 이 이유는 k8s를 도입해도 그대로 남는다 — k8s는 서버 개수만 늘려줄 뿐 설비 제약이나 팬아웃 구조를 대신 해결해주지 않는다.

### 로드밸런싱은 엔드포인트 단위가 아니라 Service 단위로 자동 동작한다
FastAPI 앱에 엔드포인트가 몇 개든, 같은 Pod/Service에 속해 있다면 ingress.yaml에 엔드포인트별로 선언할 필요가 없다. 
k8s Service는 트래픽이 어떤 경로(`/analyze`, `/status` 등)로 가는지 모른 채 TCP 연결 단위로만 Pod을 고르고, 그 Pod 안에서 FastAPI가 내부적으로 어떤 엔드포인트인지 라우팅한다. 
Ingress는 "어떤 URL을 어떤 Service로 보낼지"만 정하는 것이지 로드밸런싱 자체의 단위가 아니다.

## Related
- [[Kubernetes Service L4 boundary prevents HTTP path and header routing without Ingress]] — Service(L4)와 Ingress(L7)의 역할 분리가 이 노트의 전제
