---
created: 2026-06-04
updated: 2026-06-04
type: post
status: 1-draft
subject: "[[AI]]"
project: "[[Self-development in 2026]]"
tags:
  - linkedin
  - ml
  - deployment
  - onnx
  - docker
publish: true
---
## Source
더 많은 소스가 모이면 onnx 변환 외에도 docker, k3s, CI/CD와 결합한 인사이트로 내면 어떨지 고민 중.

[[ONNX format embeds computation graph making it self-contained unlike pth which depends on Python code]] — 5.8GB→344MB 실측, dummy input의 역할, torch 제거 원리
[[ML model delivery formats for external collaboration]] — 재학습/배포 목적별 산출물 형태 비교
[[How to inference with sole object independent with language]] — 학습은 Python, 추론은 어디서든

## Draft

제조 라인 검사 AI를 현장 PC에 올려야 했다. Python도 없고, torch도 없고, 디스크 여유도 없는 곳에.

.pth는 PyTorch 코드와 분리하면 아무것도 아니다. torch를 설치하면 이미지 하나에 5GB 넘게 잡아먹는다.

여기서 두 가지 결정이 필요했다.

첫 번째: ONNX로 변환했다.

torch 의존성을 끊으니 크기가 달라졌다.
- torch 기반 이미지: 5.8GB
- onnxruntime 기반: 344MB (17배 감소)

Python이 없어도 onnxruntime 하나로 추론이 돌아간다.

두 번째: Docker 이미지에 구웠다.

현장 담당자에게 요청한 건 하나였다. "Docker 설치해주세요."

docker pull hosugator/align-ai:inference-latest
docker run --rm -v /현장/데이터:/app/data 이미지명 python predict_onnx.py

다른 PC에서 pull해서 직접 확인했다. Python 설치도, 패키지 설치도, 경로 설정도 없었다.


.pth는 학습의 끝이 아니라 배포의 시작점이었다.

현장에 올리기 전까지는 몰랐다.


## Variant

훅 대안 (질문형):

"모델 학습 끝냈다는 말, 어디까지를 끝냈다는 걸까?

val loss 수렴했고, best.pth 저장했다. 근데 이걸 현장에서 쓰려면 뭐가 더 필요할까?"
