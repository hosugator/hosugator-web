---
created: 2026-06-11
updated: 2026-06-11
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - docker
  - ci-cd
  - devops
publish: true
---
## Context
align-ai ML 파이프라인에서 학습 이미지 변경 여부를 자동 감지하려 했다. `docker inspect .Id`로 비교했더니 같은 Dockerfile로 두 번 빌드해도 ID가 달라 매번 학습이 실행됐다.

## Insight
### `.Id`는 빌드 타임스탬프를 포함해 동일 내용에도 매번 다른 값을 반환한다

`docker inspect --format='{{.Id}}'`는 이미지 메타데이터(타임스탬프 포함)의 해시다. 같은 Dockerfile, 같은 베이스 이미지로 빌드해도 두 번의 빌드는 서로 다른 `.Id`를 갖는다.

### `RootFS.Layers`는 레이어 파일 내용의 해시로 빌드 시점에 영향받지 않는다

`docker inspect --format='{{json .RootFS.Layers}}'`는 실제 파일시스템 레이어의 sha256 배열이다. 동일한 파일 내용으로 빌드하면 항상 같은 값이 나온다.

### Buildx(BuildKit)는 별도 캐시를 써서 일반 빌드와 레이어 해시가 달라진다

`docker/setup-buildx-action`은 독립 BuildKit 컨테이너를 생성하고 자체 캐시를 사용한다. 로컬 `docker build`와 BuildKit 빌드는 같은 Dockerfile이어도 레이어 해시가 달라진다.

### `.dockerignore`의 glob 패턴은 이중 별표 없이는 서브디렉터리에 적용되지 않는다

`__pycache__/` 패턴은 루트만 제외한다. `**/__pycache__/`로 써야 `src/__pycache__/` 등 하위 디렉터리도 제외된다. pycache가 빌드 컨텍스트에 포함되면 레이어 해시가 환경마다 달라진다.

### CI 러너에서 학습한 이미지가 GHCR에 올라간다

로컬 빌드와 CI 빌드의 레이어 해시는 다를 수 있다 — `.train-image-id`는 반드시 CI 러너에서만 기록해야 한다

## Related
- [[ML training skip logic using image layer fingerprint avoids redundant training]] — 이 원리를 적용한 스킵 로직
- [[Argo CD watches Git manifest and CI must update manifest to trigger deployment]] — 같은 파이프라인의 CD 단계
