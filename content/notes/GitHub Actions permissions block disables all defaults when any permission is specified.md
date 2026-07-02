---
created: 2026-06-05
updated: 2026-06-05
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - github-actions
  - ci
  - permissions
publish: true
---
## Context
align-ai CI workflow에 GHCR push를 위해 `permissions: packages: write`를 추가했더니 `actions/checkout`이 `repository not found`로 실패했다. 권한 문제가 아니라 원인을 찾는 데 시간이 걸렸다.

## Insight
### permissions 블록은 명시된 것만 활성화하고 나머지 기본값을 모두 비활성화한다

GitHub Actions는 기본적으로 `contents: read` 등 여러 권한을 묵시적으로 부여한다. 그러나 `permissions` 블록을 하나라도 추가하는 순간 **묵시적 기본값이 전부 사라지고** 명시된 것만 살아남는다.

```yaml
# 이렇게 쓰면 contents: read가 사라져 checkout이 실패한다
permissions:
  packages: write

# 올바른 방법 — 필요한 것을 모두 명시
permissions:
  contents: read
  packages: write
```

### GHCR push에는 최소 두 가지 권한이 필요하다

| 권한 | 용도 |
|---|---|
| `contents: read` | `actions/checkout`이 코드를 읽는 데 필요 |
| `packages: write` | GHCR에 이미지를 push하는 데 필요 |

## Verification
- 2026-06-05: `packages: write`만 명시 → checkout에서 `repository not found` 발생. `contents: read` 추가 후 해결.

## Related
- [[Containerization orchestration and CI-CD address packaging runtime and delivery as separate concerns]] — CI/CD 개념 전체 맥락
- [[Docker Compose before k8s because scale motivation must precede orchestration learning]] — 학습 계획
