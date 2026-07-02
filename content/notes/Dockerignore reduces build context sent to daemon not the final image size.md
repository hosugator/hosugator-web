---
created: 2026-06-01
updated: 2026-06-01
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - docker
  - dockerfile
  - build
publish: true
---
## Context

align-ai Docker 실습에서 `.dockerignore` 없이 빌드한 이미지(14.2GB)와 `.dockerignore` 적용 후 빌드한 이미지를 비교했다. 두 이미지의 ID가 동일(`bf531f697010`)하고 크기도 같았다.

## Insight

### .dockerignore는 이미지 크기가 아니라 빌드 컨텍스트 전송량을 줄인다

```
빌드 컨텍스트  →  docker build 시 현재 디렉토리를 Docker daemon에 전송하는 묶음
이미지 크기    →  Dockerfile에서 실제로 COPY한 파일 + RUN으로 설치한 것의 합
```

`.dockerignore`는 daemon에 전송되는 파일을 필터링한다. 하지만 이미지 내용물은 Dockerfile의 `COPY` 명령이 결정한다. `COPY src/ .`만 있으면 `.dockerignore` 여부와 무관하게 `src/`만 이미지에 들어간다.

### .dockerignore의 실질적 역할은 두 가지다

**빌드 속도**: `.venv/`(7.6G), `data/`(1G)를 제외하면 daemon 전송량이 수 GB → 152MB로 줄어 빌드가 빨라진다.

**보안 사고 방지**: `.env`, 시크릿 파일이 `COPY . .`로 이미지에 실수로 포함되는 것을 막는다. 이미지가 레지스트리에 올라가면 시크릿이 노출된다.

### 이미지 크기를 줄이려면 COPY 범위를 조절해야 한다

```dockerfile
COPY . .        # .dockerignore로 제외하지 않으면 전체 포함 → 이미지 비대
COPY src/ .     # 필요한 디렉토리만 명시 → 이미지 크기 직접 제어
```

## Related

- [[Volume mount makes docker image reuse without rebuild]] — 데이터 마운트 패턴