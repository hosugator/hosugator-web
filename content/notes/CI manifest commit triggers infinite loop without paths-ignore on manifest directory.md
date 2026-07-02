---
created: 2026-06-08
updated: 2026-06-08
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - github-actions
  - ci-cd
  - gitops
publish: true
---
## Context
align-ai Phase 4B에서 CI가 이미지 빌드 후 `deployment.yaml`의 이미지 태그를 업데이트하고 `git push`하는 스텝을 추가했다. 이때 그 push가 다시 CI를 트리거해서 무한 루프가 생긴다는 걸 발견했다.

## Insight
### CI가 manifest를 push하면 그 push가 다시 CI를 트리거한다

```
git push (코드 변경)
  → CI 실행
    → 이미지 빌드
    → deployment.yaml 태그 업데이트
    → git push  ← 이 push가 다시 CI를 트리거
      → CI 실행 (무한 반복)
```

### paths-ignore로 manifest 디렉토리를 제외하면 루프가 끊긴다

```yaml
on:
  push:
    branches: [main]
    paths-ignore:
      - 'k8s/**'   # manifest 디렉토리 변경은 CI를 트리거하지 않음
```

CI가 `k8s/deployment.yaml`을 push해도 `k8s/**` 패턴에 매칭되어 CI가 재실행되지 않는다.

### paths-ignore의 `**`는 중첩 디렉토리까지 포함한다

- `k8s/*` — k8s/ 바로 아래 파일만
- `k8s/**` — k8s/ 하위 모든 파일과 디렉토리 (중첩 포함)

manifest 구조가 `k8s/overlays/prod/deployment.yaml`처럼 중첩될 수 있으므로 `**`가 더 안전하다.

## Verification
2026-06-08: align-ai Phase 4B에서 `paths-ignore: k8s/**` 적용 후 확인. CI push → manifest 업데이트 커밋 자동 생성 → CI 재실행 없음. `git log`에서 `ci: update image tag to ...` 커밋이 1회만 생성됨.

## Related
- [[Argo CD watches Git manifest and CI must update manifest to trigger deployment]] — CI가 manifest를 push하는 이유
- [[GitHub Actions permissions block disables all defaults when any permission is specified]] — 같은 ci.yml에서 발견한 다른 함정
