---
created: 2026-04-30 09:15
updated: 2026-04-30
status: 1-draft
type: study
subject: "[[Infra]]"
project: "[[Self-development in 2026]]"
tags:
  - docker
  - docker-compose
  - dev-environment
  - volume-mount
publish: true
---
## 핵심 개념: 볼륨 마운트

Docker는 배포용이라는 인식이 있지만, 볼륨 마운트를 쓰면 개발 환경으로도 활용할 수 있다.
로컬 디렉토리를 컨테이너 내부 경로에 실시간으로 연결한다. 컨테이너 안에서 코드를 읽지만, 실제 파일은 로컬에 있다.

```yaml
services:
  ml:
    build: .
    volumes:
      - .:/app    # 로컬 현재 디렉토리 → 컨테이너 /app에 마운트
```

코드를 수정하면 **이미지 재빌드 없이** 즉시 반영된다.


## 현업에서의 실제 패턴

실험/탐색과 재현/배포 단계를 분리해서 사용한다:

| 단계                               | 도구                                | 이유               |
| -------------------------------- | --------------------------------- | ---------------- |
| 빠른 실험, 하이퍼파라미터 탐색                | venv/conda                        | 이미지 빌드 없이 즉시 시도  |
| 팀 공유 학습 파이프라인                    | Docker + nvidia-container-toolkit | 재현성 보장           |
| 클라우드 학습 (SageMaker, Vertex AI 등) | Docker 필수                         | 플랫폼이 컨테이너 단위로 실행 |
| 서빙/추론                            | Docker 필수                         | 배포 표준            |

## succeeding
- [[ML 개발 환경 전략 - venv vs conda vs Docker]]
