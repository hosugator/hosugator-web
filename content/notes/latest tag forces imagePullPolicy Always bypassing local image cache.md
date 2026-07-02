---
created: 2026-06-10
updated: 2026-06-10
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - docker
  - ci-cd
  - image-pull
publish: true
---
## Context
k3s에서 학습 이미지를 `docker save | k3s ctr images import`로 로컬 캐시에 주입했음에도 불구하고, Job이 시작될 때마다 GHCR에서 다시 pulling이 발생했다. 이미지 태그가 `latest`였다.

## Insight
k8s는 이미지 태그가 `latest`이거나 태그를 생략한 경우, `imagePullPolicy`를 자동으로 `Always`로 설정한다. 그 외의 구체적인 태그(`v1.2.3`, SHA 등)는 기본값이 `IfNotPresent`다.

| 태그 | imagePullPolicy 기본값 |
|---|---|
| `:latest` 또는 생략 | `Always` |
| `:v1.2.3` 등 구체적 태그 | `IfNotPresent` |

`Always` 정책은 레지스트리에 항상 HEAD 요청을 보내 다이제스트를 확인한다. 로컬 캐시에 동일 이미지가 있어도, 레지스트리 접근이 가능한 한 항상 최신 여부를 체크한다. 레지스트리가 느리거나 불안정하면 Pod 시작이 지연된다.

### 수정 방법
```yaml
containers:
  - image: ghcr.io/org/image:latest
    imagePullPolicy: IfNotPresent  # 명시적으로 선언
```

CI/CD로 자동 빌드·배포하는 환경에서 `latest`를 쓸 경우, `imagePullPolicy: IfNotPresent`를 명시하지 않으면 실제로 이미지가 동일해도 pull 시도가 발생한다.

## Related
- [[k3s NVIDIA device plugin requires nvml strategy and runtimeClassName for GPU access]]
