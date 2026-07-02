---
created: 2026-06-05
updated: 2026-06-05
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - git
  - model-deployment
  - ci
publish: true
---
## Context
align-ai CI에서 Dockerfile이 `COPY models/`를 시도했는데, `models/`가 `.gitignore`에 있어서 CI 서버에 파일이 없었다. 이미지 자기완결성(모델 포함)과 CI 자동화를 동시에 만족시켜야 했다.

## Insight
### 모델 파일 관리 방식은 크기에 따라 결정한다

| 방식              | 적합한 크기   | 장점           | 단점                        |
| --------------- | -------- | ------------ | ------------------------- |
| 직접 커밋           | ~25MB 이하 | 설정 없음, CI 자동 | 저장소 크기 증가                 |
| GitHub Releases | 제한 없음    | 저장소와 분리      | 수동 업로드 또는 스크립트 필요         |
| Git LFS         | 제한 없음    | git 워크플로우 동일 | LFS 서버 비용, silent fail 위험 |

### .gitignore 예외 규칙으로 특정 파일만 추적할 수 있다

```gitignore
models/                          # 전체 무시
!models/**/latest.onnx           # 단, 이 파일만 추적
!models/**/latest.onnx.data
```

이미 무시됐던 파일은 `git add -f`로 강제 추가해야 한다. 이후부터는 일반 파일처럼 추적된다.

## Decision
align-ai ONNX 모델(559KB + 23MB)은 직접 커밋. `.pth` 체크포인트(25MB × 6개)는 계속 무시. 모델이 수백 MB 이상으로 커지면 GitHub Releases로 전환한다.
LFS는 GitLab에서 silent fail 경험이 있어 검증 없이 도입하지 않는다.

## Related
- [[GHCR over Docker Hub until external distribution is needed]] — 같은 맥락의 CI 자동화 결정
- [[Git LFS on self-hosted GitLab fails silently when external_url points to internal hostname]] — LFS 기피 근거
- [[pth is not deployment it is the start of deployment]] — 배포 파이프라인