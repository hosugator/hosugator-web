---
created: 2026-05-27
updated: 2026-06-01
type: insight
status: 3-superseded
subject: "[[Infra]]"
project: "[[Self-development in 2026]]"
tags:
  - docker
  - ci-cd
  - k3s
  - learning-plan
  - devops
publish: true
---

→ [[Docker Compose before k8s because scale motivation must precede orchestration learning]]

## Context

Docker 개념은 파악했으나 실전 코드 작성 경험이 부족한 상태. 컨테이너화·CI/CD·오케스트레이션의 개념 구분이 정리된 시점에서, 오후 세션부터 단계적 쉐도잉 학습을 시작하기로 결정.

## Insight

### 현재 수준 진단

**인지 완료:**
- Dockerfile 기본 문법 (FROM, WORKDIR, COPY, RUN, CMD)
- 이미지 vs 컨테이너 구분 (붕어빵 틀 vs 붕어빵)
- Docker Compose 서비스 묶음 개념, `up/down` 명령어

**미경험:**
- multi-stage build, `.dockerignore`
- Registry push/pull (Docker Hub, ECR)
- GitHub Actions workflow YAML 작성
- k3s/kubectl manifest 작성

### 학습 순서의 이유

Docker 이미지를 직접 만들 수 없으면 CI/CD에서 무엇을 자동화하는지 감이 없다. CI/CD 파이프라인 없이 k3s를 연결하면 전체 흐름이 단절된다. 반드시 아래에서 위로 쌓아야 한다.

## Decision

**학습 순서: Docker 심화 → GitHub Actions CI → CD → k3s**

### Phase 1: Docker 심화 (2세션)

| 세션 | 실습 | 핵심 WHY |
|---|---|---|
| 1A | `.dockerignore` 작성 + 이미지 크기 before/after 비교 | 빌드 컨텍스트가 이미지 크기·보안에 직결 |
| 1B | multi-stage build로 동일 앱 이미지 크기 비교 | 빌드 환경과 실행 환경은 분리되어야 한다 |
| 1C | Docker Hub push → 다른 환경에서 pull 확인 | Registry가 CI/CD의 아티팩트 전달 매체 |

### Phase 2: GitHub Actions CI (2세션)

| 세션 | 실습 |
|---|---|
| 2A | `.github/workflows/ci.yml` — checkout, 테스트 자동 실행 |
| 2B | 이미지 빌드 + Docker Hub push 자동화 |

### Phase 3: Argo CD GitOps CD (2세션)

| 세션 | 실습 | 핵심 WHY |
|---|---|---|
| 3A | k3d로 로컬 클러스터 구동 + Argo CD 설치 + manifest repo 구성 | Argo CD는 git을 단일 진실 소스로 삼는다 |
| 3B | GitHub Actions에서 image tag 업데이트 → Argo CD 자동 동기화 확인 | CI는 이미지를 만들고, CD는 상태를 맞춘다 |

### Phase 4: 전체 흐름 end-to-end (2세션)

| 세션 | 실습 |
|---|---|
| 4A | Deployment YAML 직접 작성 → apply → 롤링 업데이트 + kubectl 기본 명령 (`get`, `describe`, `logs`) |
| 4B | git push → CI 빌드 → Argo CD sync → k8s 롤링 업데이트 전체 흐름 한 번에 |

## Consequences

- 각 세션은 스캐폴딩(빈칸) → 직접 작성 → 실행 확인 순서로 진행
- Phase 1 완료 전 Phase 2로 넘어가지 않는다
- k3s/Argo CD는 Phase 2까지 완료 후 진입

## Related

- [[Containerization orchestration and CI-CD address packaging runtime and delivery as separate concerns]] — 이 학습 순서의 개념적 근거
- [[Docker - Docker Compose - Dockerfile 개념 분리]] — 현재 수준 기준선
- [[Server-side tmux necessity signals incomplete container deployment pipeline]] — 학습 동기
- [[Docker and Ansible over k3s until edge scale justifies HA overhead]] — 실무 적용 맥락
