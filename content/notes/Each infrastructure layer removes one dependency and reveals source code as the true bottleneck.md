---
created: 2026-06-19
updated: 2026-06-29
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Self-development in 2026]]"
tags:
  - docker
  - kubernetes
  - ci-cd
  - devops
  - learning
publish: true
---
## Context
Docker → k8s → Argo CD 전체 파이프라인을 화이트보드에 덤프하고 나서, 각 계층이 왜 존재하는지가 하나의 패턴으로 보이기 시작했다. 이전까지는 인프라 구조가 더 중요하다고 막연하게 생각했는데, 전체 구조를 이해하고 나서 역설적으로 소스 코드가 가장 중요하다는 걸 깨달았다.

## Insight
### 각 계층은 이전 계층의 수동 의존성을 하나씩 제거한다

```
소스코드  →  Docker     런타임 환경 의존성 제거  ("내 맥북에서는 되는데...")
Docker    →  k8s        단일 VM 의존성 제거       (스케줄링, 셀프힐링)
k8s       →  Argo CD    수동 배포 의존성 제거     (사람이 kubectl apply해야 하는 것)
```

각 계층이 등장한 이유는 기술적 우월함이 아니라 **이전 계층이 남긴 병목을 제거**하기 위해서다.

### 전체 구조를 이해하면 소스코드가 유일한 차별화 지점임이 보인다

인프라 계층들(Docker, k8s, Argo CD)은 모두 **전달 파이프라인**이다. 무엇을 전달하느냐는 결정하지 않는다. 전달 파이프라인이 완성될수록, 결국 남는 변수는 소스코드 품질뿐이다.
막연하게 인프라를 이해할 때는 인프라가 더 중요해 보인다. 전체 구조가 보이면 인프라는 필요조건이고, 소스코드가 충분조건임을 알게 된다.

### k8s의 핵심은 etcd다

```
etcd  →  클러스터의 SSOT. "무엇이 어떤 상태여야 하는가"가 전부 여기에 있음

API Server  →  etcd에 쓰고 읽음 (모든 명령의 진입점)
Scheduler   →  etcd 보고 Pod 배치 결정
kubelet     →  etcd 기준으로 컨테이너 실행
Argo CD     →  GitHub를 etcd에 동기화하는 브릿지
```

Argo CD가 죽어도 기존 Pod들은 etcd 기준으로 정상 동작한다. 새 배포만 안 될 뿐.

### CI/CD 전체 흐름 한 줄 요약

```
코드 변경
  → GitHub Actions (CI): 이미지 빌드 → GHCR push → manifest 업데이트
  → Argo CD (CD): manifest 감지 → etcd 동기화
  → kubelet: etcd 기준으로 컨테이너 실행
```

GitHub Actions Runner는 택배 기사다. kubeconfig(출입증)를 갖고 API Server에 kubectl apply를 전달하고 종료된다. 이후는 클러스터가 알아서 처리한다.

### GitHub Actions는 택배 기사이자 출고 검수소다

배송(이미지 빌드 → GHCR push → manifest 업데이트)만이 역할이 아니다. CI 파이프라인의 더 근본적인 역할은 소스코드의 **자기 완결성 검증**이다.
배포 환경은 이미 빌드된 이미지만 사용한다. 그러나 소스코드는 깨끗한 환경에서 누가 빌드해도 동일한 결과물이 나와야 한다. CI는 이를 중립 환경에서 증명한다.

```
소스코드 커밋
  → CI: 깨끗한 환경에서 빌드 + 테스트  ← 자기 완결성 검증
  → 통과하면: 이미지 빌드 → GHCR push
  → Argo CD: 이미지를 운영 환경에 배포  (빌드는 이미 끝남)
```

CI를 통과했다는 것은 "requirements.txt, Dockerfile, 의존성 선언이 코드를 정확히 기술하고 있다"는 증명이다.

## Related
- [[Containerization orchestration and CI-CD address packaging runtime and delivery as separate concerns]] — 각 계층이 답하는 관심사가 다르다는 원리
- [[Docker Compose before k8s because scale motivation must precede orchestration learning]] — 이 이해에 도달하기까지의 학습 경로
- [[Docker and Ansible over k3s until edge scale justifies HA overhead]] — 실무 적용 맥락에서의 도구 선택
- [[Docker isolates runtime environment while CI verifies build-time reproducibility]] — 빌드 환경 의존성과 런타임 환경 의존성의 구분
