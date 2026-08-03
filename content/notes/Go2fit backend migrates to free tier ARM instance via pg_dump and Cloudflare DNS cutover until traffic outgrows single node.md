---
created: 2026-07-18
updated: 2026-07-18
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Go2fit]]"
tags:
  - k3s
  - oracle-cloud
  - arm64
  - postgres
  - migration
  - decision
  - gitlab-ci
  - ocir
publish: true
---
## Context
go2fit-backend는 기존에 Oracle Always Free 자리가 없어 유료 인스턴스(E4.Flex, AMD64)로 생성했다.
이번에 Always Free A1.Flex(ARM64) 할당에 성공해 서버를 새 인스턴스로 옮겨야 한다. 
최초 메모(노트 초안)에는 IP/DNS/k3s ingress/카카오 개발자 콘솔/GitLab CI 정도만 고려사항으로 적혀 있었으나, Claude Code 세션에서 go2fit-backend 레포 코드를 직접 확인한 결과 실제 리스크 우선순위가 그 목록과 어긋나 있었다.

> [[Oracle free tier ARM k3s over paid AWS for demo hosting until traffic justifies managed infra]], [[hosugator - infra - oracle k3s rebuild log]] : 동일 유형 마이그레이션

## Insight
### 노트에 적힌 체크리스트는 실제 게이팅 팩터가 아니었다
IP·DNS·카카오 리다이렉트·GitLab CI 배포 스크립트는 Cloudflare Proxy와 도메인 기반 설정 덕분에 이미 인스턴스 IP와 분리되어 있었다(`docs/adr/033_domain-transition-plan.md` 확인).
카카오 리다이렉트 URI도 IP가 아닌 도메인(`api.go2fits.com`) 기준. 코드에 명시적으로 적혀있지 않아 놓치기 쉬웠던 진짜 게이팅 팩터는 둘:
1. k3s local-path PVC에 물린 Postgres 데이터
2. E4.Flex(AMD64) → A1.Flex(ARM64) 아키텍처 전환

### local-path PVC는 데이터를 노드에 물리적으로 묶는다
`k8s/postgres/statefulset.yaml`의 `volumeClaimTemplates`가 storageClass를 지정하지 않으면 k3s 기본값인 local-path provisioner를 쓰게 되고, 데이터는 노드 로컬 디스크에만 존재한다.
인스턴스를 통째로 바꾸는 마이그레이션에서 이 PVC는 자동으로 따라오지 않는다 — pg_dump/restore 같은 애플리케이션 레벨 이전이 필수다.

### mediapipe aarch64 wheel 존재는 필요조건이지 충분조건이 아니다
PyPI에서 `mediapipe==0.10.18`의 cp311-aarch64 wheel 존재를 직접 확인했고, Dockerfile 베이스가 `python:3.11-slim`이라 이론상 빌드 가능하다. 
그러나 hosugator 사례([[hosugator - infra - oracle k3s rebuild log]])처럼 Oracle Ubuntu 이미지 특유의 2계층 방화벽(Security List + 호스트 iptables REJECT), 예약 IP를 Ephemeral에서 떼어내야 붙는 UI 함정 등 문서화되지 않은 실전 트랩이 있어, 실제 인스턴스에서 빌드 스모크 테스트를 하기 전까지는 "가능하다"고 확정할 수 없다.

### GitLab CI는 배포 스크립트가 아니라 Runner 자체가 이전 대상이다
`.gitlab-ci.yml`은 SSH 원격 배포가 아니라 `tags: go2fit-server`로 지정된 GitLab Runner가 서버에 상주하며 `docker build` → `k3s ctr images import` → `kubectl set image`를 로컬 실행하는 구조다.
즉 "CI 설정을 바꾸는" 문제가 아니라 "Runner를 새 인스턴스에 재설치·재등록하는" 문제다.

### 배포 매니페스트와 실제 CI가 서로 다른 레지스트리 전략으로 갈라져 있었다
`k8s/kustomization.yaml`에 이미 실제 tenancy까지 채워진 OCIR 경로(`ap-chuncheon-1.ocir.io/axcmk7mkmjvy/go2fit-backend`)가 있었지만, `.gitlab-ci.yml`은 이를 전혀 참조하지 않고 `docker.io/library/...` 로컬 태그로 `k3s ctr images import`만 해왔다 — 두 사람(혹은 두 시점)의 작업이 분기된 흔적.
git 히스토리가 스쿼시돼 있어 blame으로는 확인 못 했지만, 파일 내용 자체가 증거였다. 이 "로컬 임포트 방식"이 정확히 이번 마이그레이션의 새 인스턴스 부트스트랩 문제(그 노드가 아니면 이미지가 없음)의 원인이라, 우회하지 않고 원래 설계(OCIR push/pull)로 되돌리는 근본 수정을 택함.

### Oracle Linux는 sudo secure_path에 /usr/local/bin이 빠져있다
`docker-ce`는 `/usr/bin`(패키지 매니저 설치 경로)에 깔려 `sudo docker`가 바로 됐지만, `k3s`/`kubectl`은 설치 스크립트가 `/usr/local/bin`에 심는데 이 배포판 기본 `/etc/sudoers`의 `secure_path`엔 그 경로가 없어 `sudo k3s kubectl`이 "command not found"로 조용히 실패했다.
`.gitlab-ci.yml`이 정확히 이 형태(`sudo k3s kubectl ...`)로 명령을 실행하므로, 이 수정 없이는 Runner를 붙여도 CI가 실패했을 것 — hosugator 사례의 "Ubuntu 2계층 방화벽"과 같은 급의, 배포판별 숨은 트랩.

### firewalld는 CNI 브리지 인터페이스를 자동으로 신뢰하지 않는다
`cni0`/`flannel.1`이 firewalld의 어떤 zone에도 안 묶여 있으면, restrictive한 `public` zone 정책의 영향을 받는다.
Service를 경유하는 트래픽(kube-proxy NAT)은 이 필터링을 우회해서 되지만, Traefik처럼 Pod IP에 직접 붙는 트래픽은 "Host unreachable"로 막힌다 — 그래서 클러스터 내부 디버그 pod로 Service DNS 호출은 성공(200)하는데 Traefik을 거친 실제 요청은 502가 나는, 원인 파악이 까다로운 형태로 나타났다.
hosugator 사례의 "Ubuntu iptables FORWARD REJECT가 flannel 라우팅을 깨뜨린다"는 트랩과 정확히 같은 클래스, firewalld(Oracle Linux/RHEL 계열) 버전. `cni0`/`flannel.1`을 `trusted` zone에 추가하면 해결된다.

### Ingress YAML의 들여쓰기 버그와, Traefik 버전 차이가 만든 착시
`k8s/app/ingress.yaml`은 `spec`/`tls`/`rules`가 `metadata`의 자식으로 잘못 들여써져 있어 `kubectl apply`가 strict-decoding 에러로 실패하는 상태였다 — 아마 이 파일이 커밋된 이후 아무도 처음부터 다시 `apply`해본 적이 없어서(기존 인스턴스는 CI가 `apply` 없이 `set image`만 하므로) 발견 못 된 채 남아있었다.
고치는 과정에서 별개로, OLD/NEW 인스턴스의 Traefik 버전 차이(3.6.10 vs 3.7.4)도 발견 — 존재하지 않는 `letsencrypt` certResolver를 참조할 때 구버전은 관대하게 self-signed로 fallback하지만 신버전은 더 엄격하게 반응한다. 다만 이건 실제 프로덕션엔 영향이 없다: Cloudflare가 Full(non-strict) 모드로 origin의 자체서명 인증서를 그대로 허용하고 있어서, origin의 `letsencrypt` 리졸버가 4월부터 계속 깨져있었어도 아무도 몰랐다 — 공개 도메인에서 보이는 인증서는 origin 것이 아니라 Cloudflare 엣지 인증서라는 걸 재확인.

### kustomization.yaml의 :latest 태그는 실제 프로덕션 코드와 무관했다
`kubectl apply -k k8s/`로 배포하면 `kustomization.yaml`의 `newTag: latest`가 적용되는데, 이 `:latest`는 CI가 관리하는 태그가 아니라 — 실제 CI(`.gitlab-ci.yml`)는 `$CI_COMMIT_SHORT_SHA`로 유니크 태그를 만들어 로컬 임포트해왔기 때문에, OCIR의 `:latest`는 아주 예전(아마 초기 수동 셋업 "Phase B-3") 시점에 한 번 push된 뒤 갱신된 적이 없는 화석이었다. 그 결과 새 인스턴스는 옛 인스턴스가 실제로 서빙 중인 코드(`e22e43f7`)와 전혀 다른, alembic 마이그레이션 체인조차 갈라지는 훨씬 오래된 코드를 배포할 뻔했다.

발견 경로: 새 인스턴스에서 `alembic heads`가 `1b1a896dee4f`인데 DB(pg_restore로 옮겨온)는 `bc2eebff388d` — 마이그레이션을 실행하니 "Can't locate revision"으로 실패. 옛 인스턴스에서 확인해보니 코드/DB 둘 다 `bc2eebff388d`로 일치. `kubectl get deployment -o jsonpath='{...image}'`로 옛 인스턴스의 실제 이미지 태그(`docker.io/library/go2fit-backend:e22e43f7`, 로컬 전용 태그라 레지스트리에서 pull 불가)를 확인하고, `git log --all` 검색으로 그 커밋을 특정, 정확히 그 커밋으로 다시 빌드해 OCIR에 push하고 새 인스턴스에 배포해서 해결.

교훈: 인스턴스 마이그레이션은 "같은 서비스를 옮기는 것"이어야지 코드 버전이 슬쩍 바뀌면 안 된다. `kustomization.yaml`의 고정 태그(`latest`)에 기대지 말고, 항상 옮기려는 원본이 실제로 무엇을 서빙 중인지(정확한 커밋/이미지 태그)를 먼저 확인하고 그걸 명시적으로 재현해야 한다.

## Decision
### 기존 유료 E4.Flex(AMD64) 인스턴스를 폐기하고 Always Free A1.Flex(ARM64)로 이전한다. Postgres는 pg_dump/restore로, 트래픽 전환은 Cloudflare DNS A레코드 컷오버로 수행한다. 트래픽이 무료 티어 한도를 넘거나 가용성 SLA가 필요해지는 시점까지 이 구성을 유지한다.

| 항목 | 이전 | 이번 결정 |
|---|---|---|
| 기판 | E4.Flex (유료, AMD64) | A1.Flex (Always Free, ARM64) |
| DB 데이터 | 노드 로컬 디스크 (local-path PVC) | pg_dump → 새 노드 pg_restore, 컷오버 직전 변경분 재동기화 |
| CI/CD | GitLab Runner가 old 인스턴스 상주, 로컬 `docker build` + `k3s ctr import` | OCIR push/pull로 전환(GF-136) + 새 인스턴스에 Runner 재설치·재등록(GF-137, 태그 `go2fit-server`) |
| DNS | Cloudflare Proxy A레코드 → old IP | 동일 방식 유지, A레코드만 새 IP로 전환 (전파 빠름) |
| 카카오 OAuth | 도메인 기반 redirect URI (IP 무관) | 변경 불필요 — 단, 기존 오타 버그(`api.go2fit.com` vs `api.go2fits.com`)는 이번에 별도로 수정 |

#### 실행 순서 (Jira: story/GF-133 하위 feat 브랜치)
브랜치는 이상적 개수(3-5)보다 논리적 단위로 나눈다 — 처음엔 GF-136을 "새 인스턴스 인프라 구축"으로 잡았다가, OCIR 발견 이후 별도 작업으로 분리하며 번호를 맞바꿨다(GF-136=OCIR 수정, GF-137=인프라 구축). 아직 커밋 없는 빈 브랜치였기 때문에 재배치 비용이 없었음.

1. GF-135 — Phase 0 (Go/No-Go): 새 인스턴스에서 Dockerfile 빌드 스모크 테스트. ✅ 완료·merge
2. GF-136 — OCIR CI 파이프라인 수정: 로컬 build+import → OCIR push/pull 전환. 기존(운영) 인스턴스와 무관하게 독립 검증 가능해 새 인스턴스 인프라 구축보다 먼저 배치. ✅ 완료, MR 올림(story/GF-133 대상 — main 반영은 팀 스프린트 주기에 별도 진행하되, 스토리 자체는 자기완결적으로 유지하기 위해 MR은 지금 올림)
3. GF-137 — Phase 1: k3s + GitLab Runner 새 인스턴스에 구축, secret.yaml 수동 이전. ✅ 완료, MR !59 merge
4. GF-138 — Phase 2: Postgres pg_dump/restore. GF-137 작업 중(diff 없음) 논의 끝에 별도 분리 — "순서상 의존해도 성격이 다르면 분리"라는 동일 원칙 재적용. ✅ 완료, MR !60
5. GF-139 — Phase 3: 앱 배포 후 새 인스턴스 IP로 직접 사전 검증 (도메인 전환 전). `ocir-secret` 생성, ingress YAML 버그·firewalld CNI 트랩 발견·수정까지 포함. ✅ 완료, MR !61
6. GF-140 — Phase 4: DB 재동기화 + Cloudflare DNS 컷오버. Phase 3과 "작업 영역"은 같지만 실 트래픽 영향(blast radius)이 다르다는 기준으로 분리. 🔄 진행 중 — 사전 준비(재동기화, Runner pause, stale 이미지 수정)까지 완료, 실제 DNS 전환은 Cloudflare 접근 권한 확보 후 진행
7. Phase 5: 검증 (HTTPS, 카카오 로그인, 영상 분석 파이프라인, CI 배포)
8. Phase 6: 옛 인스턴스 Runner unregister + Terminate

#### 전환 조건
- 무료 티어 리소스 한도 초과
- 다운타임이 실제 비용이 되는 트래픽 규모 도달
- 단일 노드로 감당 안 되는 시점
→ 그때 유료 인스턴스 또는 멀티 노드 구성으로 재검토.

## Consequences
- ARM 빌드가 Phase 0에서 실패하면 계획 전체가 무효화되므로, 반드시 다른 단계보다 먼저 격리해서 검증한다.
- Postgres 이전 중 "컷오버 직전 재동기화" 구간이 이 마이그레이션의 유일한 실질적 다운타임이다.

## Verification
Phase 0 완료 (2026-07-18) — 새 인스턴스(168.110.115.67, Oracle Linux 9, aarch64)에 직접 SSH 접속해 실증:
- `docker-ce` 설치 후 `mediapipe==0.10.18` + `opencv-==4.11.0.86`를 `python:3.11-slim` 컨테이너에 설치 → `FaceDetection.process()`까지 실제 추론 성공(XNNPACK delegate).
- 레포의 실제 `Dockerfile`을 `git archive` → scp → `docker build`로 CI와 동일하게 빌드 → `requirements-prod.txt` 19개 패키지 전부 aarch64 wheel로 컴파일 없이 설치 완료.
- 컨테이너 기동 시 `JWT_SECRET_KEY` 누락(시크릿 미설정)에서 정상적으로 실패 — import 체인(mediapipe/opencv/앱 코드 전체) 자체는 문제없음을 확인.
→ ARM 마이그레이션의 최대 불확실성(mediapipe 호환성)이 이론에서 실증으로 해소됨.

GF-135 스크립트화 + 버그 발견 (2026-07-18) — 수동 검증을 `scripts/arch_build_smoketest.sh`로 재사용 가능하게 커밋. 재현 과정에서 실제 버그 발견: 2단계(mediapipe 단독 검증)가 `--entrypoint` 없이 실행돼 `docker-entrypoint.sh`의 기본 `RUN_MIGRATIONS=true`를 타면서 DB/시크릿 미설정으로 실패 — 수동으로 했던 것과 스크립트화한 것 사이에 실제 차이가 있었다는 사례. `--entrypoint python3`로 우회 수정 후 재실행, 3단계 전부 통과 확인. MR !57 → story/GF-133 merge 완료.

GF-136 OCIR 검증 (2026-07-18) — `k8s/kustomization.yaml`이 이미 OCIR 경로로 설계돼 있었는데 실제 CI는 로컬 임포트만 써온 것을 발견, root cause를 고치기로 결정(임시 우회 대신). 두 가지 실증:
1. 기존(운영) 인스턴스의 `ocir-secret` 생성 시각이 OCIR Auth Token 발급 시각과 6분 차이 — 재생성 불필요, 그대로 유효함을 확인.
2. 새 인스턴스(트래픽 없는 유휴 환경)에서 실제 자격증명으로 `docker login → build → push → rmi → pull` 전체 라운드트립 실행, digest 일치 확인. main 병합 없이도 로직 자체를 안전하게 검증하는 방법. 검증용 토큰 파일/이미지는 전부 정리.
→ MR !58 → story/GF-133 (main 반영은 팀 스프린트 주기에 맞춰 추후 진행).

GF-137 Phase 1 진행 (2026-07-18) — 새 인스턴스에 k3s 설치 및 기본 인프라 구축. 전부 SSH 라이브 작업이라 처음엔 `story/GF-133` 대비 diff 없음(gitignore 대상인 `k8s/secret.yaml` 수정 포함해도 git엔 안 잡힘) — GF-135와 같은 종류의 "diff 없는 브랜치" 논의 재발.
- k3s 설치(Ready, aarch64), firewalld 80/443 오픈, `sudoers secure_path` 트랩 수정(위 Insight)
- `namespace.yaml`/`configmap.yaml` 적용, `secret.yaml` 이전(카카오 리다이렉트 오타 `api.go2fit.com`→`api.go2fits.com` 동시 수정)
- GitLab Runner 신규 등록(`glab api`로 project runner 토큰 발급 → `gitlab-runner register --non-interactive`), `gitlab-runner` 유저 NOPASSWD sudo 부여
- ⚠️ 옛 인스턴스 Runner와 새 인스턴스 Runner가 동시에 `go2fit-server` 태그로 online — `only: main`이라 당장은 안전하지만, Phase 4(컷오버) 전에 한쪽을 pause해서 배포 대상을 확정해야 함
- `ocir-secret`(이미지 pull용)은 Phase 3(Deployment 적용 시점)로 의도적으로 미룸 — 지금 안 만들어도 막히는 게 없음
- 결론: "보이지 않는 터미널 작업을 보이게 만든다"는 이유로 스크립트화 결정 → `scripts/provision_k3s_node.sh` 커밋(k3s 설치/firewalld/sudoers 수정만 포함, 부작용 있는 Runner 등록은 제외). 재실행해 전 단계 no-op 확인. MR !59 → story/GF-133 merge 완료.

GF-138 Postgres 이전 분리 + 스크립트화 (2026-07-18) — Phase 2 작업이 GF-137과 같은 브랜치(diff 없음)에서 진행되고 있던 걸 발견, "순서 의존 ≠ 같은 브랜치"라는 동일 원칙으로 별도 티켓 분리. `scripts/migrate_postgres.sh` 작성(pg_dump→scp→pg_restore→행 수 비교), 실제 재실행으로 검증 — 재실행 시점에 운영 DB에 새로 쓰인 데이터(덤프 5.1M→5.5M)까지 정상적으로 재동기화됨을 확인, 컷오버 직전 재동기화 절차로도 그대로 재사용 가능함이 증명됨. MR !60 → story/GF-133.

GF-139 Phase 3 진행 (2026-07-18) — `ocir-secret` 생성 후 `kubectl apply -k k8s/`로 Deployment/Service/Ingress 최초 적용. 이 과정에서 실제 버그 2개 발견·수정:
1. Ingress YAML 들여쓰기 버그: `spec`가 `metadata`의 자식으로 잘못 들여써져 `kubectl apply`가 strict-decoding 에러로 실패. 정정 후 정상 적용.
2. firewalld CNI 트랩: Ingress 적용 후에도 계속 502 — Service DNS 경유(디버그 pod)는 200인데 Traefik만 502가 나는 걸로 문제를 좁혔고, Traefik pod 안에서 `wget`으로 Pod IP 직접 호출 시 "Host is unreachable"까지 확인. `cni0`/`flannel.1`이 firewalld 어떤 zone에도 안 묶여있던 게 원인 — `trusted` zone에 추가 후 즉시 해결(200). `scripts/provision_k3s_node.sh`에 반영.
3. (사이드 발견, 수정 불필요) OLD/NEW Traefik 버전 차이(3.6.10 vs 3.7.4)가 존재하지 않는 `letsencrypt` certResolver에 대한 관용도를 바꿔놓은 것도 확인 — 프로덕션은 Cloudflare가 origin 인증서와 무관하게 자체 인증서를 서빙 중이라 실제 영향 없음.

새 인스턴스 IP + Host 헤더로 `/health`, `/docs` 반복 검증(HTTP 404/HTTPS 200 — 기존 인스턴스와 동일 패턴) 완료. MR !61 → story/GF-133.

GF-140 Phase 4 진행 (2026-07-18) — 컷오버는 실 트래픽 영향(리스크 등급)이 달라 별도 티켓으로 분리(작업 영역이 아니라 blast radius 기준 분리 — 새로운 분리 기준).
- 컷오버 직전 최종 DB 재동기화(`migrate_postgres.sh` 재실행) 완료, 행 수 일치
- 옛 인스턴스 GitLab Runner pause(`glab api PUT runners/52983130 paused=true`) — 둘 다 `go2fit-server` 태그로 online 상태이던 것 해소, 향후 CI push는 새 인스턴스로만 감
- 실제 영상(`tests/integration/KakaoTalk_Video_2026-03-01-17-00-30.mp4`)을 배포된 Pod에 `kubectl cp`로 넣고 `services.media_analysis.extract_pose_landmarks_sequence`를 직접 호출 — 60프레임 전부(60/60) 포즈 랜드마크 검출 성공(4.1초). Phase 0의 블랙 프레임 테스트보다 훨씬 강한 실증(인증/DB 계층 없이 핵심 로직만 격리 검증)
- 위 Insight의 stale `:latest` 이미지 문제 발견·수정: 정확한 프로덕션 커밋(`e22e43f7`)으로 재빌드·재배포, alembic head/DB/코드 3자 일치 확인
- 카카오 리다이렉트 URI 재확인: 옛 인스턴스의 실제 라이브 시크릿은 이미 `https://api.go2fits.com/...`로 정상 등록돼 있었음(로컬 파일의 오타는 그 파일만 stale했던 것, 운영엔 영향 없었음) — 새 인스턴스 값과 일치 확인
- `kustomization.yaml` 이미지 참조를 `newTag: latest`(CI가 갱신 안 하는 화석) 대신 `digest`(불변 콘텐츠 해시, `e22e43f7`)로 고정 — 실제 재적용(`kubectl apply -k`)해도 배포가 안 바뀌는 것까지 검증. Argo CD 전면 도입은 장기적으로 맞는 방향(CI가 클러스터를 직접 안 건드리게 해서 선언/실제 불일치를 구조적으로 방지)이지만, CI를 git-write-back 모델로 재설계해야 하는 별도 아키텍처 작업이라 이번 스토리 스코프에서 제외, 후속 스토리로 위임 결정
- Reserved Public IP로 전환: 새 인스턴스의 기존 IP(168.110.115.67)가 Ephemeral이었음 — 컷오버 후 인스턴스 재시작 등으로 IP가 바뀌면 Cloudflare가 죽은 주소를 가리키게 되는 리스크. 컷오버 전인 지금이 가장 안전한 타이밍이라 판단, OCI 콘솔에서 Reserved IP로 교체 → 140.245.75.16으로 확정(hosugator 사례와 동일하게 ephemeral→reserved 전환 시 주소 자체가 바뀜). k3s `--tls-san`에 새 IP 추가 후 재시작(기존 파드는 중단 없이 유지됨), HTTP/HTTPS 전부 재검증 완료
- Cloudflare 접근 권한이 아직 없어 실제 DNS 컷오버는 보류 — 그 전에 할 수 있는 모든 사전 검증은 이 단계에서 마무리

**컷오버 완료 (2026-07-19)** — 팀원이 Cloudflare `api` A레코드를 `140.245.75.16`으로 전환. 실제 도메인(`https://api.go2fits.com`) 요청이 새 인스턴스 로그(Traefik 전달 소스 `10.42.0.14`)에 찍히고 옛 인스턴스엔 kubelet 프로브 외 신규 요청이 없는 것으로 트래픽 전환을 직접 확인. 컷오버 직후 최종 재동기화(`migrate_postgres.sh`) 1회 더 실행, 행 수 일치. `/health`/`/docs` 실도메인 200, Cloudflare 인증서(Let's Encrypt) 정상.

**실기기 검증 + MR 제출 (2026-07-21)** — 팀원(이상빈)이 실기기로 카카오 로그인 → 세션 생성 → 영상 업로드 → mediapipe 분석 → 결과 조회까지 전체 플로우 실행. 새 인스턴스 로그와 DB 행 수 증가분(session/set/rep_analysis/exercise_video 전부 +1 또는 실제 반복 수만큼)이 정확히 일치 — **프론트엔드가 IP 하드코딩이 아니라 도메인으로 정상 라우팅됨을 실증**(사전에 우려했던 시나리오였음). 옛 인스턴스는 48시간 로그에 프로브 외 신규 요청 전무 — 컷오버 완전히 안정화 확인. MR !62(story/GF-133, 리뷰어 go2fit) 제출, 준비+실전환+실기기 검증까지 전체를 하나로 담음.

**발견된 버그 (스코프 밖, 별도 이슈)**: `GET /api/v1/workout/sessions`가 일부 레거시 세션의 `occurred_at`이 NULL이라 Pydantic 응답 검증에서 500 발생. 오늘 새로 생성된 세션은 정상 채워짐 — 마이그레이션이 원인이 아니라 기존 데이터의 pre-existing 이슈로 추정, 디버깅은 별도 진행.

## 미결
- 발견된 `GET /api/v1/workout/sessions` 500 버그(레거시 `occurred_at` NULL) 디버깅 — 별도 이슈로 추적
- Phase 5 나머지: CI 실배포 확인(main 반영은 팀 스프린트 주기)
- Phase 6: MR !62 리뷰 확인 후 — 옛 인스턴스 GitLab Runner unregister + 인스턴스 Terminate(Boot Volume은 보존 권장), Reserved IP였다면 필요 시 Release. 트래픽 전무 확인됐으나 실제 Terminate는 OCI 콘솔에서 사용자가 직접 수행 필요(Claude는 OCI 콘솔/API 접근 권한 없음, SSH만 가능)

## Related
- [[Oracle free tier ARM k3s over paid AWS for demo hosting until traffic justifies managed infra]] — 동일 패턴(유료 x86 → Always Free ARM)의 6주 전 선행 사례, 이번 결정의 직접적 참고.
- [[hosugator - infra - oracle k3s rebuild log]] — Oracle Ubuntu 2계층 방화벽, 예약 IP 전환 UI 함정 등 실전 트랩 기록. Phase 1(새 인스턴스 환경 구축)에서 재확인 필요.
