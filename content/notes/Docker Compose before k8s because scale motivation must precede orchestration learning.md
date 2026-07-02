---
created: 2026-06-01
updated: 2026-06-05
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Self-development in 2026]]"
tags:
  - docker
  - kubernetes
  - docker-compose
  - learning-plan
  - infrastructure
publish: true
---
## Context
2026-05-27 작성한 학습 경로([[Container stack learning path Docker through CI-CD to k3s]])에 Phase 1A(dockerignore 실습) + ONNX 경량화까지 오늘 완료됐다. 
기존 계획에는 Docker Compose 실습 단계가 없었으나, k8s에 대한 두려움의 원인이 "규모 동기 부재"임을 인식하면서 Compose를 삽입하기로 결정. 기존 계획과 통합해 최신 결정으로 업데이트.

## Insight
### 두려움은 실행 전 불확실성에서 온다
오늘 Docker 실습에서 확인: 추상 개념 설명보다 직접 틀리고 에러 읽고 고치는 반복이 불확실성을 줄인다. k8s도 동일한 패턴이 필요하다.

### k8s는 규모 동기 없이 진입하면 개념이 공허하다
Docker는 "이 컨테이너를 실행한다"는 단순 목적이 있다. k8s가 해결하는 "여러 컨테이너를 살려두고, 트래픽 나누고, 죽으면 되살리는" 문제는 그 고통을 안 겪어보면 왜 필요한지 실감이 안 된다.

### Docker Compose가 k8s 진입 전 동기 생성 단계다
멀티컨테이너 조합(예: 추론 서버 + API 서버)을 Compose로 먼저 단순하게 경험하면, k8s가 해결하려는 문제—그 조합을 클러스터에서 운영하는 것—가 구체적으로 느껴진다.

### 각 인프라 레이어는 손으로 먼저 쌓아야 다음 레이어의 필요성이 보인다
Docker 이미지를 직접 만들지 못하면 CI/CD가 무엇을 자동화하는지 모른다. CI/CD 없이 k8s를 연결하면 전체 흐름이 단절된다. 아래에서 위로 반드시 쌓아야 한다.

## Decision
**학습 순서: Docker 심화 → Docker Compose → GitHub Actions CI → Argo CD → k8s**

| Phase | 세션 | 실습 | 상태 |
|---|---|---|---|
| 1A | Docker 심화 | `.dockerignore` 작성 + 이미지 크기 before/after | ✓ 완료 (2026-06-01) |
| 1B | Docker 심화 | multi-stage build — 빌드 환경과 실행 환경 분리 | ⊘ 스킵 (Python ML 환경에서 효과 미미) |
| 1C | Docker 심화 | Docker Hub push → 다른 환경에서 pull 확인 | ✓ 완료 (2026-06-04) |
| 2A | Docker Compose | 멀티컨테이너 서비스 조합 (추론 서버 + API 서버) | ✓ 완료 (2026-06-02, align-ai 학습/추론 분리로 대체) |
| 2B | Docker Compose | 컨테이너 간 네트워크 통신 확인 | — (미실시) |
| 3A | GitHub Actions CI | checkout + 테스트 자동 실행 | ✓ 완료 (2026-06-05) |
| 3B | GitHub Actions CI | 이미지 빌드 + GHCR push 자동화 | ✓ 완료 (2026-06-05, Docker Hub → GHCR로 변경) |
| 4A | Argo CD | k3d 로컬 클러스터 + Argo CD 설치 + manifest repo 구성 | ✓ 완료 (2026-06-05) |
| 4B | Argo CD | GitHub Actions → image tag 업데이트 → Argo CD 자동 동기화 | ✓ 완료 (2026-06-08) |
| 5A | k8s | Deployment YAML 작성 → apply → 롤링 업데이트 + kubectl | — |
| 5B | k8s | git push → CI 빌드 → Argo CD sync → k8s 전체 흐름 | — |

Compose 실습 시에는 align-ai에 억지로 붙이기보다, 추론 서버 + API 서버 가상 시나리오를 설정한다.  
전환 조건: 각 Phase 완료 전 다음으로 넘어가지 않는다.

## Consequences

- Phase 1A 완료: `.dockerignore`, ONNX 경량화(5.8GB → 344MB) 직접 검증
- Phase 1B 스킵: Python ML에서는 빌드/실행 환경 분리 효과가 미미하다는 결론
- Phase 2A 완료: Docker Compose 학습/추론 서비스 분리, GPU 학습 컨테이너 end-to-end 검증
- Phase 1C 완료: Docker Hub push + pull 확인. 모델(559KB)을 이미지에 구워서 데이터 볼륨만으로 완전 배포 가능한 구조 완성
- Phase 3A 완료: pytest 7개 테스트 작성 + main push 시 자동 실행
- Phase 3B 완료: GHCR 자동 push. GITHUB_TOKEN 자동 주입으로 별도 Secret 불필요. permissions 블록 명시 시 기본값 소멸 이슈 발견 및 해결.
- Phase 4A 완료: k3d 클러스터 + Argo CD 설치 + align-ai Deployment 연결. Deployment가 배치 프로그램에 부적합(재시작 루프) 발견 — API 서버 전환 필요.
- Phase 4B 완료: CI → GHCR push → manifest SHA 태그 업데이트 → Argo CD Synced end-to-end 검증. paths-ignore로 무한 루프 방지 발견 및 적용.
- 다음: API 서버 전환(predict_onnx.py → FastAPI) → Phase 5 두 대 클러스터

## Verification
- 2026-06-04: Phase 1C 완료 — `hosugator/align-ai:inference-latest` push. 모델(559KB)을 이미지에 포함시켜 데이터 볼륨(-v)만으로 완전 배포 가능한 구조 확정. `docker pull` + `docker run -v ./data:/app/data` 한 줄로 현장 배포 가능함을 로컬 시뮬레이션으로 검증.
- 2026-06-02: Phase 2 Compose 실습을 align-ai에서 진행 (API 서버 시나리오 대신 학습/추론 분리). `docker compose build` 병렬 빌드, `docker compose run train` GPU 학습 성공 확인. 학습 완료 후 ONNX 변환 → `docker compose run inference` 추론까지 end-to-end 완주. 컨테이너 간 통신(Phase 2B)은 미실시. multi-stage build(Phase 1B)는 Python 환경에서 효과가 미미하다는 결론으로 스킵. Compose 핵심 구조(서비스 분리, 볼륨 마운트, shm_size, GPU 설정)는 체험 완료.

## Related
- [[Container stack learning path Docker through CI-CD to k3s]] — 기존 계획 (superseded by this note)
- [[Containerization orchestration and CI-CD address packaging runtime and delivery as separate concerns]] — 이 학습 순서의 개념적 근거
- [[Docker and Ansible over k3s until edge scale justifies HA overhead]] — 실무 적용 맥락
- [[Shadowing requires spec-first and adversarial review to build judgment not just familiarity]] — 같은 패턴: 두려움 해소를 위한 실행 우선 학습법
- [[ONNX format embeds computation graph making it self-contained unlike pth which depends on Python code]] — Phase 1A에서 함께 완료한 ONNX 경량화
