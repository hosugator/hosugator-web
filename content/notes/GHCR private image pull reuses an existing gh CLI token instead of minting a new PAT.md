---
created: 2026-07-09
updated: 2026-07-09
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Hosugator Web]]"
tags:
  - ghcr
  - k3s
  - imagePullSecret
  - github-cli
publish: true
---
## Context
cureat(첫 데모)은 GHCR public 이미지라 imagePullSecret이 필요 없었다.
align-ai(두 번째 데모)는 고객 모델(serving.onnx)이 이미지에 내장돼 있어 패키지를 private로 유지해야 했고, 그래서 이번에 처음으로 k3s에 GHCR pull 인증을 붙여야 했다.

## Insight
### 로컬에 이미 `read:packages` 스코프의 gh CLI 토큰이 있다면, GHCR pull secret에 별도 PAT가 필요 없다

GHCR private 이미지를 pull하려면 `docker-registry` 타입 Secret에 자격증명이 필요한데, 보통 이를 위해 새 PAT(Personal Access Token)를 GitHub 설정에서 발급받는다.
하지만 로컬 `gh auth login`으로 이미 인증된 세션이 `read:packages` 스코프를 갖고 있다면, `gh auth token`으로 뽑아낸 토큰을 그대로 재사용할 수 있다 — 새 토큰을 만들 필요가 없다.

```bash
gh auth token | ssh <host> \
  'T=$(cat); k3s kubectl -n align-ai create secret docker-registry ghcr-cred \
   --docker-server=ghcr.io --docker-username=hosugator --docker-password="$T" \
   --dry-run=client -o yaml | kubectl apply -f -'
```

## Decision
새 PAT를 발급하는 대신 기존 `gh auth token`을 SSH로 전달해 Secret을 생성했다. 
이유: 토큰 발급·관리 지점을 늘리지 않고, 이미 존재하는 신뢰된 세션의 스코프를 그대로 재사용하는 게 더 적은 표면적.
- 전환 조건: `gh` CLI 세션이 아닌 CI(GitHub Actions)에서 자동으로 pull secret을 갱신해야 하는 시점이 오면, `GITHUB_TOKEN`(또는 fine-grained PAT) 기반 자동화로 전환 검토.

## Related
- [[GHCR over Docker Hub until external distribution is needed]] — 레지스트리 선택 근거
- [[GHCR image tag must be the full commit SHA because CI tags with github.sha not the short form]] — 같은 배포 작업에서 겪은 또 다른 함정