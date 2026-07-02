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
  - cache
  - optimization
publish: true
---
## Context

align-ai Docker 실습에서 `.dockerignore` 적용 후 재빌드 시 모든 단계에 `Using cache`가 붙어 수 분의 빌드가 수 초로 줄었다. requirements.txt를 소스코드보다 먼저 COPY하는 이유가 여기 있음을 확인했다.

## Insight

### Docker는 각 Dockerfile 명령을 레이어로 저장하고 변경되지 않으면 재사용한다

```dockerfile
COPY requirements.txt .    # 레이어 1
RUN pip install -r requirements.txt  # 레이어 2 (수 분 소요)
COPY src/ .                # 레이어 3
```

`src/`가 바뀌어도 `requirements.txt`가 동일하면 레이어 1·2는 캐시를 그대로 쓴다. pip install을 다시 실행하지 않는다.

### 순서가 반대면 소스코드 수정마다 pip install이 다시 실행된다

```dockerfile
COPY src/ .                # 소스가 바뀌면 이 레이어부터 무효화
COPY requirements.txt .    # 캐시 무효화됨
RUN pip install ...        # 매번 다시 실행 → 느림
```

Docker는 레이어가 변경되면 그 아래 모든 레이어를 무효화한다. 변경 빈도가 낮은 것을 위로, 높은 것을 아래로 배치하는 게 원칙이다.

```
변경 빈도 낮음 → 위 (FROM, 의존성)
변경 빈도 높음 → 아래 (소스코드)
```

## Related

- [[Dockerignore reduces build context sent to daemon not the final image size]] — 빌드 컨텍스트와 이미지 크기 구분