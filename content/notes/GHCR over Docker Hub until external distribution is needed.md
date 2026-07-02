---
created: 2026-06-05
updated: 2026-06-05
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - github-actions
  - docker
  - ghcr
  - ci
publish: true
---
## Context
align-ai Phase 3B에서 CI 자동 이미지 빌드 레지스트리를 선택해야 했다. Docker Hub(Phase 1C에서 이미 사용)와 GHCR 중 선택.

## Insight
### GHCR은 GITHUB_TOKEN이 자동 주입되어 CI 설정 비용이 없다

Docker Hub는 별도 Access Token 발급 + GitHub Secrets 2개 등록이 필요하다. GHCR은 GitHub Actions 안에서 `secrets.GITHUB_TOKEN`이 자동으로 존재한다.

```yaml
# GHCR — 추가 Secret 불필요
- uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
```

### GHCR은 UI가 단순하고 이미지 메타 정보가 제한적이다

Docker Hub는 이미지 크기, 레이어, pull 통계를 대시보드로 제공한다. GHCR은 다이제스트, 태그, 다운로드 수 정도만 보인다. GitHub의 주력 서비스가 아니라 기능이 제한적이다.

## Decision
CI 자동화에서는 GHCR을 기본으로 사용한다. 외부 공개 배포나 Docker Hub 생태계 연동이 필요한 시점에 Docker Hub로 전환한다.

## Related

- [[GitHub Actions permissions block disables all defaults when any permission is specified]] — GHCR push 시 permissions 설정 주의사항
- [[Docker Compose before k8s because scale motivation must precede orchestration learning]] — 학습 계획 맥락
- [[pth is not deployment it is the start of deployment]] — 배포 파이프라인 전체
- [[latest-only tag creates untagged dangling versions in container registry]] — latest만 쓸 때의 dangling 문제와 태그 전략
