---
created: 2026-06-11
updated: 2026-06-11
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - ml-ops
  - ci-cd
  - docker
publish: true
---
## Context
align-ai train.yml을 트리거할 때마다 ~1시간짜리 학습이 무조건 실행됐다. 코드·의존성이 바뀌지 않았다면 스킵하고 싶었다.

## Insight
### 학습 이미지의 레이어 해시로 "이 이미지로 학습한 모델이 이미 있는가"를 판단할 수 있다

학습 이미지(Dockerfile.train) 내용 = 코드 + 의존성. 이미지가 바뀌지 않았다 = 코드·의존성이 바뀌지 않았다.

**스킵 조건 (AND 3가지):**

1. 현재 학습 이미지의 `RootFS.Layers` == `.train-image-id` 파일에 저장된 값
2. `latest.pth` 모델 파일이 존재
3. `force_train` input이 false

**데이터 변경 시**: 이미지 레이어로는 감지 불가 → `force_train: true`로 명시적 트리거.

### `.train-image-id`는 반드시 CI 러너에서만 기록해야 한다

로컬 빌드와 CI 빌드는 컨텍스트 디렉터리가 달라 레이어 해시가 다를 수 있다. 로컬에서 수동으로 `.train-image-id`를 채우면 CI에서 항상 불일치 → 매번 학습 실행.

## Related
- [[Docker image .Id is non-deterministic, use RootFS.Layers for content comparison]] — 스킵 판단에 사용한 Docker 원리
- [[Argo CD self-healing silently restarts Jobs in monitored directories]] — 반복 학습을 유발했던 다른 원인
- [[GITHUB_TOKEN commits do not trigger downstream workflows]] — 같은 파이프라인의 CI 트리거 단계
