---
created: 2026-06-11
updated: 2026-06-11
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - github-actions
  - cli
  - authentication
publish: true
---
## Context
GHCR untagged 버전 삭제를 위해 `gh auth login --scopes "delete:packages"`를 실행했다. 인증 후 바로 명령을 실행하니 `read:packages` 권한 오류가 났다. 스코프가 추가된 게 아니라 교체된 것이었다.

## Insight
### `--scopes` 플래그는 기존 스코프에 추가하지 않고 교체한다

```bash
# 기존: read:packages, repo, ...
gh auth login --scopes "delete:packages"
# 결과: delete:packages만 남음 — read:packages 제거됨
```

필요한 스코프를 모두 쉼표로 나열해서 한 번에 지정해야 한다:

```bash
gh auth login --scopes "read:packages,delete:packages"
```

### GitHub 패키지 스코프는 read/write/delete가 독립적으로 분리되어 있다

| 스코프 | 용도 |
|---|---|
| `read:packages` | 목록 조회, pull |
| `write:packages` | 이미지 push (CI에서는 GITHUB_TOKEN이 자동 처리) |
| `delete:packages` | 버전 삭제 |

로컬 정리 작업에는 `read:packages` + `delete:packages` 조합이 필요하다.

## Related
- [[latest-only tag creates untagged dangling versions in container registry]] — 이 스코프가 필요했던 상황
- [[GITHUB_TOKEN commits do not trigger downstream workflows]] — GitHub Actions 토큰 제약의 다른 사례
