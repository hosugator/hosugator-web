---
created: 2026-06-12
updated: 2026-06-12
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - edge-ai
  - self-healing
  - high-availability
publish: true
---
## Context
align-ai k3s 소규모 현장 배포를 논의하다가 "노드가 1-2대인데 굳이 k8s를 써야 하나"는 질문이 나왔다. 노드 수가 적으면 HA가 의미 없다는 주장과, 그럼에도 k8s가 가치 있다는 주장 사이의 혼선이 있었다.

## Insight
### 노드 수준 HA와 앱 수준 self-healing은 해결하는 장애 층위가 다르다

노드 수준 HA는 노드(추론 PC)가 죽었을 때 다른 노드로 재스케줄하는 기능이다. 노드가 1-2대면 재스케줄할 곳이 없으므로 HA는 의미 없다.
앱 수준 self-healing은 컨테이너·프로세스가 죽었을 때 같은 노드에서 자동 재시작하는 기능이다. 이건 단일 노드에서도 완전히 유효하다.

| 장애 유형            | k8s 자동 대응     | 비고                |
| ---------------- | ------------- | ----------------- |
| 앱 크래시, OOM, hang | pod 자동 재시작    | liveness probe 필요 |
| 컨테이너 이미지 결함      | 재시작해도 반복 실패   | 개발자 개입 필요         |
| 노드(PC) 자체 다운     | 단일 노드면 서비스 중단 | 다중 노드일 때만 재스케줄    |

### 연속 가동 현장에서 self-healing은 소규모여도 핵심 가치다

현장 설비는 택트 타임이 고정되어 있고 담당자가 즉시 개입하기 어렵다. 수동 재시작 자체가 생산 손실이다.

```
기존: 앱 크래시 → 담당자 발견 → 수동 재시작 → 수 분~수십 분 공백
k8s: 앱 크래시 → liveness probe 감지 → 자동 재시작 → 수십 초 이내 복구
```

로직·이미지 결함이 아닌 일시적 리소스 고갈·네트워크 타임아웃·예외 누수는 재시작만으로 해결되는 경우가 많다. 노드 규모가 작아도 이 가치는 유효하다. "HA가 없으면 k8s가 의미 없다"는 HA와 self-healing을 혼동한 결론이다.

## Related
- [[Industrial edge deployments split Windows hardware integration from Linux inference servers]] — 현장 배포 구조 전체 맥락. 이 노트에서 분리됨
- [[Kubernetes liveness and readiness probes catch failures that process existence cannot]] — self-healing의 실제 동작 원리. probe 없으면 hang도 감지 못함
- [[Stateless design makes any instance interchangeable by externalizing state]] — pod가 재시작·교체되어도 동작이 유지되는 전제 조건
- [[Docker and Ansible over k3s until edge scale justifies HA overhead]] — 소규모 현장에서 HA overhead 대비 Docker 우선 결정
