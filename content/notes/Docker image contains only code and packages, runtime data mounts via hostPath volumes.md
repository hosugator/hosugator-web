---
created: 2026-06-11
updated: 2026-06-11
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - docker
  - kubernetes
  - deployment
  - edge-ai
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

| 변경 유형 | 결과 | 배포 트리거 |
|---|---|---|
| Python 코드 수정 | 새 Docker 이미지 | GHCR 이미지 태그 변경 → Argo CD 롤링 업데이트 |
| 모델 가중치 갱신 | .pth / .onnx 파일 교체 | 이미지 변경 없음; 마운트된 파일만 교체 |

게이트웨이 PC가 "학습 코드가 바뀌었는가?"를 알고 싶다면 GHCR 이미지 레이어를 보면 된다. GitHub 소스를 볼 필요가 없다.

### 이 분리가 엣지 AI 배포 구조를 단순하게 만든다

```
GHCR 이미지 변경 감지 → k3s Job 실행 (새 학습 코드로 재학습)
학습 완료 → /models/에 .onnx 저장 (이미지 빌드 없이 파일만 교체)
설비 PC → 게이트웨이 HTTP 파일 서버에서 .onnx pull
```

코드 CI/CD(GitHub → GHCR → k3s)와 모델 배포(파일 서버 → 설비 PC pull)가 독립적으로 동작하므로, 한쪽이 실패해도 다른 쪽에 영향을 주지 않는다.

## Related
- [[Industrial edge deployments split Windows hardware integration from Linux inference servers]] — 게이트웨이 vs 설비 PC 역할 분리
- [[OrtSession hot-swap enables zero-downtime model updates without restarting C SDK process]] — 설비 PC에서 .onnx 파일 변경을 처리하는 방법
- [[Air-gapped factory ML deployment uses gateway PC as pull bridge not Argo CD push]] — 격리 환경에서의 배포 패턴
- [[latest-only tag creates untagged dangling versions in container registry]] — GHCR에서 이미지 변경을 추적하는 방법
