---
created: 2026-06-05
updated: 2026-06-05
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - deployment
  - k8s
publish: true
---
## Context
align-ai inference 이미지를 k8s Deployment로 배포했더니 `RESTARTS: 5`가 계속 올라갔다. `kubectl logs`로 확인하니 "–image 또는 –folder를 지정하세요"라고 출력하고 즉시 종료되고 있었다.

## Insight
### Deployment는 항상 살아있어야 하는 서버를 위한 리소스다

Deployment는 Pod이 종료되면 "실패"로 판단하고 자동 재시작한다. 배치 프로그램처럼 실행 후 정상 종료되는 컨테이너도 재시작 루프에 빠진다.

```
Deployment: Pod 시작 → 프로그램 종료(exit 0) → "죽었다" → 재시작 → 무한반복
```

### 배치 작업에는 Job 리소스를 써야 한다

| 리소스 | 용도 | 종료 처리 |
|---|---|---|
| `Deployment` | 항상 실행 중인 서버 | 종료 = 실패 → 재시작 |
| `Job` | 한 번 실행하고 끝나는 작업 | 성공 종료 = 완료 |
| `CronJob` | 주기적으로 실행되는 배치 | 스케줄에 따라 Job 생성 |

## Consequences
align-ai를 k8s에 올리려면 두 가지 선택지:
1. `predict_onnx.py`를 API 서버로 감싸서 Deployment로 운영
2. Job으로 변경하여 배치 실행
API 서버 구조가 실운영에 맞는 방향. Job은 학습 목적으로만 적합.

## Related
- [[Kubernetes.md]] — k8s 개념 전체
- [[Docker Compose before k8s because scale motivation must precede orchestration learning]] — 학습 계획
