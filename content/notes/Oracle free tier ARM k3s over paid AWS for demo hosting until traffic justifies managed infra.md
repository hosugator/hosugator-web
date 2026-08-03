---
created: 2026-07-06
updated: 2026-07-06
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Hosugator Web]]"
tags:
  - k3s
  - kubernetes
  - oracle-cloud
  - ghcr
  - arm64
  - deployment
  - cost
  - decision
publish: true
---
## Context
Cureat 데모 백엔드(FastAPI)는 hosugator.com 포트폴리오에 연동돼 라이브로 돌던 기능이다. 최초 구성은 AWS ECS/Fargate/ALB였고, 이후 단일 EC2(t3.medium) 내 k3s 통합 구조로 리팩토링했으나, On-Demand 인스턴스 상시 비용이 데모 하나 유지 대비 과해 전체를 철거했다.
이번에 Oracle Cloud Always Free 인스턴스(2 OCPU / 12GB RAM / 200GB, Ampere A1 = ARM64)를 확보하면서, 같은 데모를 비용 $0으로 재가동할 조건이 생겼다. 동시에 앞으로 월 1개 페이스로 다른 프로젝트 데모를 추가할 계획이라, 단일 백엔드 복구가 아니라 멀티 데모 호스팅 기반을 세우는 결정이 필요했다.

전제 정리(이번 세션 확정):
- 프론트(hosugator.com)는 S3 + CloudFront 유지, 백엔드만 이전한다.
- DNS는 Route 53 관리(GoDaddy는 등록만). `api.hosugator.com` A레코드만 재지정하면 되고, 프론트가 이미 `https://api.hosugator.com/api/cureat/...`를 호출하므로 프론트 코드 무변경이 유지된다.

## Insight
### k3s는 여기서 HA가 아니라 멀티 데모 라우팅과 CI/CD로 정당화된다

### ARM 기판은 빌드 타깃을 뒤집는다

예전 EC2/Fargate 구성은 x86이라 이미지도 `linux/amd64`였다(CI에 `--platform linux/amd64` 하드코딩됨). Oracle Ampere는 ARM64(aarch64) 라 그 이미지는 안 돌거나 QEMU 에뮬레이션으로 느려진다. 재가동의 숨은 필수 작업은 이미지를 `linux/arm64`로 재빌드하는 것이고, 이건 레지스트리 전환(ECR→GHCR)과 함께 CI를 새로 짜야 하는 이유가 된다.

## Decision
### 유료 AWS EC2 k3s를 철거하고, 동일 k3s 구성을 Oracle Always Free(ARM) + GHCR 기반으로 재이식한다. 트래픽이 무료 티어 한도를 넘거나 가용성 SLA가 필요해지는 시점까지 이 구성을 유지한다.

| 항목       | 이전 (철거됨)                    | 이번 결정                                                                    |
| -------- | --------------------------- | ------------------------------------------------------------------------ |
| 기판       | AWS EC2 t3.medium (유료, x86) | Oracle Always Free Ampere (무료, ARM64)                                    |
| 이미지 아키텍처 | linux/amd64                 | linux/arm64                                                              |
| 레지스트리    | AWS ECR                     | GHCR ([[GHCR over Docker Hub until external distribution is needed]] 근거) |
| CD       | `aws.yml` (ECR push→ECS)    | GHCR push → VM pull (초기 수동 `kubectl set image`, 안정화 후 자동화)               |
| 오케스트레이션  | k3s 단일 노드 + Traefik         | 유지                                                                       |
| TLS      | (Phase 4 미완)                | cert-manager + Let's Encrypt                                             |
| 프론트      | S3 + CloudFront             | 유지 (무변경)                                                                 |
| DNS      | Route 53 → EC2 IP           | Route 53 A레코드 → Oracle VM IP                                             |
| 라우팅      | `/api/<demo>/` prefix strip | 유지 (멀티 데모 확장 규칙)                                                         |
#### 전환 조건
- 무료 티어 리소스/네트워크 한도 초과
- 데모가 실사용 트래픽을 받아 다운타임이 비용이 되는 시점
- 노드 하나로 감당 안 되는 데모 수 
→ 그때 관리형(EKS/managed) 또는 멀티 노드 검토.

### Argo CD는 추후 데모 종류 증가하면 도입하되, 미리 GitOps-ready 설계로 진행한다

Argo CD의 두 이점(git→클러스터 자동 sync, 드리프트 대시보드)은 실재하지만,  런타임 의존성이 아니다 → 데모는 Argo 없이도 돌고, 나중에 무위험으로 얹을 수 있다. 이 비대칭성 때문에 "월 1회 배포 + 운영 최소화" 조건에선 지금 도입이 이른 오케스트레이션이 된다. 
대신 별도 `hosugator-infra` 레포를 선언형 매니페스트 + 데모당 디렉토리 1개로 구성해, 초기엔 CI가 `kubectl apply`하고 Argo가 필요해지면 그 레포를 그대로 소스로 지정만 하면 되게 둔다.
  
- Argo 도입 전환 조건: 데모 수 증가로 수동 apply·상태 확인 toil이 실제로 커지거나, GitOps 학습이 목표로 승격될 때.

진행 순서:
1. 🔴 시크릿 재발급 (선행 필수) — `task-definition.json`에 평문 커밋된 OpenAI 키·Naver Client Secret 폐기·재발급. 신규 키는 코드에 넣지 않고 k8s Secret으로 주입.
2. VM 준비 — SSH → OS 확인 → k3s 설치 → Oracle 보안 리스트에서 80/443 오픈.
3. GHCR 파이프라인 — `aws.yml` 폐기, `buildx --platform linux/arm64` → GHCR push 워크플로 신설.
4. k8s 매니페스트 — Deployment/Service/Ingress/Secret + cert-manager (기존 매니페스트 ARM 재이식).
5. DNS 컷오버 — Route 53 A레코드를 Oracle VM IP로.

## 미결
- Always Free reclaim 방지 킵얼라이브 구체 방안 (다음 세션에서 확인)
- 노출 키 git 히스토리 정리(BFG) 수행 여부 (보류)

## Related
- [[hosugator - infra - k8s - plan]] — 철거된 AWS EC2 k3s 구축의 실행 로그. 이번 결정의 직접적 전신.
- [[Docker and Ansible over k3s until edge scale justifies HA overhead]] — "소규모엔 k3s 오버엔지니어링(HA 근거)" 원칙. 이번엔 HA가 목표가 아니라 충돌하지 않음.
- [[Docker Compose before k8s because scale motivation must precede orchestration learning]] — 학습 비용 원칙. 매니페스트 재사용이라 재적용 안 됨.
- [[Kubernetes Service L4 boundary prevents HTTP path and header routing without Ingress]] — 멀티 데모 path 라우팅이 Ingress 계층인 이유.
- [[GHCR over Docker Hub until external distribution is needed]] — 레지스트리 선택 근거.
- [[Multi-node k8s requires container registry because build and runtime node differ]] — 단일 노드에도 GHCR이 필요한 이유(GH Actions 빌드 ≠ VM 런타임).
- [[traefik 보안 경고]] — k3s 내장 Traefik ingress 운영 시 보안 주의.
- [[Route53 Routing Policy]] — api.hosugator.com DNS 컷오버.
- [[Argo CD is a deployment coordinator not a runtime dependency, k3s self-heals without it]] — Argo가 런타임 의존성이 아니라 나중에 무위험 추가 가능하다는 근거. CD 방식 결정의 핵심.

