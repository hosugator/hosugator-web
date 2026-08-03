---
created: 2026-06-11
updated: 2026-07-20
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - docker
  - kubernetes
  - deployment
  - edge-ai
  - docker-compose
publish: true
---
## Context
엣지 AI 아키텍처 설계 중 "게이트웨이 PC는 GitHub를 볼 필요가 있는가?"라는 질문이 나왔다. Docker 이미지에 무엇이 들어있는지를 명확히 하지 않으면 배포 트리거 설계가 어렵다.

## Insight
### Docker 이미지 레이어는 Dockerfile 명령어의 산물이다 — 데이터·모델은 포함되지 않는다

```dockerfile
FROM python:3.11           # base layer
RUN pip install torch      # 패키지 설치 layer
COPY src/ /app/src/        # 코드 복사 layer
# 데이터셋, .pth, .onnx 파일은 COPY되지 않는다
```

이미지 = 코드 + 패키지. 모델 가중치(.pth, .onnx)와 학습 데이터는 이미지 밖에 존재하며, 런타임에 마운트된다.

```yaml
# k8s deployment.yaml
volumes:
  - name: models
    hostPath:
      path: /home/hosugator/projects/align-ai/models  # 이미지 외부
```

### 코드 변경과 모델 변경은 서로 다른 파이프라인을 거친다

| 변경 유형        | 결과                 | 배포 트리거                           |
| ------------ | ------------------ | -------------------------------- |
| Python 코드 수정 | 새 Docker 이미지       | GHCR 이미지 태그 변경 → Argo CD 롤링 업데이트 |
| 모델 가중치 갱신    | .pth / .onnx 파일 교체 | 이미지 변경 없음; 마운트된 파일만 교체           |

게이트웨이 PC가 "학습 코드가 바뀌었는가?"를 알고 싶다면 GHCR 이미지 레이어를 보면 된다. GitHub 소스를 볼 필요가 없다.

### 이 분리가 엣지 AI 배포 구조를 단순하게 만든다

```
GHCR 이미지 변경 감지 → k3s Job 실행 (새 학습 코드로 재학습)
학습 완료 → /models/에 .onnx 저장 (이미지 빌드 없이 파일만 교체)
설비 PC → 게이트웨이 HTTP 파일 서버에서 .onnx pull
```

코드 CI/CD(GitHub → GHCR → k3s)와 모델 배포(파일 서버 → 설비 PC pull)가 독립적으로 동작하므로, 한쪽이 실패해도 다른 쪽에 영향을 주지 않는다.

### Dockerfile의 `RUN --mount`(빌드 타임)와 compose/`docker run -v`의 `volumes`(런타임)는 이름만 같고 완전히 다른 메커니즘이다

`RUN --mount=type=cache,...`는 `docker build` 중에만 존재하는 임시 마운트로 패키지 캐시·빌드 시크릿용이고, 빌드가 끝나면 사라져 최종 이미지에 아무 흔적을 안 남긴다.
반면 compose의 `volumes:`나 `docker run -v`는 `build:` 단계와 전혀 무관하게, 컨테이너를 **기동**할 때만 적용된다 — 같은 compose 파일 안에서도 `build:`가 이미지를 만드는 단계, `volumes:`가 그 이미지로 컨테이너를 띄우는 단계로 완전히 분리되어 있고, 이미지 레이어/메타데이터에는 `volumes:` 내용이 전혀 기록되지 않는다(`docker inspect`로도 안 보임).
(예외: Dockerfile의 `VOLUME /path` 명령은 이미지 메타데이터에 "이 경로는 마운트 지점"이라는 표시만 남기지만, 호스트의 어디를 마운트할지는 여전히 실행 시점에 결정된다.)

### `docker run -v` 바인드 마운트와 k8s hostPath는 서로 다른 두 기술이 아니라 같은 리눅스 bind mount를 감싼 것이다

k3s는 Docker 위에서 돌지 않는다 — containerd를 자체 내장하고 dockerd를 아예 안 쓴다. 그럼에도 둘 다 결국 같은 커널의 bind mount 기능을 호출하기 때문에, "docker -v"와 "k8s hostPath"는 개념적으로 직계 대응된다.
차이는 k8s가 그 위에 PV/PVC/`nodeAffinity`라는 추가 레이어를 얹었다는 것뿐이다 — Docker는 단일 호스트라 "이 데이터가 어느 머신에 있는지" 고민할 필요가 없지만, k8s는 노드가 여러 개일 수 있어서 "어느 노드의 로컬 디스크에 있는지"를 추적하고 그 노드로 Pod을 강제 스케줄링할 장치가 필요하다.

### 같은 호스트 경로를 서로 모르는 두 런타임이 동시에 마운트하면 데이터가 깨질 수 있다

k3s Pod이 hostPath로 어떤 경로를 쓰고 있는데, 같은 머신에서 독립적으로 `docker run -v <같은 경로>`를 또 띄우면, 서로의 존재를 모르는 두 프로세스가 같은 파일을 동시에 건드리게 된다. 안 되는 건 "Docker mount의 존재 자체"가 아니라 "동일 경로에 대한 두 관리 주체의 충돌"이다 — 경로가 다르면 아무 문제 없이 공존한다.

## Related
- [[Industrial edge deployments split Windows hardware integration from Linux inference servers]] — 게이트웨이 vs 설비 PC 역할 분리
- [[OrtSession hot-swap enables zero-downtime model updates without restarting C SDK process]] — 설비 PC에서 .onnx 파일 변경을 처리하는 방법
- [[Air-gapped factory ML deployment uses gateway PC as pull bridge not Argo CD push]] — 격리 환경에서의 배포 패턴
- [[latest-only tag creates untagged dangling versions in container registry]] — GHCR에서 이미지 변경을 추적하는 방법
