---
created: 2026-06-11
updated: 2026-06-11
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - docker
  - ghcr
  - ci-cd
publish: true
---
## Context
align-ai GHCR 정리 중 `align-ai-train`에 untagged 버전이 18개, `align-ai` inference에 11개가 쌓인 걸 발견했다. 원인을 추적하니 태그 전략 차이였다.

## Insight
### `latest`만 push하면 이전 버전의 태그가 박탈되어 untagged로 남는다

`latest` 태그는 하나의 이미지에만 붙을 수 있다. 새 이미지를 push할 때마다 이전 이미지에서 태그가 이동하고, 이전 이미지는 태그 없는(untagged/dangling) 상태로 레지스트리에 잔류한다. GHCR은 태그가 없어져도 자동으로 삭제하지 않는다.

### 롤백이 필요한 이미지는 versioned tag를 함께 push해야 한다

```bash
# 추론 이미지 — SHA 태그로 롤백 가능
docker push ghcr.io/org/app:inference-latest
docker push ghcr.io/org/app:${GITHUB_SHA}

# 학습 이미지 — latest만으로 충분 (롤백 대상이 모델 파일이지 이미지가 아님)
docker push ghcr.io/org/app-train:latest
```

## Related
- [[GHCR over Docker Hub until external distribution is needed]] — GHCR 선택 배경
- [[GITHUB_TOKEN commits do not trigger downstream workflows]] — 같은 파이프라인의 트리거 제약
