---
created: 2026-06-11
updated: 2026-06-11
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - github-actions
  - ci-cd
publish: true
---
## Context
align-ai train.yml에서 ONNX를 커밋·push한 후 ci.yml이 트리거되길 기대했다. ci.yml에 `on: push: branches: [main]`이 있었지만 트리거되지 않았다.

## Insight
### GITHUB_TOKEN으로 만든 커밋은 같은 레포의 다른 워크플로를 트리거하지 않는다

GitHub Actions 보안 정책이다. 무한 루프 방지 목적. PAT(Personal Access Token)나 GitHub App 토큰을 사용하면 트리거된다.

### `gh workflow run`으로 명시적 호출이 우회법이다

`gh workflow run ci.yml`은 REST API를 통한 `workflow_dispatch` 트리거이므로 GITHUB_TOKEN 제약을 받지 않는다. 단, 대상 워크플로에 `workflow_dispatch:` 트리거가 반드시 있어야 한다.

### `git merge-base --is-ancestor`로 불필요한 중복 트리거를 막을 수 있다

ONNX가 변경 없어 커밋이 안 된 경우에도 `gh workflow run`을 무조건 호출하면 낭비다. ONNX의 최신 커밋이 deployment.yaml의 최신 커밋보다 새로운 경우에만 호출하면 된다.

```bash
ONNX_COMMIT=$(git log -1 --format="%H" -- models/Q-display/latest.onnx)
DEPLOY_COMMIT=$(git log -1 --format="%H" -- k8s/deployment.yaml)
if git merge-base --is-ancestor "$ONNX_COMMIT" "$DEPLOY_COMMIT"; then
  echo "pod이 최신 ONNX 포함 — ci.yml 스킵"
else
  gh workflow run ci.yml
fi
```

## Related
- [[Argo CD watches Git manifest and CI must update manifest to trigger deployment]] — ci.yml이 담당하는 manifest 업데이트 역할
- [[Docker image .Id is non-deterministic, use RootFS.Layers for content comparison]] — 같은 파이프라인의 이미지 비교 단계
